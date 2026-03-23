export interface IAttribute {
  _id: string;
  name: string;
  slug: string;
  type: "image" | "text" | "number" | string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateAttributePayload = Partial<IAttribute>;
export type UpdateAttributePayload = Partial<IAttribute>;
