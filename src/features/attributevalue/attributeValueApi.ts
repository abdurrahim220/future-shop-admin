import type { ApiResponse } from "@/types/apiResponse";
import type { 
  IAttributeValue, 
  CreateAttributeValuePayload, 
  UpdateAttributeValuePayload 
} from "@/types/attributeValueTypes";
import { baseApi } from "@/services/baseApi";

export const attributeValueApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL ATTRIBUTE VALUES
    getAllAttributeValues: builder.query<ApiResponse<IAttributeValue[]>, Record<string, string> | void>({
      query: (params) => ({
        url: "/attributevalue",
        method: "GET",
        params: params ? params : undefined,
      }),
      providesTags: ["AttributeValues"],
    }),

    // ✅ GET ATTRIBUTE VALUE BY ID
    getAttributeValueById: builder.query<ApiResponse<IAttributeValue>, string>({
      query: (id) => ({
        url: `/attributevalue/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "AttributeValues", id }],
    }),

    // ✅ CREATE ATTRIBUTE VALUE
    createAttributeValue: builder.mutation<ApiResponse<IAttributeValue>, CreateAttributeValuePayload>({
      query: (data) => ({
        url: "/attributevalue",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AttributeValues"],
    }),

    // ✅ UPDATE ATTRIBUTE VALUE
    updateAttributeValue: builder.mutation<
      ApiResponse<IAttributeValue>,
      { id: string; data: UpdateAttributeValuePayload }
    >({
      query: ({ id, data }) => ({
        url: `/attributevalue/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "AttributeValues", id },
        "AttributeValues",
      ],
    }),

    // ✅ DELETE ATTRIBUTE VALUE
    deleteAttributeValue: builder.mutation<ApiResponse<IAttributeValue>, string>({
      query: (id) => ({
        url: `/attributevalue/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AttributeValues"],
    }),
  }),
});

export const {
  useGetAllAttributeValuesQuery,
  useGetAttributeValueByIdQuery,
  useCreateAttributeValueMutation,
  useUpdateAttributeValueMutation,
  useDeleteAttributeValueMutation,
} = attributeValueApi;
