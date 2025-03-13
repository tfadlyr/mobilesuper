import React from "react";
import { useState } from "react";
import { BackHandler, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  PADDING,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { Search } from "../../components/Search";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { useEffect } from "react";
import {
  getArsipCuti,
  getCutiPersonal,
  getFormCuti,
  getKuotaCuti,
} from "../../service/api";
import { CardKuotaCuti } from "../../components/CardKuotaCuti";
import { FlatList, Image } from "react-native";
import ListEmpty from "../../components/ListEmpty";
import { Loading } from "../../components/Loading";
import { CardArsipCuti } from "../../components/CardArsipCuti";
import { RefreshControl } from "react-native";
import { CardFormPengajuanCuti } from "../../components/CardFormPengajuanCuti";
import { Config } from "../../constants/config";
import { getTokenValue, removePushNotif } from "../../service/session";

export const PersonalCuti = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.superApps);
  const [collapse, setCollapse] = useState({
    nip: "",
    toggle: false,
  });

  const [token, setToken] = useState("");

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getCutiPersonal(token));
      dispatch(getKuotaCuti(token));
      dispatch(getArsipCuti(token));
    }
  }, [token]);

  const navigation = useNavigation();
  const BASE_URL = Config.base_url + "bridge";
  const { personal, kuota, loading, arsip } = useSelector(
    (state) => state.cuti
  );
  const arsipLists = arsip?.lists?.data;

  const formCuti = (id) => {
    const params = { nip: profile.nip, id: id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getFormCuti(params));
  };

  const [refreshing, setRefreshing] = useState(false);
  const [jumlahDraft, setJumlahDraft] = useState();
  const [jumlahOnProgress, setJumlahOnProsess] = useState();
  const [jumlahComplete, setJumlahCompete] = useState();
  const [jumlahReject, setJumlahReject] = useState();

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        dispatch(getCutiPersonal(token));
        dispatch(getKuotaCuti(token));
        dispatch(getArsipCuti(token));
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token]);

  useEffect(() => {
    if (arsipLists) {
      const rejectedData = arsipLists.filter((item) => {
        return item?.status === "Rejected";
      });
      const draftData = arsipLists.filter((item) => {
        return item?.status === "Draft";
      });
      const onProgressData = arsipLists.filter((item) => {
        return item?.status === "On Progress";
      });
      const CompleteData = arsipLists.filter((item) => {
        return item?.status === "Completed";
      });

      setJumlahCompete(CompleteData.length);
      setJumlahOnProsess(onProgressData.length);
      setJumlahDraft(draftData.length);
      setJumlahReject(rejectedData.length);
    } else {
    }
  }, [arsipLists]);

  const { device } = useSelector((state) => state.apps);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("Home"); // Navigasi langsung ke Home
      return true; // Mencegah aksi back default Android
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {loading ? <Loading /> : null}
      <View style={{ flex: 1 }}>
        <ScrollView>
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
                  fontSize: fontSizeResponsive("H1", device),
                  fontWeight: FONTWEIGHT.bold,
                  color: COLORS.white,
                }}
              >
                Cuti
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
              <TouchableOpacity onPress={() => navigation.navigate("Libur")}>
                <Ionicons
                  name="calendar-outline"
                  size={device === "tablet" ? 30 : 18}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{ paddingVertical: 20, paddingHorizontal: "5%", flex: 1 }}
          >
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
              <Image
                source={require("../../assets/superApp/Card-Background-Red.png")}
                style={{
                  width: "100%",
                  height: device === "tablet" ? 300 : 200,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  //shadow ios
                  shadowOffset: { width: -2, height: 4 },
                  shadowColor: "#171717",
                  shadowOpacity: 0.2,
                  //shadow android
                  elevation: 2,
                }}
              />
              <View
                style={{ alignItems: "center", gap: 10, position: "absolute" }}
              >
                <Image
                  source={{ uri: BASE_URL + profile.avatar_signed }}
                  style={{
                    width: device === "tablet" ? 125 : 75,
                    height: device === "tablet" ? 125 : 75,
                    borderRadius: device === "tablet" ? 65 : 36,
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
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: 400,
                    color: COLORS.white,
                  }}
                >
                  {profile.nip}
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: COLORS.white,
                padding: 15,
                borderBottomRightRadius: 8,
                borderBottomLeftRadius: 8,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  setCollapse({ nip: personal.data_user?.nip, toggle: true })
                }
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Profil
                  </Text>
                  {collapse.nip === personal.data_user?.nip &&
                  collapse.toggle === true ? (
                    <TouchableOpacity
                      onPress={() => setCollapse({ nip: "", toggle: false })}
                    >
                      <Ionicons name="chevron-up" size={24} />
                    </TouchableOpacity>
                  ) : (
                    <Ionicons name="chevron-down" size={24} />
                  )}
                </View>
              </TouchableOpacity>
              {personal.data_user?.nip === personal.data_user?.nip &&
              collapse.toggle === true ? (
                <View>
                  <TouchableOpacity
                    onPress={() => setCollapse({ nip: "", toggle: false })}
                  >
                    <Text
                      style={{
                        marginTop: 10,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Jenis Kelamin
                    </Text>
                    <Text
                      style={{
                        marginTop: 5,
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      {personal.data_user?.jenis_kelamin}
                    </Text>

                    <Text
                      style={{
                        marginTop: 10,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Golongan
                    </Text>
                    <Text
                      style={{
                        marginTop: 5,
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      {personal.data_user?.golongan}
                    </Text>

                    <Text
                      style={{
                        marginTop: 10,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Jabatan
                    </Text>
                    <Text
                      style={{
                        marginTop: 5,
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      {personal.data_user?.jabatan}
                    </Text>

                    <Text
                      style={{
                        marginTop: 10,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Unit Kerja
                    </Text>
                    <Text
                      style={{
                        marginTop: 5,
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      {personal.data_user?.unit_kerja}
                    </Text>

                    <Text
                      style={{
                        marginTop: 10,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Satuan Kerja
                    </Text>
                    <Text
                      style={{
                        marginTop: 5,
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      {personal.data_user?.satuan_kerja}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>
          <View style={{ paddingHorizontal: "5%", gap: 10, flex: 1 }}>
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Form Pengajuan Cuti
            </Text>
            {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
              {personal?.data_jenis_cuti?.map((item) => {
                return (
                  <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
                    <View style={{ alignItems: "center", gap: 10 }}>
                      <TouchableOpacity
                        onPress={() => {
                          formCuti(item.id);
                          navigation.navigate("TambahCutiTahunan");
                        }}
                        style={{
                          backgroundColor: COLORS.infoDanger,
                          padding: 15,
                          borderRadius: 30,
                          width: 55,
                          height: 55,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={18}
                          color={COLORS.white}
                        />
                      </TouchableOpacity>
                      <Text style={{ maxWidth: 60, textAlign: "center" }}>
                        {item.nama}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView> */}
            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FlatList
                data={personal.data_jenis_cuti}
                renderItem={({ item }) => (
                  <View key={item.id}>
                    <CardFormPengajuanCuti
                      item={item}
                      profile={profile}
                      device={device}
                      token={token}
                    />
                  </View>
                )}
                numColumns={3}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={() => <ListEmpty />}
                scrollEnabled={true}
              />
            </View>
          </View>
          <View style={{ paddingHorizontal: "5%", flex: 1 }}>
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Status Dokumen Cuti
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: "2%",
              }}
            >
              <View
                style={[styles.cardStatus, { backgroundColor: COLORS.grey }]}
              >
                <View
                  style={{ width: "70%", alignItems: "center", rowGap: 20 }}
                >
                  <Ionicons
                    name="document-outline"
                    size={50}
                    color={COLORS.white}
                  />
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: fontSizeResponsive("Judul", device),
                    }}
                  >
                    Draft
                  </Text>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: fontSizeResponsive("Judul", device),
                    }}
                  >
                    {jumlahDraft}
                  </Text>
                </View>
              </View>

              <View
                style={[styles.cardStatus, { backgroundColor: COLORS.orange }]}
              >
                <View
                  style={{
                    width: "70%",
                    alignItems: "center",
                    rowGap: 10,
                  }}
                >
                  <Ionicons
                    name="file-tray-full-outline"
                    size={50}
                    color={COLORS.white}
                  />
                  <Text
                    style={{
                      color: COLORS.white,
                      textAlign: "center",
                      fontSize: fontSizeResponsive("Judul", device),
                    }}
                  >
                    Sedang Proses
                  </Text>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: fontSizeResponsive("Judul", device),
                    }}
                  >
                    {jumlahOnProgress}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={[styles.cardStatus, { backgroundColor: COLORS.success }]}
              >
                <View
                  style={{ width: "70%", alignItems: "center", rowGap: 10 }}
                >
                  <Ionicons
                    name="checkmark-done-outline"
                    size={50}
                    color={COLORS.white}
                  />
                  <Text
                    style={{
                      color: COLORS.white,
                      textAlign: "center",
                      fontSize: fontSizeResponsive("Judul", device),
                    }}
                  >
                    Dokumen Disetujui
                  </Text>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: fontSizeResponsive("Judul", device),
                    }}
                  >
                    {jumlahComplete}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.cardStatus,
                  { backgroundColor: COLORS.infoDanger },
                ]}
              >
                <View style={{ width: "70%", alignItems: "center", rowGap: 2 }}>
                  <Ionicons
                    name="close-circle-outline"
                    size={50}
                    color={COLORS.white}
                  />
                  <Text
                    style={{
                      color: COLORS.white,
                      textAlign: "center",
                      fontSize: fontSizeResponsive("Judul", device),
                    }}
                  >
                    Dokumen Tidak Disetujui
                  </Text>
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: fontSizeResponsive("Judul", device),
                    }}
                  >
                    {jumlahReject}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View
            style={{
              paddingVertical: PADDING.Page,
              marginHorizontal: "5%",
              flex: 1,
            }}
          >
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Kuota Cuti
            </Text>
            <FlatList
              data={kuota.data_kuota_cuti}
              renderItem={({ item }) => (
                <View key={item.id}>
                  <CardKuotaCuti item={item} device={device} />
                </View>
              )}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={() => <ListEmpty />}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
            {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={{ gap: 20, flexDirection: 'row' }}>
                                <View style={[styles.cardKouta]}>
                                    <View style={{
                                        width: "60%",
                                        padding: 15,
                                        borderRadius: 8,
                                        backgroundColor: COLORS.white,
                                        alignItems: "center"
                                    }}>
                                        <View style={{ rowGap: 10 }}>
                                            <Text style={{ fontSize: 12 }}>Jenis : Cuti Tahunan</Text>
                                            <Text style={{ fontSize: 12 }}>Periode:  N-2 </Text>
                                            <Text style={{ fontSize: 12, color: COLORS.lighter }}>Mulai Berlaku: 01 Januari 2021</Text>
                                            <Text style={{ fontSize: 12, color: COLORS.lighter }}>Akhir Beralaku: 31 Desember 2021</Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        width: "40%",
                                        borderBottomRightRadius: 8,
                                        borderTopRightRadius: 8,
                                        backgroundColor: "grey",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                        <View style={{ gap: 20, }}>
                                            <View style={{ flexDirection: "row", columnGap: 5, alignItems: "center" }}>
                                                <Text>Kuota Cuti</Text>
                                                <View style={{ backgroundColor: COLORS.white, borderRadius: 5, paddingHorizontal: 12, paddingVertical: 8 }}>
                                                    <Text style={{ fontWeight: FONTWEIGHT.bold }}>6</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: "row", columnGap: 5, alignItems: "center" }}>
                                                <Text>Sisa Kuota</Text>
                                                <View style={{ backgroundColor: COLORS.white, borderRadius: 5, paddingHorizontal: 12, paddingVertical: 8 }}>
                                                    <Text style={{ fontWeight: FONTWEIGHT.bold }}>6</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                <View style={[styles.cardKouta, { marginRight: 10 }]}>
                                    <View style={{
                                        width: "60%",
                                        padding: 15,
                                        borderRadius: 8,
                                        backgroundColor: COLORS.white,
                                        alignItems: "center"
                                    }}>
                                        <View style={{ rowGap: 10 }}>
                                            <Text style={{ fontSize: 12 }}>Jenis : Cuti Tahunan</Text>
                                            <Text style={{ fontSize: 12 }}>Periode:  N-2 </Text>
                                            <Text style={{ fontSize: 12, color: COLORS.lighter }}>Mulai Berlaku: 01 Januari 2021</Text>
                                            <Text style={{ fontSize: 12, color: COLORS.lighter }}>Akhir Beralaku: 31 Desember 2021</Text>
                                        </View>
                                    </View>
                                    <View style={{
                                        width: "40%",
                                        borderBottomRightRadius: 8,
                                        borderTopRightRadius: 8,
                                        backgroundColor: "grey",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}>
                                        <View style={{ gap: 20, }}>
                                            <View style={{ flexDirection: "row", columnGap: 5, alignItems: "center" }}>
                                                <Text>Kuota Cuti</Text>
                                                <View style={{ backgroundColor: COLORS.white, borderRadius: 5, paddingHorizontal: 12, paddingVertical: 8 }}>
                                                    <Text style={{ fontWeight: FONTWEIGHT.bold }}>6</Text>
                                                </View>
                                            </View>
                                            <View style={{ flexDirection: "row", columnGap: 5, alignItems: "center" }}>
                                                <Text>Sisa Kuota</Text>
                                                <View style={{ backgroundColor: COLORS.white, borderRadius: 5, paddingHorizontal: 12, paddingVertical: 8 }}>
                                                    <Text style={{ fontWeight: FONTWEIGHT.bold }}>6</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView> */}
          </View>

          {/* <View style={{ padding: 20, rowGap: 10 }}>
            <Text style={{ fontWeight: FONTWEIGHT.bold }}>
              Monitoring Kuota
            </Text>
            <View style={{ backgroundColor: "white", borderRadius: 8 }}>
              <View
                style={{
                  flexDirection: "row",
                  gap: 70,
                  padding: 10,
                  justifyContent: "center",
                }}
              >
                <TouchableOpacity>
                  <Ionicons
                    name="chevron-back-outline"
                    size={24}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
                <Text>Cuti Tahunan 2021</Text>
                <TouchableOpacity>
                  <Ionicons
                    name="chevron-forward-outline"
                    size={24}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  padding: 10,
                  marginHorizontal: 15,
                  marginBottom: 15,
                  flexDirection: "row",
                }}
              >
                <View style={{ gap: 20, position: "relative" }}>
                  <View style={{ flexDirection: "row" }}>
                    <Text>Kuota</Text>
                    <View
                      style={{
                        backgroundColor: "#1868AB",
                        width: 20,
                        height: 20,
                        alignItems: "center",
                        borderRadius: 3,
                        marginHorizontal: 130,
                        position: "absolute",
                      }}
                    >
                      <Text
                        style={{ color: "white", fontWeight: FONTWEIGHT.bold }}
                      >
                        6
                      </Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text>Penggunaan</Text>
                    <View
                      style={{
                        backgroundColor: "#F6AD1D",
                        width: 20,
                        height: 20,
                        alignItems: "center",
                        borderRadius: 3,
                        marginHorizontal: 130,
                        position: "absolute",
                      }}
                    >
                      <Text style={{ color: "white" }}>6</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text>Sisa</Text>
                    <View
                      style={{
                        backgroundColor: "#11C15B",
                        width: 20,
                        height: 20,
                        alignItems: "center",
                        borderRadius: 3,
                        marginHorizontal: 130,
                        position: "absolute",
                      }}
                    >
                      <Text style={{ color: "white" }}>6</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View> */}
          {/* 
                    <View style={{ padding: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontWeight: FONTWEIGHT.bold }}>Arsip Cuti</Text>
                            <TouchableOpacity style={{ justifyContent: 'flex-end' }}
                                onPress={() => {
                                    navigation.navigate('ListArsipCuti')
                                }}
                            >
                                <Text style={{ color: COLORS.info }}>Selengkapnya</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={arsipLists?.slice(0, 10)}
                            renderItem={({ item }) => (
                                <View key={item.id}>
                                    <CardArsipCuti
                                        item={item}
                                    />
                                </View>
                            )}
                            keyExtractor={(item) => item.id}
                            ListEmptyComponent={() => <ListEmpty />}
                        />
                    </View> */}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  cardStatus: {
    width: "49%",
    padding: 15,
    borderRadius: 8,
    marginBottom: "2%",
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  cardKouta: {
    width: 360,
    // padding: 1,
    borderRadius: 8,
    // marginHorizontal: 5,
    // margin:10,
    marginVertical: 10,
    flexDirection: "row",
  },
});
