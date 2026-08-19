/**
 * Next.js server-start hook — installs the Workzy v1 read-only guard (F05 C9).
 *
 * `register()` runs once per server instance, before any request is handled.
 * That ordering is load-bearing: `airtable`'s `Table` captures its own write
 * primitives in its constructor, so the prototype has to be patched before the
 * first table exists. Doing this lazily from a request path would leave a
 * window, and the window is exactly where a candidate's application gets
 * written into a system nobody reads any more.
 */

export async function register() {
  // Node runtime only. The Edge runtime never touches the Airtable SDK, and
  // `require` is unavailable there.
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { installAirtableReadOnlyGuard } = await import("./lib/airtable-read-only-guard");
  const { isV1ReadOnly, C9_RETENTION_END } = await import("./lib/read-only");

  const patched = installAirtableReadOnlyGuard();

  console.log(
    "[workzy-v1] read-only guard installed",
    JSON.stringify({
      readOnly: isV1ReadOnly(),
      retentionEnd: C9_RETENTION_END,
      runActionPatched: patched.runAction,
      tableMethodsPatched: patched.tableMethods,
    }),
  );
}
