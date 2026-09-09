import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import { z } from "zod";

export const SESSION_COOKIE = "till_sb_session";
export const REFRESH_COOKIE = "till_sb_refresh";

const sessionSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
  expires_at: z.number().optional(),
});

export type AuthCookieSession = z.infer<typeof sessionSchema>;

function cookieOpts(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export function writeAuthCookies(session: AuthCookieSession): void {
  setCookie(SESSION_COOKIE, session.access_token, cookieOpts(60 * 60 * 24 * 7));
  setCookie(REFRESH_COOKIE, session.refresh_token, cookieOpts(60 * 60 * 24 * 30));
}

export function wipeAuthCookies(): void {
  deleteCookie(SESSION_COOKIE, { path: "/" });
  deleteCookie(REFRESH_COOKIE, { path: "/" });
}

export function peekAuthCookies(): AuthCookieSession | null {
  const access_token = getCookie(SESSION_COOKIE);
  const refresh_token = getCookie(REFRESH_COOKIE);
  if (!access_token || !refresh_token) return null;
  return { access_token, refresh_token };
}

export const persistAuthCookies = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => sessionSchema.parse(data))
  .handler(async ({ data }) => {
    writeAuthCookies(data);
    return { ok: true as const };
  });

export const clearAuthCookies = createServerFn({ method: "POST" }).handler(async () => {
  wipeAuthCookies();
  return { ok: true as const };
});

export const readAuthCookies = createServerFn({ method: "GET" }).handler(async () =>
  peekAuthCookies(),
);
