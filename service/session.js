import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

// export const setTokenValue = async (value) => {
//     try {
//         const jsonValue = JSON.stringify(value)
//         await AsyncStorage.setItem('token', jsonValue)
//     } catch (e) {
//     }
// }

// export const getTokenValue = async () => {
//     try {
//         const token = JSON.parse(await AsyncStorage.getItem("token"))
//         return token
//     } catch (error) {
//     }
// };

export const getTokenValue = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token;
  } catch (error) {}
};

export const setTokenValue = async (value) => {
  try {
    await AsyncStorage.setItem("token", value);
  } catch (e) {}
};

export const removeTokenValue = async (value) => {
  try {
    await AsyncStorage.removeItem("token");
  } catch (e) {}
};

export const setPushNotif = async (value) => {
  try {
    console.log("storage", value);
    await AsyncStorage.setItem("notif", JSON.stringify(value));
  } catch (e) {}
};

export const getPushNotif = async () => {
  try {
    const notif = await AsyncStorage.getItem("notif");
    return JSON.parse(notif);
  } catch (error) {}
};

export const removePushNotif = async (value) => {
  try {
    console.log("hapus");
    console.log(value);
    await AsyncStorage.removeItem("notif");
  } catch (e) {}
};

export const getMenu = async () => {
  try {
    const menu = await AsyncStorage.getItem("menu");
    return menu;
  } catch (error) {}
};

export const setMenu = async (value) => {
  try {
    await AsyncStorage.setItem("menu", value);
  } catch (e) {}
};

export const removeMenu = async (value) => {
  try {
    await AsyncStorage.removeItem("menu");
  } catch (e) {}
};

export const getMenuLite = async (nip) => {
  try {
    const menuLite = await AsyncStorage.getItem(`menulite-${nip}`);
    return menuLite;
  } catch (error) {}
};

export const setMenuLite = async (value, nip) => {
  try {
    await AsyncStorage.setItem(`menulite-${nip}`, value);
  } catch (e) {}
};

export const removeMenuLite = async (nip) => {
  try {
    await AsyncStorage.removeItem(`menulite-${nip}`);
  } catch (e) {}
};

export const getMenuType = async () => {
  try {
    const menuType = await AsyncStorage.getItem("menutype");
    return menuType;
  } catch (error) {}
};

export const setMenuType = async (value) => {
  try {
    await AsyncStorage.setItem("menutype", value);
  } catch (e) {}
};

export const removeMenuType = async (value) => {
  try {
    await AsyncStorage.removeItem("menutype");
  } catch (e) {}
};
