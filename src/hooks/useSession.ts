import { SessionType } from "@/lib/auth/session";
import { fetchJson } from "@/lib/utils/fetch";
import { useEffect, useState } from "react";

export function useSession() {
  const [user, setUser] = useState<SessionType | null>(null);

  useEffect(() => {
    fetchJson<SessionType>("/api/auth/me")
      .then((data) => setUser({ userId: data.userId }))
      .catch(() => setUser(null));
  }, []);

  return user;
}
