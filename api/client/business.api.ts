import { api } from "./axios";
import { Business } from "../../types/business";
import { BusinessStampList } from "../../types/stampImage";

export type CreateBusinessPayload = {
  name: string;
  address?: string;
};

export const createBusiness = async (payload: {
  name: string;
  address?: string;
}) => {
  const { data } = await api.post<Business>("/business", payload);
  return data;
};

export const updateBusiness = async (
  id: string,
  payload: {
    name: string;
    address?: string | null;
    locationPlaceId?: string | null;
    locationAddress?: string | null;
    locationLat?: number | null;
    locationLng?: number | null;
  }
) => {
  const { data } = await api.patch<Business>(`/business/id/${id}`, payload);
  return data;
};

export const uploadBusinessLogo = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append("logo", file);
  const { data } = await api.post<{ id: string }>(
    `/business/id/${id}/logo`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

export const deleteBusinessLogo = async (id: string) => {
  await api.delete(`/business/id/${id}/logo`);
};

export const uploadBusinessStampOn = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append("stampOn", file);
  const { data } = await api.post<{ id: string }>(
    `/business/id/${id}/stamp-on`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

export const uploadBusinessStampOff = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append("stampOff", file);
  const { data } = await api.post<{ id: string }>(
    `/business/id/${id}/stamp-off`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data;
};

export const getBusinessStamps = async (id: string) => {
  const { data } = await api.get<BusinessStampList>(`/business/id/${id}/stamps`);
  return data;
};

export const deleteBusinessStampImage = async (
  businessId: string,
  imageId: string
) => {
  await api.delete(`/business/id/${businessId}/stamps/${imageId}`);
};
