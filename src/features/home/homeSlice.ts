import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Campaign {
  id: number;
  title: string;
  category: string;
  image: string;
  goal: number;
  raised: number;
  contributors: number;
  daysLeft: number;
  progress: number;
}

interface HomeState {
  popularCampaigns: Campaign[];
  isLoading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  popularCampaigns: [],
  isLoading: false,
  error: null,
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setPopularCampaigns: (state, action: PayloadAction<Campaign[]>) => {
      state.popularCampaigns = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setPopularCampaigns, setLoading, setError } = homeSlice.actions;
export default homeSlice.reducer;
