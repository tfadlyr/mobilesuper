import React from "react";
import { Text } from "react-native";
import { BottomTabsDetailEvent } from "../../utils/menutab";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Host } from "react-native-portalize";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const MainDetailEvent = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Host>
        <BottomSheetModalProvider>
          <BottomTabsDetailEvent />
        </BottomSheetModalProvider>
      </Host>
    </GestureHandlerRootView>
  );
};
