import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, fontSizeResponsive } from "../../config/SuperAppps";
import { TopsBantuanPemerintah } from "../../utils/menutab";

export const BantuanPemerintah = () => {
  const navigation = useNavigation();
  const { device } = useSelector((state) => state.apps);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          backgroundColor: COLORS.primary,
          height: "10%",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 20,
              backgroundColor: "white",
              height: device === "tablet" ? 46 : 28,
              width: device === "tablet" ? 46 : 28,
              borderRadius: 50,
            }}
          >
            <Ionicons
              name="chevron-back"
              size={device === "tablet" ? 40 : 24}
              color={COLORS.primary}
            />
          </View>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 40,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: fontSizeResponsive("H3", device),
              fontWeight: 600,
            }}
          >
            KUSUKA
          </Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <TopsBantuanPemerintah />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backIcon: {
    backgroundColor: "white",
    height: 28,
    width: 28,
    borderRadius: 50,
  },
  imageIos: {
    height: 193,
    width: 350,
    borderRadius: 16,
  },
  imageAndroid: {
    height: 193,
    width: 369,
    borderRadius: 16,
  },
});
