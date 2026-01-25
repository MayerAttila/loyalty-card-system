export type CardTemplate = {
  id: string;
  title: string;
  maxPoints: number;
  cardColor: string;
  accentColor: string;
  textColor: string;
  useStampImages?: boolean;
  stampOnImageId?: string | null;
  stampOffImageId?: string | null;
  isActive: boolean;
  businessId: string;
  createdAt: string;
  updatedAt: string;
};
