import type { ApiResponse } from "@/types/apiResponse";
import type { 
  IStockMovement, 
  CreateStockMovementPayload, 
  UpdateStockMovementPayload 
} from "@/types/stockMovementTypes";
import { baseApi } from "@/services/baseApi";

export const stockMovementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL STOCK MOVEMENTS
    getAllStockMovements: builder.query<ApiResponse<IStockMovement[]>, Record<string, string> | void>({
      query: (params) => ({
        url: "/stockmovement",
        method: "GET",
        params: params ? params : undefined,
      }),
      providesTags: ["StockMovements"],
    }),

    // ✅ GET STOCK MOVEMENT BY ID
    getStockMovementById: builder.query<ApiResponse<IStockMovement>, string>({
      query: (id) => ({
        url: `/stockmovement/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "StockMovements", id }],
    }),

    // ✅ CREATE STOCK MOVEMENT
    createStockMovement: builder.mutation<ApiResponse<IStockMovement>, CreateStockMovementPayload>({
      query: (data) => ({
        url: "/stockmovement",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["StockMovements"],
    }),

    // ✅ UPDATE STOCK MOVEMENT
    updateStockMovement: builder.mutation<
      ApiResponse<IStockMovement>,
      { id: string; data: UpdateStockMovementPayload }
    >({
      query: ({ id, data }) => ({
        url: `/stockmovement/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "StockMovements", id },
        "StockMovements",
      ],
    }),

    // ✅ DELETE STOCK MOVEMENT
    deleteStockMovement: builder.mutation<ApiResponse<IStockMovement>, string>({
      query: (id) => ({
        url: `/stockmovement/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["StockMovements"],
    }),
  }),
});

export const {
  useGetAllStockMovementsQuery,
  useGetStockMovementByIdQuery,
  useCreateStockMovementMutation,
  useUpdateStockMovementMutation,
  useDeleteStockMovementMutation,
} = stockMovementApi;
