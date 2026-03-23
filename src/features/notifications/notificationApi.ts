import type { ApiResponse } from "@/types/apiResponse";
import type { 
  INotification, 
  CreateNotificationPayload, 
  UpdateNotificationPayload 
} from "@/types/notificationTypes";
import { baseApi } from "@/services/baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL NOTIFICATIONS
    getAllNotifications: builder.query<ApiResponse<INotification[]>, Record<string, string> | void>({
      query: (params) => ({
        url: "/notifications",
        method: "GET",
        params: params ? params : undefined,
      }),
      providesTags: ["Notifications"],
    }),

    // ✅ GET NOTIFICATION BY ID
    getNotificationById: builder.query<ApiResponse<INotification>, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Notifications", id }],
    }),

    // ✅ CREATE NOTIFICATION
    createNotification: builder.mutation<ApiResponse<INotification>, CreateNotificationPayload>({
      query: (data) => ({
        url: "/notifications",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Notifications"],
    }),

    // ✅ UPDATE NOTIFICATION
    updateNotification: builder.mutation<
      ApiResponse<INotification>,
      { id: string; data: UpdateNotificationPayload }
    >({
      query: ({ id, data }) => ({
        url: `/notifications/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Notifications", id },
        "Notifications",
      ],
    }),

    // ✅ DELETE NOTIFICATION
    deleteNotification: builder.mutation<ApiResponse<INotification>, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useGetNotificationByIdQuery,
  useCreateNotificationMutation,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
} = notificationApi;
