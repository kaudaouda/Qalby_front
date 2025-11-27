import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { fundService } from '../../services/fundService';
import type { FundDetail, FundStatistics, Contributor, Contribution } from '../../types';

interface FundState {
  currentFund: FundDetail | null;
  statistics: FundStatistics | null;
  contributors: Contributor[];
  contributions: Contribution[];
  contributionsPage: number;
  hasMoreContributions: boolean;
  isLoading: boolean;
  isLoadingContributions: boolean;
  isLoadingStatistics: boolean;
  isLoadingContributors: boolean;
  error: string | null;
}

const initialState: FundState = {
  currentFund: null,
  statistics: null,
  contributors: [],
  contributions: [],
  contributionsPage: 1,
  hasMoreContributions: true,
  isLoading: false,
  isLoadingContributions: false,
  isLoadingStatistics: false,
  isLoadingContributors: false,
  error: null,
};

// Async thunks
export const getFundDetail = createAsyncThunk(
  'fund/getDetail',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fundService.getFundDetail(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get fund details');
    }
  }
);

export const getFundStatistics = createAsyncThunk(
  'fund/getStatistics',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fundService.getFundStatistics(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get fund statistics');
    }
  }
);

export const getFundContributions = createAsyncThunk(
  'fund/getContributions',
  async ({ id, page = 1 }: { id: string; page?: number }, { rejectWithValue }) => {
    try {
      const response = await fundService.getFundContributions(id, page);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get contributions');
    }
  }
);

export const getFundContributors = createAsyncThunk(
  'fund/getContributors',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fundService.getFundContributors(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get contributors');
    }
  }
);

const fundSlice = createSlice({
  name: 'fund',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearFund: (state) => {
      state.currentFund = null;
      state.statistics = null;
      state.contributors = [];
      state.contributions = [];
      state.contributionsPage = 1;
      state.hasMoreContributions = true;
      state.error = null;
    },
    resetContributions: (state) => {
      state.contributions = [];
      state.contributionsPage = 1;
      state.hasMoreContributions = true;
    },
  },
  extraReducers: (builder) => {
    // Get Fund Detail
    builder
      .addCase(getFundDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFundDetail.fulfilled, (state, action: PayloadAction<FundDetail>) => {
        state.isLoading = false;
        state.currentFund = action.payload;
        state.error = null;
      })
      .addCase(getFundDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Fund Statistics
    builder
      .addCase(getFundStatistics.pending, (state) => {
        state.isLoadingStatistics = true;
        state.error = null;
      })
      .addCase(getFundStatistics.fulfilled, (state, action: PayloadAction<FundStatistics>) => {
        state.isLoadingStatistics = false;
        state.statistics = action.payload;
        state.error = null;
      })
      .addCase(getFundStatistics.rejected, (state, action) => {
        state.isLoadingStatistics = false;
        state.error = action.payload as string;
      });

    // Get Fund Contributions
    builder
      .addCase(getFundContributions.pending, (state) => {
        state.isLoadingContributions = true;
        state.error = null;
      })
      .addCase(getFundContributions.fulfilled, (state, action) => {
        state.isLoadingContributions = false;
        const { results, next } = action.payload;
        
        if (state.contributionsPage === 1) {
          state.contributions = results || [];
        } else {
          state.contributions = [...state.contributions, ...(results || [])];
        }
        
        state.hasMoreContributions = !!next;
        state.contributionsPage += 1;
        state.error = null;
      })
      .addCase(getFundContributions.rejected, (state, action) => {
        state.isLoadingContributions = false;
        state.error = action.payload as string;
      });

    // Get Fund Contributors
    builder
      .addCase(getFundContributors.pending, (state) => {
        state.isLoadingContributors = true;
        state.error = null;
      })
      .addCase(getFundContributors.fulfilled, (state, action: PayloadAction<Contributor[]>) => {
        state.isLoadingContributors = false;
        state.contributors = action.payload;
        state.error = null;
      })
      .addCase(getFundContributors.rejected, (state, action) => {
        state.isLoadingContributors = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearFund, resetContributions } = fundSlice.actions;
export default fundSlice.reducer;

