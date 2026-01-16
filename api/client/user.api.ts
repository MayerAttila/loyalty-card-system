import { api } from "./axios";
import { User } from "@/types/user";

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  businessId: string;
  role?: "OWNER" | "ADMIN" | "STAFF";
  approved?: boolean;
};

export const createUser = async (payload: CreateUserPayload) => {
  const { data } = await api.post<User>("/user", payload);
  return data;
};

export const updateUserApproval = async (id: string, approved: boolean) => {
  const { data } = await api.patch<User>(`/user/id/${id}/approval`, {
    approved,
  });
  return data;
};
