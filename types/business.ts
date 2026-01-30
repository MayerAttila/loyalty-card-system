export type Business = {
  id: string;
  name: string;
  address?: string;
  website?: string | null;
  locationPlaceId?: string | null;
  locationAddress?: string | null;
  locationLat?: number | null;
  locationLng?: number | null;
  hasLogo?: boolean;
  hasStampOn?: boolean;
  hasStampOff?: boolean;
};
