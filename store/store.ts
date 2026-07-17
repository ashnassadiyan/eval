import { configureStore } from "@reduxjs/toolkit";
import creditReducer from "./slices/creditSlice";
import notificationSlice from "./slices/NotificationSlice";
import jobsSlice from "./slices/JobsSlice";

export const store = configureStore({
  reducer: {
    credits: creditReducer,
    notification: notificationSlice,
    jobs: jobsSlice,
  },
});

// ✅ Add this type
export type AppDispatch = typeof store.dispatch;
