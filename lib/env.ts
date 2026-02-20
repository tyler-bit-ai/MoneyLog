const REQUIRED_ENV = ["DASHBOARD_PASSWORD", "SESSION_SECRET"] as const;

export function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function validateRequiredEnv(): void {
  for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

export const SHEET_ID =
  process.env.GOOGLE_SHEET_ID ?? "1bO-4dm04CcEPCnrUy3CEhCw6ivf8gNUV4ZB8HBXL2wU";

export const SHEET_GID_BUDGET = Number(process.env.GOOGLE_SHEET_GID_BUDGET ?? 0);
export const SHEET_GID_CHECKLIST = Number(
  process.env.GOOGLE_SHEET_GID_CHECKLIST ?? 399501102,
);
