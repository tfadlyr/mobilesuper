import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import React from "react";
import { Text, View } from "react-native";
import { BottomTabsSertifikat } from "../../utils/menutab";

export const MainSertifikat = () => {
  return (
    <BottomSheetModalProvider>
      <BottomTabsSertifikat />
    </BottomSheetModalProvider>
  );
};
