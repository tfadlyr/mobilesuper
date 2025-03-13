import { StyleSheet, Text, View, Image, useWindowDimensions } from "react-native";
import React from "react";
import { BottomTabsRepo } from "../../utils/menutab";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setDibagikanLists, setDokumentlists } from "../../store/Repository";
import { Host } from "react-native-portalize";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function MainRepo() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Host>
        <BottomSheetModalProvider>
          <BottomTabsRepo />
        </BottomSheetModalProvider>
      </Host>
    </GestureHandlerRootView>
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
