export type HolidayCountryCode = string;

export type PublicHolidayRecord = {
  date: string;
  localName: string;
  name: string;
  countryCode: HolidayCountryCode;
  global: boolean;
  counties: string[] | null;
  launchYear: number | null;
  types: string[];
};
