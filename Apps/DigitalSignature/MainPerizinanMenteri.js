import React from "react";
import { Text, View } from "react-native";
import { BottomTabsPerizinanMenteri } from "../../utils/menutab";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export const MainPerizinanMenteri = ({ route }) => {
  return (
    <BottomSheetModalProvider>
      <BottomTabsPerizinanMenteri route={route} />
    </BottomSheetModalProvider>
  );
};
