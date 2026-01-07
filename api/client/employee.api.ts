import { api } from "./axios";
import { Employee } from "@/types/employee";

export const createEmployee = async (payload: {
  name: string;
  email: string;
  password: string;
  approved?: boolean;
  businessId: string;
}) => {
  const { data } = await api.post<Employee>("/employees", payload);
  return data;
};
