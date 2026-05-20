import type { ApiResponse } from "@/types/apiResponse";
import type { IBranchInventory } from "@/types/branchInventoryTypes";
import { baseApi } from "@/services/baseApi";

export const branchInventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL INVENTORIES
    getAllBranchInventories: builder.query<
      ApiResponse<{
        items: IBranchInventory[];
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
        url: "/branch-inventory",
        method: "GET",
        params: params ? params : undefined,
      }),
      providesTags: ["BranchInventory"],
    }),
  }),
});

export const {
  useGetAllBranchInventoriesQuery,
} = branchInventoryApi;
