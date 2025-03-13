import { createSlice } from "@reduxjs/toolkit";
import {
  getDetailLinimasa,
  getDetailPegawai,
  getDetailPenilaian,
  getExportFileEmployee,
  getExportFileQuarter,
  getLinimasa,
  getListCategory,
  getListCompetence,
  getListPegawai,
  getListPegawaiExport,
  getListPenilaian,
  getListPostPegawai,
  getListUnitKerja,
  getListsLike,
  getMyPostCount,
  getMyPostDetail,
  getMyPostLike,
  getMyPostList,
  getMyPostPoint,
  getMyPostView,
  getNilai,
  getSummaryAccumulation,
  getSummaryBadUser,
  getSummaryGraph,
  getSummaryReview,
  getSummaryTotalPost,
  getTotalPenilaian,
  getViewLinimasa,
  patchLike,
  patchUnlike,
  postComment,
  postKomentarDetailPenilaian,
  putTakeDown,
} from "../service/api";
import * as Sentry from "@sentry/react-native";

const PengetahuanSlice = createSlice({
  name: "Pengetahuan",
  initialState: {
    refresh: false,
    error: "",
    linimasa: {
      lists: [],
      detail: {},
      listsLike: [],
    },
    postinganSaya: {
      lists: [],
      detail: {},
    },
    postinganSayaJumlah: {
      dilihat: {},
      disukai: {},
      nilai: {},
      draft: {},
    },
    summary: {
      total_post: {},
      bad_user: {},
      graph: {},
      accumulation: {},
      review: {},
    },
    kategori: {
      lists: [],
    },
    kompetensi: {
      lists: [],
    },
    unitKerja: {
      lists: [],
    },
    pegawai: {
      lists: [],
    },
    postinganPegawai: {
      lists: [],
    },
    exportPegawai: {
      lists: {},
    },
    download: {},
    exportLaporan: {
      quarter: {},
      employee: {},
    },
    penilaian: {
      lists: [],
      total: {},
      detail: null,
    },
    nilai: [],
    komen: [],
    loading: false,
    komenPenilaian: {},
    comments: false,
  },
  reducers: {
    setLiniMasa: (state, action) => {
      state.linimasa.lists = action.payload;
    },
    setPostinganSaya: (state, action) => {
      state.postinganSaya.lists = action.payload;
    },
    setPostinganSayaJumlah: (state, action) => {
      state.postinganSayaJumlah.dilihat = action.payload;
    },
    setPenilaian: (state, action) => {
      state.penilaian.lists = action.payload;
    },
    setRefresh: (state, action) => {
      state.refresh = action.payload;
    },
    setResetDetailLinimasa: (state, action) => {
      state.linimasa.detail = {};
    },
    setComments: (state, action) => {
      state.comments = action.payload;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getLinimasa.fulfilled, (state, action) => {
        state.linimasa.lists = action.payload;
        state.loading = false;
      })
      .addCase(getLinimasa.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getLinimasa.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getDetailLinimasa.fulfilled, (state, action) => {
        state.linimasa.detail = action.payload;
        state.loading = false;
      })
      .addCase(getDetailLinimasa.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDetailLinimasa.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getViewLinimasa.fulfilled, (state, action) => {
        state.linimasa.view = action.payload;
        state.loading = false;
      })
      .addCase(getViewLinimasa.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getViewLinimasa.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.refresh = true;
      })
      .addCase(postComment.rejected, (state, action) => {})
      .addCase(getListsLike.fulfilled, (state, action) => {
        state.linimasa.listsLike = action.payload;
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getListsLike.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListsLike.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(patchLike.fulfilled, (state, action) => {
        state.refresh = true;
      })
      .addCase(patchUnlike.fulfilled, (state, action) => {
        state.refresh = true;
      })
      .addCase(getListPenilaian.fulfilled, (state, action) => {
        state.penilaian.lists = action.payload;
        state.loading = false;
      })
      .addCase(getListPenilaian.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListPenilaian.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getTotalPenilaian.fulfilled, (state, action) => {
        state.penilaian.total = action.payload;
        state.loading = false;
      })
      .addCase(getTotalPenilaian.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getTotalPenilaian.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getDetailPenilaian.fulfilled, (state, action) => {
        state.penilaian.detail = action.payload;
        state.loading = false;
      })
      .addCase(getDetailPenilaian.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDetailPenilaian.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getNilai.fulfilled, (state, action) => {
        state.nilai = action.payload;
        state.loading = false;
      })
      .addCase(getNilai.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getNilai.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(putTakeDown.fulfilled, (state, action) => {
        state.error = false;
        state.loading = false;
      })
      .addCase(putTakeDown.pending, (state, action) => {
        state.error = false;
        state.loading = true;
      })
      .addCase(putTakeDown.rejected, (state, action) => {
        state.error = true;
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getMyPostList.fulfilled, (state, action) => {
        state.postinganSaya.lists = action.payload;
        state.loading = false;
      })
      .addCase(getMyPostList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getMyPostList.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getMyPostDetail.fulfilled, (state, action) => {
        state.postinganSaya.detail = action.payload;
        state.loading = false;
      })
      .addCase(getMyPostDetail.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getMyPostDetail.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getMyPostView.fulfilled, (state, action) => {
        state.postinganSayaJumlah.dilihat = action.payload;
        state.loading = false;
      })
      .addCase(getMyPostView.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getMyPostView.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getMyPostPoint.fulfilled, (state, action) => {
        state.postinganSayaJumlah.nilai = action.payload;
        state.loading = false;
      })
      .addCase(getMyPostPoint.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getMyPostPoint.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getMyPostLike.fulfilled, (state, action) => {
        state.postinganSayaJumlah.disukai = action.payload;
        state.loading = false;
      })
      .addCase(getMyPostLike.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getMyPostLike.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getMyPostCount.fulfilled, (state, action) => {
        state.postinganSayaJumlah.draft = action.payload;
        state.loading = false;
      })
      .addCase(getMyPostCount.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getMyPostCount.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getSummaryTotalPost.fulfilled, (state, action) => {
        state.summary.total_post = action.payload;
        state.loading = false;
      })
      .addCase(getSummaryTotalPost.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getSummaryTotalPost.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getSummaryBadUser.fulfilled, (state, action) => {
        state.summary.bad_user = action.payload;
        state.loading = false;
      })
      .addCase(getSummaryBadUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getSummaryBadUser.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getSummaryGraph.fulfilled, (state, action) => {
        state.summary.graph = action.payload;
        state.loading = false;
      })
      .addCase(getSummaryGraph.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getSummaryGraph.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getSummaryAccumulation.fulfilled, (state, action) => {
        state.summary.accumulation = action.payload;
        state.loading = false;
      })
      .addCase(getSummaryAccumulation.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getSummaryAccumulation.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getSummaryReview.fulfilled, (state, action) => {
        state.summary.review = action.payload;
        state.loading = false;
      })
      .addCase(getSummaryReview.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getSummaryReview.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getListCategory.fulfilled, (state, action) => {
        state.kategori.lists = action.payload;
        state.loading = false;
      })
      .addCase(getListCategory.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListCategory.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getListCompetence.fulfilled, (state, action) => {
        state.kompetensi.lists = action.payload;
        state.loading = false;
      })
      .addCase(getListCompetence.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListCompetence.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getListUnitKerja.fulfilled, (state, action) => {
        state.unitKerja.lists = action.payload;
        state.loading = false;
      })
      .addCase(getListUnitKerja.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListUnitKerja.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getListPegawai.fulfilled, (state, action) => {
        state.pegawai.lists = action.payload;
        state.loading = false;
        console.log(action.payload);
      })
      .addCase(getListPegawai.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListPegawai.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
        console.log("error");
      })
      .addCase(getListPostPegawai.fulfilled, (state, action) => {
        state.postinganPegawai.lists = action.payload;
        state.loading = false;
      })
      .addCase(getListPostPegawai.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListPostPegawai.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getListPegawaiExport.fulfilled, (state, action) => {
        state.exportPegawai.lists = action.payload;
        state.loading = false;
      })
      .addCase(getListPegawaiExport.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getListPegawaiExport.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getExportFileQuarter.fulfilled, (state, action) => {
        state.exportLaporan.quarter = action.payload;
        state.loading = false;
      })
      .addCase(getExportFileQuarter.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getExportFileQuarter.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getExportFileEmployee.fulfilled, (state, action) => {
        state.exportLaporan.employee = action.payload;
        state.loading = false;
      })
      .addCase(getExportFileEmployee.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getExportFileEmployee.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(postKomentarDetailPenilaian.fulfilled, (state, action) => {
        state.komenPenilaian = action.payload;
        state.loading = false;
        state.comments = true;
        console.log("berhasil");
      })
      .addCase(postKomentarDetailPenilaian.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(postKomentarDetailPenilaian.rejected, (state, action) => {
        state.loading = false;
        state.comments = false;
        console.log("gagal");
        Sentry.captureException(action.error);
      });
  },
});

export const {
  setLiniMasa,
  setPostinganSaya,
  setPostinganSayaJumlah,
  setPenilaian,
  setRefresh,
  setResetDetailLinimasa,
  setComments,
} = PengetahuanSlice.actions;

export default PengetahuanSlice.reducer;
