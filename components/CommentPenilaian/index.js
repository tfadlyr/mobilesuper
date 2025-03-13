import React from "react";
import { Text, View } from "react-native";
import {
  COLORS,
  fontSizeResponsive,
  FONTWEIGHT,
} from "../../config/SuperAppps";

export const CommentPenilaian = ({ item, device }) => {
  return (
    <View
      style={{
        padding: 10,
        backgroundColor: COLORS.ExtraDivinder,
        margin: 10,
        borderRadius: 8,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: fontSizeResponsive("H4", device),
            fontWeight: FONTWEIGHT.bold,
          }}
        >
          {item.creator}{" "}
        </Text>
        <Text style={{ fontSize: fontSizeResponsive("H5", device) }}>
          {item.created_at}
        </Text>
      </View>
      <Text
        style={{ marginTop: 10, fontSize: fontSizeResponsive("H4", device) }}
      >
        {item.message}
      </Text>
    </View>
  );
};
