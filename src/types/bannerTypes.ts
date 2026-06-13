import type { IImageSet } from "./brandTypes";

export interface IBanner {
  _id: string;
  name: string;
  image: IImageSet;
  public_id: string;
  createdAt?: string;
  updatedAt?: string;
}
