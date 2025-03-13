import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native";
import {
  COLORS,
  DATETIME,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { getTicket } from "../../service/api";

export const CardListHelpDesk = ({ item, device }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  return (
    <View style={{ marginTop: "5%" }}>
      <View
        style={{
          borderRadius: 8,
          paddingHorizontal: 18,
          paddingVertical: 12,
          backgroundColor: COLORS.white, //shadow ios
          shadowOffset: { width: -2, height: 4 },
          shadowColor: "#171717",
          shadowOpacity: 0.2,
          //shadow android
          elevation: 2,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ rowGap: 5, width: "70%" }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H1", device),
              fontWeight: FONTWEIGHT.bold,
            }}
          >
            Bagian: {item.part_name}
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            Permintaan: {item.request}
          </Text>
          <Text
            style={{
              color: COLORS.lighter,
              fontSize: fontSizeResponsive("H4", device),
            }}
          >
            Waktu Laporan: {item.date_start}
          </Text>
          <View
            style={{
              backgroundColor: COLORS.secondaryLighter,
              borderRadius: 10,
              paddingHorizontal: 10,
              width: device === "tablet" ? 300 : 195,
            }}
          >
            <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
              Nomor Tiket: {item.no_ticket}
            </Text>
          </View>
        </View>
        <View style={{ rowGap: 5, alignItems: "center" }}>
          <Text
            style={{
              color: COLORS.lighter,
              fontSize: fontSizeResponsive("H4", device),
            }}
          >
            Status
          </Text>
          <View
            style={{
              backgroundColor:
                item.status === "APPROVED"
                  ? COLORS.successLight
                  : COLORS.warningLight,
              borderRadius: 10,
              paddingHorizontal: 10,
            }}
          >
            <Text
              style={{
                color:
                  item.status === "APPROVED" ? COLORS.success : COLORS.warning,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
