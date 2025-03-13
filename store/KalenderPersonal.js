import { createSlice } from "@reduxjs/toolkit";
import {
  getDetailKalenderPersonal,
  getlistKalenderPersonal,
  getlistKalenderPersonalMirror,
} from "../service/api";
import * as Sentry from "@sentry/react-native";

const KalenderPersonalSlice = createSlice({
  name: "KalenderPersonal",
  initialState: {
    personal: {
      lists: [],
      detail: {},
    },
    status: "",
    loading: false,
    mirrorSuccess: false,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getlistKalenderPersonal.fulfilled, (state, action) => {
        state.personal.lists = action.payload;
        state.loading = false;
        state.mirrorSuccess = false;
      })
      .addCase(getlistKalenderPersonal.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getlistKalenderPersonal.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
        console.log(action.error);
      })
      .addCase(getlistKalenderPersonalMirror.fulfilled, (state, action) => {
        state.loading = false;
        state.mirrorSuccess = !state.mirrorSuccess;
        state.personal.lists = action.payload;
      })
      .addCase(getlistKalenderPersonalMirror.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getlistKalenderPersonalMirror.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
        console.log(action.error);
      })
      .addCase(getDetailKalenderPersonal.fulfilled, (state, action) => {
        state.loading = false;
        console.log("berhasil");
        state.personal.detail = action.payload;
      })
      .addCase(getDetailKalenderPersonal.pending, (state, action) => {
        state.loading = true;
        console.log("pending");
      })
      .addCase(getDetailKalenderPersonal.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
        console.log(action.error);
      });
  },
});

export default KalenderPersonalSlice.reducer;
