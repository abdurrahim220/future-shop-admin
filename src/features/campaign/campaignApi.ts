import type { ApiResponse } from "@/types/apiResponse";
import type { 
  ICampaign, 
  CreateCampaignPayload, 
  UpdateCampaignPayload 
} from "@/types/campaignTypes";
import { baseApi } from "@/services/baseApi";

export const campaignApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL CAMPAIGNS
    getAllCampaigns: builder.query<
      ApiResponse<{
        items: ICampaign[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>,
      {
        search?: string;
        status?: string;
        page?: number;
        limit?: number;
      } | void
    >({
      query: (params) => ({
        url: "/campaign",
        method: "GET",
        params: params ? params : undefined,
      }),
      providesTags: ["Campaigns"],
    }),

    // ✅ GET CAMPAIGN BY ID
    getCampaignById: builder.query<ApiResponse<ICampaign>, string>({
      query: (id) => ({
        url: `/campaign/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Campaigns", id }],
    }),

    // ✅ CREATE CAMPAIGN
    createCampaign: builder.mutation<ApiResponse<ICampaign>, CreateCampaignPayload | FormData>({
      query: (data) => ({
        url: "/campaign",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Campaigns"],
    }),

    // ✅ UPDATE CAMPAIGN
    updateCampaign: builder.mutation<
      ApiResponse<ICampaign>,
      { id: string; data: UpdateCampaignPayload | FormData }
    >({
      query: ({ id, data }) => ({
        url: `/campaign/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Campaigns", id },
        "Campaigns",
      ],
    }),

    // ✅ DELETE CAMPAIGN
    deleteCampaign: builder.mutation<ApiResponse<ICampaign>, string>({
      query: (id) => ({
        url: `/campaign/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Campaigns"],
    }),
  }),
});

export const {
  useGetAllCampaignsQuery,
  useGetCampaignByIdQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
} = campaignApi;
