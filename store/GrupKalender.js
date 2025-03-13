import { createSlice } from "@reduxjs/toolkit";
import {
  deleteAgendaGrup,
  deleteGrup,
  getDetailAcara,
  getDetailAgendaAcara,
  getDetailGrup,
  getListAcara,
  getListAgendaAcara,
  getListGrup,
  getListSubAgenda,
  postAgendaAcara,
  postGrup,
  putEditAgendaGrup,
  putEditGrup,
} from "../service/api";
import * as Sentry from "@sentry/react-native";

const GrupKalenderSlice = createSlice({
  name: "GrupKalender",
  initialState: {
    agenda: {
      lists: [],
      detail: {},
    },
    dropdown: {
      kategori: [],
      subKategori: {},
    },
    acara: {
      lists: [],
      detail: {},
    },
    agendaAcara: {
      lists: [],
      detail: {},
      listsSub: [],
    },
    detailGrup: {},
    status: "",
    loading: false,
  },
  reducers: {
    setAgenda: (state, action) => {
      state.agenda.lists = action.payload;
    },
    setAgendaDetail: (state, action) => {
      state.agenda.detail = action.payload;
    },
    setKategori: (state, action) => {
      state.dropdown.kategori = action.payload;
    },
    setSubKategori: (state, action) => {
      state.dropdown.subKategori = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setAcara: (state, action) => {
      state.acara.lists = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getListGrup.fulfilled, (state, action) => {
        state.agenda.lists = action.payload;
        state.loading = false;
      })
      .addCase(getListGrup.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListGrup.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getListAcara.fulfilled, (state, action) => {
        state.acara.lists = action.payload;
        state.loading = false;
      })
      .addCase(getListAcara.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListAcara.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getDetailAcara.fulfilled, (state, action) => {
        state.acara.detail = action.payload;
        state.loading = false;
      })
      .addCase(getDetailAcara.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDetailAcara.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getListAgendaAcara.fulfilled, (state, action) => {
        state.acara.lists = action.payload;
        state.loading = false;
      })
      .addCase(getListAgendaAcara.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListAgendaAcara.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getDetailAgendaAcara.fulfilled, (state, action) => {
        state.acara.detail = action.payload;
        state.loading = false;
      })
      .addCase(getDetailAgendaAcara.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDetailAgendaAcara.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getListSubAgenda.fulfilled, (state, action) => {
        state.agendaAcara.listsSub = action.payload;
        state.loading = false;
      })
      .addCase(getListSubAgenda.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListSubAgenda.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(postGrup.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.loading = false;
      })
      .addCase(postGrup.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(postGrup.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
        state.status = "error";
      })
      .addCase(getDetailGrup.fulfilled, (state, action) => {
        state.detailGrup = action.payload;
        state.loading = false;
      })
      .addCase(getDetailGrup.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDetailGrup.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(postAgendaAcara.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.loading = false;
      })
      .addCase(postAgendaAcara.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(postAgendaAcara.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(putEditGrup.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.loading = false;
      })
      .addCase(putEditGrup.pending, (state, action) => {
        state.status = "berhasil";
        state.loading = true;
      })
      .addCase(putEditGrup.rejected, (state, action) => {
        state.loading = false;
        state.status = "error";
        Sentry.captureException(action.error);
      })
      .addCase(putEditAgendaGrup.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.loading = false;
      })
      .addCase(putEditAgendaGrup.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(putEditAgendaGrup.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(deleteAgendaGrup.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.loading = false;
      })
      .addCase(deleteAgendaGrup.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteAgendaGrup.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(deleteGrup.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.loading = false;
      })
      .addCase(deleteGrup.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteGrup.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        Sentry.captureException(action.error);
      });
  },
});

export const {
  setAgenda,
  setAgendaDetail,
  setKategori,
  setSubKategori,
  setStatus,
  setAcara,
} = GrupKalenderSlice.actions;

export default GrupKalenderSlice.reducer;
