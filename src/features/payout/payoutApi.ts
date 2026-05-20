import type { ApiResponse } from "@/types/apiResponse";
import type { IPayout } from "@/types/payoutTypes";
import { baseApi } from "@/services/baseApi";

export const payoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL PAYOUT REQUESTS
    getAllPayouts: builder.query<
      ApiResponse<{
        items: IPayout[];
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
        url: "/payout",
        method: "GET",
        params: params ? params : undefined,
      }),
      providesTags: ["Payouts"],
    }),

    // ✅ UPDATE PAYOUT STATUS (APPROVE/REJECT)
    updatePayoutStatus: builder.mutation<
      ApiResponse<IPayout>,
      { id: string; status: "approved" | "rejected" }
    >({
      query: ({ id, status }) => ({
        url: `/payout/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Payouts", "SellerWallets"],
    }),
  }),
});

export const {
  useGetAllPayoutsQuery,
  useUpdatePayoutStatusMutation,
} = payoutApi;
