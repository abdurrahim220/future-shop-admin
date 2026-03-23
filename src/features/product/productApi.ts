import type { ApiResponse } from "@/types/apiResponse";
import type { 
  IProduct, 
  CreateProductPayload, 
  UpdateProductPayload, 
  IProductVariant, 
  CreateVariantPayload,
  BulkVariantCreationPayload
} from "@/types/productTypes";
import { baseApi } from "@/services/baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL PRODUCTS
    getAllProducts: builder.query<ApiResponse<IProduct[]>, Record<string, string> | void>({
      query: (params) => ({
        url: "/product",
        method: "GET",
        params: params ? params : undefined,
      }),
      providesTags: ["Products"],
    }),

    // ✅ GET PRODUCT BY ID
    getProductById: builder.query<ApiResponse<IProduct>, string>({
      query: (id) => ({
        url: `/product/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Products", id }],
    }),

    // ✅ CREATE PRODUCT
    createProduct: builder.mutation<ApiResponse<IProduct>, CreateProductPayload>({
      query: (data) => ({
        url: "/product",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    // ✅ UPDATE PRODUCT
    updateProduct: builder.mutation<
      ApiResponse<IProduct>,
      { id: string; data: UpdateProductPayload }
    >({
      query: ({ id, data }) => ({
        url: `/product/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Products", id },
        "Products",
      ],
    }),

    // ✅ CREATE VARIANT
    createVariant: builder.mutation<
      ApiResponse<IProductVariant>,
      { productId: string; data: CreateVariantPayload }
    >({
      query: ({ productId, data }) => ({
        url: `/product/${productId}/variants`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Products", id: productId },
        "Products",
      ],
    }),

    // ✅ BULK CREATE VARIANTS
    bulkCreateVariants: builder.mutation<
      ApiResponse<IProductVariant[]>,
      { productId: string; data: BulkVariantCreationPayload }
    >({
      query: ({ productId, data }) => ({
        url: `/product/${productId}/variants/bulk`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Products", id: productId },
        "Products",
      ],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useCreateVariantMutation,
  useBulkCreateVariantsMutation,
} = productApi;
