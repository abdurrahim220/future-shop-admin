import type { ApiResponse } from "@/types/apiResponse";
import type { IReview } from "@/types/reviewTypes";
import { baseApi } from "@/services/baseApi";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL REVIEWS
    getAllReviews: builder.query<
      ApiResponse<{
        items: IReview[];
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
        url: "/reviews",
        method: "GET",
        params: params ? params : undefined,
      }),
      providesTags: ["Reviews"],
    }),

    // ✅ UPDATE REVIEW STATUS (APPROVE/REJECT)
    updateReviewStatus: builder.mutation<
      ApiResponse<IReview>,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/reviews/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Reviews"],
    }),

    // ✅ DELETE REVIEW
    deleteReview: builder.mutation<ApiResponse<IReview>, string>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews"],
    }),
  }),
});

export const {
  useGetAllReviewsQuery,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation,
} = reviewApi;
