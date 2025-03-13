import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTSIZE, FONTWEIGHT } from "../../config/SuperAppps";
import {} from "react-native-safe-area-context";

export const DetailAbsen = () => {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          backgroundColor: COLORS.primary,
          height: 80,
          paddingBottom: 20,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 20,
            width: 28,
            height: 28,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-outline"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: "center", marginRight: 50 }}>
          <Text
            style={{
              fontSize: FONTSIZE.H1,
              fontWeight: FONTWEIGHT.bold,
              color: COLORS.white,
            }}
          >
            Detail Absensi
          </Text>
        </View>
      </View>
    </>
  );
};
