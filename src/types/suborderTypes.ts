export interface ISubOrder {
  _id: string;
  orderId: string | { _id: string; status: string; paymentStatus: string };
  productId: string | { _id: string; name: string };
  variantId: string;
  sellerId: string | { _id: string; shopName: string };
  branchId: string | { _id: string; branchName: string };
  createdAt?: string;
  updatedAt?: string;
}
