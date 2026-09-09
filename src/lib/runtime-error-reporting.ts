/** Local runtime error reporting — no third-party editor telemetry. */
export function reportRuntimeError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof console !== "undefined") {
    console.error("[till]", error, context);
  }
}
