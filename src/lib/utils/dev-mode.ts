export function isDevModeEnabled() {
  return process.env.NEXT_PUBLIC_MODE?.toLowerCase() === "dev";
}
