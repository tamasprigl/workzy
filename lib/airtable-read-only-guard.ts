/**
 * The authoritative write boundary for Workzy v1 in read-only mode (F05 C9).
 *
 * ## Why this is not "just add a check to each route"
 *
 * The v1 mutation surface is not one endpoint. Measured on 2026-08-19:
 *
 *   * **33** separate `new Airtable(...)` constructions — there is no shared
 *     data-access layer to put a guard in;
 *   * **30** `.create()` / `.update()` / `.destroy()` call sites across 17
 *     files;
 *   * **15** POST route handlers, **8** files exporting server actions;
 *   * and — the reason a per-route guard is not enough on its own — **two GET
 *     handlers that write**: `/api/auth/verify` creates Employer and User
 *     records, `/api/auth/magic-link` updates a MagicLink record. Anything that
 *     reasons about "mutating HTTP methods" misses both.
 *
 * Guarding 30 call sites means being right 30 times, and staying right every
 * time someone adds the 31st. So the guard goes where every one of them
 * necessarily converges: the Airtable SDK's own HTTP function.
 *
 * ## Where exactly
 *
 * `airtable@0.12` funnels every request through `lib/run_action.js`
 * (`runAction(base, method, path, ...)`), and builds `create` / `update` /
 * `replace` / `destroy` from `Table.prototype._createRecords`,
 * `_updateRecords` and `_destroyRecord`. Both layers are patched:
 *
 *   1. **`runAction`** — refuses any non-`GET`/`HEAD` request to Airtable. This
 *      is the backstop, and it is method-based, so it holds for calls this
 *      repository does not contain yet.
 *   2. **The three `Table` write primitives** — refuse earlier, with a message
 *      that names the table, so a developer sees the cause and not a stack
 *      inside a vendored file.
 *
 * Neither depends on which of the 33 clients issued the call, and reads are
 * untouched: C9 requires v1 to stay *readable*.
 *
 * ## Idempotent, and applied before the first request
 *
 * `register()` is called from `instrumentation.ts`, which Next.js runs once per
 * server instance before any request is handled — so the patch is in place
 * before any `Table` is constructed. That matters: `Table` captures
 * `this._createRecords` in its constructor, so patching the prototype *after* a
 * table existed would leave that instance holding the original.
 *
 * The patch is marked on the module object and never applied twice.
 */

import { isV1ReadOnly, V1ReadOnlyError } from "./read-only";

const PATCH_FLAG = "__workzyV1ReadOnlyPatched";

type PatchTarget = Record<string, unknown>;

/**
 * Install the guard. Safe to call repeatedly; only the first call patches.
 *
 * Returns what it patched, so `instrumentation.ts` can log it and tests can
 * assert the patch actually attached rather than silently no-oping on an
 * SDK whose internals moved.
 */
export function installAirtableReadOnlyGuard(options?: {
  /**
   * The `Table.prototype` to patch.
   *
   * Defaults to `require("airtable/lib/table").prototype`, which is what the
   * running server uses. It is injectable for one reason: under a test runner's
   * ESM interop, `require(...)` here and `import(...)` in a test can resolve to
   * *different* module instances, so a test that patched its own copy would be
   * asserting against something the guard never touched — and would pass while
   * proving nothing. Passing the prototype in removes the ambiguity entirely.
   */
  tableProto?: Record<string, unknown>;
}): {
  runAction: boolean;
  tableMethods: string[];
} {
  const result = { runAction: false, tableMethods: [] as string[] };

  // ---- 1. The HTTP choke point ------------------------------------------
  //
  // Every SDK request goes through this one function, so a method check here
  // holds for any call site, including ones added later.
  try {
    /*
     * `require`, deliberately, and not `import`.
     *
     * The patch works by replacing the entry in `require.cache`, so that the
     * `require("./run_action")` which `airtable/lib/base.js` performs
     * internally receives the guarded function. ESM `import` gives a frozen
     * live binding with no cache to reach into, so it cannot do this. The rule
     * is right in general and wrong for exactly this line.
     */
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const runActionModule = require("airtable/lib/run_action") as PatchTarget;
    const original = runActionModule as unknown as (...args: unknown[]) => unknown;

    if (!(runActionModule as PatchTarget)[PATCH_FLAG] && typeof original === "function") {
      const patched = function patchedRunAction(this: unknown, ...args: unknown[]) {
        // runAction(base, method, path, queryParams, bodyData, callback, ...)
        const method = String(args[1] ?? "").toUpperCase();
        const path = String(args[2] ?? "");

        if (isV1ReadOnly() && method !== "GET" && method !== "HEAD") {
          throw new V1ReadOnlyError(`Airtable ${method} ${path}`);
        }

        return original.apply(this, args as never);
      };

      (patched as unknown as PatchTarget)[PATCH_FLAG] = true;

      require.cache[require.resolve("airtable/lib/run_action")]!.exports = patched;
      result.runAction = true;
    }
  } catch {
    // Deliberately swallowed: if the SDK's internals move, the Table-level
    // patch below and the per-route guards still refuse. A guard that crashes
    // the server on boot would take the evidence system down, which is the one
    // thing C9 exists to prevent.
  }

  // ---- 2. The record-write primitives ------------------------------------
  try {
    let proto = options?.tableProto as PatchTarget | undefined;

    if (!proto) {
      // Same reason as above: this must be the CommonJS instance the running
      // server shares, not a separate ESM namespace object.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const tableModule = require("airtable/lib/table") as {
        prototype?: PatchTarget;
        default?: { prototype?: PatchTarget };
      };
      proto = tableModule?.prototype ?? tableModule?.default?.prototype;
    }

    if (proto && !proto[PATCH_FLAG]) {
      for (const name of ["_createRecords", "_updateRecords", "_destroyRecord"]) {
        const original = proto[name];
        if (typeof original !== "function") continue;

        proto[name] = function guarded(this: { name?: string }, ...args: unknown[]) {
          if (isV1ReadOnly()) {
            throw new V1ReadOnlyError(
              `Airtable ${name.replace(/^_/, "")} on table "${this?.name ?? "unknown"}"`,
            );
          }
          return (original as (...a: unknown[]) => unknown).apply(this, args);
        };

        result.tableMethods.push(name);
      }

      proto[PATCH_FLAG] = true;
    }
  } catch {
    // Same reasoning as above.
  }

  return result;
}
