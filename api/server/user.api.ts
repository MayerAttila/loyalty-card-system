import "server-only";
import { apiFetch } from "./fetch";
import { User } from "@/types/user";

export const getAllUsers = async () => {
  const data = await apiFetch<User[]>("/users");
  return data;
};

export const getUserById = async (id: string) => {
  const data = await apiFetch<User>(`/users/id/${id}`);
  return data;
};

export const getUserByEmail = async (email: string) => {
  const data = await apiFetch<User>(
    `/users/email/${encodeURIComponent(email)}`
  );
  return data;
};
