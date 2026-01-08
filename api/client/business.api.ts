import { api } from "./axios";
import { Business } from "../../types/business";

export type CreateBusinessPayload = {
  name: string;
  address?: string;
};

export const createBusiness = async (payload: {
  name: string;
  address?: string;
}) => {
  const { data } = await api.post<Business>("/business", payload);
  return data;
};
