export type AppSession = {
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: "OWNER" | "ADMIN" | "STAFF";
    approved?: boolean;
    businessId?: string;
    businessName?: string;
    businessHasLogo?: boolean;
  };
  expires?: string;
} | null;
