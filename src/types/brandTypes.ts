export interface IImageSet {
  small?: string;
  medium?: string;
  large?: string;
  original?: string;
}

export interface IBrand {
  _id: string;
  name: string;
  slug: string;
  logo: IImageSet;
  public_id: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
