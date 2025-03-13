import React from "react";
import { Text, View } from "react-native";
import {} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  PADDING,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { CollapseCardBiodata } from "../../components/CollapseCardBiodata";
import { CollapseCardLinimasa } from "../../components/CollapseCardLinimasa";
import { ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Config } from "../../constants/config";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const DetailProfile = ({ route }) => {
  const data = route.params;
  const { pegawai, loading } = useSelector((state) => state.Pegawai);
  const navigation = useNavigation();
  const item = pegawai.detail;
  const { device } = useSelector((state) => state.apps);

  const BASE_URL = Config.base_url + "bridge";
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView>
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
                  fontSize: fontSizeResponsive("H1", device),
                  fontWeight: 600,
                  color: COLORS.white,
                }}
              >
                Profil Pegawai
              </Text>
            </View>
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: PADDING.Page,
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.white,
                width: wp(87),
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
                padding: PADDING.Page,
                //shadow ios
                shadowOffset: { width: -2, height: 4 },
                shadowColor: "#171717",
                shadowOpacity: 0.2,
                //shadow android
                elevation: 2,
              }}
            >
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 30 }}
                  width={61}
                  height={61}
                />
              ) : (
                <Image
                  source={{ uri: BASE_URL + item.avatar }}
                  style={{
                    width: device === "tablet" ? 100 : 61,
                    height: device === "tablet" ? 100 : 61,
                    borderRadius: device === "tablet" ? 50 : 30,
                  }}
                />
              )}
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4, marginVertical: 10 }}
                  width={200}
                  height={20}
                />
              ) : (
                <Text
                  style={{
                    marginVertical: 10,
                    color: COLORS.info,
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {item.nama}
                </Text>
              )}
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : (
                <Text
                  style={{
                    color: COLORS.lighter,
                    fontSize: fontSizeResponsive("H4", device),
                    textAlign: "center",
                  }}
                >
                  {item.satuan_kerja_nama}
                </Text>
              )}
            </View>
          </View>

          {/* <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              paddingHorizontal: 10,
              paddingTop: 20,
              borderRadius: 8,
              //shadow ios
              shadowOffset: { width: -2, height: 4 },
              shadowColor: "#171717",
              shadowOpacity: 0.2,
              //shadow android
              elevation: 2,
              width: wp(43),
            }}
          >
            <Text
              style={{
                fontSize: fontSizeResponsive("Judul", device),
                fontWeight: FONTWEIGHT.bold,
              }}
            >
              Absensi
            </Text>

            <View style={{ paddingBottom: 20 }}>
              <View style={{ flexDirection: "row", marginTop: 20, gap: wp(2) }}>
                <Text
                  style={{
                    width: "80%",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Jumlah hari kerja
                </Text>
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  {pegawai.detail.working_day}
                </Text>
              </View>

              <View style={{ flexDirection: "row", marginTop: 10, gap: wp(2) }}>
                <Text
                  style={{
                    width: "80%",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Jumlah hadir
                </Text>
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  {pegawai.detail.present_day}
                </Text>
              </View>

              <View style={{ flexDirection: "row", marginTop: 10, gap: wp(2) }}>
                <Text
                  style={{
                    width: "80%",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Terlambat
                </Text>
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  {pegawai.detail.late_day}
                </Text>
              </View>

              <View style={{ flexDirection: "row", marginTop: 10, gap: wp(2) }}>
                <Text
                  style={{
                    width: "80%",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Dinas
                </Text>
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  {pegawai.detail.outstation_day}
                </Text>
              </View>

              <View style={{ flexDirection: "row", marginTop: 10, gap: wp(2) }}>
                <Text
                  style={{
                    width: "80%",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Cuti
                </Text>
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  -
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              backgroundColor: COLORS.white,
              paddingHorizontal: 40,
              paddingTop: 20,
              borderRadius: 8,
              //shadow ios
              shadowOffset: { width: -2, height: 4 },
              shadowColor: "#171717",
              shadowOpacity: 0.2,
              //shadow android
              elevation: 2,
              width: wp(87),
            }}
          >
            <Text
              style={{
                fontSize: device === "tablet" ? 40 : 20,
                fontWeight: FONTWEIGHT.bold,
              }}
            >
              IP ASN
            </Text>

            <View style={{ paddingBottom: 20 }}>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 5,
                  width: "60%",
                  gap: wp(5),
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: device === "tablet" ? 120 : 60,
                    fontWeight: FONTWEIGHT.bold,
                  }}
                >
                  {pegawai.detail.ipasn_nilai}
                </Text>
                <View
                  style={{
                    backgroundColor: "#CED06C",
                    width: wp(20),
                    height: wp(7),
                    borderRadius: 30,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ fontSize: fontSizeResponsive("Judul", device) }}
                  >
                    Tinggi
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                  alignItems: "center",
                  gap: wp(1),
                }}
              >
                <Text
                  style={{
                    width: "75%",
                    fontSize: fontSizeResponsive("Judul", device),
                  }}
                >
                  Kualifikasi
                </Text>
                <View
                  style={{
                    width: wp(6),
                    height: wp(6),
                    backgroundColor: "#FF9900",
                    borderRadius: 30,
                  }}
                />
                <Text style={{ fontSize: fontSizeResponsive("Judul", device) }}>
                  {pegawai.detail.ipasn_kualifikasi}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                  alignItems: "center",
                  gap: wp(1),
                }}
              >
                <Text
                  style={{
                    width: "75%",
                    fontSize: fontSizeResponsive("Judul", device),
                  }}
                >
                  Kompetensi
                </Text>
                <View
                  style={{
                    width: wp(6),
                    height: wp(6),
                    backgroundColor: COLORS.success,
                    borderRadius: 30,
                  }}
                />
                <Text style={{ fontSize: fontSizeResponsive("Judul", device) }}>
                  {pegawai.detail.ipasn_kompetensi}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                  alignItems: "center",
                  gap: wp(1),
                }}
              >
                <Text
                  style={{
                    width: "75%",
                    fontSize: fontSizeResponsive("Judul", device),
                  }}
                >
                  Kinerja
                </Text>
                <View
                  style={{
                    width: wp(6),
                    height: wp(6),
                    backgroundColor: "#CED06C",
                    borderRadius: 30,
                  }}
                />
                <Text style={{ fontSize: fontSizeResponsive("Judul", device) }}>
                  {pegawai.detail.ipasn_kinerja}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                  alignItems: "center",
                  gap: wp(1),
                }}
              >
                <Text
                  style={{
                    width: "75%",
                    fontSize: fontSizeResponsive("Judul", device),
                  }}
                >
                  Disiplin
                </Text>
                <View
                  style={{
                    width: wp(6),
                    height: wp(6),
                    backgroundColor: COLORS.success,
                    borderRadius: 30,
                  }}
                />
                <Text style={{ fontSize: fontSizeResponsive("Judul", device) }}>
                  {pegawai.detail.ipasn_disiplin}
                </Text>
              </View>
            </View>
          </View>
        </View> */}

          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {loading ? (
              <View
                style={{
                  width: "90%",
                  backgroundColor: COLORS.white,
                  height: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 8,
                  //shadow ios
                  shadowOffset: { width: -2, height: 4 },
                  shadowColor: "#171717",
                  shadowOpacity: 0.2,
                  //shadow android
                  elevation: 2,
                }}
              >
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={200}
                  height={20}
                />
              </View>
            ) : (
              <CollapseCardBiodata profile={item} device={device} data={data} />
            )}
            {/* <CollapseCardLinimasa linimasa={item.dataLinimasa} /> */}
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </>
  );
};
