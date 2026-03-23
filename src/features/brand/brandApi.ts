import type { ApiResponse } from "@/types/apiResponse";
import type { IBrand } from "@/types/brandTypes";
import { baseApi } from "@/services/baseApi";

export const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL BRANDS
    getAllBrands: builder.query<ApiResponse<IBrand[]>, Record<string, string> | void>({
      query: (params) => ({
        url: "/brands",
        method: "GET",
        params: params ? params : undefined,
      }),
      providesTags: ["Brands"],
    }),

    // ✅ GET BRAND BY ID
    getBrandById: builder.query<ApiResponse<IBrand>, string>({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Brands", id }],
    }),

    // ✅ CREATE BRAND
    createBrand: builder.mutation<ApiResponse<IBrand>, FormData>({
      query: (data) => ({
        url: "/brands",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Brands"],
    }),

    // ✅ UPDATE BRAND
    updateBrand: builder.mutation<
      ApiResponse<IBrand>,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/brands/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Brands", id },
        "Brands",
      ],
    }),

    // ✅ DELETE BRAND
    deleteBrand: builder.mutation<ApiResponse<IBrand>, string>({
      query: (id) => ({
        url: `/brands/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brands"],
    }),
  }),
});

export const {
  useGetAllBrandsQuery,
  useGetBrandByIdQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
