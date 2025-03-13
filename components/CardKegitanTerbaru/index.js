import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "react-native";
import {
  COLORS,
  DATETIME,
  fontSizeResponsive,
  FONTWEIGHT,
} from "../../config/SuperAppps";
import moment from "moment/min/moment-with-locales";

export const CardKegiatanTerbaru = ({ item, device }) => {
  return (
    <View style={{ alignItems: "center", gap: 10 }}>
      {/* <View>
                <Ionicons name='ellipse-outline' size={24} />
            </View> */}
      <View
        style={{
          width: "90%",
          // borderWidth: 1,
          marginTop: 5,
          padding: 10,
          borderRadius: 8,
          // borderColor: COLORS.grey,
          backgroundColor: COLORS.white,
          //shadow ios
          shadowOffset: { width: -2, height: 4 },
          shadowColor: "#171717",
          shadowOpacity: 0.2,
          //shadow android
          elevation: 2,
        }}
      >
        <Text
          style={{
            marginTop: 10,
            color: COLORS.lighter,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {moment(item.start_date, "DD-MM-YYYY")
            .locale("id")
            .format(DATETIME.LONG_DATE)}{" "}
          -{" "}
          {moment(item.end_date, "DD-MM-YYYY")
            .locale("id")
            .format(DATETIME.LONG_DATE)}
        </Text>
        <Text
          style={{
            marginTop: 5,
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {item.fullname}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              color: COLORS.infoDanger,
              fontSize: fontSizeResponsive("H4", device),
            }}
          >
            *{" "}
          </Text>
          <Text
            style={{ marginTop: 5, fontSize: fontSizeResponsive("H4", device) }}
          >
            {item.venue}
          </Text>
        </View>
      </View>
    </View>
  );
};
