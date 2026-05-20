export interface IPayout {
  _id: string;
  sellerId: string | { _id: string; shopName: string };
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
  updatedAt?: string;
}
