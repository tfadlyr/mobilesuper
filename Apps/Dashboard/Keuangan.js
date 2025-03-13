import React, { useEffect } from "react";
import { View } from "react-native";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { COLORS, PADDING, fontSizeResponsive } from "../../config/SuperAppps";
import { StyleSheet } from "react-native";
import { TopsKeuanganKinerja } from "../../utils/menutab";
import { useDispatch, useSelector } from "react-redux";
import { setTeknologiList } from "../../store/Dashboard";
import { useNavigation } from "@react-navigation/native";

export const Keuangan = () => {
  const dispatch = useDispatch();
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
            Keuangan & Kinerja
          </Text>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <TopsKeuanganKinerja />
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
