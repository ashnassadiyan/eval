import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import JobService from "../services/job.service";

const initialState = {
  page: 1,
  search: "",
  limit: 10,
  data: [],
  loading: false,
  error: null,
};

export const getJobs = createAsyncThunk(
  "jobs/getJobs",
  async (_, { rejectWithValue }) => {
    try {
      const res = await JobService.getMyJobs();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Error fetching jobs"
      );
    }
  }
);

const JobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
    clearJobs: (state) => {
      state.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPage, setSearch, setLimit, clearJobs } = JobsSlice.actions;

export default JobsSlice.reducer;
