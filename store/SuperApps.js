import { createSlice } from "@reduxjs/toolkit";
import {
  getBanner,
  getProfileMe,
  getGaleri,
  getBerita,
  getDetailBerita,
  getLastLogAttendence,
  postAttendence,
  putResetPassword,
} from "../service/api";
import { removeTokenValue } from "../service/session";
import { useNavigation } from "@react-navigation/native";
import * as Sentry from "@sentry/react-native";

const SuperAppsSlice = createSlice({
  name: "SuperApps",
  initialState: {
    profile: {},
    profileKores: {},
    berita: {
      lists: [],
      detail: {},
    },
    agenda: [],
    program: [],
    mading: [],
    linimasa: [],
    ultah: [],
    galeri: {
      lists: [],
      detail: {},
    },
    visimisi: {
      visi: {},
      misi: [],
    },
    banner: [],
    loading: false,
    handleError: false,
    lastLog: {},
    status: "",
    post: false,
    typeMenu: null,
    iosNotif: false,
    responReset: {},
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setProfileKores: (state, action) => {
      state.profileKores = action.payload;
    },
    setBerita: (state, action) => {
      state.berita.lists = action.payload;
    },
    setDetailBerita: (state, action) => {
      state.berita.detail = action.payload;
    },
    setAgenda: (state, action) => {
      state.agenda = action.payload;
    },
    setProgram: (state, action) => {
      state.program = action.payload;
    },
    setGaleri: (state, action) => {
      state.galeri.lists = action.payload;
    },
    setDetaiGaleri: (state, action) => {
      state.galeri.detail = action.payload;
    },
    setMading: (state, action) => {
      state.mading = action.payload;
    },
    setLinimasa: (state, action) => {
      state.linimasa = action.payload;
    },
    setUltah: (state, action) => {
      state.ultah = action.payload;
    },
    setVisiMisi: (state, action) => {
      state.visimisi = action.payload;
    },
    setBanner: (state, action) => {
      state.banner = action.payload;
    },
    setHandleError: (state, action) => {
      state.handleError = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setPost: (state, action) => {
      state.post = action.payload;
    },
    setTypeMenu: (state, action) => {
      state.typeMenu = action.payload;
    },
    setNotifIos: (state, action) => {
      state.iosNotif = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setResponReset: (state, action) => {
      state.responReset = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getProfileMe.fulfilled, (state, action) => {
        state.loading = false;
        let roles_access = [];

        if (action.payload.roles_coofis) {
          roles_access = action.payload.roles_coofis.map((item) => {
            return item.state;
          });
        }
        state.profile = { ...action.payload, roles_access };
      })
      .addCase(getProfileMe.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getProfileMe.rejected, (state, action) => {
        state.loading = false;
        state.handleError = true;
        Sentry.captureException(action.error);
        console.log(action.error, "login");
      })
      .addCase(getBanner.fulfilled, (state, action) => {
        state.banner = action.payload;
        // state.loading = false;
      })
      .addCase(getBanner.pending, (state, action) => {
        // state.loading = true;
      })
      .addCase(getBanner.rejected, (state, action) => {
        // state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getGaleri.fulfilled, (state, action) => {
        // state.galeri.lists = action.payload;
        state.loading = false;
        let dataPrev = state.galeri.lists;
        let dataNext = action.payload;
        let gabung = dataPrev.concat(dataNext);
        state.galeri.lists = gabung;
        // state.loading = false;
      })
      .addCase(getGaleri.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getGaleri.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getBerita.fulfilled, (state, action) => {
        let dataPrev = state.berita.lists;
        let dataNext = action.payload;
        let gabung = dataPrev.concat(dataNext);
        state.berita.lists = gabung;
        state.loading = false;
        // state.loading = false;
      })
      .addCase(getBerita.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getBerita.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getDetailBerita.fulfilled, (state, action) => {
        state.berita.detail = action.payload;
        state.loading = false;
      })
      .addCase(getDetailBerita.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDetailBerita.rejected, (state, action) => {
        state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(getLastLogAttendence.fulfilled, (state, action) => {
        state.lastLog = action.payload;

        // state.loading = false;
      })
      .addCase(getLastLogAttendence.pending, (state, action) => {
        // state.loading = true;
      })
      .addCase(getLastLogAttendence.rejected, (state, action) => {
        // state.loading = false;
        Sentry.captureException(action.error);
      })
      .addCase(postAttendence.fulfilled, (state, action) => {
        state.post = true;
        state.status = "berhasil";
      })
      .addCase(postAttendence.pending, (state, action) => {
        state.status = "";
      })
      .addCase(postAttendence.rejected, (state, action) => {
        state.status = "error";
        state.post = false;
        Sentry.captureException(action.error);
      })
      .addCase(putResetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.responReset = { status: "200" };
      })
      .addCase(putResetPassword.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(putResetPassword.rejected, (state, action) => {
        const array = action.error.message.split(" ");
        const statusCode = array[array.length - 1];

        state.loading = false;
        state.responReset = { status: statusCode, ...action.error };
      });
  },
});

export const {
  setProfile,
  setProfileKores,
  setBerita,
  setDetailBerita,
  setAgenda,
  setProgram,
  setGaleri,
  setMading,
  setLinimasa,
  setUltah,
  setVisiMisi,
  setBanner,
  setHandleError,
  setStatus,
  setPost,
  setTypeMenu,
  setNotifIos,
  setLoading,
  setResponReset,
} = SuperAppsSlice.actions;

export default SuperAppsSlice.reducer;
