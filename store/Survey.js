import { createSlice } from "@reduxjs/toolkit";
import {
  getSurveyCount,
  getSurveyDetail,
  getSurveyExport,
  getSurveyReport,
  postSurvey,
} from "../service/api";
import * as Sentry from "@sentry/react-native";

const SurveySlice = createSlice({
  name: "Survey",
  initialState: {
    loading: true,
    status: "",
    report: [],
    count: null,
    detail: {},
    exportFile: {},
  },
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(postSurvey.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.loading = false;
      })
      .addCase(postSurvey.pending, (state, action) => {
        state.status = "";
        state.loading = true;
      })
      .addCase(postSurvey.rejected, (state, action) => {
        state.status = "error";
        console.log("gagal");
        state.loading = true;
        Sentry.captureException(action.error);
      })
      .addCase(getSurveyReport.fulfilled, (state, action) => {
        state.report = action.payload;
        state.loading = false;
      })
      .addCase(getSurveyReport.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getSurveyReport.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getSurveyCount.fulfilled, (state, action) => {
        state.count = action.payload;
        state.loading = false;
      })
      .addCase(getSurveyCount.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getSurveyCount.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getSurveyDetail.fulfilled, (state, action) => {
        state.detail = action.payload;
        state.loading = false;
      })
      .addCase(getSurveyDetail.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getSurveyDetail.rejected, (state, action) => {
        state.loading = false;
        console.log("gagal");
        Sentry.captureException(action.error);
      })
      .addCase(getSurveyExport.fulfilled, (state, action) => {
        state.exportFile = action.payload;
        state.loading = false;
      })
      .addCase(getSurveyExport.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getSurveyExport.rejected, (state, action) => {
        state.loading = false;
        console.log("gagal");
        Sentry.captureException(action.error);
      });
  },
});

export const { setStatus } = SurveySlice.actions;

export default SurveySlice.reducer;
