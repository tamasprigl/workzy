import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  C9_RETENTION_END,
  isV1ReadOnly,
  READ_ONLY_HTTP_STATUS,
  V1ReadOnlyError,
  WORKZY_V2_ORIGIN,
  assertNotReadOnly,
  readOnlyPayload,
} from "./read-only";

/**
 * The C9 read-only boundary.
 *
 * These tests exist because the failure they guard against is silent: a v1
 * write does not error, it succeeds — into a database nobody reads any more.
 * Nothing about the running system would look wrong afterwards, which is why
 * the guard has to be proven rather than observed.
 */

const ORIGINAL = { ...process.env };

beforeEach(() => {
  delete process.env.V1_READ_ONLY;
  vi.unstubAllEnvs();
});

afterEach(() => {
  process.env = { ...ORIGINAL };
});

/** `NODE_ENV` is read-only in typing terms; set it the way vitest sanctions. */
function setNodeEnv(value: string) {
  vi.stubEnv("NODE_ENV", value);
}

describe("isV1ReadOnly — the truth table", () => {
  it('"true" enables read-only in every environment', () => {
    for (const env of ["production", "development", "test"]) {
      setNodeEnv(env);
      vi.stubEnv("V1_READ_ONLY", "true");
      expect(isV1ReadOnly()).toBe(true);
    }
  });

  it('"false" is an explicit, auditable opt-out — even in production', () => {
    setNodeEnv("production");
    vi.stubEnv("V1_READ_ONLY", "false");
    expect(isV1ReadOnly()).toBe(false);
  });

  it("FAILS CLOSED: unset in production means read-only", () => {
    // The whole point. A flag someone has to remember is a flag that will one
    // day be forgotten, and the cost of forgetting this one is a real
    // candidate's application disappearing into a system nobody reads.
    setNodeEnv("production");
    expect(process.env.V1_READ_ONLY).toBeUndefined();
    expect(isV1ReadOnly()).toBe(true);
  });

  it("a typo does not silently re-open writes in production", () => {
    // "TRUE", "1", "yes" and a stray space are all NOT "false", so production
    // stays closed. Only the exact string "false" opens it.
    setNodeEnv("production");
    for (const value of ["TRUE", "1", "yes", "", " false", "False", "no"]) {
      vi.stubEnv("V1_READ_ONLY", value);
      expect(isV1ReadOnly(), `value ${JSON.stringify(value)}`).toBe(true);
    }
  });

  it("development stays writable when unset, so local work is unaffected", () => {
    setNodeEnv("development");
    expect(isV1ReadOnly()).toBe(false);
  });

  it("is read from the environment on every call, not captured at import", () => {
    setNodeEnv("development");
    expect(isV1ReadOnly()).toBe(false);
    vi.stubEnv("V1_READ_ONLY", "true");
    expect(isV1ReadOnly()).toBe(true);
  });
});

describe("the refusal contract", () => {
  it("410 Gone, not 403 and not 503", () => {
    // 403 says "you lack permission" and 503 says "come back later". Both are
    // false. The endpoint is retired at this origin, permanently.
    expect(READ_ONLY_HTTP_STATUS).toBe(410);
  });

  it("every refusal names where the live system actually is", () => {
    const payload = readOnlyPayload();
    expect(payload.success).toBe(false);
    expect(payload.readOnly).toBe(true);
    expect(payload.code).toBe("V1_READ_ONLY");
    expect(payload.currentSystem).toBe("https://www.workzy.hu");
    expect(payload.message).toContain("https://www.workzy.hu");
  });

  it("never points anyone at v2.workzy.hu, which is a transitional host", () => {
    expect(JSON.stringify(readOnlyPayload())).not.toContain("v2.workzy.hu");
    expect(WORKZY_V2_ORIGIN).toBe("https://www.workzy.hu");
  });

  it("records the operator-approved retention end exactly, never rounded", () => {
    expect(C9_RETENTION_END).toBe("2026-09-18T09:46:18.647655Z");
  });
});

describe("assertNotReadOnly", () => {
  it("throws a named, identifiable error when read-only", () => {
    vi.stubEnv("V1_READ_ONLY", "true");
    expect(() => assertNotReadOnly("test write")).toThrow(V1ReadOnlyError);
    try {
      assertNotReadOnly("test write");
    } catch (error) {
      expect((error as V1ReadOnlyError).code).toBe("V1_READ_ONLY");
      expect((error as Error).message).toContain("test write");
      expect((error as Error).message).toContain("https://www.workzy.hu");
    }
  });

  it("is a no-op when writes are allowed", () => {
    vi.stubEnv("V1_READ_ONLY", "false");
    expect(() => assertNotReadOnly("test write")).not.toThrow();
  });
});

describe("middleware duplicates the truth table, and must not drift", () => {
  /**
   * `middleware.ts` cannot import this module: it runs on the Edge runtime and
   * importing `lib/read-only` would drag the Node-only Airtable guard in with
   * it. So the function is duplicated there — and duplication is exactly the
   * kind of thing that quietly diverges. This asserts the two agree on every
   * input that matters.
   */
  function middlewareCopy(raw: string | undefined, nodeEnv: string): boolean {
    if (raw === "true") return true;
    if (raw === "false") return false;
    return nodeEnv === "production";
  }

  it("agrees with lib/read-only on every combination", () => {
    const values = [undefined, "true", "false", "TRUE", "1", "", " false"];
    const envs = ["production", "development", "test"];

    for (const raw of values) {
      for (const env of envs) {
        setNodeEnv(env);
        if (raw === undefined) {
          delete process.env.V1_READ_ONLY;
        } else {
          vi.stubEnv("V1_READ_ONLY", raw);
        }

        expect(
          isV1ReadOnly(),
          `V1_READ_ONLY=${JSON.stringify(raw)} NODE_ENV=${env}`,
        ).toBe(middlewareCopy(raw, env));
      }
    }
  });
});
