import type { ApiResponse } from "@/types/apiResponse";
import type { ISellerWallet } from "@/types/sellerWalletTypes";
import { baseApi } from "@/services/baseApi";

export const sellerWalletApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL SELLER WALLETS
    getAllSellerWallets: builder.query<
      ApiResponse<{
        items: ISellerWallet[];
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
        url: "/seller-wallet",
        method: "GET",
        params: params ? params : undefined,
      }),
      providesTags: ["SellerWallets"],
    }),

    // ✅ GET SELLER WALLET BY ID
    getSellerWalletById: builder.query<ApiResponse<ISellerWallet>, string>({
      query: (id) => ({
        url: `/seller-wallet/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "SellerWallets", id }],
    }),
  }),
});

export const {
  useGetAllSellerWalletsQuery,
  useGetSellerWalletByIdQuery,
} = sellerWalletApi;
