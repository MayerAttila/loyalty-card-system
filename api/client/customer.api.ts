import { api } from "./axios";
import type { Customer } from "@/types/customer";

export type CreateCustomerPayload = {
  name: string;
  email: string;
  businessId: string;
};

export type CustomerCardPreview = {
  issuerName: string;
  programName: string;
  maxPoints: number;
  cardColor: string;
  logoUrl?: string | null;
  useStampImages?: boolean;
  filledStampSrc?: string | null;
  emptyStampSrc?: string | null;
};

export const createCustomer = async (payload: CreateCustomerPayload) => {
  const { data } = await api.post("/customer", payload);
  return data as {
    customer: { id: string; name: string; email: string; businessId: string };
    cardId: string | null;
    cardPreview: CustomerCardPreview | null;
  };
};

export const getCustomersByBusinessId = async (
  businessId: string,
  limit?: number
) => {
  const { data } = await api.get<Customer[]>(
    `/customer/business/${encodeURIComponent(businessId)}`,
    {
      params: typeof limit === "number" ? { limit } : undefined,
    }
  );
  return data;
};
