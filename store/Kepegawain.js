import { createSlice } from "@reduxjs/toolkit";
import * as Sentry from "@sentry/react-native";
import {
  getDataDetailIPASN,
  getDataIPASN,
  getDataPribadi,
  getDataPribadiDetail,
  getFilterUnitKerja,
  getNominatif,
  getNominatifReport,
} from "../service/api";

const KepegawaianSlice = createSlice({
  name: "Kepegawaian",
  initialState: {
    DataIPASN: {
      lists: [],
      detail: {},
    },
    DataPribadi: {
      lists: [],
      detail: {},
    },
    nominatif: {
      lists: [],
    },
    nominatifReport: {},
    unitKerja: [],
    loading: false,
  },
  reducers: {
    setDataDetailIPASN: (state, action) => {
      state.DataIPASN.detail = {};
      state.DataPribadi.detail = {};
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getDataIPASN.fulfilled, (state, action) => {
        state.DataIPASN.lists = action.payload;
        state.loading = false;
        console.log("masuk");
      })
      .addCase(getDataIPASN.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDataIPASN.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getDataDetailIPASN.fulfilled, (state, action) => {
        state.DataIPASN.detail = action.payload;
        state.loading = false;
      })
      .addCase(getDataDetailIPASN.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDataDetailIPASN.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getDataPribadi.fulfilled, (state, action) => {
        state.DataPribadi.lists = action.payload;
        state.loading = false;
      })
      .addCase(getDataPribadi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDataPribadi.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getDataPribadiDetail.fulfilled, (state, action) => {
        state.DataPribadi.detail = action.payload;
        state.loading = false;
      })
      .addCase(getDataPribadiDetail.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDataPribadiDetail.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getFilterUnitKerja.fulfilled, (state, action) => {
        state.unitKerja = action.payload;
        state.loading = false;
      })
      .addCase(getFilterUnitKerja.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getFilterUnitKerja.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getNominatif.fulfilled, (state, action) => {
        state.nominatif.lists = action.payload;
        state.loading = false;
      })
      .addCase(getNominatif.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getNominatif.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getNominatifReport.fulfilled, (state, action) => {
        state.nominatifReport = action.payload;
        state.loading = false;
      })
      .addCase(getNominatifReport.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getNominatifReport.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      });
  },
});

export const { setDataDetailIPASN } = KepegawaianSlice.actions;

export default KepegawaianSlice.reducer;
