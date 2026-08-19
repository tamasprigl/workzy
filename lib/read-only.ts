/**
 * Workzy v1 — the single read-only configuration boundary (F05 C9).
 *
 * ## Why this exists
 *
 * Workzy v2 went live at https://www.workzy.hu on 2026-08-19. The v1 dataset
 * was frozen, exported once, and imported into v2 against a pinned content
 * fingerprint. Nothing written into v1 after that freeze will ever reach v2.
 *
 * That makes every remaining v1 write path a **split-brain data-loss path**: a
 * candidate who applies here produces a record only this system can see, and
 * the employer — who now works in v2 — never learns it exists.
 *
 * C9 is the runbook step that closes it. Its own title is "v1 read-only", and
 * its body is "leave v1 deployed and readable for the agreed retention window.
 * It is the evidence base for every post-cutover question." So v1 must keep
 * *serving* and stop *writing*. This module is the switch.
 *
 * **C9 is not a decommission.** Nothing here deletes anything, and the
 * deployment must stay up until the agreed retention end,
 * `2026-09-18T09:46:18.647655Z`.
 *
 * ## The default is the important part
 *
 * A flag that has to be remembered is a flag that will one day be forgotten,
 * and the cost of forgetting this one is a real candidate's application
 * vanishing. So the default is inverted in production:
 *
 * | `V1_READ_ONLY` | `NODE_ENV=production` | result |
 * | --- | --- | --- |
 * | `"true"`  | any | **read-only** |
 * | `"false"` | any | writable — an explicit, auditable opt-out |
 * | unset / anything else | production | **read-only** ← fails closed |
 * | unset / anything else | development, test | writable |
 *
 * Production cannot accidentally omit the guard: omission *is* the guard.
 * Re-enabling writes on the live deployment takes a deliberate
 * `V1_READ_ONLY=false`, which is visible in the environment and in this table.
 */

/** The exact instant C9's retention window ends. Recorded, never computed. */
export const C9_RETENTION_END = "2026-09-18T09:46:18.647655Z";

/** Where the live product now is. Used in every archive message. */
export const WORKZY_V2_ORIGIN = "https://www.workzy.hu";

/**
 * Whether this process refuses business-data writes.
 *
 * Read from the environment on every call rather than captured at module load:
 * a value captured at import time is a value that silently disagrees with the
 * environment after a hot reload or a test that sets it.
 */
export function isV1ReadOnly(): boolean {
  const raw = process.env.V1_READ_ONLY;

  if (raw === "true") return true;
  if (raw === "false") return false;

  return process.env.NODE_ENV === "production";
}

/** The message a human sees. Hungarian, because every v1 user is. */
export const READ_ONLY_MESSAGE_HU =
  "Ez a Workzy korábbi rendszerének archív változata. Itt már nem fogadunk új jelentkezést. " +
  `A jelenlegi Workzy: ${WORKZY_V2_ORIGIN}`;

/** The machine-readable refusal body shared by every blocked endpoint. */
export function readOnlyPayload() {
  return {
    success: false,
    readOnly: true,
    code: "V1_READ_ONLY",
    message: READ_ONLY_MESSAGE_HU,
    currentSystem: WORKZY_V2_ORIGIN,
  } as const;
}

/**
 * `410 Gone` rather than `403` or `503`.
 *
 * This endpoint has not lost permission and is not temporarily unavailable —
 * it is retired, permanently, at this origin. `410` is the one status that says
 * exactly that to a client and to a crawler, and it is what stops a caller
 * retrying forever against a system that will never accept the write again.
 */
export const READ_ONLY_HTTP_STATUS = 410;

/** Error thrown by the SDK-level guard. Named so tests can assert on it. */
export class V1ReadOnlyError extends Error {
  readonly code = "V1_READ_ONLY";

  constructor(detail: string) {
    super(
      `Workzy v1 is in read-only mode (C9) and refused a write: ${detail}. ` +
        `The live system is ${WORKZY_V2_ORIGIN}.`,
    );
    this.name = "V1ReadOnlyError";
  }
}

/**
 * Guard for a code path that is about to mutate business data.
 *
 * Call it at the TOP of a handler, before parsing input, before touching a
 * provider, before enqueuing a notification. Throwing later still protects the
 * data, but it does so after the work that the refusal was supposed to prevent.
 */
export function assertNotReadOnly(detail: string): void {
  if (isV1ReadOnly()) {
    throw new V1ReadOnlyError(detail);
  }
}
