import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const authSlice = createSlice({
  name: "authenticate",
  initialState: {
    token: "",
    isAuthenticated: false,
    rememberMe: false,
    username: "",
    password: "",
    firstLogin: true,
    showbg: true,
    validVersion:true
  },
  reducers: {
    setValidVersion: (state,action)=>{
      state.validVersion = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      AsyncStorage.setItem("token", JSON.stringify(action.payload.token));
    },
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload.rememberMe;
      if (action.payload.rememberMe) {
        state.username = action.payload.username;
        state.password = action.payload.password;
      }
      AsyncStorage.setItem("rememberMe", JSON.stringify(action.payload));
    },
    setFirstLogin: (state, action) => {
      state.firstLogin = action.payload;
    },
    setBg: (state, action) => {
      state.showbg = action.payload;
    },
    logout: (state) => {
      state.token = "";
      state.isAuthenticated = false;
      AsyncStorage.removeItem("token");
      // AsyncStorage.removeItem("profileLogin");
    },
  },
});

export const {
  setValidVersion,
  setToken,
  setRememberMe,
  logout,
  setFirstLogin,
  setBg,
} = authSlice.actions;

export default authSlice.reducer;
