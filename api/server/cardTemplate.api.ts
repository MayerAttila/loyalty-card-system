import "server-only";
import { apiFetch } from "./fetch";
import { CardTemplate } from "@/types/cardTemplate";

export const getCardTemplatesByBusinessId = async (businessId: string) => {
  const data = await apiFetch<CardTemplate[]>(
    `/card-template/business/${businessId}`
  );
  return data;
};
