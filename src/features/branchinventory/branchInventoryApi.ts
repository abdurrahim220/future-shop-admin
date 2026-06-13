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

    // ✅ CREATE BRANCH INVENTORY
    createBranchInventory: builder.mutation<
      ApiResponse<IBranchInventory>,
      Partial<IBranchInventory>
    >({
      query: (data) => ({
        url: "/branch-inventory",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["BranchInventory"],
    }),

    // ✅ UPDATE BRANCH INVENTORY
    updateBranchInventory: builder.mutation<
      ApiResponse<IBranchInventory>,
      { id: string; data: Partial<IBranchInventory> }
    >({
      query: ({ id, data }) => ({
        url: `/branch-inventory/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["BranchInventory"],
    }),
  }),
});

export const {
  useGetAllBranchInventoriesQuery,
  useCreateBranchInventoryMutation,
  useUpdateBranchInventoryMutation,
} = branchInventoryApi;
