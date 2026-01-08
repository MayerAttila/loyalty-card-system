export type User = {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "STAFF";
  approved: boolean;
  businessId: string;
  createdAt: string;
  updatedAt: string;
};
