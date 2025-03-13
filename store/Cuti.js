import { createSlice } from "@reduxjs/toolkit";
import {
  getArsipCuti,
  getCutiPersonal,
  getDetailArsipCuti,
  getDetailPegawai,
  getDokumenPersetujuan,
  getFormCuti,
  getKuotaCuti,
  getLiburKhusus,
  getPegawai,
  getPilihApproval,
  getPilihApprovalPejabat,
  getTanggalLibur,
  postApproval,
  postAttachmentCuti,
  postPembatalanCuti,
  postPengajuanCuti,
  postPengajuanCutiDraft,
  postTanggalCuti,
} from "../service/api";
import * as Sentry from "@sentry/react-native";

const CutiSlice = createSlice({
  name: "Cuti",
  initialState: {
    personal: {},
    loading: false,
    kuota: {},
    libur: [],
    liburKhusus: [],
    arsip: {
      lists: [],
      detail: {},
    },
    form: {},
    pilih: [],
    pilihPejabat: [],
    persetujuan: {
      lists: [],
    },
    status: "",
    attachment: [],
    jumlahCuti: {},
    message: "",
  },
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setAttachmentCuti: (state, action) => {
      state.attachment = action.payload;
    },
    setJumlahCuti: (state, action) => {
      state.jumlahCuti = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getCutiPersonal.fulfilled, (state, action) => {
        state.personal = action.payload;
        state.loading = false;
      })
      .addCase(getCutiPersonal.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCutiPersonal.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getKuotaCuti.fulfilled, (state, action) => {
        state.kuota = action.payload;
        state.loading = false;
      })
      .addCase(getKuotaCuti.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getKuotaCuti.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getTanggalLibur.fulfilled, (state, action) => {
        state.libur = action.payload;
        state.loading = false;
      })
      .addCase(getTanggalLibur.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getTanggalLibur.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getLiburKhusus.fulfilled, (state, action) => {
        state.liburKhusus = action.payload;
        state.loading = false;
      })
      .addCase(getLiburKhusus.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getLiburKhusus.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getArsipCuti.fulfilled, (state, action) => {
        state.arsip.lists = action.payload;
        state.loading = false;
      })
      .addCase(getArsipCuti.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getArsipCuti.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getDetailArsipCuti.fulfilled, (state, action) => {
        state.arsip.detail = action.payload;
        state.loading = false;
      })
      .addCase(getDetailArsipCuti.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDetailArsipCuti.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getFormCuti.fulfilled, (state, action) => {
        state.form = action.payload;
        state.loading = false;
      })
      .addCase(getFormCuti.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getFormCuti.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getPilihApproval.fulfilled, (state, action) => {
        state.pilih = action.payload;
      })
      .addCase(getPilihApprovalPejabat.fulfilled, (state, action) => {
        state.pilihPejabat = action.payload;
      })
      .addCase(getDokumenPersetujuan.fulfilled, (state, action) => {
        state.persetujuan.lists = action.payload;
        state.loading = false;
      })
      .addCase(getDokumenPersetujuan.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDokumenPersetujuan.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
        console.log(action.error);
      })
      .addCase(postPengajuanCuti.fulfilled, (state, action) => {
        if (action.payload.success === false) {
          state.status = "error";
          console.log(action.payload);
          state.loading = false;
        } else {
          state.status = "berhasil";
          state.loading = false;
          console.log(action.payload);
          Sentry.captureException(action.error);
        }
      })
      .addCase(postPengajuanCuti.pending, (state, action) => {
        state.status = "";
        state.loading = true;
      })
      .addCase(postPengajuanCuti.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(postApproval.fulfilled, (state, action) => {
        let data = action.payload;
        console.log(action.payload);
        if (data.success === true) {
          state.status = "berhasil";
          state.loading = false;
        } else {
          state.status = "error";
          state.loading = false;
          state.message = data.message;
          Sentry.captureException(action.error);
        }
      })
      .addCase(postApproval.pending, (state, action) => {
        state.status = "";
        state.loading = true;
        state.message = "";
        console.log("pending");
      })
      .addCase(postApproval.rejected, (state, action) => {
        let data = action.payload;
        state.status = "error";
        state.loading = false;
        state.message = data.message;
        console.log("gagal");
        Sentry.captureException(action.error);
      })
      .addCase(postAttachmentCuti.fulfilled, (state, action) => {
        // let id_attachment = [];
        // id_attachment.push({ id: action.payload.data.id });
        state.attachment = [{ id: action.payload.data.id }];
        state.loading = false;
      })
      .addCase(postAttachmentCuti.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(postAttachmentCuti.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(postPembatalanCuti.fulfilled, (state, action) => {
        state.status = "berhasil";
        console.log(action.payload);
        state.loading = false;
      })
      .addCase(postPembatalanCuti.pending, (state, action) => {
        state.status = "";
        state.loading = true;
      })
      .addCase(postPembatalanCuti.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        console.log(action.error);
        Sentry.captureException(action.error);
      })
      .addCase(postTanggalCuti.fulfilled, (state, action) => {
        state.jumlahCuti = action.payload;
        state.loading = false;
      })
      .addCase(postTanggalCuti.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(postTanggalCuti.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(postPengajuanCutiDraft.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.loading = false;
        console.log(action.payload);
      })
      .addCase(postPengajuanCutiDraft.pending, (state, action) => {
        state.status = "";
        state.loading = true;
      })
      .addCase(postPengajuanCutiDraft.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        console.log(action.error);
        Sentry.captureException(action.error);
      });
  },
});

export const { setStatus, setAttachmentCuti, setJumlahCuti } =
  CutiSlice.actions;

export default CutiSlice.reducer;
