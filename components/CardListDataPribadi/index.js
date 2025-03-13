import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import {
  COLORS,
  fontSizeResponsive,
  FONTWEIGHT,
} from "../../config/SuperAppps";
import { getDataPribadiDetail } from "../../service/api";
import { setDataDetailIPASN } from "../../store/Kepegawain";

export const CardListDataPribadi = ({
  item,
  token,
  device,
  isRoleOperator,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // const getDetail = (id) => {
  //   dispatch(getDataPribadiDetail({ token, id }));
  // };
  return (
    <TouchableOpacity
      disabled={isRoleOperator === true ? false : true}
      style={{
        backgroundColor: COLORS.white,
        padding: 10,
        marginTop: 10,
        borderRadius: 8,
      }}
      onPress={() => {
        // getDetail(item.nip);
        dispatch(setDataDetailIPASN());
        navigation.navigate("DetailPegawaiIPASN", {
          type: "pribadi",
          nip: item.nip,
          token: token,
        });
      }}
    >
      <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
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
          style={{
            width: device === "tablet" ? 350 : 200,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {item.nama}
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
          NIP
        </Text>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>:</Text>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
          {item.nip}
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
          PANGKAT/GOLONGAN
        </Text>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>:</Text>
        <Text
          style={{
            width: device === "tablet" ? "90%" : 200,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {item?.updated_getrefpeg_data?.golongan_pangkat === undefined
            ? "-"
            : item?.updated_getrefpeg_data?.golongan_pangkat}
          /
          {item?.updated_getrefpeg_data?.golongan_nama === undefined
            ? "-"
            : item?.updated_getrefpeg_data?.golongan_nama}
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
          NAMA JABATAN/UNIT KERJA
        </Text>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>:</Text>
        <Text
          style={{
            width: device === "tablet" ? "90%" : 200,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {item?.updated_getrefpeg_data?.pegawai_nama_jabatan === undefined
            ? "-"
            : item?.updated_getrefpeg_data?.pegawai_nama_jabatan}
          /
          {item?.updated_getrefpeg_data?.unit_kerja_nama === undefined
            ? "-"
            : item?.updated_getrefpeg_data?.unit_kerja_nama}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
