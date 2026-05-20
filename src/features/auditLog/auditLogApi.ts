import type { ApiResponse } from "@/types/apiResponse";
import type { IAuditLog } from "@/types/auditLogTypes";
import { baseApi } from "@/services/baseApi";

export const auditLogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL AUDIT LOGS
    getAllAuditLogs: builder.query<
      ApiResponse<{
        items: IAuditLog[];
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
        url: "/audit-logs",
        method: "GET",
        params: params ? params : undefined,
      }),
      providesTags: ["AuditLogs"],
    }),
  }),
});

export const {
  useGetAllAuditLogsQuery,
} = auditLogApi;
