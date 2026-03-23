export interface IStockTransferItem {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface IStockTransfer {
  _id: string;
  sellerId: string;
  fromBranchId: string;
  toBranchId: string;
  status: string; // "pending" | "completed" | "cancelled"
  items: IStockTransferItem[];
  createdAt?: string;
  updatedAt?: string;
}

export type CreateStockTransferPayload = Partial<IStockTransfer>;
export type UpdateStockTransferPayload = Partial<IStockTransfer>;
