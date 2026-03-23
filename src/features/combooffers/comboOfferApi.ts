import type { ApiResponse } from "@/types/apiResponse";
import type { 
  IComboOffer, 
  CreateComboOfferPayload, 
  UpdateComboOfferPayload 
} from "@/types/comboOfferTypes";
import { baseApi } from "@/services/baseApi";

export const comboOfferApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ GET ALL COMBO OFFERS
    getAllComboOffers: builder.query<ApiResponse<IComboOffer[]>, Record<string, string> | void>({
      query: (params) => ({
        url: "/combooffers",
        method: "GET",
        params: params ? params : undefined,
      }),
      providesTags: ["ComboOffers"],
    }),

    // ✅ GET COMBO OFFER BY ID
    getComboOfferById: builder.query<ApiResponse<IComboOffer>, string>({
      query: (id) => ({
        url: `/combooffers/${id}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "ComboOffers", id }],
    }),

    // ✅ CREATE COMBO OFFER
    createComboOffer: builder.mutation<ApiResponse<IComboOffer>, CreateComboOfferPayload>({
      query: (data) => ({
        url: "/combooffers",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ComboOffers"],
    }),

    // ✅ UPDATE COMBO OFFER
    updateComboOffer: builder.mutation<
      ApiResponse<IComboOffer>,
      { id: string; data: UpdateComboOfferPayload }
    >({
      query: ({ id, data }) => ({
        url: `/combooffers/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ComboOffers", id },
        "ComboOffers",
      ],
    }),

    // ✅ DELETE COMBO OFFER
    deleteComboOffer: builder.mutation<ApiResponse<IComboOffer>, string>({
      query: (id) => ({
        url: `/combooffers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ComboOffers"],
    }),
  }),
});

export const {
  useGetAllComboOffersQuery,
  useGetComboOfferByIdQuery,
  useCreateComboOfferMutation,
  useUpdateComboOfferMutation,
  useDeleteComboOfferMutation,
} = comboOfferApi;
