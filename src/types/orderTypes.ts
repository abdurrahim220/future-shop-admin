export interface IOrder {
  _id: string;
  customerId: string;
  productId: string;
  variantId: string;
  sellerId: string;
  branchId: string;
  price: number;
  quantity: number;
  subtotal: number;
  status: string;
  paymentStatus: string;
  deliveryStatus: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateOrderPayload = Partial<IOrder>;
export type UpdateOrderPayload = Partial<IOrder>;
