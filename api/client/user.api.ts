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

export const changeUserPassword = async (
  id: string,
  payload: { currentPassword: string; newPassword: string }
) => {
  const { data } = await api.patch<{ message: string }>(
    `/user/id/${id}/password`,
    payload
  );
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

export const getUsersByBusinessId = async (
  businessId: string,
  limit?: number,
  offset?: number
) => {
  const { data } = await api.get<User[]>(
    `/user/businessId/${encodeURIComponent(businessId)}`,
    {
      params:
        typeof limit === "number" || typeof offset === "number"
          ? {
              ...(typeof limit === "number" ? { limit } : {}),
              ...(typeof offset === "number" ? { offset } : {}),
            }
          : undefined,
    }
  );
  return data;
};
