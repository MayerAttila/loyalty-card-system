import { api } from "./axios";
import { User } from "@/types/user";

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  businessId: string;
  role?: "OWNER" | "ADMIN" | "STAFF";
};

export const createUser = async (payload: CreateUserPayload) => {
  const { data } = await api.post<User>("/user", payload);
  return data;
};

export const updateUserRole = async (id: string, role: User["role"]) => {
  const { data } = await api.patch<User>(`/user/id/${id}/role`, {
    role,
  });
  return data;
};

export const updateUserProfile = async (
  id: string,
  payload: { name?: string; email?: string }
) => {
  const { data } = await api.patch<User>(`/user/id/${id}`, payload);
  return data;
};

export const deleteUser = async (id: string) => {
  await api.delete(`/user/id/${id}`);
};

export const sendEmployeeInvite = async (payload: {
  email: string;
  businessId: string;
}) => {
  const { data } = await api.post<{ message: string }>("/user/invite", payload);
  return data;
};
