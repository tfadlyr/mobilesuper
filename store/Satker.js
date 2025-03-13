import { createSlice } from "@reduxjs/toolkit";
import {
  getBennerSatker,
  getDetailSatkerNews,
  getGallerySatker,
  getPesan,
  getSatkerLinimasa,
  getSatkerNews,
  getUltah,
} from "../service/api";
import * as Sentry from "@sentry/react-native";

const SatkerSlice = createSlice({
  name: "Satker",
  initialState: {
    benner: [],
    gallery: [],
    berita: {
      lists: [],
      detail: {},
    },
    pesan: [],
    ultah: [],
    linimasa: [],
    loading: true,
  },
  reducers: {
    setBeritaSatker: (state, action) => {
      state.berita.lists = action.payload;
    },
    setGaleriSatker: (state, action) => {
      state.gallery = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getBennerSatker.fulfilled, (state, action) => {
        state.benner = action.payload;
        state.loading = false;
      })
      .addCase(getBennerSatker.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getBennerSatker.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getGallerySatker.fulfilled, (state, action) => {
        state.gallery = action.payload;
        state.loading = false;
      })
      .addCase(getGallerySatker.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getGallerySatker.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getSatkerNews.fulfilled, (state, action) => {
        // state.berita.lists = action.payload;
        // state.loading = false
        let dataPrev = state.berita.lists;
        let dataNext = action.payload;
        let gabung = dataPrev.concat(dataNext);
        state.berita.lists = gabung;
        state.loading = false;
      })
      .addCase(getSatkerNews.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getSatkerNews.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getDetailSatkerNews.fulfilled, (state, action) => {
        state.berita.detail = action.payload;
        state.loading = false;
      })
      .addCase(getDetailSatkerNews.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDetailSatkerNews.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getPesan.fulfilled, (state, action) => {
        state.pesan = action.payload;
        state.loading = false;
      })
      .addCase(getPesan.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getPesan.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getUltah.fulfilled, (state, action) => {
        state.ultah = action.payload;
        state.loading = false;
      })
      .addCase(getUltah.pending, (state, action) => {
        state.loading = false;
      })
      .addCase(getUltah.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getSatkerLinimasa.fulfilled, (state, action) => {
        state.linimasa = action.payload;
        state.loading = false;
      })
      .addCase(getSatkerLinimasa.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getSatkerLinimasa.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      });
  },
});

export const { setBeritaSatker, setGaleriSatker } = SatkerSlice.actions;

export default SatkerSlice.reducer;
