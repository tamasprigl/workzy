import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The request-facing half of the C9 read-only boundary.
 *
 * The SDK guard (`lib/airtable-read-only-guard.test.ts`) proves no write can
 * reach Airtable. These tests prove the layers in front of it behave properly
 * rather than merely failing: a candidate gets a truthful message and a working
 * link, a crawler gets `noindex`, and an attacker sending a hand-rolled request
 * gets the same refusal as the form.
 *
 * Every test here is adversarial in the same way: it bypasses the UI entirely
 * and calls the server the way a script would.
 */

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  process.env.AIRTABLE_TOKEN = "patTESTTESTTEST01.0123456789abcdef0123456789abcdef";
  process.env.AIRTABLE_BASE_ID = "appTESTBASEID0000";
  process.env.AUTH_SECRET = "test-secret-not-a-real-one";
  vi.stubEnv("V1_READ_ONLY", "true");
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.unstubAllEnvs();
});

describe("POST /api/applications — the public application endpoint", () => {
  it("refuses with 410 Gone and names the live system", async () => {
    const { POST } = await import("./api/applications/route");

    const form = new FormData();
    form.set("jobId", "recTEST");
    form.set("fullName", "Teszt Jelentkező");
    form.set("email", "teszt@example.hu");

    const response = await POST(
      new Request("https://workzy.vercel.app/api/applications", {
        method: "POST",
        body: form,
      }),
    );

    expect(response.status).toBe(410);

    const body = await response.json();
    expect(body.readOnly).toBe(true);
    expect(body.code).toBe("V1_READ_ONLY");
    expect(body.currentSystem).toBe("https://www.workzy.hu");
  });

  it("refuses BEFORE reading the body — so no CV reaches blob storage", async () => {
    /*
     * This handler uploads the candidate's CV to Vercel Blob with `put()`
     * BEFORE it creates the Airtable record. A guard placed only at the
     * Airtable call would still have written a real person's CV to storage on
     * every refused attempt.
     *
     * A body that throws when read proves the refusal happens first: if the
     * handler touched it, this test would see the throw instead of a 410.
     */
    const { POST } = await import("./api/applications/route");

    const exploding = new Request("https://workzy.vercel.app/api/applications", {
      method: "POST",
      body: "not-form-data",
      headers: { "content-type": "multipart/form-data; boundary=nonsense" },
    });

    const response = await POST(exploding);
    expect(response.status).toBe(410);
  });

  it("tells crawlers not to index the refusal", async () => {
    const { POST } = await import("./api/applications/route");
    const response = await POST(
      new Request("https://workzy.vercel.app/api/applications", {
        method: "POST",
        body: new FormData(),
      }),
    );
    expect(response.headers.get("x-robots-tag")).toContain("noindex");
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});

describe("POST /api/apply — the stub that used to lie", () => {
  it("no longer reports success for a submission it never stored", async () => {
    /*
     * This endpoint always returned `{ success: true, message: "Jelentkezés
     * sikeresen fogadva." }` while writing nothing, anywhere. It did not create
     * split-brain data — it created a false belief, which the C9 brief forbids
     * just as explicitly ("do not silently accept and discard submissions").
     */
    const { POST } = await import("./api/apply/route");

    const response = await POST(
      new Request("https://workzy.vercel.app/api/apply", {
        method: "POST",
        body: JSON.stringify({ fullName: "Teszt" }),
        headers: { "content-type": "application/json" },
      }),
    );

    expect(response.status).toBe(410);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).not.toContain("sikeresen");
  });
});

describe("submitApplicationAction — the server action behind the rendered form", () => {
  it("refuses without parsing the form, and returns a usable message", async () => {
    const { submitApplicationAction } = await import("./jobs/[slug]/actions");

    const form = new FormData();
    form.set("fullName", "Teszt Jelentkező");

    const result = await submitApplicationAction(null, form);

    expect(result.success).toBe(false);
    expect(result.readOnly).toBe(true);
    // Not the generic "try again" from the catch block — trying again would
    // never work, and telling someone to is worse than telling them nothing.
    expect(result.error).not.toContain("próbálja újra");
    expect(result.error).toContain("https://www.workzy.hu");
  });

  it("permits the original path when read-only is explicitly off", async () => {
    vi.stubEnv("V1_READ_ONLY", "false");
    const { submitApplicationAction } = await import("./jobs/[slug]/actions");

    // Missing required fields, so it stops at validation without any network.
    const result = await submitApplicationAction(null, new FormData());
    expect(result.readOnly).toBeUndefined();
    expect(result.error).toContain("kötelező");
  });
});

describe("middleware — the outer boundary", () => {
  async function run(url: string, method: string) {
    const { middleware } = await import("../middleware");
    const { NextRequest } = await import("next/server");
    return middleware(new NextRequest(new Request(url, { method })));
  }

  it("blocks every mutating method on the application endpoint", async () => {
    for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
      const res = await run("https://workzy.vercel.app/api/applications", method);
      expect(res.status, method).toBe(410);
    }
  });

  it("blocks a server-action POST to a public job page", async () => {
    // Server actions post to the page's own URL, so this is the form's real
    // wire shape — no action name needed.
    const res = await run("https://workzy.vercel.app/jobs/raktaros-hajos", "POST");
    expect(res.status).toBe(410);
  });

  it("blocks admin mutation routes even though they sit behind a session", async () => {
    for (const path of [
      "/api/admin/update-job",
      "/api/admin/update-employer-access",
      "/api/admin/recalculate-job-quality",
      "/api/admin/check-free-campaigns",
      "/api/automation/start-campaign",
      "/api/automation/stop-campaign",
      "/api/jobs/create",
      "/api/jobs/quick-create",
      "/api/jobs/update",
      "/api/applications/update",
      "/api/generate-job-image",
    ]) {
      const res = await run(`https://workzy.vercel.app${path}`, "POST");
      expect(res.status, path).toBe(410);
    }
  });

  it("blocks UNAUTHENTICATED public job creation", async () => {
    // `/api/jobs/public-create` creates Company and Job records with no auth
    // check whatsoever. It is the one route that could have let an anonymous
    // caller add adverts to the frozen dataset.
    const res = await run("https://workzy.vercel.app/api/jobs/public-create", "POST");
    expect(res.status).toBe(410);
  });

  it("blocks the two GET handlers that WRITE", async () => {
    // A rule of "block mutating methods" waves both of these straight through:
    // /api/auth/verify creates Employer and User records, /api/auth/magic-link
    // updates a MagicLink row — both on GET.
    for (const path of ["/api/auth/verify", "/api/auth/magic-link"]) {
      const res = await run(`https://workzy.vercel.app${path}?token=x`, "GET");
      expect(res.status, path).toBe(410);
    }
  });

  it("still allows sign-in, which reads a credential and writes nothing", async () => {
    const res = await run("https://workzy.vercel.app/api/admin/login", "POST");
    expect(res.status).not.toBe(410);
  });

  it("still allows reading — C9 keeps v1 as the evidence base", async () => {
    for (const path of ["/", "/jobs", "/jobs/raktaros-hajos", "/aszf", "/impresszum"]) {
      const res = await run(`https://workzy.vercel.app${path}`, "GET");
      expect(res.status, path).not.toBe(410);
    }
  });

  it("permits mutations again when read-only is explicitly off", async () => {
    vi.stubEnv("V1_READ_ONLY", "false");
    const res = await run("https://workzy.vercel.app/api/applications", "POST");
    expect(res.status).not.toBe(410);
  });

  it("FAILS CLOSED: production with the flag unset still blocks writes", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.unstubAllEnvs();
    vi.stubEnv("NODE_ENV", "production");
    delete process.env.V1_READ_ONLY;

    const res = await run("https://workzy.vercel.app/api/applications", "POST");
    expect(res.status).toBe(410);
  });
});

describe("robots", () => {
  it("disallows every crawler on every path", async () => {
    const robots = (await import("./robots")).default;
    const result = robots();
    const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules;

    expect(rule?.userAgent).toBe("*");
    expect(rule?.disallow).toBe("/");
  });
});
