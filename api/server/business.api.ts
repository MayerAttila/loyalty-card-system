import "server-only";
import { apiFetch } from "./fetch";
import { Business } from "@/types/business";

export const getAllBusinesses = async () => {
  const data = await apiFetch<Business[]>("/business");
  return data;
};

export const getBusinessById = async (id: string) => {
  const data = await apiFetch<Business>(`/business/id/${id}`);
  return data;
};
