import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  COLORS,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { getDetailSertifikatEksternal } from "../../service/api";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";

export const CardListSertifikatEksternal = ({ device, item, token }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
  };

  const getDetail = (id) => {
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getDetailSertifikatEksternal({ token: token, id: id }));
  };
  return (
    <TouchableOpacity
      style={{
        backgroundColor: "white",
        borderRadius: 16,
        width: "90%",
        flex: 1,
        marginTop: 10,
        marginHorizontal: "5%",
        padding: 20,
        //shadow ios
        shadowOffset: { width: -2, height: 4 },
        shadowColor: "#171717",
        shadowOpacity: 0.2,
        //shadow android
        elevation: 2,
        marginVertical: 10,
      }}
      onPress={() => {
        getDetail(item.id);
        navigation.navigate("DetailSertifikatEksternal");
      }}
    >
      <Text
        style={{
          fontSize: fontSizeResponsive("H1", device),
          width: 300,
          textAlign: "justify",
          fontWeight: FONTWEIGHT.bold,
          width: "100%",
        }}
      >
        {item.subject}
      </Text>
      <View
        style={{
          backgroundColor: COLORS.lighter,
          height: 1,
          marginVertical: 5,
          width: "100%",
        }}
      />

      <View style={{ flexDirection: "row" }}>
        <Text
          style={{
            fontSize: fontSizeResponsive("H3", device),
            width: 110,
            textAlign: "justify",
            paddingRight: 12,
            fontWeight: FONTWEIGHT.normal,
            width: "45%",
          }}
        >
          NO. Sertifikat
        </Text>

        <Text
          style={{
            fontSize: fontSizeResponsive("H3", device),
            width: device === "tablet" ? 200 : 170,
            textAlign: "justify",
            fontWeight: FONTWEIGHT.normal,
          }}
        >
          :{" "}
          {item?.extra_attributes?.noSertif === ""
            ? "-"
            : item?.extra_attributes?.noSertif}
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginVertical: 5 }}>
        <Text
          style={{
            fontSize: fontSizeResponsive("H3", device),
            width: 110,
            textAlign: "justify",
            paddingRight: 12,
            fontWeight: FONTWEIGHT.normal,
            width: "45%",
          }}
        >
          Jumlah Peserta
        </Text>

        <Text
          style={{
            fontSize: fontSizeResponsive("H3", device),
            width: device === "tablet" ? 200 : 170,
            textAlign: "justify",
            fontWeight: FONTWEIGHT.normal,
          }}
        >
          :{" "}
          {item?.jumlah_peserta === ""
            ? "-"
            : numberWithCommas(item?.jumlah_peserta)}
        </Text>
      </View>

      <View style={{ flexDirection: "row" }}>
        <Text
          style={{
            fontSize: fontSizeResponsive("H3", device),
            width: 110,
            textAlign: "justify",
            paddingRight: 12,
            fontWeight: FONTWEIGHT.normal,
            width: "45%",
          }}
        >
          Tempat
        </Text>

        <Text
          style={{
            fontSize: fontSizeResponsive("H3", device),
            width: device === "tablet" ? 200 : 170,
            textAlign: "justify",
            fontWeight: FONTWEIGHT.normal,
          }}
        >
          :{" "}
          {item?.extra_attributes?.tempat === ""
            ? "-"
            : item?.extra_attributes?.tempat}
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginVertical: 5 }}>
        <Text
          style={{
            fontSize: fontSizeResponsive("H3", device),
            width: 110,
            textAlign: "justify",
            paddingRight: 12,
            fontWeight: FONTWEIGHT.normal,
            width: "45%",
          }}
        >
          Tanggal Pelatihan
        </Text>

        <Text
          style={{
            fontSize: fontSizeResponsive("H3", device),
            width: device === "tablet" ? 200 : 170,
            textAlign: "justify",
            fontWeight: FONTWEIGHT.normal,
          }}
        >
          :{" "}
          {item?.extra_attributes?.tempat === ""
            ? "-"
            : item?.extra_attributes?.tanggalSertif}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
