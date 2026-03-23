import type { ApiResponse } from "@/types/apiResponse";
import type { IUser } from "@/types/userTypes";
import { baseApi } from "./baseApi";

interface ChangeRolePayload {
  userId: string;
  role: string;
}

interface SellerRequestPayload {
  userId: string;
  status: string;
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    
    // ✅ GET ALL USERS
    getAllUsers: builder.query<ApiResponse<IUser[]>, void>({
      query: () => ({
        url: "/admin",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    // ✅ CHANGE ROLE
    changeRole: builder.mutation<ApiResponse<IUser>, ChangeRolePayload>({
      query: (data) => ({
        url: "/admin/change-role",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ UPDATE SELLER REQUEST
    updateSellerRequest: builder.mutation<
      ApiResponse<IUser>,
      SellerRequestPayload
    >({
      query: (data) => ({
        url: "/admin/update-seller-request",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ BLOCK USER
    blockUser: builder.mutation<ApiResponse<IUser>, string>({
      query: (userId) => ({
        url: `/admin/block-user/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ UNBLOCK USER
    unblockUser: builder.mutation<ApiResponse<IUser>, string>({
      query: (userId) => ({
        url: `/admin/unblock-user/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ RESTORE USER
    restoreUser: builder.mutation<ApiResponse<IUser>, string>({
      query: (userId) => ({
        url: `/admin/restore-user/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ DELETE USER
    deleteUser: builder.mutation<ApiResponse<IUser>, string>({
      query: (userId) => ({
        url: `/admin/delete-user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useChangeRoleMutation,
  useUpdateSellerRequestMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
  useRestoreUserMutation,
  useDeleteUserMutation,
} = adminApi;