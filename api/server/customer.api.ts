import "server-only";
import { apiFetch } from "./fetch";
import { Customer } from "@/types/customer";

export const getCustomersByBusinessId = async (businessId: string) => {
  const data = await apiFetch<Customer[]>(
    `/customer/business/${encodeURIComponent(businessId)}`
  );
  return data;
};
