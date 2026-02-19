import { api } from "./axios";

export type ContactMessagePayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const sendContactMessage = async (payload: ContactMessagePayload) => {
  const { data } = await api.post<{ message: string }>(
    "/support/contact",
    payload,
  );
  return data;
};
