export interface IReview {
  _id: string;
  productId: string | { _id: string; name: string };
  userId: string | { _id: string; name: string; email: string };
  rating: number;
  comment: string;
  images?: Array<{
    small?: string;
    medium?: string;
    large?: string;
    original?: string;
  }>;
  status: "pending" | "approved" | "rejected" | string;
  createdAt?: string;
  updatedAt?: string;
}
