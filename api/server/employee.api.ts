import "server-only";
import { apiFetch } from "./fetch";
import { Employee } from "@/types/employee";

export const getEmployeeById = async (id: string) => {
  const data = await apiFetch<Employee>(`/employee/id/${id}`);
  return data;
};

export const getEmployeesByBusinessId = async (businessId: string) => {
  const data = await apiFetch<Employee[]>(
    `/employee/businessId/${businessId}`
  );
  return data;
};
