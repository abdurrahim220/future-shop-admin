import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IAttributeValue } from "@/types/attributeValueTypes";

export interface AttributeValueState {
  selectedAttributeValue: IAttributeValue | null;
}

const initialState: AttributeValueState = {
  selectedAttributeValue: null,
};

const attributeValueSlice = createSlice({
  name: "attributeValue",
  initialState,
  reducers: {
    setSelectedAttributeValue: (state, action: PayloadAction<IAttributeValue | null>) => {
      state.selectedAttributeValue = action.payload;
    },
    clearSelectedAttributeValue: (state) => {
      state.selectedAttributeValue = null;
    },
  },
});

export const { setSelectedAttributeValue, clearSelectedAttributeValue } = attributeValueSlice.actions;
export default attributeValueSlice.reducer;
