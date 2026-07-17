import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import CreditService from "../services/credit.service";

const initialState = {
  visible: false,
  title: 0,
  body: 0,
  type: "success",
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showNotification: (state, action) => {
      state.visible = true;
      state.title = action.payload.title;
      state.body = action.payload.body;
      state.type = action.payload.type || "success";
    },

    hideNotification: (state) => {
      state.visible = false;
      state.title = "";
      state.body = "";
      state.type = "success";
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
