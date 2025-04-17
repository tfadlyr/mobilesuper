import { createSlice } from "@reduxjs/toolkit";
import {
  getListSignedDigiSign,
  getCourseDigiSign,
  getListComposer,
  getListCompleted,
  getListInProgress,
  getDetailDigisign,
  getCounterDigitalSign,
  getListDraft,
  addDocumentDigiSign,
  getSummaryCount,
  getSummaryList,
  putTandaTangan,
  getListRejected,
  getListReady,
  getListRetry,
  getListSertifikatEksternal,
  getDetailSertifikatEksternal,
  tandaTanganMentri,
  getSubjectList,
  getCounterPerizinanMenteri,
  getListTrack,
  parafPerizinan,
  revisiPerizinan,
  getNomorPerizinanMenteri,
  addAttachmentDigiSign,
  putDocumentPerizinan,
  getCounterPKRL,
  parafBeforeTTDEPerizinan,
  getListInbox,
  getListNeedSignSK,
  getListNeedApproveSK,
  putSetujiSK,
  putReturnSK,
  putRevisionSK,
  putBatalkanSK,
  putTandaTanganSK,
  putReleaseSK,
  getDasboardListPKRL,
  getExportPKRL,
  getCounterMain,
  deleteDokumenLain,
  getListMonitoring,
  getDetailDigisignMonitoring,
  getCounterPKRLMonitoring,
  tolakDokumenLain,
  getCounterSK,
  getMonitorCountWeek,
  getMonitorCountMonth,
  getMonitorCountYear,
} from "../service/api";
import * as Sentry from "@sentry/react-native";

const DigitalSignSlice = createSlice({
  name: "DigitalSign",
  initialState: {
    digitalsign: {
      lists: [],
      detail: {},
    },
    dokumenlain: {
      lists: [],
      detail: {},
    },
    courseList: [],
    status: "",
    summary: {
      count: {},
      lists: [],
    },
    loading: false,
    eksternal: {
      lists: [],
      detail: {},
    },
    subjectLists: [],
    counter: {},
    counterDS: {},
    counterDSSK: {},
    counterPKRL: {},
    attachmentDokPerizinan: [],
    attachmentLampiran: [],
    nomorDokPerizinan: "",
    listDashboard: {},
    fileExport: {},
    mainCounter: {},
    message: "",
    statusHapus: "",
    monitorCount: {},
  },
  reducers: {
    setDigitalSignLists: (state, action) => {
      state.digitalsign.lists = action.payload;
    },
    setDigitalSignCourseList: (state, action) => {
      state.courseList = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setStatusHapus: (state, action) => {
      state.statusHapus = action.payload;
    },
    setLaporanList: (state, action) => {
      state.summary.lists = action.payload;
    },
    setAttachmentDokPerizinan: (state, action) => {
      // console.log("setDokPerizinan", action.payload);
      state.attachmentDokPerizinan = [action.payload];
    },
    setAttachmentLampiran: (state, action) => {
      // console.log("lampiran", action.payload);
      state.attachmentLampiran = [action.payload];
    },
    resetNomorDokPerizinan: (state, action) => {
      state.nomorDokPerizinan = action.payload;
    },
    resetAttachment: (state) => {
      state.attachmentLampiran = [];
      state.attachmentDokPerizinan = [];
    },
    resetList: (state, action) => {
      state.dokumenlain.lists = action.payload;
    },
    resetDetail: (state, action) => {
      state.digitalsign.detail = {};
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getListComposer.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.tipe === "bankom") {
          state.digitalsign.lists = action.payload.data;
        } else {
          state.dokumenlain.lists = action.payload.data;
          // console.log("masuk");
        }
      })
      .addCase(getListComposer.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListComposer.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error, "error composer");
      })
      .addCase(getListInProgress.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.tipe === "bankom") {
          state.digitalsign.lists = action.payload.data;
        } else {
          // console.log("berhasil");
          state.dokumenlain.lists = action.payload.data;
        }
      })
      .addCase(getListInProgress.pending, (state, action) => {
        state.loading = true;
        console.log("pending");
      })
      .addCase(getListInProgress.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getListReady.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.tipe === "bankom") {
          state.digitalsign.lists = action.payload.data;
        } else {
          state.dokumenlain.lists = action.payload.data;
        }
      })
      .addCase(getListReady.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListReady.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getListTrack.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.tipe === "bankom") {
          state.digitalsign.lists = action.payload.data;
        } else {
          state.dokumenlain.lists = action.payload.data;
        }
      })
      .addCase(getListTrack.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListTrack.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getListRetry.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.tipe === "bankom") {
          state.digitalsign.lists = action.payload.data;
        } else {
          state.dokumenlain.lists = action.payload.data;
        }
      })
      .addCase(getListRetry.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListRetry.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getListCompleted.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.tipe === "bankom") {
          state.digitalsign.lists = action.payload.data;
        } else {
          state.dokumenlain.lists = action.payload.data;
        }
      })
      .addCase(getListCompleted.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListCompleted.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getListMonitoring.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.tipe === "bankom") {
          state.digitalsign.lists = action.payload.data;
        } else {
          state.dokumenlain.lists = action.payload.data;
        }

        console.log("berhasil");
      })
      .addCase(getListMonitoring.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListMonitoring.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error);
      })
      .addCase(getListInbox.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.tipe === "bankom") {
          state.digitalsign.lists = action.payload.data;
        } else {
          state.dokumenlain.lists = action.payload.data;
        }
        // console.log("berhasil");
      })
      .addCase(getListInbox.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListInbox.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error);
      })
      .addCase(getListNeedSignSK.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.tipe === "bankom") {
          state.digitalsign.lists = action.payload.data;
        } else {
          state.dokumenlain.lists = action.payload.data;
        }
        // console.log("berhasil");
      })
      .addCase(getListNeedSignSK.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListNeedSignSK.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error);
      })
      .addCase(getListNeedApproveSK.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.tipe === "bankom") {
          state.digitalsign.lists = action.payload.data;
        } else {
          state.dokumenlain.lists = action.payload.data;
        }
        // console.log("berhasil");
      })
      .addCase(getListNeedApproveSK.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListNeedApproveSK.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error);
      })
      .addCase(getListDraft.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.tipe === "bankom") {
          state.digitalsign.lists = action.payload.data;
        } else {
          state.dokumenlain.lists = action.payload.data;
        }
      })
      .addCase(getListDraft.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListDraft.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getListSignedDigiSign.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.tipe === "bankom") {
          state.digitalsign.lists = action.payload.data;
        } else {
          state.dokumenlain.lists = action.payload.data;
        }
      })
      .addCase(getListSignedDigiSign.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListSignedDigiSign.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getDetailDigisign.fulfilled, (state, action) => {
        state.loading = false;
        state.digitalsign.detail = action.payload;
      })
      .addCase(getDetailDigisign.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDetailDigisign.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getDetailDigisignMonitoring.fulfilled, (state, action) => {
        state.loading = false;
        state.digitalsign.detail = action.payload;
      })
      .addCase(getDetailDigisignMonitoring.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDetailDigisignMonitoring.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error);
      })
      .addCase(getCounterDigitalSign.fulfilled, (state, action) => {
        state.loading = false;
        state.counterDS = action.payload;
      })
      .addCase(getCounterDigitalSign.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCounterDigitalSign.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
        console.log(action.error);
      })
      .addCase(getCounterSK.fulfilled, (state, action) => {
        state.loading = false;
        state.counterDSSK = action.payload;
      })
      .addCase(getCounterSK.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCounterSK.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
        console.log(action.error);
      })
      .addCase(getCourseDigiSign.fulfilled, (state, action) => {
        state.loading = false;
        state.courseList = action.payload;
      })
      .addCase(getCourseDigiSign.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCourseDigiSign.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(addDocumentDigiSign.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        console.log(action.error);
        Sentry.captureException(action.error);
      })
      .addCase(addDocumentDigiSign.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.loading = false;
      })
      .addCase(addDocumentDigiSign.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(putDocumentPerizinan.pending, (state) => {
        state.loading = true;
      })
      .addCase(putDocumentPerizinan.rejected, (state, action) => {
        state.status = "gagal";
        state.loading = false;
        // console.log(action.payload);
        Sentry.captureException(action.error);
      })
      .addCase(putDocumentPerizinan.fulfilled, (state) => {
        state.loading = false;
        state.status = "berhasil";
      })
      .addCase(getSummaryCount.fulfilled, (state, action) => {
        state.summary.count = action.payload;
        state.loading = false;
      })
      .addCase(getSummaryCount.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getSummaryCount.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getSummaryList.fulfilled, (state, action) => {
        state.summary.lists = action.payload;
        state.loading = false;
      })
      .addCase(getSummaryList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getSummaryList.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(putTandaTangan.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.loading = false;
      })
      .addCase(putTandaTangan.pending, (state, action) => {
        state.status = "";
        state.loading = true;
      })
      .addCase(putTandaTangan.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        console.log(action.error);
        Sentry.captureException(action.error);
      })
      .addCase(putSetujiSK.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.loading = false;
        state.message = "Dokumen telah disetujui";
      })
      .addCase(putSetujiSK.pending, (state, action) => {
        state.status = "";
        state.loading = true;
      })
      .addCase(putSetujiSK.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        console.log(action.error);
        Sentry.captureException(action.error);
      })
      .addCase(putTandaTanganSK.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.loading = false;
        state.message = "Dokumen telah ditandatangani";
      })
      .addCase(putTandaTanganSK.pending, (state, action) => {
        state.status = "";
        state.loading = true;
      })
      .addCase(putTandaTanganSK.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        console.log(action.error);
        Sentry.captureException(action.error);
      })
      .addCase(putReturnSK.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.loading = false;
        state.message = "Dokumen telah dikembalikan";
      })
      .addCase(putReturnSK.pending, (state, action) => {
        state.status = "";
        state.loading = true;
      })
      .addCase(putReturnSK.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        console.log(action.error);
        Sentry.captureException(action.error);
      })
      .addCase(putRevisionSK.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.loading = false;
        state.message = "Dokumen sudah dikembalikan untuk direvisi";
      })
      .addCase(putRevisionSK.pending, (state, action) => {
        state.status = "";
        state.loading = true;
      })
      .addCase(putRevisionSK.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        console.log(action.error);
        Sentry.captureException(action.error);
      })
      .addCase(putBatalkanSK.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.loading = false;
        state.message = "Dokumen telah dibatalkan";
      })
      .addCase(putBatalkanSK.pending, (state, action) => {
        state.status = "";
        state.loading = true;
      })
      .addCase(putBatalkanSK.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        console.log(action.error);
        Sentry.captureException(action.error);
      })
      .addCase(putReleaseSK.fulfilled, (state, action) => {
        state.status = "berhasil";
        state.loading = false;
        state.message = "Dokumen telah dirilis";
      })
      .addCase(putReleaseSK.pending, (state, action) => {
        state.status = "";
        state.loading = true;
      })
      .addCase(putReleaseSK.rejected, (state, action) => {
        state.status = "error";
        state.loading = false;
        console.log(action.error);
        Sentry.captureException(action.error);
      })
      .addCase(getListRejected.fulfilled, (state, action) => {
        state.loading = false;
        state.dokumenlain.lists = action.payload.data;
      })
      .addCase(getListRejected.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListRejected.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error);
      })
      .addCase(getListSertifikatEksternal.fulfilled, (state, action) => {
        state.loading = false;
        state.eksternal.lists = action.payload;
      })
      .addCase(getListSertifikatEksternal.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListSertifikatEksternal.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getDetailSertifikatEksternal.fulfilled, (state, action) => {
        state.loading = false;
        state.eksternal.detail = action.payload;
      })
      .addCase(getDetailSertifikatEksternal.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDetailSertifikatEksternal.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(tandaTanganMentri.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "berhasil";
        state.message = "Dokumen telah ditandtangani";
      })
      .addCase(tandaTanganMentri.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(tandaTanganMentri.rejected, (state, action) => {
        state.loading = false;
        state.status = "error";
        console.log(action.error);
        Sentry.captureException(action.error);
      })
      .addCase(tolakDokumenLain.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "berhasil";
        state.message = "Dokumen telah ditolak";
      })
      .addCase(tolakDokumenLain.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(tolakDokumenLain.rejected, (state, action) => {
        state.loading = false;
        state.status = "error";
        console.log(action.error);
        Sentry.captureException(action.error);
      })
      .addCase(getSubjectList.fulfilled, (state, action) => {
        state.loading = false;
        state.subjectLists = action.payload;
      })
      .addCase(getSubjectList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getSubjectList.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getCounterPerizinanMenteri.fulfilled, (state, action) => {
        state.loading = false;
        state.counter = action.payload;
      })
      .addCase(getCounterPerizinanMenteri.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCounterPerizinanMenteri.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getCounterPKRL.fulfilled, (state, action) => {
        state.loading = false;
        state.counterPKRL = action.payload;
      })
      .addCase(getCounterPKRL.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCounterPKRL.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error, "counter pkrl");
      })
      .addCase(getCounterPKRLMonitoring.fulfilled, (state, action) => {
        state.loading = false;
        state.counterPKRL = action.payload;
      })
      .addCase(getCounterPKRLMonitoring.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCounterPKRLMonitoring.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error, "counter pkrl");
      })
      .addCase(getDasboardListPKRL.fulfilled, (state, action) => {
        state.loading = false;
        state.listDashboard = action.payload;
        // console.log("berhasil");
      })
      .addCase(getDasboardListPKRL.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDasboardListPKRL.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error, "list dashboard pkrl");
      })
      .addCase(getCounterMain.fulfilled, (state, action) => {
        state.loading = false;
        state.mainCounter = action.payload;
        // console.log("berhasil");
      })
      .addCase(getCounterMain.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCounterMain.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error, "gagal");
      })
      .addCase(getExportPKRL.fulfilled, (state, action) => {
        state.loading = false;
        state.fileExport = action.payload.data;
        // console.log("berhasil");
      })
      .addCase(getExportPKRL.pending, (state, action) => {
        // state.loading = true;
        // console.log("pending");
      })
      .addCase(getExportPKRL.rejected, (state, action) => {
        // state.loading = false;
        // console.log("gagal");
      })
      .addCase(parafPerizinan.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "berhasil";
        state.message = "Dokumen telah diparaf";
      })
      .addCase(parafPerizinan.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(parafPerizinan.rejected, (state, action) => {
        state.loading = false;
        state.status = "gagal";
      })
      .addCase(parafBeforeTTDEPerizinan.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "berhasil";
        state.message = "Dokumen telah diparaf";
      })
      .addCase(parafBeforeTTDEPerizinan.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(parafBeforeTTDEPerizinan.rejected, (state, action) => {
        state.loading = false;
        state.status = "gagal";
      })
      .addCase(revisiPerizinan.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "berhasil";
        state.message = "Dokumen sudah dikembalikan untuk direvisi";
      })
      .addCase(revisiPerizinan.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(revisiPerizinan.rejected, (state, action) => {
        state.loading = false;
        state.status = "gagal";
      })
      .addCase(getNomorPerizinanMenteri.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNomorPerizinanMenteri.fulfilled, (state, action) => {
        // console.log("action nomor", action.payload);
        state.loading = false;
        state.nomorDokPerizinan = action.payload?.result?.nomor;
      })
      .addCase(getNomorPerizinanMenteri.rejected, (state, action) => {
        // console.log("error nomor", action);
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(addAttachmentDigiSign.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAttachmentDigiSign.fulfilled, (state, action) => {
        state.loading = false;
        let tipe = action.payload.tipe;
        if (tipe === "perizinan") {
          state.attachmentDokPerizinan = [action.payload.data.result];
        } else if (tipe === "lampiran") {
          state.attachmentLampiran = [action.payload.data.result];
        }
      })
      .addCase(addAttachmentDigiSign.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error);
        Sentry.captureException(action.error);
      })
      .addCase(deleteDokumenLain.fulfilled, (state, action) => {
        state.loading = false;
        state.statusHapus = "berhasil";
      })
      .addCase(deleteDokumenLain.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteDokumenLain.rejected, (state, action) => {
        state.loading = false;
        state.statusHapus = "gagal";
        Sentry.captureException(action.error);
      })
      .addCase(getMonitorCountWeek.fulfilled, (state, action) => {
        state.loading = false;
        state.monitorCount = action.payload
      })
      .addCase(getMonitorCountWeek.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getMonitorCountWeek.rejected, (state, action) => {
        state.loading = false;
        // Sentry.captureException(action.error, "counter pkrl");
      })
      .addCase(getMonitorCountMonth.fulfilled, (state, action) => {
        state.loading = false;
        state.monitorCount = action.payload
      })
      .addCase(getMonitorCountMonth.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getMonitorCountMonth.rejected, (state, action) => {
        state.loading = false;
        // Sentry.captureException(action.error, "counter pkrl");
      })
      .addCase(getMonitorCountYear.fulfilled, (state, action) => {
        state.loading = false;
        state.monitorCount = action.payload
      })
      .addCase(getMonitorCountYear.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getMonitorCountYear.rejected, (state, action) => {
        state.loading = false;
        // Sentry.captureException(action.error, "counter pkrl");
      })
  },
});

export const {
  setDigitalSignLists,
  setDigitalSignCourseList,
  setStatus,
  setAttachmentDokPerizinan,
  setAttachmentLampiran,
  setLaporanList,
  resetNomorDokPerizinan,
  resetAttachment,
  resetList,
  resetDetail,
  setStatusHapus,
} = DigitalSignSlice.actions;

export default DigitalSignSlice.reducer;
