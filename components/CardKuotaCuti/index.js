import React from "react";
import { View, Image } from "react-native";
import {
  COLORS,
  DATETIME,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Text } from "react-native";
import { StyleSheet } from "react-native";
import moment from "moment/min/moment-with-locales";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const CardKuotaCuti = ({ item, device }) => {
  return (
    <View
      style={{
        alignItems: "center",
        backgroundColor: COLORS.white,
        marginTop: 10,
        padding: 12,
        minHeight: item.jenis_cuti === "Cuti Besar" ? 100 : 140,
        position: "relative",
        borderRadius: 8,
      }}
    >
      <View
        style={{
          position: "absolute",
          // alignSelf: "flex-end",
          right: 0,
          top: 0,
          bottom: 0,
          left: 0,
          // height: "100%",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <Image
          source={require("../../assets/superApp/Vector2.png")}
          style={{
            height: "100%",
            width: item.jenis_cuti === "Cuti Besar" ? 105 : 145,
          }}
        />
      </View>
      <View>
        <View style={[styles.cardKouta]}>
          <View
            style={{
              width: "60%",
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
              // backgroundColor: COLORS.white,
              alignItems: "flex-start",
            }}
          >
            <View>
              <Text style={{ fontSize: fontSizeResponsive("H3", device) }}>
                Jenis : {item.jenis_cuti}
              </Text>
              {item.jenis_cuti === "Cuti Besar" ? null : (
                <Text style={{ fontSize: fontSizeResponsive("H3", device) }}>
                  Periode: {item.periode}{" "}
                </Text>
              )}
              {item.jenis_cuti === "Cuti Besar" ? (
                <>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H3", device),
                      color: COLORS.lighter,
                    }}
                  >
                    Mulai Dipakai:{" "}
                    {item.mulai_dipakai === "-"
                      ? "-"
                      : moment(item.mulai_dipakai, "DD MMMM YYYY HH:mm:ss")
                          .locale("id")
                          .format(DATETIME.LONG_DATE)}
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H3", device),
                      color: COLORS.lighter,
                    }}
                  >
                    Akhir Dipakai:{" "}
                    {item.akhir_dipakai === "-"
                      ? "-"
                      : moment(item.akhir_dipakai, "DD MMMM YYYY HH:mm:ss")
                          .locale("id")
                          .format(DATETIME.LONG_DATE)}
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H3", device),
                      color: COLORS.lighter,
                    }}
                  >
                    Mulai Berlaku:{" "}
                    {moment(item.mulai_berlaku, "DD MMMM YYYY HH:mm:ss")
                      .locale("id")
                      .format(DATETIME.LONG_DATE)}
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H3", device),
                      color: COLORS.lighter,
                    }}
                  >
                    Akhir Berlaku:{" "}
                    {moment(item.akhir_berlaku, "DD MMMM YYYY HH:mm:ss")
                      .locale("id")
                      .format(DATETIME.LONG_DATE)}
                  </Text>
                </>
              )}
            </View>
          </View>
          <View
            style={{
              width: "40%",
              borderBottomRightRadius: 8,
              borderTopRightRadius: 8,
              // backgroundColor: COLORS.white,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{ gap: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  columnGap: 12,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: fontSizeResponsive("H3", device) }}>
                  Kuota Cuti
                </Text>
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    borderRadius: 5,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    {item.kuota}
                  </Text>
                </View>
              </View>
              {item.jenis_cuti === "Cuti Besar" ? null : (
                <View
                  style={{
                    flexDirection: "row",
                    columnGap: 12,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: fontSizeResponsive("H3", device) }}>
                    Sisa Kuota
                  </Text>
                  <View
                    style={{
                      backgroundColor: COLORS.white,
                      borderRadius: 5,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H3", device),
                      }}
                    >
                      {item.sisa_kuota}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  cardStatus: {
    width: "20%",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    margin: 10,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  cardKouta: {
    // padding: 1,
    borderRadius: 8,
    // marginHorizontal: 5,
    // margin:10,
    marginVertical: 10,
    flexDirection: "row",
  },
});
