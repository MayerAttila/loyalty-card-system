import { api } from "./axios";
import { User } from "@/types/user";

export const createUser = async (payload: { email: string; name?: string }) => {
  const { data } = await api.post<User>("/users", payload);
  return data;
};
