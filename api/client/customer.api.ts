import { api } from "./axios";

export type CreateCustomerPayload = {
  name: string;
  email: string;
  businessId: string;
};

export const createCustomer = async (payload: CreateCustomerPayload) => {
  const { data } = await api.post("/customer", payload);
  return data;
};
