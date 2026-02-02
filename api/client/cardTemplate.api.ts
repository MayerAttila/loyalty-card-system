import { api } from "./axios";
import { CardTemplate } from "@/types/cardTemplate";

export type CreateCardTemplatePayload = {
  template: string;
  businessId: string;
  text1?: string | null;
  text2?: string | null;
  maxPoints: number;
  cardColor: string;
  isActive?: boolean;
  useStampImages?: boolean;
  stampOnImageId?: string | null;
  stampOffImageId?: string | null;
  includeLocation?: boolean;
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
  template?: string;
  text1?: string | null;
  text2?: string | null;
  maxPoints?: number;
  cardColor?: string;
  isActive?: boolean;
  useStampImages?: boolean;
  stampOnImageId?: string | null;
  stampOffImageId?: string | null;
  includeLocation?: boolean;
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

export const deleteCardTemplate = async (id: string, force = false) => {
  const suffix = force ? "?force=1" : "";
  const { data } = await api.delete<CardTemplate>(
    `/card-template/id/${id}${suffix}`
  );
  return data;
};

export const generateHeroImage = async (
  id: string,
  count = 0,
  options?: { maxPoints?: number; stampRows?: number }
) => {
  const params = new URLSearchParams();
  params.set("count", String(count));
  if (options?.maxPoints !== undefined) {
    params.set("maxPoints", String(options.maxPoints));
  }
  if (options?.stampRows !== undefined) {
    params.set("stampRows", String(options.stampRows));
  }
  const { data } = await api.post<{ url: string }>(
    `/card-template/id/${id}/hero-image?${params.toString()}`
  );
  return data;
};
