export interface IStockMovement {
  _id: string;
  branchId: string;
  sellerId: string;
  productId: string;
  variantId: string;
  type: string; // "in" | "out" | "adjustment"
  quantity: number;
  referenceId: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateStockMovementPayload = Partial<IStockMovement>;
export type UpdateStockMovementPayload = Partial<IStockMovement>;
