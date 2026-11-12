export function reportAppError(
  error: unknown,
  context: Record<string, unknown> = {}
) {
  if (typeof window === "undefined") return;
  console.error("[R2G Learn CAD Error]:", error, {
    route: window.location.pathname,
    ...context,
  });
}