import { StyleSheet, Text } from "react-native";
import React from "react";
import { useDispatch } from "react-redux";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { BottomTabsCuti } from "../../utils/menutab";

export default function MainCuti() {
  return (
    <BottomSheetModalProvider>
      <BottomTabsCuti />
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
