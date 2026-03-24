import type { ApiResponse } from "@/types/apiResponse";
import type { ICategory } from "@/types/categoryTypes";
import { baseApi } from "@/services/baseApi";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL CATEGORIES
    getAllCategories: builder.query<
      ApiResponse<{
        items: ICategory[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>,
      {
        search?: string;
        isActive?: boolean | string;
        isFeatured?: boolean | string;
        page?: number;
        limit?: number;
      } | void
    >({
      query: (params) => ({
        url: "/categories",
        method: "GET",
        params: params ? params : undefined,
      }),
      providesTags: ["Categories"],
    }),

    // ✅ GET CATEGORY BY ID
    getCategoryById: builder.query<ApiResponse<ICategory>, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Categories", id }],
    }),

    // ✅ CREATE CATEGORY
    createCategory: builder.mutation<ApiResponse<ICategory>, FormData>({
      query: (data) => ({
        url: "/categories",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),

    // ✅ UPDATE CATEGORY
    updateCategory: builder.mutation<
      ApiResponse<ICategory>,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Categories", id },
        "Categories",
      ],
    }),

    // ✅ DELETE CATEGORY
    deleteCategory: builder.mutation<ApiResponse<ICategory>, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
