import type { ApiResponse } from "@/types/apiResponse";
import type { 
  IStockTransfer, 
  CreateStockTransferPayload, 
  UpdateStockTransferPayload 
} from "@/types/stockTransferTypes";
import { baseApi } from "@/services/baseApi";

export const stockTransferApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL STOCK TRANSFERS
    getAllStockTransfers: builder.query<ApiResponse<IStockTransfer[]>, Record<string, string> | void>({
      query: (params) => ({
        url: "/stocktransfer",
        method: "GET",
        params: params ? params : undefined,
      }),
      providesTags: ["StockTransfers"],
    }),

    // ✅ GET STOCK TRANSFER BY ID
    getStockTransferById: builder.query<ApiResponse<IStockTransfer>, string>({
      query: (id) => ({
        url: `/stocktransfer/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "StockTransfers", id }],
    }),

    // ✅ CREATE STOCK TRANSFER
    createStockTransfer: builder.mutation<ApiResponse<IStockTransfer>, CreateStockTransferPayload>({
      query: (data) => ({
        url: "/stocktransfer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["StockTransfers"],
    }),

    // ✅ UPDATE STOCK TRANSFER
    updateStockTransfer: builder.mutation<
      ApiResponse<IStockTransfer>,
      { id: string; data: UpdateStockTransferPayload }
    >({
      query: ({ id, data }) => ({
        url: `/stocktransfer/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "StockTransfers", id },
        "StockTransfers",
      ],
    }),

    // ✅ DELETE STOCK TRANSFER
    deleteStockTransfer: builder.mutation<ApiResponse<IStockTransfer>, string>({
      query: (id) => ({
        url: `/stocktransfer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["StockTransfers"],
    }),
  }),
});

export const {
  useGetAllStockTransfersQuery,
  useGetStockTransferByIdQuery,
  useCreateStockTransferMutation,
  useUpdateStockTransferMutation,
  useDeleteStockTransferMutation,
} = stockTransferApi;
