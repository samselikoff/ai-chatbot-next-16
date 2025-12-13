import 'server-only';

import { cookies } from 'next/headers';
import { getIronSession, unsealData } from 'iron-session';

const sessionOptions = {
  cookieName: 'app_session',
  password: process.env.SESSION_PASSWORD!,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  },
};

type SessionData = {
  userId: string;
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function unsealCookie(cookie: string) {
  return unsealData<{ userId?: string }>(cookie, {
    password: sessionOptions.password,
  });
}
