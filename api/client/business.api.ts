import { api } from "./axios";
import { Business } from "../../types/business";

export type CreateBusinessPayload = {
  name: string;
  email: string;
  password: string;
  address?: string;
};

export const createBusiness = async (payload: {
  name: string;
  email: string;
  password: string;
  address?: string;
}) => {
  const { data } = await api.post<Business>("/business", payload);
  return data;
};
