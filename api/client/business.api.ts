import { api } from "./axios";
import { Business } from "../../types/business";

export const createBusiness = async (payload: {
  name: string;
  email: string;
  password: string;
  address?: string;
}) => {
  const { data } = await api.post<Business>("/businesses", payload);
  return data;
};
