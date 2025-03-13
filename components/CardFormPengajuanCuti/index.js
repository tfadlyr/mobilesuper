import React from "react";
import { useDispatch } from "react-redux";
import { getFormCuti } from "../../service/api";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS, fontSizeResponsive } from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const CardFormPengajuanCuti = ({ item, profile, device, token }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const formCuti = (id) => {
    const params = { token: token, id: id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getFormCuti(params));
  };
  return (
    <View
      style={{
        flexDirection: "row",
        width: device === "tablet" ? 250 : 100,
        paddingVertical: 16,
      }}
    >
      <View
        style={{
          alignItems: "center",
          gap: 10,
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            formCuti(item.id);
            navigation.navigate("TambahCutiTahunan", { tipe: "add" });
          }}
          style={{
            backgroundColor: COLORS.infoDanger,
            borderRadius: device === "tablet" ? 50 : 30,
            width: device === "tablet" ? 100 : 55,
            height: device === "tablet" ? 100 : 55,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="calendar-outline"
            size={device === "tablet" ? 40 : 18}
            color={COLORS.white}
          />
        </TouchableOpacity>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: device === "tablet" ? 50 : 30,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              overflow: "hidden",
              fontSize: fontSizeResponsive("H4", device),
            }}
          >
            {item.nama}
          </Text>
        </View>
      </View>
    </View>
  );
};
