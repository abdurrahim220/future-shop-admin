import type { ApiResponse } from "@/types/apiResponse";
import type { IAddress } from "@/types/addressTypes";
import { baseApi } from "@/services/baseApi";

export const userAddressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL ADDRESSES
    getAllAddresses: builder.query<
      ApiResponse<{
        items: IAddress[];
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
        url: "/address",
        method: "GET",
        params: params ? params : undefined,
      }),
      providesTags: ["Addresses"],
    }),
  }),
});

export const {
  useGetAllAddressesQuery,
} = userAddressApi;
