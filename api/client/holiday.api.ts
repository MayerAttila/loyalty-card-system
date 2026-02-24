import { api } from "./axios";
import type { HolidayCountryCode, PublicHolidayRecord } from "@/types/holiday";

export async function getPublicHolidays(
  countryCode: HolidayCountryCode,
  year: number
) {
  const res = await api.get<PublicHolidayRecord[]>("/holiday/public", {
    params: {
      countryCode,
      year,
    },
  });
  return res.data;
}

