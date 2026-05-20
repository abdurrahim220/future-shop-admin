export interface IBranchInventory {
  _id: string;
  branchId: string | { _id: string; branchName: string };
  sellerId: string | { _id: string; shopName: string };
  productId: string | { _id: string; name: string };
  variantId: string;
  stock: number;
  reorderLevel: number;
  createdAt?: string;
  updatedAt?: string;
}
