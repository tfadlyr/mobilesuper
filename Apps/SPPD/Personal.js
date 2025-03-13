import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import {} from "react-native-safe-area-context";
import {
  AVATAR,
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  PADDING,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native";
// import profile from '../../store/profile';
import { ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getTokenValue } from "../../service/session";
import { getDashboardSPPD } from "../../service/api";
import { Loading } from "../../components/Loading";
import { StyleSheet } from "react-native";
import { Config } from "../../constants/config";

export const Personal = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState("");

  const [collapse, setCollapse] = useState({
    toggle: false,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      // dispatch(getDivision(token))
      dispatch(getDashboardSPPD(token));
      // dispatch(getDivisionTree({ token: token, id: kategori.key }))
    }
  }, [token]);

  const { dashboard, loading } = useSelector((state) => state.sppd);
  const { profile } = useSelector((state) => state.superApps);
  const { device } = useSelector((state) => state.apps);

  let jmlperjalanan = dashboard.stats?.self_event?.counter.toString();
  let jmlProv = dashboard.stats?.province?.counter.toString();
  let jmlKota = dashboard.stats?.city?.counter.toString();

  const BASE_URL = Config.base_url + "bridge";

  return (
    <>
      {loading ? <Loading /> : null}
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-outline"
              size={device === "tablet" ? 40 : 24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H3", device),
              fontWeight: FONTWEIGHT.bold,
              color: COLORS.white,
            }}
          >
            Perjalanan Dinas
          </Text>
        </View>
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 20,
            width: device === "tablet" ? 40 : 28,
            height: device === "tablet" ? 40 : 28,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 20,
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate("KegiatanBaru")}>
            <Ionicons
              name="calendar-outline"
              size={device === "tablet" ? 25 : 18}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        <View style={{ paddingVertical: 20, paddingHorizontal: "5%" }}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              //shadow ios
              shadowOffset: { width: -2, height: 4 },
              shadowColor: "#171717",
              shadowOpacity: 0.2,
              //shadow android
              elevation: 2,
            }}
          >
            <ImageBackground
              source={require("../../assets/superApp/Card-Background-Red.png")}
              style={{
                width: "100%",
                // height: device === "tablet" ? "50%" : null,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                //shadow ios
                shadowOffset: { width: -2, height: 4 },
                shadowColor: "#171717",
                shadowOpacity: 0.2,
                //shadow android
                elevation: 2,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  gap: 10,
                  zIndex: 1,
                  padding: PADDING.Page,
                }}
              >
                <Image
                  source={{ uri: BASE_URL + profile.avatar_signed }}
                  style={{
                    width: device === "tablet" ? 100 : 75,
                    height: device === "tablet" ? 100 : 75,
                    borderRadius: device === "tablet" ? 100 : 36,
                    borderWidth: 2,
                    borderColor: COLORS.white,
                  }}
                />
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H1", device),
                    fontWeight: 600,
                    color: COLORS.white,
                  }}
                >
                  {profile.nama}
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: 400,
                    color: COLORS.white,
                  }}
                >
                  {profile?.nip}
                </Text>
              </View>
            </ImageBackground>
          </View>
          <View
            style={{
              backgroundColor: COLORS.white,
              padding: 15,
              borderBottomRightRadius: 8,
              borderBottomLeftRadius: 8,
            }}
          >
            <TouchableOpacity onPress={() => setCollapse({ toggle: true })}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginHorizontal: 5,
                }}
              >
                <Text
                  style={{
                    width: "95%",
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: 600,
                  }}
                >
                  Profil
                </Text>
                {collapse.toggle === true ? (
                  <TouchableOpacity
                    onPress={() => setCollapse({ toggle: false })}
                  >
                    <Ionicons
                      name="chevron-up"
                      size={device === "tablet" ? 40 : 24}
                    />
                  </TouchableOpacity>
                ) : (
                  <Ionicons
                    name="chevron-down"
                    size={device === "tablet" ? 40 : 24}
                  />
                )}
              </View>
            </TouchableOpacity>
            {collapse.toggle === true ? (
              <View>
                <TouchableOpacity
                  onPress={() => setCollapse({ toggle: false })}
                >
                  <Text
                    style={{
                      marginTop: 10,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Posisi
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    {profile.nama_jabatan}
                  </Text>

                  <Text
                    style={{
                      marginTop: 10,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Golongan
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    {profile.golongan}
                  </Text>

                  <Text
                    style={{
                      marginTop: 10,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Satuan Kerja
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    {profile.unit_kerja}
                  </Text>

                  <Text
                    style={{
                      marginTop: 10,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Unit Kerja
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    {profile.satuan_kerja_nama}
                  </Text>

                  <Text
                    style={{
                      marginTop: 10,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Kota Kantor
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    {profile.officecity}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          <Text
            style={{
              fontSize: fontSizeResponsive("H2", device),
              fontWeight: 700,
              marginTop: 20,
            }}
          >
            Status
          </Text>

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={[styles.cardStatus, { backgroundColor: COLORS.info }]}
              onPress={() => {
                navigation.navigate("DokumenSPPD");
              }}
            >
              <View style={{ alignItems: "center", rowGap: 20 }}>
                <Ionicons
                  name="document-outline"
                  size={50}
                  color={COLORS.white}
                />
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: device === "tablet" ? 40 : 24,
                  }}
                >
                  {dashboard.stats?.documents?.counter?.toString()}
                </Text>
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  Total Perjalanan Dinas
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cardStatus, { backgroundColor: COLORS.info }]}
              onPress={() => {
                navigation.navigate("DokumenSPPD");
              }}
            >
              <View style={{ alignItems: "center", rowGap: 20 }}>
                <Ionicons
                  name="document-outline"
                  size={50}
                  color={COLORS.white}
                />
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: device === "tablet" ? 40 : 24,
                  }}
                >
                  {dashboard.stats?.events?.counter?.toString()}
                </Text>
                <Text
                  style={{
                    color: COLORS.white,
                    textAlign: "center",
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  Jumlah Dokumen Total
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 10, marginBottom: 30 }}>
            <View
              style={{
                flexDirection: "row",
                //shadow ios
                shadowOffset: { width: -2, height: 4 },
                shadowColor: "#171717",
                shadowOpacity: 0.2,
                //shadow android
                elevation: 2,
              }}
            >
              <View
                style={{
                  backgroundColor: "#EAEAEA",
                  width: "20%",
                  borderBottomLeftRadius: 8,
                  borderTopLeftRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#474747",
                    width: device === "tablet" ? 50 : 35,
                    height: device === "tablet" ? 50 : 35,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 8,
                  }}
                >
                  <Ionicons
                    name="file-tray-full-outline"
                    size={device === "tablet" ? 40 : 30}
                    color="#EAEAEA"
                  />
                </View>
              </View>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  width: "80%",
                  borderBottomRightRadius: 8,
                  borderTopRightRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 5,
                  padding: PADDING.Page,
                }}
              >
                <Text
                  style={{
                    fontSize: device === "tablet" ? 40 : 24,
                    fontWeight: 600,
                    color: COLORS.primary,
                  }}
                >
                  {jmlperjalanan}
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: 600,
                  }}
                >
                  Jumlah Perjalanan Dinas
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H4", device),
                    fontWeight: 400,
                    textAlign: "center",
                    width: "90%",
                    color: "#6B7280",
                  }}
                >
                  Kegiatan Terakhir: {dashboard.stats?.self_event?.last_visited}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                //shadow ios
                shadowOffset: { width: -2, height: 4 },
                shadowColor: "#171717",
                shadowOpacity: 0.2,
                //shadow android
                elevation: 2,
              }}
            >
              <View
                style={{
                  backgroundColor: "#EAEAEA",
                  width: "20%",
                  borderBottomLeftRadius: 8,
                  borderTopLeftRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#474747",
                    width: device === "tablet" ? 50 : 35,
                    height: device === "tablet" ? 50 : 35,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 8,
                  }}
                >
                  <Ionicons
                    name="map-outline"
                    size={device === "tablet" ? 40 : 30}
                    color="#EAEAEA"
                  />
                </View>
              </View>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  width: "80%",
                  borderBottomRightRadius: 8,
                  borderTopRightRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 5,
                  padding: PADDING.Page,
                }}
              >
                <Text
                  style={{
                    fontSize: device === "tablet" ? 40 : 24,
                    fontWeight: 600,
                    color: COLORS.primary,
                  }}
                >
                  {jmlProv}
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: 600,
                  }}
                >
                  Jumlah Provinsi Didatangi
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H4", device),
                    fontWeight: 400,
                    textAlign: "center",
                    width: "90%",
                    color: "#6B7280",
                  }}
                >
                  Provinsi Terakhir Didatangi:{" "}
                  {dashboard.stats?.province?.last_visited}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                //shadow ios
                shadowOffset: { width: -2, height: 4 },
                shadowColor: "#171717",
                shadowOpacity: 0.2,
                //shadow android
                elevation: 2,
              }}
            >
              <View
                style={{
                  backgroundColor: "#EAEAEA",
                  width: "20%",
                  borderBottomLeftRadius: 8,
                  borderTopLeftRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#474747",
                    width: device === "tablet" ? 50 : 35,
                    height: device === "tablet" ? 50 : 35,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 8,
                  }}
                >
                  <Ionicons
                    name="location-outline"
                    size={device === "tablet" ? 40 : 30}
                    color="#EAEAEA"
                  />
                </View>
              </View>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  width: "80%",
                  borderBottomRightRadius: 8,
                  borderTopRightRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 5,
                  padding: PADDING.Page,
                }}
              >
                <Text
                  style={{
                    fontSize: device === "tablet" ? 40 : 24,
                    fontWeight: 600,
                    color: COLORS.primary,
                  }}
                >
                  {jmlKota}
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: 600,
                  }}
                >
                  Jumlah Kota Tujuan
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H4", device),
                    fontWeight: 400,
                    textAlign: "center",
                    width: "90%",
                    color: "#6B7280",
                  }}
                >
                  Kota Terakhir Didatangi: {dashboard.stats?.city?.last_visited}
                </Text>
                {/* <Text style={{ fontSize: 11, fontWeight: 400, textAlign: "center", width: 250, color: "#6B7280" }}>Pada Tanggal 03 Oktober 2023</Text> */}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  cardStatus: {
    width: "49.5%",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 1,
    margin: 10,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
});
