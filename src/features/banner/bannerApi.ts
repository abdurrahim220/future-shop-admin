import type { ApiResponse } from "@/types/apiResponse";
import type { IBanner } from "@/types/bannerTypes";
import { baseApi } from "@/services/baseApi";

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL BANNERS
    getAllBanners: builder.query<ApiResponse<IBanner[]>, void>({
      query: () => ({
        url: "/banner",
        method: "GET",
      }),
      providesTags: ["Banners"],
    }),

    // ✅ GET BANNER BY ID
    getBannerById: builder.query<ApiResponse<IBanner>, string>({
      query: (id) => ({
        url: `/banner/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Banners", id }],
    }),

    // ✅ CREATE BANNER
    createBanner: builder.mutation<ApiResponse<IBanner>, FormData>({
      query: (data) => ({
        url: "/banner",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Banners"],
    }),

    // ✅ UPDATE BANNER
    updateBanner: builder.mutation<
      ApiResponse<IBanner>,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/banner/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Banners", id },
        "Banners",
      ],
    }),

    // ✅ DELETE BANNER
    deleteBanner: builder.mutation<ApiResponse<IBanner>, string>({
      query: (id) => ({
        url: `/banner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Banners"],
    }),
  }),
});

export const {
  useGetAllBannersQuery,
  useGetBannerByIdQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;
