import { StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { AVATAR } from "../../config/SuperAppps";
import { useDispatch } from "react-redux";
import {
  setAgenda,
  setBanner,
  setBerita,
  setGaleri,
  setLinimasa,
  setMading,
  setProfile,
  setProgram,
  setUltah,
  setVisiMisi,
} from "../../store/SuperApps";
import { Host } from "react-native-portalize";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomTabs } from "../../utils/menutab";
import * as Linking from "expo-linking";

export default function Main() {
  const url = Linking.useURL();

  useEffect(() => {
    if (url?.includes("apps/KnowledgeManagement/detail")) {
      Linking.openURL(url);
    }
  }, [url]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Host>
        <BottomSheetModalProvider>
          <BottomTabs />
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
