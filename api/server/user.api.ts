import "server-only";
import { apiFetch } from "./fetch";
import { User } from "@/types/user";

export const getAllUsers = async () => {
  const data = await apiFetch<User[]>("/user");
  return data;
};

export const getUserById = async (id: string) => {
  const data = await apiFetch<User>(`/user/id/${id}`);
  return data;
};

export const getUsersByBusinessId = async (businessId: string) => {
  const data = await apiFetch<User[]>(
    `/user/businessId/${encodeURIComponent(businessId)}`
  );
  return data;
};
