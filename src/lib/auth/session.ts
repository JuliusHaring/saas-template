import { UserIdType } from "@/lib/db/types";
import { isDevModeEnabled } from "@/lib/utils/dev-mode";
import { SessionOptions, getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";

export interface SessionType {
  userId: string;
}

const sessionOptions: SessionOptions = {
  password:
    "asdjasdasdknaaasdasdaszgdjhaklsmdlkynxcluybxcbyxciuyicuxasdkuahsdiuahsdiuhasdiuhasiudh",
  cookieName: "auth_session",
  cookieOptions: {
    secure: !isDevModeEnabled(),
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession(req: NextRequest, res?: NextResponse) {
  return getIronSession<SessionType>(
    req,
    res || new NextResponse(),
    sessionOptions,
  );
}

export async function setSession(
  req: NextRequest,
  res: NextResponse,
  userId: UserIdType,
) {
  const session = await getSession(req, res);
  session.userId = userId;
  await session.save();
  return res;
}

export async function clearSession(req: NextRequest) {
  const session = await getSession(req);
  session.destroy();
  return NextResponse.json(
    {},
    {
      headers: {
        "Set-Cookie": `${sessionOptions.cookieName}=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict; Secure`,
      },
    },
  );
}
