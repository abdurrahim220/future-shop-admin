import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IComboOffer } from "@/types/comboOfferTypes";

export interface ComboOfferState {
  selectedComboOffer: IComboOffer | null;
}

const initialState: ComboOfferState = {
  selectedComboOffer: null,
};

const comboOfferSlice = createSlice({
  name: "comboOffer",
  initialState,
  reducers: {
    setSelectedComboOffer: (state, action: PayloadAction<IComboOffer | null>) => {
      state.selectedComboOffer = action.payload;
    },
    clearSelectedComboOffer: (state) => {
      state.selectedComboOffer = null;
    },
  },
});

export const { setSelectedComboOffer, clearSelectedComboOffer } = comboOfferSlice.actions;
export default comboOfferSlice.reducer;
