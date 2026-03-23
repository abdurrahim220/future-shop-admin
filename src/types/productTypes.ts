export interface IAttributeValuePair {
  attributeId: string;
  attributeValueId: string;
}

export interface IProduct {
  _id: string; // The backend uses MongoDB
  sellerId: string;
  categoryId: string;
  brandId: string;
  name: string;
  sku: string;
  slug: string;
  description?: string;
  hasVariants: boolean;
  attributeIds: string[];
  status: "draft" | "pending" | "active";
}

export interface IProductVariant {
  _id: string;
  productId: string;
  sku: string;
  purchasePrice: number;
  salePrice: number;
  images: string[];
  attributeValues: IAttributeValuePair[];
  isDefault: boolean;
  variantKey: string;
  status: "active" | "inactive";
}

export interface CreateProductPayload {
  categoryId: string;
  brandId: string;
  name: string;
  description?: string;
  hasVariants: boolean;
  attributeIds?: string[];
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  categoryId?: string;
  brandId?: string;
  hasVariants?: boolean;
  attributeIds?: string[];
}

export interface CreateVariantPayload {
  sku: string;
  purchasePrice: number;
  salePrice: number;
  images: string[];
  attributeValues: {
    attributeId: string;
    attributeValueId: string;
  }[];
  isDefault?: boolean;
}

export interface BulkVariantCreationPayload {
  combinations: unknown[]; // Or define RawCombination type specifically
  basePrice: number;
  baseSalePrice: number;
}
