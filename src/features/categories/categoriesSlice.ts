import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ICategory } from "@/types/categoryTypes";

export interface CategoriesState {
  selectedCategory: ICategory | null;
}

const initialState: CategoriesState = {
  selectedCategory: null,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<ICategory | null>) => {
      state.selectedCategory = action.payload;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
});

export const { setSelectedCategory, clearSelectedCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
