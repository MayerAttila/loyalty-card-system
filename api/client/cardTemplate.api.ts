import { api } from "./axios";
import { CardTemplate } from "@/types/cardTemplate";

export type CreateCardTemplatePayload = {
  title: string;
  businessId: string;
  maxPoints: number;
  cardColor: string;
  accentColor: string;
  textColor: string;
};

export const createCardTemplate = async (
  payload: CreateCardTemplatePayload
) => {
  const { data } = await api.post<CardTemplate>("/card-template", payload);
  return data;
};

export const getCardTemplatesByBusinessId = async (businessId: string) => {
  const { data } = await api.get<CardTemplate[]>(
    `/card-template/business/${businessId}`
  );
  return data;
};

export type UpdateCardTemplatePayload = {
  title?: string;
  maxPoints?: number;
  cardColor?: string;
  accentColor?: string;
  textColor?: string;
};

export const updateCardTemplate = async (
  id: string,
  payload: UpdateCardTemplatePayload
) => {
  const { data } = await api.patch<CardTemplate>(
    `/card-template/id/${id}`,
    payload
  );
  return data;
};

export const deleteCardTemplate = async (id: string) => {
  const { data } = await api.delete<CardTemplate>(`/card-template/id/${id}`);
  return data;
};
