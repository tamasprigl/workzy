import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

/**
 * ## C9 read-only enforcement, and the existing admin session gate
 *
 * Two responsibilities, in this order. The read-only check runs FIRST, because
 * a write must be refused whether or not the caller holds a valid session — a
 * signed-in employer mutating v1 is exactly as lost to v2 as an anonymous one.
 *
 * This is the *outer* layer of a three-layer boundary. It gives callers a clean
 * `410 Gone` instead of a 500 from deeper down, and it is deliberately NOT the
 * thing being relied on: `lib/airtable-read-only-guard.ts` refuses at the
 * Airtable SDK itself, so a path that slips past this matcher still cannot
 * write. Hiding buttons is not a boundary; neither is middleware alone.
 *
 * ### Why method alone is not the rule
 *
 * Two v1 GET handlers write to Airtable — `/api/auth/verify` creates Employer
 * and User records, `/api/auth/magic-link` updates a MagicLink row. A rule of
 * "block POST/PUT/PATCH/DELETE" would wave both straight through. They are
 * named explicitly below.
 *
 * ### Why sign-in is still allowed
 *
 * C9 keeps v1 readable as the evidence base, and the historic admin views are
 * behind a session. `/admin/login` and `/api/admin/login` read the Employers
 * table to check a credential and write nothing — verified against the write
 * inventory — so authentication stays available. Every mutation behind that
 * session is still refused, by the SDK guard if not here.
 */

const READ_ONLY_MESSAGE_HU =
  'Ez a Workzy korábbi rendszerének archív változata. Itt már nem fogadunk új jelentkezést. ' +
  'A jelenlegi Workzy: https://www.workzy.hu';

/**
 * Mirrors `lib/read-only.ts`. Duplicated because middleware runs on the Edge
 * runtime and must not pull in the Node-only Airtable guard module. The two are
 * kept in step by a test that asserts identical truth tables.
 */
function isV1ReadOnly(): boolean {
  const raw = process.env.V1_READ_ONLY;
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  return process.env.NODE_ENV === 'production';
}

/** Authentication endpoints that read only, and stay reachable in read-only mode. */
const AUTH_READ_PATHS = ['/api/admin/login', '/admin/login'];

/** GET handlers that nevertheless write to Airtable. Blocked by path, not method. */
const WRITING_GET_PATHS = ['/api/auth/verify', '/api/auth/magic-link'];

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function readOnlyResponse(pathname: string) {
  return NextResponse.json(
    {
      success: false,
      readOnly: true,
      code: 'V1_READ_ONLY',
      message: READ_ONLY_MESSAGE_HU,
      currentSystem: 'https://www.workzy.hu',
      path: pathname,
    },
    {
      // 410 Gone: retired at this origin, permanently. Not 403 (nothing is
      // missing a permission) and not 503 (nothing is coming back).
      status: 410,
      headers: {
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow, noarchive',
      },
    },
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  // ---- C9 read-only boundary --------------------------------------------
  if (isV1ReadOnly()) {
    const isAuthRead = AUTH_READ_PATHS.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );
    const isWritingGet = WRITING_GET_PATHS.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );

    // A server action is a POST to the page's own URL, so this catches the
    // public application form's `submitApplicationAction` as well as every
    // admin action — without needing to know their names.
    if ((MUTATING_METHODS.has(method) && !isAuthRead) || isWritingGet) {
      return readOnlyResponse(pathname);
    }
  }

  // ---- Existing admin session gate, unchanged ---------------------------
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_session')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const secretKey = process.env.AUTH_SECRET;

      if (!secretKey) {
        throw new Error('AUTH_SECRET environment variable is missing');
      }

      const key = new TextEncoder().encode(secretKey);
      await jwtVerify(token, key, {
        algorithms: ['HS256'],
      });

      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_session');
      return response;
    }
  }

  return NextResponse.next();
}

/**
 * Widened from `/admin/:path*`.
 *
 * The read-only boundary has to see `/api/*` and the public job pages (whose
 * server action posts to `/jobs/<slug>`), so the matcher now covers everything
 * except Next's own static output and the icons. The admin branch above is
 * still scoped by its own `pathname.startsWith('/admin')` test, so widening the
 * matcher does not change who is asked for a session.
 */
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.png).*)'],
};
