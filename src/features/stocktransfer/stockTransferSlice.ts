import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IStockTransfer } from "@/types/stockTransferTypes";

export interface StockTransferState {
  selectedStockTransfer: IStockTransfer | null;
}

const initialState: StockTransferState = {
  selectedStockTransfer: null,
};

const stockTransferSlice = createSlice({
  name: "stockTransfer",
  initialState,
  reducers: {
    setSelectedStockTransfer: (state, action: PayloadAction<IStockTransfer | null>) => {
      state.selectedStockTransfer = action.payload;
    },
    clearSelectedStockTransfer: (state) => {
      state.selectedStockTransfer = null;
    },
  },
});

export const { setSelectedStockTransfer, clearSelectedStockTransfer } = stockTransferSlice.actions;
export default stockTransferSlice.reducer;
