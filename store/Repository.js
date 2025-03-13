import { createSlice } from "@reduxjs/toolkit";
import {
  deleteBerbagiDokumen,
  getDetailDocument,
  getDivisionFilter,
  getDocument,
  getDocumentDibagikan,
  getDocumentTamplate,
  getDownloadLampiran,
  getSubDivisionFilter,
  postAttachmentRepo,
  postBerbagiDokumen,
  postDokumenTamplate,
  postRating,
  putBerbagiDokumen,
  putDokumenTamplate,
  putUpdateState,
} from "../service/api";
import * as Sentry from "@sentry/react-native";

const RepositorySlice = createSlice({
  name: "Repository",
  initialState: {
    dokumen: {
      lists: [],
      detail: {},
    },
    dibagikan: {
      lists: [],
      detail: {},
    },
    tamplate: {
      lists: [],
      detail: {},
    },
    loading: false,
    load: false,
    filter: {
      unker: [],
      satker: [],
    },
    download: {
      detail: {},
    },
    attachment: [],
    dokumenBerbagi: {},
    refresh: false,
    rating: false,
    status: "",
    edit: "",
    dokumenTamplate: {},
  },
  reducers: {
    // setDokumentlists: (state, action) => {
    //   state.dokumen.lists = action.payload;
    // },
    // setDokumenDetail: (state, action) => {
    //   state.dokumen.detail = action.payload;
    // },
    // setDibagikanLists: (state, action) => {
    //   state.dibagikan.lists = action.payload;
    // },
    setRefresh: (state, action) => {
      state.refresh = action.payload;
    },
    setRating: (state, action) => {
      state.rating = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setEdit: (state, action) => {
      state.edit = action.payload;
    },
    setAttachments: (state, action) => {
      state.attachment = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getDocument.fulfilled, (state, action) => {
        state.dokumen.lists = action.payload;
        state.loading = false;
        state.load = false;
      })
      .addCase(getDocument.pending, (state, action) => {
        state.loading = true;
        state.load = true;
      })
      .addCase(getDocument.rejected, (state, action) => {
        state.loading = false;
        state.load = false;
        console.log(action.error);
        Sentry.captureException(action.error);
      })
      .addCase(getDetailDocument.fulfilled, (state, action) => {
        state.dokumen.detail = action.payload;
      })
      .addCase(getDocumentDibagikan.fulfilled, (state, action) => {
        state.dibagikan.lists = action.payload;
        state.loading = false;
        state.load = false;
      })
      .addCase(getDocumentDibagikan.pending, (state, action) => {
        state.loading = true;
        state.load = true;
      })
      .addCase(getDocumentDibagikan.rejected, (state, action) => {
        state.loading = false;
        state.load = false;
        console.log(action.error);
        Sentry.captureException(action.error);
      })
      .addCase(getDocumentTamplate.fulfilled, (state, action) => {
        state.tamplate.lists = action.payload;
        state.loading = false;
        state.load = false;
      })
      .addCase(getDocumentTamplate.pending, (state, action) => {
        state.loading = true;
        state.load = true;
      })
      .addCase(getDocumentTamplate.rejected, (state, action) => {
        state.loading = false;
        state.load = false;
        Sentry.captureException(action.error);
      })
      .addCase(getDivisionFilter.fulfilled, (state, action) => {
        state.filter.unker = action.payload;
      })
      .addCase(getSubDivisionFilter.fulfilled, (state, action) => {
        state.filter.satker = action.payload;
      })
      .addCase(getDownloadLampiran.fulfilled, (state, action) => {
        state.download.detail = action.payload;
        state.loading = false;
        state.load = false;
      })
      .addCase(getDownloadLampiran.pending, (state, action) => {
        state.loading = true;
        state.load = true;
      })
      .addCase(getDownloadLampiran.rejected, (state, action) => {
        state.loading = false;
        state.load = false;
        Sentry.captureException(action.error);
      })
      .addCase(postAttachmentRepo.fulfilled, (state, action) => {
        let data = [...state.attachment, action.payload];
        state.attachment = data;
        state.loading = false;
        console.log("berhasil");
      })
      .addCase(postAttachmentRepo.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(postAttachmentRepo.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error);
        Sentry.captureException(action.error);
      })
      .addCase(postBerbagiDokumen.fulfilled, (state, action) => {
        state.dokumenBerbagi = action.payload;
        state.loading = false;
        state.status = "berhasil";
      })
      .addCase(postBerbagiDokumen.pending, (state, action) => {
        state.dokumenBerbagi = action.payload;
        state.loading = true;
      })
      .addCase(postBerbagiDokumen.rejected, (state, action) => {
        state.dokumenBerbagi = action.payload;
        state.loading = false;
        state.status = "gagal";
        console.log(action.error);
      })
      .addCase(putBerbagiDokumen.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "berhasil";
      })
      .addCase(putBerbagiDokumen.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(putBerbagiDokumen.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error);
        state.status = "gagal";
      })
      .addCase(postRating.fulfilled, (state, action) => {
        state.loading = false;
        console.log("berhasil");
      })
      .addCase(postRating.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(postRating.rejected, (state, action) => {
        state.loading = false;
        console.log("gagal");
      })
      .addCase(deleteBerbagiDokumen.fulfilled, (state, action) => {
        state.loading = false;
        console.log("berhasil");
        state.status = "berhasil";
      })
      .addCase(deleteBerbagiDokumen.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteBerbagiDokumen.rejected, (state, action) => {
        state.loading = false;
        state.status = "gagal";
        console.log("gagal");
      })
      .addCase(postDokumenTamplate.fulfilled, (state, action) => {
        state.dokumenTamplate = action.payload;
        state.loading = false;
        state.status = "berhasil";
      })
      .addCase(postDokumenTamplate.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(postDokumenTamplate.rejected, (state, action) => {
        state.loading = false;
        state.status = "gagal";
        console.log(action.error);
      })
      .addCase(putDokumenTamplate.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "berhasil";
      })
      .addCase(putDokumenTamplate.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(putDokumenTamplate.rejected, (state, action) => {
        state.loading = false;
        state.status = "gagal";
      })
      .addCase(putUpdateState.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "berhasil";
      })
      .addCase(putUpdateState.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(putUpdateState.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error);
        state.status = "gagal";
      });
  },
});

export const {
  setDokumentlists,
  setDokumenDetail,
  setDibagikanLists,
  setLoadMore,
  setRefresh,
  setRating,
  setStatus,
  setEdit,
  setAttachments,
} = RepositorySlice.actions;

export default RepositorySlice.reducer;
