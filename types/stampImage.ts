export type BusinessStampImage = {
  id: string;
  url: string;
  mimeType: string;
  kind: "STAMP_ON" | "STAMP_OFF";
  createdAt: string;
};

export type BusinessStampList = {
  stampOn: BusinessStampImage[];
  stampOff: BusinessStampImage[];
};
