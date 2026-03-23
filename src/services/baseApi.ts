import config from "@/utils/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: config.apiBaseUrl,
    credentials: "include",
  }),
  tagTypes: ["Users", "Products", "Categories", "Banners", "Brands", "Campaigns", "ComboOffers", "Cupons"],
  endpoints: () => ({}),
});