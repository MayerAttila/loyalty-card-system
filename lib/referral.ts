"use client";

const REFERRAL_STORAGE_KEY = "loyale_referral_capture_v1";
const REFERRAL_COOKIE_NAME = "loyale_ref";
const REFERRAL_TTL_DAYS = 30;
const REFERRAL_TTL_MS = REFERRAL_TTL_DAYS * 24 * 60 * 60 * 1000;

type StoredReferralCapture = {
  code: string;
  expiresAt: number;
};

export const normalizeReferralCode = (value: string) =>
  value
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "-")
    .replace(/[^A-Z0-9_-]/g, "");

const setReferralCookie = (code: string) => {
  if (typeof document === "undefined") return;
  const maxAge = REFERRAL_TTL_DAYS * 24 * 60 * 60;
  document.cookie = `${REFERRAL_COOKIE_NAME}=${encodeURIComponent(
    code,
  )}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
};

const clearReferralCookie = () => {
  if (typeof document === "undefined") return;
  document.cookie = `${REFERRAL_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
};

export const storeReferralCode = (rawCode: string) => {
  if (typeof window === "undefined") return null;
  const code = normalizeReferralCode(rawCode);
  if (!code) return null;

  const payload: StoredReferralCapture = {
    code,
    expiresAt: Date.now() + REFERRAL_TTL_MS,
  };

  try {
    window.localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // ignore storage failures
  }
  setReferralCookie(code);
  return code;
};

export const readStoredReferralCode = () => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(REFERRAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredReferralCapture>;
    const code = typeof parsed.code === "string" ? normalizeReferralCode(parsed.code) : "";
    const expiresAt =
      typeof parsed.expiresAt === "number" ? parsed.expiresAt : Number.NaN;

    if (!code || !Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
      window.localStorage.removeItem(REFERRAL_STORAGE_KEY);
      clearReferralCookie();
      return null;
    }

    return code;
  } catch {
    return null;
  }
};

export const clearStoredReferralCode = () => {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(REFERRAL_STORAGE_KEY);
    } catch {
      // ignore storage failures
    }
  }
  clearReferralCookie();
};

