import type { ApiResponse } from "@/types/apiResponse";
import type { ISeller, UpdateSellerPayload } from "@/types/sellerTypes";
import { baseApi } from "@/services/baseApi";

export const sellerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL SELLERS
    getAllSellers: builder.query<
      ApiResponse<{
        items: ISeller[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>,
      Record<string, string | number | boolean | undefined> | void
    >({
      query: (params) => ({
        url: "/seller",
        method: "GET",
        params: params ? params : undefined,
      }),
      providesTags: ["Sellers"],
    }),

    // ✅ GET SELLER BY ID
    getSellerById: builder.query<ApiResponse<ISeller>, string>({
      query: (id) => ({
        url: `/seller/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Sellers", id }],
    }),

    // ✅ UPDATE SELLER
    updateSeller: builder.mutation<
      ApiResponse<ISeller>,
      { id: string; data: UpdateSellerPayload }
    >({
      query: ({ id, data }) => ({
        url: `/seller/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Sellers", id },
        "Sellers",
      ],
    }),

    // ✅ DELETE SELLER
    deleteSeller: builder.mutation<ApiResponse<ISeller>, string>({
      query: (id) => ({
        url: `/seller/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sellers"],
    }),
  }),
});

export const {
  useGetAllSellersQuery,
  useGetSellerByIdQuery,
  useUpdateSellerMutation,
  useDeleteSellerMutation,
} = sellerApi;
