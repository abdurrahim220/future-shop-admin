export interface IImageSet {
  small?: string;
  medium?: string;
  large?: string;
  original?: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  parentId?: string;
  icon: IImageSet;
  public_id: string;
  isFeatured: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
