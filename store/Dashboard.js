import { createSlice } from "@reduxjs/toolkit";
import { getKesejahteraan, getPerencanaan, getTeknologi } from "../service/api";
import * as Sentry from "@sentry/react-native";

const DashboardSlice = createSlice({
  name: "Dashboard",
  initialState: {
    berita: {
      lists: [],
      detail: {},
    },
    pengumuman: {
      lists: [],
      detail: {},
    },
    teknologi: {
      lists: [],
      detail: {},
    },
    kesejahteraan: {
      lists: {
        count: 0,
        prev: "",
        next: "",
        results: [],
      },
    },
    perencanaan: {
      lists: {
        count: 0,
        prev: "",
        next: "",
        results: [],
      },
    },
    loading: false,
  },
  reducers: {
    setKesejahteraanEmpty: (state, action) => {
      state.kesejahteraan.lists = {
        count: 0,
        prev: "",
        next: "",
        results: [],
      };
    },
    setPerencanaanEmpty: (state, action) => {
      state.perencanaan.lists = {
        count: 0,
        prev: "",
        next: "",
        results: [],
      };
    },
    setBerita: (state, action) => {
      state.berita.lists = action.payload;
    },
    setPengumuman: (state, action) => {
      state.pengumuman.lists = action.payload;
    },
    setTeknologiList: (state, action) => {
      state.teknologi.lists = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getKesejahteraan.fulfilled, (state, action) => {
        let dataPrev = state.kesejahteraan.lists.results;
        let dataNext = action.payload.results;
        let newData = action.payload;
        let gabung = dataPrev.concat(dataNext);
        newData.results = gabung;

        state.kesejahteraan.lists = newData;

        state.loading = false;
      })
      .addCase(getKesejahteraan.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getKesejahteraan.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getPerencanaan.fulfilled, (state, action) => {
        // state.perencanaan.lists = action.payload;
        // state.loading = false
        let dataPrev = state.perencanaan.lists.results;
        let dataNext = action.payload.results;
        let newData = action.payload;
        let gabung = dataPrev.concat(dataNext);
        newData.results = gabung;

        state.perencanaan.lists = newData;

        state.loading = false;
      })
      .addCase(getPerencanaan.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getPerencanaan.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getTeknologi.fulfilled, (state, action) => {
        state.teknologi.lists = action.payload;
        state.loading = false;
      })
      .addCase(getTeknologi.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getTeknologi.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      });
  },
});

export const {
  setBerita,
  setPengumuman,
  setTeknologiList,
  setKesejahteraanEmpty,
  setPerencanaanEmpty,
} = DashboardSlice.actions;

export default DashboardSlice.reducer;
