import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IAttribute } from "@/types/attributeTypes";

export interface AttributeState {
  selectedAttribute: IAttribute | null;
}

const initialState: AttributeState = {
  selectedAttribute: null,
};

const attributeSlice = createSlice({
  name: "attribute",
  initialState,
  reducers: {
    setSelectedAttribute: (state, action: PayloadAction<IAttribute | null>) => {
      state.selectedAttribute = action.payload;
    },
    clearSelectedAttribute: (state) => {
      state.selectedAttribute = null;
    },
  },
});

export const { setSelectedAttribute, clearSelectedAttribute } = attributeSlice.actions;
export default attributeSlice.reducer;
