import type { ApiResponse } from "@/types/apiResponse";
import type { 
  IOrder, 
  CreateOrderPayload, 
  UpdateOrderPayload 
} from "@/types/orderTypes";
import { baseApi } from "@/services/baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL ORDERS
    getAllOrders: builder.query<ApiResponse<IOrder[]>, Record<string, string> | void>({
      query: (params) => ({
        url: "/order",
        method: "GET",
        params: params ? params : undefined,
      }),
      providesTags: ["Orders"],
    }),

    // ✅ GET ORDER BY ID
    getOrderById: builder.query<ApiResponse<IOrder>, string>({
      query: (id) => ({
        url: `/order/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Orders", id }],
    }),

    // ✅ CREATE ORDER
    createOrder: builder.mutation<ApiResponse<IOrder>, CreateOrderPayload>({
      query: (data) => ({
        url: "/order",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),

    // ✅ UPDATE ORDER
    updateOrder: builder.mutation<
      ApiResponse<IOrder>,
      { id: string; data: UpdateOrderPayload }
    >({
      query: ({ id, data }) => ({
        url: `/order/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Orders", id },
        "Orders",
      ],
    }),

    // ✅ DELETE ORDER
    deleteOrder: builder.mutation<ApiResponse<IOrder>, string>({
      query: (id) => ({
        url: `/order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = orderApi;
