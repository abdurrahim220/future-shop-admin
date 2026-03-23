import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IBrand } from "@/types/brandTypes";

export interface BrandState {
  selectedBrand: IBrand | null;
}

const initialState: BrandState = {
  selectedBrand: null,
};

const brandSlice = createSlice({
  name: "brand",
  initialState,
  reducers: {
    setSelectedBrand: (state, action: PayloadAction<IBrand | null>) => {
      state.selectedBrand = action.payload;
    },
    clearSelectedBrand: (state) => {
      state.selectedBrand = null;
    },
  },
});

export const { setSelectedBrand, clearSelectedBrand } = brandSlice.actions;
export default brandSlice.reducer;
