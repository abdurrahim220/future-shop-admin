import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { INotification } from "@/types/notificationTypes";

export interface NotificationState {
  selectedNotification: INotification | null;
}

const initialState: NotificationState = {
  selectedNotification: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setSelectedNotification: (state, action: PayloadAction<INotification | null>) => {
      state.selectedNotification = action.payload;
    },
    clearSelectedNotification: (state) => {
      state.selectedNotification = null;
    },
  },
});

export const { setSelectedNotification, clearSelectedNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
