import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
import { useSelector } from "react-redux";
import { COLORS, DATETIME, fontSizeResponsive } from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

export const DetailDokumenPersonal = () => {
  const { detailPersonal } = useSelector((state) => state.sppd);
  const { device } = useSelector((state) => state.apps);
  const navigation = useNavigation();
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: COLORS.primary,
          height: 80,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 20,
            width: device === "tablet" ? 40 : 28,
            height: device === "tablet" ? 40 : 28,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
          }}
        >
          <TouchableOpacity style={{}} onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-outline"
              size={device === "tablet" ? 40 : 24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: "center", marginRight: 50 }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H3", device),
              fontWeight: 600,
              color: COLORS.white,
            }}
          >
            Detail Dokumen Personal
          </Text>
        </View>
      </View>

      <View style={{ paddingVertical: 20, marginHorizontal: "5%" }}>
        <ScrollView style={{ height: "90%" }}>
          <View
            style={{
              backgroundColor: COLORS.white,
              padding: 20,
              borderRadius: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Kode Dokumen
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {/* {moment(dokumen.detail?.start_date, "DD-MM-YYYY")
                  .locale("id")
                  .format(DATETIME.LONG_DATE)} */}
                {detailPersonal.document_code}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Kegiatan
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {/* {moment(dokumen.detail?.end_date, "DD-MM-YYYY")
                  .locale("id")
                  .format(DATETIME.LONG_DATE)} */}
                {detailPersonal.event}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Alasan Perjalanan
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {detailPersonal.purpose}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Penanggung Jawab
              </Text>

              <View style={{ gap: 10, width: "60%", paddingRight: 20 }}>
                {/* <Text style={{ fontSize: 13, fontWeight: 400 }}>
                  KABUPATEN MANGGARAI BARAT - Labuan Bajo
                </Text>
                <Text style={{ fontSize: 13, fontWeight: 400 }}>
                  KOTA KUPANG - Hotel Nusantara
                </Text>
                <Text style={{ fontSize: 13, fontWeight: 400 }}>
                  KOTA DENPASAR - Hotel Kempinsky
                </Text> */}
                <Text style={{ fontSize: fontSizeResponsive("H2", device) }}>
                  {detailPersonal?.detail?.officer?.name} /
                  {detailPersonal?.detail?.officer?.nip}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Satker Penanggung Jawab
              </Text>
              <View style={{ gap: 10, width: "60%", paddingRight: 20 }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: 400,
                  }}
                >
                  {detailPersonal?.detail?.officer_satker}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Pelaksana
              </Text>
              {detailPersonal?.detail?.participant?.map((item) => {
                return (
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H2", device),
                      fontWeight: 400,
                      width: "60%",
                      paddingRight: 20,
                    }}
                  >
                    {item.person}
                  </Text>
                );
              })}
            </View>

            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Tanggal Keberangkatan
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {moment(detailPersonal.detail?.start_date, "DD-MM-YYYY")
                  .locale("id")
                  .format(DATETIME.LONG_DATE)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Tanggal Kembali
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {moment(detailPersonal.detail?.end_date, "DD-MM-YYYY")
                  .locale("id")
                  .format(DATETIME.LONG_DATE)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Total Lama Perjalanan
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {detailPersonal?.detail?.days}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Daftar Tujuan
              </Text>
              <View style={{ gap: 10, width: "60%", paddingRight: 20 }}>
                {detailPersonal.detail?.venue?.map((item) => {
                  return (
                    <Text
                      style={{ fontSize: fontSizeResponsive("H2", device) }}
                    >
                      {item.locations}
                    </Text>
                  );
                })}
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                Catatan
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {detailPersonal?.note}
              </Text>
            </View>
          </View>
          <View style={{ gap: 10, marginVertical: 20 }}>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.info,
                height: 50,
                borderRadius: 8,
                justifyContent: "center",
              }}
              onPress={() => {
                navigation.navigate("LihatSuratSPPD", {
                  status: "",
                  data: detailPersonal.purpose,
                });
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 500,
                  color: COLORS.white,
                }}
              >
                Lihat Surat
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#752A2B",
                height: 50,
                borderRadius: 8,
                justifyContent: "center",
              }}
              onPress={() => {
                // downloadFile(
                //   "https://portal.kkp.go.id/api/monperdin/document/back-form/" +
                //     dokumen.detail?.id +
                //     "/",
                //   "application/pdf",
                //   data + ".pdf"
                // );
                navigation.navigate("LihatSuratSPPD", {
                  status: "share",
                  data: detailPersonal.purpose,
                });
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 500,
                  color: COLORS.white,
                }}
              >
                Cetak Lembar Belakang
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
};
