import { createSlice } from "@reduxjs/toolkit";
import { getDetailPegawai, getPegawai } from "../service/api";
import * as Sentry from "@sentry/react-native";

const PegawaiSlice = createSlice({
  name: "Pegawai",
  initialState: {
    pegawai: {
      lists: [],
      detail: {},
    },
    loading: false,
  },
  reducers: {
    setPegawai: (state, action) => {
      state.pegawai.lists = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getPegawai.fulfilled, (state, action) => {
        // let dataPrev = state.pegawai.lists
        // let dataNext = action.payload
        // let gabung = dataPrev.concat(dataNext)
        state.pegawai.lists = action.payload;
        state.loading = false;
      })
      .addCase(getPegawai.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getPegawai.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getDetailPegawai.fulfilled, (state, action) => {
        state.pegawai.detail = action.payload;
        state.loading = false;
      })
      .addCase(getDetailPegawai.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDetailPegawai.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      });
  },
});

export const { setPegawai } = PegawaiSlice.actions;

export default PegawaiSlice.reducer;
