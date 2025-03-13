import { createSlice } from "@reduxjs/toolkit";
import {
  getDetailKalenderPersonal,
  getDetailKalenderSatker,
  getlistKalenderPersonal,
  getlistKalenderSatker,
} from "../service/api";
import * as Sentry from "@sentry/react-native";

const KalenderSatkerSlice = createSlice({
  name: "KalenderSatker",
  initialState: {
    satker: {
      lists: [],
      detail: {},
    },
    status: "",
    loading: false,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getlistKalenderSatker.fulfilled, (state, action) => {
        state.satker.lists = action.payload;
        state.loading = false;
      })
      .addCase(getlistKalenderSatker.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getlistKalenderSatker.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getDetailKalenderSatker.fulfilled, (state, action) => {
        state.satker.detail = action.payload;
        state.loading = false;
      })
      .addCase(getDetailKalenderSatker.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDetailKalenderSatker.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      });
  },
});

export default KalenderSatkerSlice.reducer;
