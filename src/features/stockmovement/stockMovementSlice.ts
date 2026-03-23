import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IStockMovement } from "@/types/stockMovementTypes";

export interface StockMovementState {
  selectedStockMovement: IStockMovement | null;
}

const initialState: StockMovementState = {
  selectedStockMovement: null,
};

const stockMovementSlice = createSlice({
  name: "stockMovement",
  initialState,
  reducers: {
    setSelectedStockMovement: (state, action: PayloadAction<IStockMovement | null>) => {
      state.selectedStockMovement = action.payload;
    },
    clearSelectedStockMovement: (state) => {
      state.selectedStockMovement = null;
    },
  },
});

export const { setSelectedStockMovement, clearSelectedStockMovement } = stockMovementSlice.actions;
export default stockMovementSlice.reducer;
