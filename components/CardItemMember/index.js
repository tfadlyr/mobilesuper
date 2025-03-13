import React from "react";
import { Image } from "react-native";
import { View } from "react-native";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Text } from "react-native";

export const CardItemMember = ({ item, device }) => {
  return (
    <View
      key={item.nip}
      style={{
        flexDirection: "row",
        gap: 10,
        marginHorizontal: 20,
        alignItems: "center",
        marginTop: 20,
      }}
    >
      <Image
        source={{ uri: item.avatar_url }}
        style={{
          width: device === "tablet" ? 60 : 30,
          height: device === "tablet" ? 60 : 30,
          borderRadius: device === "tablet" ? 40 : 20,
        }}
      />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {item?.title?.name !== "" ? item?.title?.name : item?.nama}
        </Text>
        {item?.title?.name !== "" ? (
          <Text
            style={{
              fontWeight: FONTWEIGHT.normal,
              fontSize: fontSizeResponsive("H4", device),
            }}
          >
            {" "}
            {item?.nama}
          </Text>
        ) : null}
      </View>
    </View>
  );
};
