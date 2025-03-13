import React from "react";
import { Text, View } from "react-native";
import { fontSizeResponsive } from "../../config/SuperAppps";

export const CardListTempatSPPD = ({ item, device }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 5,
        marginHorizontal: 20,
        marginVertical: 5,
      }}
    >
      <Text style={{ fontSize: fontSizeResponsive("H3", device) }}>-</Text>
      <Text style={{ fontSize: fontSizeResponsive("H3", device) }}>
        {item.locations}
      </Text>
    </View>
  );
};
