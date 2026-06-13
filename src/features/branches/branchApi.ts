import type { ApiResponse } from "@/types/apiResponse";
import type { IBranch } from "@/types/branchTypes";
import { baseApi } from "@/services/baseApi";

export const branchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL BRANCHES
    getAllBranches: builder.query<
      ApiResponse<IBranch[]>,
      Record<string, string | number | boolean | undefined> | void
    >({
      query: (params) => ({
        url: "/branches",
        method: "GET",
        params: params ? params : undefined,
      }),
      providesTags: ["Branches"],
    }),

    // ✅ GET BRANCH BY ID
    getBranchById: builder.query<ApiResponse<IBranch>, string>({
      query: (id) => ({
        url: `/branches/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Branches", id }],
    }),

    // ✅ CREATE BRANCH
    createBranch: builder.mutation<ApiResponse<IBranch>, Partial<IBranch>>({
      query: (data) => ({
        url: "/branches",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Branches"],
    }),

    // ✅ UPDATE BRANCH
    updateBranch: builder.mutation<
      ApiResponse<IBranch>,
      { id: string; data: Partial<IBranch> }
    >({
      query: ({ id, data }) => ({
        url: `/branches/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Branches", id },
        "Branches",
      ],
    }),

    // ✅ DELETE BRANCH
    deleteBranch: builder.mutation<ApiResponse<IBranch>, string>({
      query: (id) => ({
        url: `/branches/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Branches"],
    }),
  }),
});

export const {
  useGetAllBranchesQuery,
  useGetBranchByIdQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} = branchApi;
