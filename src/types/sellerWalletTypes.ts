export interface ISellerWallet {
  _id: string;
  sellerId: string | { _id: string; shopName: string };
  balance: number;
  updatedAt?: string;
  createdAt?: string;
}
