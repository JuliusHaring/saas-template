export function isDevModeEnabled() {
  return process.env.MODE?.toLowerCase() === "dev";
}
