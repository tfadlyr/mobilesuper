import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert, Linking } from "react-native";
import { Config } from "../constants/config";
import { nde_api } from "./api.config";
import * as Sentry from "@sentry/react-native";
import { store } from "../store/store";

export async function headerToken() {
  let token;
  await AsyncStorage.getItem("token").then((data) => {
    token = data;
  });
  return { Authorization: token, "User-Agent": "mobile" };
}

export async function postAuth(data) {
  return await axios.post(nde_api.auth, data);
}
export async function postHTTP(url, data) {
  const state = store.getState(); // Akses seluruh state
  const selectedAttr = state.profile.selectedAttr; // Ambil selectedAttr dari profile
  let header = await headerToken();
  const temp = url.includes("?")
    ? url + "&attr=" + selectedAttr?.code
    : url + "?attr=" + selectedAttr?.code;
  console.log(temp);
  return await axios.post(temp, data, { headers: header });
}

export async function getHTTP(url) {
  const state = store.getState(); // Akses seluruh state
  const selectedAttr = state.profile.selectedAttr; // Ambil selectedAttr dari profile
  let header = await headerToken();
  const temp =
    selectedAttr?.code?.length == 0
      ? url
      : url.includes("?")
      ? url + "&attr=" + selectedAttr?.code
      : url + "?attr=" + selectedAttr?.code;
  console.log(temp);
  return await axios.get(temp, { headers: header });
}

export const handlerError = (error, title, msg) => {
  // const dispatch = useDispatch();
  // function showError(error, title, msg) {
  if (error?.response?.status == null) {
    Alert.alert("Peringatan!", "Silakan cek koneksi Anda");
    Sentry.captureException(error?.response);
  } else if (error?.response?.status == 404) {
    Sentry.captureException(error?.response);
    Alert.alert("Peringatan!", "Halaman tidak ditemukan", [
      {
        text: "Ok",
        onPress: () => {
          // navigation.goBack();
        },
        style: "cancel",
      },
    ]);
  } else if (error?.response?.status === 401) {
    // dispatch(setFirstLogin(false));
    // dispatch(logout());
  } else {
    Sentry.captureException(error?.response);
    Alert.alert(title, msg + `\n\nversion ` + Config.app_version, [
      {
        text: "Ok",
        onPress: () => {
          // navigation.goBack();
        },
        style: "cancel",
      },
    ]);
  }
  // }
  // showError(error, title, msg);
};

export const handleUpgradeLink = async () => {
  // Checking if the link is supported for links with custom URL scheme.
  let url = Config.upgrade_url;
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    // Opening the link with some app, if the URL scheme is "http" the web link should be opened
    // by some browser in the mobile
    await Linking.openURL(url);
  } else {
    Alert.alert(`Don't know how to open this URL: ${url}`);
  }
};
