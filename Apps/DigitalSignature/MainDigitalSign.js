import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { BottomTabsDigitalSign, BottomTabsKeb } from "../../utils/menutab";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setDigitalSignLists } from "../../store/DigitalSign";
import { AVATAR } from "../../config/SuperAppps";

export default function MainDigitalSign({ route }) {
  const dispatch = useDispatch();

  return (
    <BottomSheetModalProvider>
      <BottomTabsDigitalSign route={route} />
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 70,
    left: 150,
  },
});
