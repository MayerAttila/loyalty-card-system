import { api } from "./axios";

export type CustomerCard = {
  id: string;
  customerId: string;
  loyaltyCardTemplateId: string;
  createdAt?: string;
};

export type GoogleWalletSaveLink = {
  saveUrl: string;
  classId: string;
  objectId: string;
};

export const getCardsByCustomerId = async (customerId: string) => {
  const { data } = await api.get(`/user-loyalty-card/customer/${customerId}`);
  return data as CustomerCard[];
};

export const getGoogleWalletSaveLink = async (cardId: string) => {
  const { data } = await api.post(`/user-loyalty-card/id/${cardId}/google-wallet`);
  return data as GoogleWalletSaveLink;
};
