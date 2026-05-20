import type { ApiResponse } from "@/types/apiResponse";
import type { ISubOrder } from "@/types/suborderTypes";
import { baseApi } from "@/services/baseApi";

export const suborderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL SUBORDERS
    getAllSubOrders: builder.query<
      ApiResponse<{
        items: ISubOrder[];
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
        url: "/suborder",
        method: "GET",
        params: params ? params : undefined,
      }),
      providesTags: ["Suborders"],
    }),

    // ✅ GET SUBORDER BY ID
    getSubOrderById: builder.query<ApiResponse<ISubOrder>, string>({
      query: (id) => ({
        url: `/suborder/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Suborders", id }],
    }),
  }),
});

export const {
  useGetAllSubOrdersQuery,
  useGetSubOrderByIdQuery,
} = suborderApi;
