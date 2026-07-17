import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CreditService from "../services/credit.service";

const initialState = {
  balance: 0,
  total_added: 0,
  total_used: 0,
  loadingCredits: false,
  error: null,
};

export const getUserCredit = createAsyncThunk(
  "credit/usercredits",
  async (_, { rejectWithValue }) => {
    try {
      const res = await CreditService.getUserCredit();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error fetching credits");
    }
  }
);

const creditSlice = createSlice({
  name: "credits",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserCredit.pending, (state) => {
        state.loadingCredits = true;
        state.error = null;
      })
      .addCase(getUserCredit.fulfilled, (state, action) => {
        state.loadingCredits = false;

        state.balance = action.payload.balance ?? 0;
        state.total_added = action.payload.total_added ?? 0;
        state.total_used = action.payload.total_used ?? 0;
      })
      .addCase(getUserCredit.rejected, (state, action) => {
        state.loadingCredits = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default creditSlice.reducer;
