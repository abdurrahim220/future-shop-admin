import type { ApiResponse } from "@/types/apiResponse";
import type { 
  IAttribute, 
  CreateAttributePayload, 
  UpdateAttributePayload 
} from "@/types/attributeTypes";
import { baseApi } from "@/services/baseApi";

export const attributeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL ATTRIBUTES
    getAllAttributes: builder.query<ApiResponse<IAttribute[]>, Record<string, string> | void>({
      query: (params) => ({
        url: "/attribute",
        method: "GET",
        params: params ? params : undefined,
      }),
      providesTags: ["Attributes"],
    }),

    // ✅ GET ATTRIBUTE BY ID
    getAttributeById: builder.query<ApiResponse<IAttribute>, string>({
      query: (id) => ({
        url: `/attribute/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Attributes", id }],
    }),

    // ✅ CREATE ATTRIBUTE
    createAttribute: builder.mutation<ApiResponse<IAttribute>, CreateAttributePayload>({
      query: (data) => ({
        url: "/attribute",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Attributes"],
    }),

    // ✅ UPDATE ATTRIBUTE
    updateAttribute: builder.mutation<
      ApiResponse<IAttribute>,
      { id: string; data: UpdateAttributePayload }
    >({
      query: ({ id, data }) => ({
        url: `/attribute/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Attributes", id },
        "Attributes",
      ],
    }),

    // ✅ DELETE ATTRIBUTE
    deleteAttribute: builder.mutation<ApiResponse<IAttribute>, string>({
      query: (id) => ({
        url: `/attribute/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Attributes"],
    }),
  }),
});

export const {
  useGetAllAttributesQuery,
  useGetAttributeByIdQuery,
  useCreateAttributeMutation,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
} = attributeApi;
