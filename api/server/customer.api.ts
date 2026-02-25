import "server-only";
import { apiFetch } from "./fetch";
import { Customer } from "@/types/customer";

export const getCustomersByBusinessId = async (
  businessId: string,
  options?: { limit?: number }
) => {
  const params = new URLSearchParams();
  if (options?.limit && Number.isFinite(options.limit)) {
    params.set("limit", String(options.limit));
  }
  const data = await apiFetch<Customer[]>(
    `/customer/business/${encodeURIComponent(businessId)}${
      params.size ? `?${params.toString()}` : ""
    }`
  );
  return data;
};
