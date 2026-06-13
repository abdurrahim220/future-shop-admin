import config from "@/utils/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: config.apiBaseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const { accessToken, user } = (refreshResult.data as any).data;
      api.dispatch({
        type: "auth/setCredentials",
        payload: { accessToken, user },
      });
      // Retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch({ type: "auth/logout" });
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Users",
    "Products",
    "Categories",
    "Banners",
    "Brands",
    "Campaigns",
    "ComboOffers",
    "Cupons",
    "Attributes",
    "AttributeValues",
    "StockMovements",
    "StockTransfers",
    "Notifications",
    "Orders",
    "Sellers",
    "SellerWallets",
    "Payouts",
    "Addresses",
    "Branches",
    "BranchInventory",
    "Reviews",
    "AuditLogs",
    "Suborders"
  ],
  endpoints: () => ({}),
});