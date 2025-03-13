import { createSlice } from "@reduxjs/toolkit";
import { Login } from "../service/api";
import { setTokenValue } from "../service/session";
import * as Sentry from "@sentry/react-native";

const LoginAuthSlice = createSlice({
  name: "Login",
  initialState: {
    token: "",
    error: null,
    msg: "",
    loading: false,
  },
  reducers: {
    setLogout: (state, action) => {
      state.token = "";
      state.error = null;
      state.msg = "";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(Login.fulfilled, (state, action) => {
        setTokenValue(action.payload.token);
        state.token = action.payload;
        state.error = action.payload.error;
        state.msg = action.payload.msg;
        state.loading = false;
      })
      .addCase(Login.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(Login.rejected, (state, action) => {
        state.error = false;
        state.error = action.payload.error;
        state.msg = action.payload.msg;
        Sentry.captureException(action.error);
        state.loading = false;
      });
  },
});

export const { setLogout } = LoginAuthSlice.actions;

export default LoginAuthSlice.reducer;
