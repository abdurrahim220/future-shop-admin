import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import brandReducer from "@/features/brand/brandSlice";
import categoriesReducer from "@/features/categories/categoriesSlice";
import productReducer from "@/features/product/productSlice";
import campaignReducer from "@/features/campaign/campaignSlice";
import comboOfferReducer from "@/features/combooffers/comboOfferSlice";
import cuponReducer from "@/features/cupons/cuponSlice";
import attributeReducer from "@/features/attribute/attributeSlice";
import attributeValueReducer from "@/features/attributevalue/attributeValueSlice";
import stockMovementReducer from "@/features/stockmovement/stockMovementSlice";
import stockTransferReducer from "@/features/stocktransfer/stockTransferSlice";
import notificationReducer from "@/features/notifications/notificationSlice";
import orderReducer from "@/features/order/orderSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { baseApi } from "@/services/baseApi";

const rootReducer = combineReducers({
  auth: authReducer,
  brand: brandReducer,
  categories: categoriesReducer,
  product: productReducer,
  campaign: campaignReducer,
  comboOffer: comboOfferReducer,
  cupon: cuponReducer,
  attribute: attributeReducer,
  attributeValue: attributeValueReducer,
  stockMovement: stockMovementReducer,
  stockTransfer: stockTransferReducer,
  notification: notificationReducer,
  order: orderReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
