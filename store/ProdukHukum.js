import { createSlice } from "@reduxjs/toolkit";
import {
  getCheckProdHuk,
  getCounterProdukHukum,
  getDetailProdukHukum,
  getListProdukHukum,
  parafProdukHukum,
  revisionProdukHukum,
  ttdeProdukHukum,
} from "../service/api";
import * as Sentry from "@sentry/react-native";

const ProdukHukumSlice = createSlice({
  name: "ProdukHukum",
  initialState: {
    checkProdukHukum: false,
    next: null,
    previous: null,
    lists: [],
    detail: {},
    status: "",
    loading: false,
    counter: {},
    counterCat: 0,
    message: "",
    error: "",
  },
  reducers: {
    setCounterCat: (state, action) => {
      state.counterCat = action.payload;
    },
    setListProdukHukum: (state, action) => {
      state.lists = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
      if (action.payload?.length == 0) {
        state.message = "";
        state.error = "";
      }
    },
    setCheckProdukHukum: (state, action) => {
      state.checkProdukHukum = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getCheckProdHuk.fulfilled, (state, action) => {
        state.loading = false;
        state.checkProdukHukum = action.payload.result.is_permitted;
      })
      .addCase(getCheckProdHuk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCheckProdHuk.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getCounterProdukHukum.fulfilled, (state, action) => {
        state.loading = false;
        state.counter = action.payload;
      })
      .addCase(getCounterProdukHukum.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCounterProdukHukum.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getListProdukHukum.fulfilled, (state, action) => {
        state.loading = false;
        state.previous = action.payload?.previous;
        state.next = action.payload?.next;
        state.lists = action.payload?.data;
      })
      .addCase(getListProdukHukum.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListProdukHukum.rejected, (state, action) => {
        state.loading = false;
        state.lists = [];
        Sentry.captureException(action.error);
      })
      .addCase(getDetailProdukHukum.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(getDetailProdukHukum.pending, (state, action) => {
        state.loading = true;
        state.detail = {};
      })
      .addCase(getDetailProdukHukum.rejected, (state, action) => {
        state.loading = false;
        state.detail = {};
        Sentry.captureException(action.error);
      })
      .addCase(parafProdukHukum.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "berhasil";
        state.message = action.payload.data.result;
      })
      .addCase(parafProdukHukum.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(parafProdukHukum.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload.data.error;
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(revisionProdukHukum.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "berhasil";
        state.message = action.payload?.data?.result;
      })
      .addCase(revisionProdukHukum.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(revisionProdukHukum.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload.data.error;
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(ttdeProdukHukum.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "berhasil";
      })
      .addCase(ttdeProdukHukum.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(ttdeProdukHukum.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        Sentry.captureException(action.error);
      });
  },
});

export const {
  setCounterCat,
  setStatus,
  resetList,
  resetDetail,
  setCheckProdukHukum,
} = ProdukHukumSlice.actions;

export default ProdukHukumSlice.reducer;
