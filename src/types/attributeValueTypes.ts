export interface IAttributeValue {
  _id: string;
  attributeId: string;
  value: string;
  hexCode?: string;
  image?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateAttributeValuePayload = Partial<IAttributeValue>;
export type UpdateAttributeValuePayload = Partial<IAttributeValue>;
