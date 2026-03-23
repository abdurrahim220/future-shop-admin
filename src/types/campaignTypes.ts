export interface IImageSet {
  small?: string;
  medium?: string;
  large?: string;
  original?: string;
}

export interface ICampaign {
  _id: string;
  slug: string;
  title: string;
  description: string;
  bannerImg: IImageSet;
  products: string[];
  categories: string[];
  brands: string[];
  startDate: string;
  endDate: string;
  status: string; // "active" | "inactive" | "pending" etc.
  createdAt?: string;
  updatedAt?: string;
}

export type CreateCampaignPayload = Partial<ICampaign>;
export type UpdateCampaignPayload = Partial<ICampaign>;
