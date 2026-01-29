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

export type StampCardResult = {
  cardId: string;
  customerName: string;
  customerEmail: string;
  cardTitle: string;
  stampCount: number;
  maxPoints: number;
  completed: boolean;
  addedStamps?: number;
  walletUpdated?: boolean;
  walletUpdateError?: unknown;
};

export const getCardsByCustomerId = async (customerId: string) => {
  const { data } = await api.get(`/user-loyalty-card/customer/${customerId}`);
  return data as CustomerCard[];
};

export const getGoogleWalletSaveLink = async (cardId: string) => {
  const { data } = await api.post(`/user-loyalty-card/id/${cardId}/google-wallet`);
  return data as GoogleWalletSaveLink;
};

export const stampCard = async (cardId: string, addedStamps = 1) => {
  const { data } = await api.post(`/user-loyalty-card/id/${cardId}/stamp`, {
    addedStamps,
  });
  return data as StampCardResult;
};
