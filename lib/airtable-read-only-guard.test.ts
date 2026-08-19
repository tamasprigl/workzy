import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { installAirtableReadOnlyGuard } from "./airtable-read-only-guard";
import { V1ReadOnlyError } from "./read-only";

/**
 * The authoritative boundary: **no write reaches Airtable**.
 *
 * The v1 mutation surface is 30 write calls across 17 files, from 33 separate
 * Airtable clients, with no shared data-access layer. Guarding call sites means
 * being right 30 times and staying right for the 31st. So the guard sits on the
 * SDK's own write primitives, and this file proves it by replacing those
 * primitives with counting spies and asserting the spies are never called.
 *
 * ## Why it is written this way, and not against the network
 *
 * The first version of this file mocked the SDK's HTTP function and asserted
 * "no request was attempted". That mock never attached — vitest's ESM interop
 * does not intercept the `require("./run_action")` that `airtable/lib/base.js`
 * does internally — so two tests quietly talked to the real api.airtable.com
 * (rejected 401, nothing written), and, far worse, the "never attempted"
 * assertions were **vacuously true**: an empty array compared against an empty
 * array, proving nothing.
 *
 * Spying on the prototype the guard actually wraps removes both problems. The
 * spy is unambiguously wired — the "writes are permitted when off" test calls
 * it and sees the call — so when the read-only tests assert zero calls, that
 * zero means something. No test here can reach a network.
 */

const ORIGINAL_ENV = { ...process.env };

/** Every write the SDK would have performed, had the guard let it through. */
let performed: string[];

/** A stand-in for the real `airtable/lib/table` module, patched in place. */
type Proto = Record<string, unknown> & { name?: string };
let proto: Proto;

const WRITE_PRIMITIVES = ["_createRecords", "_updateRecords", "_destroyRecord"] as const;

beforeEach(async () => {
  performed = [];

  process.env.AIRTABLE_TOKEN = "patTESTTESTTEST01.0123456789abcdef0123456789abcdef";
  process.env.AIRTABLE_BASE_ID = "appTESTBASEID0000";

  const tableModule = (await import("airtable/lib/table")) as unknown as {
    default?: { prototype: Proto };
    prototype?: Proto;
  };
  proto = (tableModule.default?.prototype ?? tableModule.prototype) as Proto;

  // Replace the real write primitives with counting spies, and clear any patch
  // marker so the guard re-wraps these spies rather than a previous wrapper.
  delete proto.__workzyV1ReadOnlyPatched;
  for (const name of WRITE_PRIMITIVES) {
    proto[name] = function spy(this: { name?: string }) {
      performed.push(`${name}:${this?.name ?? "unknown"}`);
      return Promise.resolve([]);
    };
  }

  // Inject the exact prototype the spies live on, so there is no chance the
  // guard patches a different module instance than the one asserted against.
  installAirtableReadOnlyGuard({ tableProto: proto });
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.unstubAllEnvs();
});

/** Invoke a write primitive the way the SDK's `create`/`update`/`destroy` do. */
function invoke(name: (typeof WRITE_PRIMITIVES)[number], table = "Applications") {
  const fn = proto[name] as (...args: unknown[]) => unknown;
  return fn.call({ name: table }, [{ fields: {} }]);
}

describe("the guard is actually wired", () => {
  it("wraps every write primitive", () => {
    // If this fails, every assertion below is meaningless — so it is asserted
    // first and explicitly, rather than assumed.
    expect(proto.__workzyV1ReadOnlyPatched).toBe(true);
  });

  it("the underlying spy IS reachable when writes are allowed", () => {
    // This is what makes the "never called" assertions meaningful.
    vi.stubEnv("V1_READ_ONLY", "false");
    invoke("_createRecords");
    expect(performed).toEqual(["_createRecords:Applications"]);
  });
});

describe("read-only mode — the Airtable write function is never reached", () => {
  beforeEach(() => {
    vi.stubEnv("V1_READ_ONLY", "true");
  });

  it("refuses record creation — the candidate application path", () => {
    expect(() => invoke("_createRecords")).toThrow(V1ReadOnlyError);
    expect(performed).toEqual([]);
  });

  it("refuses record updates", () => {
    expect(() => invoke("_updateRecords", "Jobs")).toThrow(V1ReadOnlyError);
    expect(performed).toEqual([]);
  });

  it("refuses record deletion — nothing in the evidence base can be destroyed", () => {
    expect(() => invoke("_destroyRecord", "Jobs")).toThrow(V1ReadOnlyError);
    expect(performed).toEqual([]);
  });

  it("refuses regardless of which of v1's 33 Airtable clients issued the call", () => {
    // The guard is on the shared prototype, so the calling client is
    // irrelevant. `this` differs; the refusal does not.
    for (const table of ["Applications", "Jobs", "Employers", "MagicLinks", "Users"]) {
      expect(() => invoke("_createRecords", table)).toThrow(V1ReadOnlyError);
    }
    expect(performed).toEqual([]);
  });

  it("names the table and the live system in the error", () => {
    try {
      invoke("_createRecords", "MagicLinks");
      throw new Error("should have refused");
    } catch (error) {
      expect((error as Error).message).toContain("MagicLinks");
      expect((error as Error).message).toContain("https://www.workzy.hu");
      expect((error as V1ReadOnlyError).code).toBe("V1_READ_ONLY");
    }
  });

  it("leaves READ primitives untouched — C9 requires v1 to stay readable", () => {
    // The guard wraps exactly three methods. Anything else on the prototype —
    // every read path — must be exactly what the SDK shipped.
    const readPrimitives = Object.getOwnPropertyNames(proto).filter(
      (n) =>
        typeof proto[n] === "function" &&
        !WRITE_PRIMITIVES.includes(n as (typeof WRITE_PRIMITIVES)[number]),
    );

    expect(readPrimitives.length).toBeGreaterThan(0);
    for (const name of readPrimitives) {
      expect(String(proto[name]), `${name} must not be wrapped`).not.toContain(
        "V1ReadOnlyError",
      );
    }
  });
});

describe("writes are permitted when read-only is explicitly off", () => {
  it("calls through to the SDK for every primitive", () => {
    vi.stubEnv("V1_READ_ONLY", "false");
    invoke("_createRecords");
    invoke("_updateRecords", "Jobs");
    invoke("_destroyRecord", "Jobs");
    expect(performed).toEqual([
      "_createRecords:Applications",
      "_updateRecords:Jobs",
      "_destroyRecord:Jobs",
    ]);
  });
});

describe("idempotency", () => {
  it("a second install does not double-wrap or weaken refusal", () => {
    installAirtableReadOnlyGuard({ tableProto: proto });
    installAirtableReadOnlyGuard({ tableProto: proto });
    vi.stubEnv("V1_READ_ONLY", "true");

    expect(() => invoke("_createRecords")).toThrow(V1ReadOnlyError);
    expect(performed).toEqual([]);
  });
});
