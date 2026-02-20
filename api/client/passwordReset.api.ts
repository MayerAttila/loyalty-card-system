import { api } from "./axios";

export const requestPasswordReset = async (payload: { email: string }) => {
  const { data } = await api.post<{ message: string }>(
    "/password-reset/request",
    payload,
  );
  return data;
};

export const confirmPasswordReset = async (payload: {
  token: string;
  newPassword: string;
}) => {
  const { data } = await api.post<{ message: string }>(
    "/password-reset/confirm",
    payload,
  );
  return data;
};
