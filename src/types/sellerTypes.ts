export interface ISeller {
  _id: string;
  userId: string;
  shopName: string;
  logo?: {
    small?: string;
    medium?: string;
    large?: string;
    original?: string;
  };
  banner?: {
    small?: string;
    medium?: string;
    large?: string;
    original?: string;
  };
  logoPublicId?: string;
  bannerPublicId?: string;
  tradeLicense?: {
    small?: string;
    medium?: string;
    large?: string;
    original?: string;
  };
  tradeLicensePublicId?: string;
  address: string;
  commissionPercentage: number;
  status: "pending" | "approved" | "rejected" | "suspended";
  createdAt?: string;
  updatedAt?: string;
}

export type CreateSellerPayload = Partial<ISeller>;
export type UpdateSellerPayload = Partial<ISeller>;
