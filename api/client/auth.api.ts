import { api } from "./axios";
import { AppSession } from "@/types/session";

export type signInPayload = {
  email: string;
  password: string;
  callbackUrl?: string;
};

export type SignInResponse = {
  error?: string | null;
  ok?: boolean;
  status?: number;
  url?: string | null;
};

export type SignOutResponse = {
  url?: string | null;
};


type CsrfResponse = {
  csrfToken: string;
};

const getCsrfToken = async () => {
  const res = await api.get<CsrfResponse>("/auth/csrf");
  if (!res.data?.csrfToken) {
    throw new Error("Missing CSRF token");
  }
  return res.data.csrfToken;
};

export const signIn = async function name(payload: signInPayload) {
  const csrfToken = await getCsrfToken();
  const body = new URLSearchParams({
    csrfToken,
    email: payload.email,
    password: payload.password,
    callbackUrl:
      typeof window !== "undefined"
        ? payload.callbackUrl ?? window.location.origin
        : payload.callbackUrl ?? "/",
    json: "true",
  });

  const res = await api.post("/auth/callback/credentials", body.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1",
      Accept: "application/json",
    },
  });

  if (res.data?.error) {
    throw new Error(res.data.error);
  }

  return res.data as SignInResponse;
};

export const signOut = async () => {
  const csrfToken = await getCsrfToken();
  const body = new URLSearchParams({
    csrfToken,
    callbackUrl: typeof window !== "undefined" ? window.location.origin : "/",
    json: "true",
  });

  const res = await api.post("/auth/signout", body.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Auth-Return-Redirect": "1",
      Accept: "application/json",
    },
  });

  return res.data as SignOutResponse;
};

export const getSession = async () => {
  const res = await api.get<AppSession>("/auth/session");
  return res.data ?? null;
};
