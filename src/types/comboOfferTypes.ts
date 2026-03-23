export interface IComboOfferProduct {
  productId: string;
  quantityRequired: number;
}

export interface IComboOffer {
  _id: string;
  title: string;
  discountType: string;
  discountValue: number;
  products: IComboOfferProduct[];
  startDate: string;
  endDate: string;
  status: string; 
  createdAt?: string;
  updatedAt?: string;
}

export type CreateComboOfferPayload = Partial<IComboOffer>;
export type UpdateComboOfferPayload = Partial<IComboOffer>;
