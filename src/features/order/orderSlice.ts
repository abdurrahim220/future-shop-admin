import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IOrder } from "@/types/orderTypes";

export interface OrderState {
  selectedOrder: IOrder | null;
}

const initialState: OrderState = {
  selectedOrder: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setSelectedOrder: (state, action: PayloadAction<IOrder | null>) => {
      state.selectedOrder = action.payload;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
});

export const { setSelectedOrder, clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
