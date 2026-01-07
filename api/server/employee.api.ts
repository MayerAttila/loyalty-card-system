import "server-only";
import { apiFetch } from "./fetch";
import { Employee } from "@/types/employee";

export const getEmployeeById = async (id: string) => {
  const data = await apiFetch<Employee>(`/employees/id/${id}`);
  return data;
};

export const getEmployeesByBusinessId = async (businessId: string) => {
  const data = await apiFetch<Employee[]>(`/employees/business/${businessId}`);
  return data;
};
