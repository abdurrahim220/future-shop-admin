import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ICampaign } from "@/types/campaignTypes";

export interface CampaignState {
  selectedCampaign: ICampaign | null;
}

const initialState: CampaignState = {
  selectedCampaign: null,
};

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    setSelectedCampaign: (state, action: PayloadAction<ICampaign | null>) => {
      state.selectedCampaign = action.payload;
    },
    clearSelectedCampaign: (state) => {
      state.selectedCampaign = null;
    },
  },
});

export const { setSelectedCampaign, clearSelectedCampaign } = campaignSlice.actions;
export default campaignSlice.reducer;
