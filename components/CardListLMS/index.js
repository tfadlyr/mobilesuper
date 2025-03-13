import moment from "moment";
import React from "react";
import { Text, View } from "react-native";
import { COLORS, DATETIME, fontSizeResponsive, FONTWEIGHT } from "../../config/SuperAppps";

export const CardListLMS = ({ item, device }) => {
  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
  };
  // console.log(item);
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        marginTop: 10,
        padding: 10,
        borderRadius: 10,
      }}
    >
      <View>
        <Text style={{ fontWeight: FONTWEIGHT.bold, fontSize: fontSizeResponsive("H3", device), }}>ID PELATIHAN</Text>
        <Text style={{ marginTop: 5, fontSize: fontSizeResponsive("H3", device), }}>{item?.id_course}</Text>
      </View>

      <View style={{ marginVertical: 10 }}>
        <Text style={{ fontWeight: FONTWEIGHT.bold, fontSize: fontSizeResponsive("H3", device), }}>NAMA PELATIHAN</Text>
        <Text style={{ marginTop: 5, fontSize: fontSizeResponsive("H3", device), }}>{item?.displayname}</Text>
      </View>

      <View>
        <Text style={{ fontWeight: FONTWEIGHT.bold, fontSize: fontSizeResponsive("H3", device), }}>TANGGAL MULAI</Text>
        <Text style={{ marginTop: 5, fontSize: fontSizeResponsive("H3", device), }}>
          {moment(item?.timecreated, "YYYY-MM-DD HH:mm:ss").format(
            DATETIME.LONG_DATE
          )}
        </Text>
      </View>

      <View style={{ marginVertical: 10 }}>
        <Text style={{ fontWeight: FONTWEIGHT.bold, fontSize: fontSizeResponsive("H3", device), }}>
          JUMLAH PESERTA (ENROLLMENT)
        </Text>
        <Text style={{ marginTop: 5, fontSize: fontSizeResponsive("H3", device), }}>
          {item?.jumlah_peserta?.enrolled !== undefined
            ? numberWithCommas(item?.jumlah_peserta?.enrolled)
            : "0"}{" "}
          Peserta
        </Text>
      </View>

      <View>
        <Text style={{ fontWeight: FONTWEIGHT.bold, fontSize: fontSizeResponsive("H3", device), }}>
          JUMLAH PESERTA (COMPLETED)
        </Text>
        <Text style={{ marginTop: 5, fontSize: fontSizeResponsive("H3", device), }}>
          {item?.jumlah_peserta?.completed !== undefined
            ? numberWithCommas(item?.jumlah_peserta?.completed)
            : "0"}{" "}
          Peserta
        </Text>
      </View>
    </View>
  );
};
