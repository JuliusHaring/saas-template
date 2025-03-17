import { NEXT_PUBLIC_MODE } from "@/lib/utils/environment";

export function isDevModeEnabled() {
  return NEXT_PUBLIC_MODE?.toLowerCase() === "dev";
}
