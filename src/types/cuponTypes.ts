export interface ICupon {
  _id: string;
  code: string;
  discountType: string;
  discountValue: number;
  maxDiscount: number;
  minPurchaseAmount: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validTo: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateCuponPayload = Partial<ICupon>;
export type UpdateCuponPayload = Partial<ICupon>;
