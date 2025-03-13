import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  COLORS,
  fontSizeResponsive,
  FONTWEIGHT,
} from "../../config/SuperAppps";
import { useDispatch } from "react-redux";
import { getDataDetailIPASN } from "../../service/api";
import { useNavigation } from "@react-navigation/native";
import { setDataDetailIPASN } from "../../store/Kepegawain";

export const CardListDataIPASN = ({ item, token, device, isRoleOperator }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // const getDetail = (id) => {
  //   dispatch(getDataDetailIPASN({ token, id }));
  // };
  return (
    <TouchableOpacity
      disabled={isRoleOperator === true ? false : true}
      style={{
        backgroundColor: COLORS.white,
        padding: 10,
        marginVertical: 10,
        borderRadius: 8,
      }}
      onPress={() => {
        dispatch(setDataDetailIPASN());
        // getDetail(item.nip);
        navigation.navigate("DetailPegawaiIPASN", {
          type: "pegawai",
          nip: item.nip,
          token: token,
        });
      }}
    >
      <View style={{ flexDirection: "row", gap: 5 }}>
        <Text
          style={{
            width: device === "tablet" ? 350 : 100,
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          NAMA
        </Text>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>:</Text>
        <Text
          style={{ width: 200, fontSize: fontSizeResponsive("H4", device) }}
        >
          {item.nama}
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 5, marginTop: 10 }}>
        <Text
          style={{
            width: device === "tablet" ? 350 : 100,
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          KUALIFIKASI
        </Text>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>:</Text>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
          {item.ipasn_kualifikasi} (
          {Math.round((item.ipasn_kualifikasi / 25) * 100)}%)
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 5, marginTop: 10 }}>
        <Text
          style={{
            width: device === "tablet" ? 350 : 100,
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          KOMPETENSI
        </Text>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>:</Text>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
          {item.ipasn_kompetensi} (
          {Math.round((item.ipasn_kompetensi / 40) * 100)}%)
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 5, marginTop: 10 }}>
        <Text
          style={{
            width: device === "tablet" ? 350 : 100,
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          KINERJA
        </Text>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>:</Text>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
          {item.ipasn_kinerja} ({Math.round((item.ipasn_kinerja / 30) * 100)}%)
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 5, marginTop: 10 }}>
        <Text
          style={{
            width: device === "tablet" ? 350 : 100,
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          DISIPLIN
        </Text>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>:</Text>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
          {item.ipasn_disiplin} ({Math.round((item.ipasn_disiplin / 5) * 100)}%)
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 5, marginTop: 10 }}>
        <Text
          style={{
            width: device === "tablet" ? 350 : 100,
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          NILAI
        </Text>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>:</Text>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
          {item.ipasn_nilai}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 5,
          marginTop: 10,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            width: device === "tablet" ? 350 : 100,
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          PREDIKAT
        </Text>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>:</Text>
        <View
          style={{
            backgroundColor:
              item.ipasn_nilai <= 100 && item.ipasn_nilai > 90
                ? COLORS.successLight
                : item.ipasn_nilai <= 90 && item.ipasn_nilai > 80
                ? COLORS.infoLight
                : item.ipasn_nilai <= 80 && item.ipasn_nilai > 70
                ? COLORS.warningLight
                : item.ipasn_nilai <= 60 && item.ipasn_nilai > 50
                ? "rgb(255,249,196)"
                : COLORS.infoDangerLight,
            padding: 6,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              color:
                item.ipasn_nilai <= 100 && item.ipasn_nilai > 90
                  ? COLORS.success
                  : item.ipasn_nilai <= 90 && item.ipasn_nilai > 80
                  ? COLORS.info
                  : item.ipasn_nilai <= 80 && item.ipasn_nilai > 70
                  ? COLORS.warning
                  : item.ipasn_nilai <= 60 && item.ipasn_nilai > 50
                  ? "rgb(251, 192,45)"
                  : COLORS.danger,
              fontSize: fontSizeResponsive("H4", device),
            }}
          >
            {item.ipasn_nilai <= 100 && item.ipasn_nilai > 90
              ? "Sangat Tinggi"
              : item.ipasn_nilai <= 90 && item.ipasn_nilai > 80
              ? "Tinggi"
              : item.ipasn_nilai <= 80 && item.ipasn_nilai > 70
              ? "Sedang"
              : item.ipasn_nilai <= 60 && item.ipasn_nilai > 50
              ? "Rendah"
              : "Sangat Rendah"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
