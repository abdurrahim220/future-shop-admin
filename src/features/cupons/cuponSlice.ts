import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ICupon } from "@/types/cuponTypes";

export interface CuponState {
  selectedCupon: ICupon | null;
}

const initialState: CuponState = {
  selectedCupon: null,
};

const cuponSlice = createSlice({
  name: "cupon",
  initialState,
  reducers: {
    setSelectedCupon: (state, action: PayloadAction<ICupon | null>) => {
      state.selectedCupon = action.payload;
    },
    clearSelectedCupon: (state) => {
      state.selectedCupon = null;
    },
  },
});

export const { setSelectedCupon, clearSelectedCupon } = cuponSlice.actions;
export default cuponSlice.reducer;
