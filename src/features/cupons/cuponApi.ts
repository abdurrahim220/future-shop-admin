import type { ApiResponse } from "@/types/apiResponse";
import type { 
  ICupon, 
  CreateCuponPayload, 
  UpdateCuponPayload 
} from "@/types/cuponTypes";
import { baseApi } from "@/services/baseApi";

interface PaginatedData<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const cuponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL CUPONS
    getAllCupons: builder.query<
      ApiResponse<PaginatedData<ICupon>>,
      Record<string, string | number | undefined> | void
    >({
      query: (params) => ({
        url: "/cupons",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["Cupons"],
    }),

    // ✅ GET CUPON BY ID
    getCuponById: builder.query<ApiResponse<ICupon>, string>({
      query: (id) => ({
        url: `/cupons/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Cupons", id }],
    }),

    // ✅ CREATE CUPON
    createCupon: builder.mutation<ApiResponse<ICupon>, CreateCuponPayload>({
      query: (data) => ({
        url: "/cupons",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cupons"],
    }),

    // ✅ UPDATE CUPON
    updateCupon: builder.mutation<
      ApiResponse<ICupon>,
      { id: string; data: UpdateCuponPayload }
    >({
      query: ({ id, data }) => ({
        url: `/cupons/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Cupons", id },
        "Cupons",
      ],
    }),

    // ✅ DELETE CUPON
    deleteCupon: builder.mutation<ApiResponse<ICupon>, string>({
      query: (id) => ({
        url: `/cupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cupons"],
    }),
  }),
});

export const {
  useGetAllCuponsQuery,
  useGetCuponByIdQuery,
  useCreateCuponMutation,
  useUpdateCuponMutation,
  useDeleteCuponMutation,
} = cuponApi;
