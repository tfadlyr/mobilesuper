import React from "react";
import { Text } from "react-native";
import { BottomTabsDetailRepo } from "../../utils/menutab";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setDokumenDetail } from "../../store/Repository";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Host } from "react-native-portalize";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const MainDetailRepo = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Host>
        <BottomSheetModalProvider>
          <BottomTabsDetailRepo />
        </BottomSheetModalProvider>
      </Host>
    </GestureHandlerRootView>
  );
};
