export interface IBranch {
  _id: string;
  sellerId: string | { _id: string; shopName: string };
  branchName: string;
  branchCode: string;
  type: "store" | "warehouse";
  phone: string;
  address: string;
  city: string;
  state: string;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
}
