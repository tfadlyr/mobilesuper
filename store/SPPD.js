import { createSlice } from "@reduxjs/toolkit";
import {
  getArsipCuti,
  getCutiPersonal,
  getDashboardSPPD,
  getDocumentAttachmentSPPD,
  getDocumentCetakSPPD,
  getDocumentDetailPersonalSPPD,
  getDocumentDetailSPPD,
  getDocumentListSPPD,
} from "../service/api";
import * as Sentry from "@sentry/react-native";

const SPPDSlice = createSlice({
  name: "SPPD",
  initialState: {
    dashboard: {},
    loading: false,
    dokumen: {
      lists: [],
      detail: {},
    },
    detailPersonal: {},
    surat: null,
    cetak: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getDashboardSPPD.fulfilled, (state, action) => {
        state.dashboard = action.payload;
        state.loading = false;
      })
      .addCase(getDashboardSPPD.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDashboardSPPD.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getDocumentListSPPD.fulfilled, (state, action) => {
        state.dokumen.lists = action.payload;
        state.loading = false;
      })
      .addCase(getDocumentListSPPD.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDocumentListSPPD.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getDocumentDetailSPPD.fulfilled, (state, action) => {
        state.dokumen.detail = action.payload;
        state.loading = false;
      })
      .addCase(getDocumentDetailSPPD.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDocumentDetailSPPD.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getDocumentAttachmentSPPD.fulfilled, (state, action) => {
        state.surat = action.payload;
        state.loading = false;
      })
      .addCase(getDocumentAttachmentSPPD.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDocumentAttachmentSPPD.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getDocumentCetakSPPD.fulfilled, (state, action) => {
        state.cetak = action.payload;
        state.loading = false;
      })
      .addCase(getDocumentCetakSPPD.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDocumentCetakSPPD.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getDocumentDetailPersonalSPPD.fulfilled, (state, action) => {
        state.detailPersonal = action.payload;
        state.loading = false;
      })
      .addCase(getDocumentDetailPersonalSPPD.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDocumentDetailPersonalSPPD.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      });
  },
});

export const {} = SPPDSlice.actions;

export default SPPDSlice.reducer;
