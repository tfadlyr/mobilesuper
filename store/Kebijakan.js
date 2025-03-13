import { createSlice } from "@reduxjs/toolkit";
import {
  getCategory,
  getCategoryId,
  getCategoryIdPage,
  getDokGeneral,
  getDokHukum,
  getUnitKerjaTematik,
  getUnitKerjaTematikId,
} from "../service/api";

const KebijakanSilce = createSlice({
  name: "kebijakan",
  initialState: {
    dokumen: [],
    lists: {},
    dokumenList: [],
    unitKerja: {
      lists: [],
    },
    unitKerjaId: {
      lists: [],
    },
    general: [],
    loading: false,
    refresh: false,
  },
  reducers: {
    setDokumen: (state, action) => {
      state.dokumen = action.payload;
    },
    setLists: (state, action) => {
      state.lists = action.payload;
    },
    setRefresh: (state, action) => {
      state.refresh = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getCategory.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCategory.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.map((item) => {
          state.dokumen = [
            ...state.dokumen,
            {
              label: item.bentuk,
              value: item.id_peraturan_cat,
            },
          ];
        });
      })

      .addCase(getCategoryId.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCategoryId.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload.map((item) => {
        //     state.dokumen = [
        //         ...state.dokumen,
        //         {
        //             label: item.bentuk,
        //             value: item.id_peraturan_cat
        //         }
        //     ]
        // })
        state.lists = action.payload;
      })

      .addCase(getDokHukum.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDokHukum.fulfilled, (state, action) => {
        state.loading = false;
        state.dokumenList = action.payload;
      })
      .addCase(getUnitKerjaTematik.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUnitKerjaTematik.fulfilled, (state, action) => {
        state.loading = false;
        state.unitKerja.lists = action.payload;
      })
      .addCase(getUnitKerjaTematikId.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getUnitKerjaTematikId.fulfilled, (state, action) => {
        state.loading = false;
        state.unitKerjaId.lists = action.payload;
      })
      .addCase(getDokGeneral.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDokGeneral.fulfilled, (state, action) => {
        state.loading = false;
        state.general = action.payload;
      });
  },
});

export const { setRefresh } = KebijakanSilce.actions;

export default KebijakanSilce.reducer;
