import { getEnv } from "@/lib/env";

const SESSION_COOKIE = "moneylog_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

export function createSessionToken(now = Date.now()): string {
  const expiresAt = Math.floor(now / 1000) + SESSION_TTL_SECONDS;
  const marker = getEnv("SESSION_SECRET").slice(0, 12);
  return `${expiresAt}.${marker}`;
}

export function verifySessionToken(token?: string | null, now = Date.now()): boolean {
  if (!token) {
    return false;
  }

  const [expiresAtRaw, marker] = token.split(".");
  if (!expiresAtRaw || !marker) {
    return false;
  }

  const expiresAt = Number(expiresAtRaw);
  const expectedMarker = getEnv("SESSION_SECRET").slice(0, 12);

  if (!Number.isFinite(expiresAt) || expiresAt <= Math.floor(now / 1000)) {
    return false;
  }

  return marker === expectedMarker;
}

export function isPasswordValid(input: string): boolean {
  const expected = getEnv("DASHBOARD_PASSWORD");
  return input.trim() === expected.trim();
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE;
}

export function getSessionTtlSeconds(): number {
  return SESSION_TTL_SECONDS;
}
