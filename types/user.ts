export type User = {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "STAFF";
  businessId: string;
  createdAt: string;
  updatedAt: string;
};
