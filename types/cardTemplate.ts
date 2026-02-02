export type CardTemplate = {
  id: string;
  template: string;
  text1?: string | null;
  text2?: string | null;
  maxPoints: number;
  cardColor: string;
  useStampImages?: boolean;
  stampOnImageId?: string | null;
  stampOffImageId?: string | null;
  isActive: boolean;
  businessId: string;
  createdAt: string;
  updatedAt: string;
};
