import "server-only";
import { apiFetch } from "./fetch";
import { Business } from "@/types/business";

export const getAllBusinesses = async () => {
  const data = await apiFetch<Business[]>("/businesses");
  return data;
};

export const getBusinessById = async (id: string) => {
  const data = await apiFetch<Business>(`/businesses/id/${id}`);
  return data;
};
