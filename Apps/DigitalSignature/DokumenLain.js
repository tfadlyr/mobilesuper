import React, { useMemo, useRef } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Text, Image } from "react-native";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import {
  useIsFocused,
  useNavigation,
  useNavigationState,
} from "@react-navigation/native";
import { Search } from "../../components/Search";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { useEffect } from "react";
import ListEmpty from "../../components/ListEmpty";
import {
  getDetailDigisign,
  getListRejected,
  getListComposer,
  getListDraft,
  getListInProgress,
  getListSignedDigiSign,
  deleteDokumenLain,
  getCounterDigitalSign,
} from "../../service/api";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getTokenValue } from "../../service/session";
import {
  setDigitalSignLists,
  setStatus,
  setStatusHapus,
} from "../../store/DigitalSign";
import { Loading } from "../../components/Loading";
import { RefreshControl } from "react-native";
import { Config } from "../../constants/config";
import { ModalSubmit } from "../../components/ModalSubmit";

const ListDokumenLain = ({ item, variant, token, device }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isSelected, setSelection] = useState(false);
  const getDetail = (id) => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getDetailDigisign(params));
  };
  const BASE_URL = Config.base_url + "bridge";
  return (
    <View
      key={item.id}
      style={{
        backgroundColor: "white",
        borderRadius: 8,
        width: "90%",
        flex: 1,
        marginHorizontal: "5%",
        padding: 16,
        //shadow ios
        shadowOffset: { width: -2, height: 4 },
        shadowColor: "#171717",
        shadowOpacity: 0.1,
        // //shadow android
        elevation: 2,
        marginVertical: 8,
      }}
    >
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
        onPress={() => {
          getDetail(item.id);
          navigation.navigate("DetailDokumenLain", {
            variant: variant,
            token: token,
          });
        }}
      >
        {/* {variant === "inprogress" ? (
          <Checkbox
            value={isSelected}
            onValueChange={setSelection}
            color={isSelected === true ? COLORS.lighter : null}
          />
        ) : null} */}
        <View style={{ flexDirection: "column", width: "100%" }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H3", device),
              textAlign: "justify",
              fontWeight: FONTWEIGHT.bold,
              width: "100%",
            }}
          >
            {item?.subject}
          </Text>
          <View
            style={{
              backgroundColor: COLORS.lighter,
              height: 1,
              marginVertical: 8,
              width: "100%",
            }}
          />
          <View style={{ gap: 5, width: "100%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H3", device),
                  width: 120,
                  textAlign: "auto",
                  paddingRight: 12,
                  fontWeight: FONTWEIGHT.normal,
                  width: "45%",
                }}
              >
                Penerima
              </Text>
              {item?.composer?.display_title !== undefined ? (
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.normal,
                    width: "55%",
                    textAlign: "auto",

                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  :{" "}
                  {item?.composer?.officer?.nama !== undefined
                    ? item?.receivers[0]?.officer?.nama
                    : "-"}
                </Text>
              ) : (
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.normal,
                    width: "55%",
                    textAlign: "auto",
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  :{" "}
                  {item?.composer?.nama !== undefined
                    ? item?.composer?.nama
                    : "-"}
                </Text>
              )}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H3", device),
                  width: 120,
                  textAlign: "auto",
                  paddingRight: 12,
                  fontWeight: FONTWEIGHT.normal,
                  width: "45%",
                }}
              >
                Penandatangan
              </Text>
              <Text style={{ fontSize: fontSizeResponsive("H3", device) }}>
                :{" "}
              </Text>
              {item?.approvers.slice(1).map((data) => (
                <Image
                  source={{ uri: data.avatar_url }}
                  style={{
                    width: device === "tablet" ? 40 : 20,
                    height: device === "tablet" ? 40 : 20,
                    borderRadius: 50,
                  }}
                />
              ))}
            </View>
            {variant === "signed" ? (
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    width: 110,
                    textAlign: "auto",
                    paddingRight: 12,
                    fontWeight: FONTWEIGHT.normal,
                    width: "45%",
                  }}
                >
                  Status
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    width: 200,
                    textAlign: "auto",
                    fontWeight: FONTWEIGHT.normal,
                    width: "55%",
                  }}
                >
                  :{item.state === "in_progress" ? "In Progress" : "Done"}
                </Text>
              </View>
            ) : null}

            {variant === "composer" ? (
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: COLORS.infoDanger,
                  borderRadius: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10,
                }}
                onPress={() => {
                  Alert.alert(
                    "Peringatan!",
                    "Apakah anda yakin akan menghapus dokumen ini?",
                    [
                      {
                        text: "Ya",
                        onPress: () => {
                          dispatch(
                            deleteDokumenLain({ token: token, id: item.id })
                          );
                        },
                        style: "cencel",
                      },
                      {
                        text: "Batal",
                        style: "cancel",
                      },
                    ],
                    {
                      cancelable: false,
                      onDismiss: () => {},
                    }
                  );
                }}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Hapus Dokumen
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const DokumenLain = ({ route }) => {
  const routeCounter = route?.params;
  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [tipe, setTipe] = useState("dokumen_lain");
  const [variant, SetVariant] = useState("composer");
  const [filterData, setFilterData] = useState([]);
  const [page, setPage] = useState(10);
  const isFocus = useIsFocused();

  const currentTab = useNavigationState(
    (state) => state.routes[state.index].name
  );

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      if (
        currentTab === "DokumenLain" &&
        routeCounter?.route?.params.screen === "DokumenLain"
      ) {
        SetVariant("inprogress");
        dispatch(
          getListInProgress({
            token: token,
            tipe: "dokumen_lain",
            page: page,
            search: search,
          })
        );
        dispatch(getCounterDigitalSign({ token: token, tipe: "dokumen_lain" }));
        navigation.setParams({ route: undefined });
      } else if (currentTab === "DokumenLain") {
        // dispatch(
        //   getListComposer({
        //     token: token,
        //     tipe: tipe,
        //     page: page,
        //     search: search,
        //   })
        // );
        dispatch(getCounterDigitalSign({ token: token, tipe: "dokumen_lain" }));
      }
      // else if (currentTab === "DokumenLain") {
      //   dispatch(
      //     getListComposer({
      //       token: token,
      //       tipe: tipe,
      //       page: page,
      //       search: search,
      //     })
      //   );
      //   dispatch(getCounterDigitalSign({ token: token, tipe: "dokumen_lain" }));
      // }
    }
  }, [token, tipe, currentTab]);

  const filterHandlerComposer = () => {
    SetVariant("composer");
    dispatch(
      getListComposer({ token: token, tipe: tipe, page: page, search: search })
    );
  };
  const filterHandlerInProgress = () => {
    SetVariant("inprogress");
    dispatch(
      getListInProgress({
        token: token,
        tipe: tipe,
        page: page,
        search: search,
      })
    );
  };
  const filterHandlerRejected = () => {
    SetVariant("rejected");
    dispatch(getListRejected({ token: token, page: page, search: search }));
  };
  const filterHandlerDraft = () => {
    SetVariant("draft");
    dispatch(
      getListDraft({ token: token, tipe: tipe, page: page, search: search })
    );
  };
  const filterHandlerSigned = () => {
    SetVariant("signed");
    dispatch(
      getListSignedDigiSign({
        token: token,
        tipe: tipe,
        page: page,
        search: search,
      })
    );
  };

  const { dokumenlain, loading, counterDS, statusHapus, status } = useSelector(
    (state) => state.digitalsign
  );

  useEffect(() => {
    setFilterData(dokumenlain.lists);
  }, [dokumenlain]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        dispatch(getCounterDigitalSign({ token: token, tipe: "dokumen_lain" }));
        if (variant === "composer" && currentTab === "DokumenLain") {
          dispatch(
            getListComposer({
              token: token,
              tipe: tipe,
              page: page,
              search: search,
            })
          );
        }
        if (variant === "inprogress" && currentTab === "DokumenLain") {
          dispatch(
            getListInProgress({
              token: token,
              tipe: tipe,
              page: page,
              search: search,
            })
          );
        }
        if (variant === "rejected" && currentTab === "DokumenLain") {
          dispatch(
            getListRejected({
              token: token,
              tipe: tipe,
              page: page,
              search: search,
            })
          );
        }
        if (variant === "draft" && currentTab === "DokumenLain") {
          dispatch(
            getListDraft({
              token: token,
              tipe: tipe,
              page: page,
              search: search,
            })
          );
        }
        if (variant === "signed" && currentTab === "DokumenLain") {
          dispatch(
            getListSignedDigiSign({
              token: token,
              tipe: tipe,
              page: page,
              search: search,
            })
          );
        }
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token, tipe, currentTab, page, search, variant]);

  const { device } = useSelector((state) => state.apps);

  const loadMore = () => {
    if (dokumenlain?.lists?.length !== 0) {
      if (dokumenlain.lists.length % 5 === 0) {
        setPage((prevPage) => prevPage + 10);
      }
    }
  };

  useEffect(() => {
    if (token !== "" && routeCounter?.route?.params.screen !== "DokumenLain") {
      if (variant === "composer" && currentTab === "DokumenLain") {
        dispatch(
          getListComposer({
            token: token,
            tipe: tipe,
            page: page,
            search: search,
          })
        );
      } else if (variant === "ready" && currentTab === "DokumenLain") {
        dispatch(
          getListReady({ token: token, tipe: tipe, page: page, search: search })
        );
      } else if (variant === "completed" && currentTab === "DokumenLain") {
        dispatch(
          getListCompleted({
            token: token,
            tipe: tipe,
            page: page,
            search: search,
          })
        );
      } else if (variant === "inprogress" && currentTab === "DokumenLain") {
        dispatch(
          getListInProgress({
            token: token,
            tipe: tipe,
            page: page,
            search: search,
          })
        );
        dispatch(getCounterDigitalSign({ token: token, tipe: "dokumen_lain" }));
      } else if (variant === "rejected" && currentTab === "DokumenLain") {
        dispatch(
          getListRejected({
            token: token,
            tipe: tipe,
            page: page,
            search: search,
          })
        );
      } else if (variant === "signed" && currentTab === "DokumenLain") {
        dispatch(
          getListSignedDigiSign({
            token: token,
            tipe: tipe,
            page: page,
            search: search,
          })
        );
      }
    }
  }, [page, token, tipe, search, currentTab, isFocus]);

  console.log(variant);

  useEffect(() => {
    if (statusHapus !== "" && currentTab === "DokumenLain") {
      if (statusHapus === "berhasil" && currentTab === "DokumenLain") {
        Alert.alert(
          "Peringatan!",
          "Dokumen berhasil dihapus",
          [
            {
              text: "Ya",
              onPress: () => {
                dispatch(setStatusHapus(""));
                setTimeout(() => {
                  onRefresh();
                }, 3000);
              },
              style: "cencel",
            },
          ],
          {
            cancelable: false,
            onDismiss: () => {},
          }
        );
      } else {
        Alert.alert(
          "Peringatan!",
          "Dokumen gagal dihapus",
          [
            {
              text: "Ya",
              onPress: () => {
                dispatch(setStatusHapus(""));
              },
              style: "cencel",
            },
          ],
          {
            cancelable: false,
            onDismiss: () => {},
          }
        );
      }
    }
  }, [statusHapus]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {loading ? <Loading /> : null}
      <View style={{ position: "relative", flex: 1 }}>
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
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
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
                fontWeight: FONTWEIGHT.bold,
                color: COLORS.white,
              }}
            >
              Dokumen Lain
            </Text>
          </View>
        </View>

        <View
          style={{
            padding: 10,
            borderRadius: 8,
            backgroundColor: COLORS.white,
            marginTop: 16,
            width: "90%",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          {/* <Text
            style={{
              fontWeight: FONTWEIGHT.bold,
              fontSize: fontSizeResponsive("H4", device),
            }}
          >
            Dokumen Lain
          </Text> */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={{
                backgroundColor:
                  variant === "inprogress"
                    ? COLORS.secondaryLighter
                    : COLORS.bgLightGrey,
                borderRadius: 8,
                width: "49%",
                //shadow ios
                shadowOffset: { width: -2, height: 4 },
                shadowColor: "#171717",
                shadowOpacity: 0.2,
                //shadow android
                elevation: 2,
                justifyContent: "center",
                padding: 5,
              }}
              onPress={() => filterHandlerInProgress()}
            >
              <Text
                style={{
                  // marginTop: 10,
                  fontSize: fontSizeResponsive("H4", device),
                  fontWeight: FONTWEIGHT.bold,
                  width: "100%",
                  textAlign: "left",
                }}
              >
                Need Sign
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <View
                  style={{
                    padding: 5,
                    backgroundColor: COLORS.infoDangerLight,
                    borderRadius: 50,
                  }}
                >
                  <MaterialCommunityIcons
                    name={"file-alert-outline"}
                    size={device === "tablet" ? 40 : 30}
                    color={COLORS.infoDanger}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      // fontSize: fontSizeResponsive("H1", device),
                      fontSize: 40,
                    }}
                  >
                    {counterDS?.data?.dokumen_lain_count?.need_sign}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  marginTop: 5,
                  fontSize: fontSizeResponsive("H5", device),
                  color: COLORS.grey,
                  fontWeight: FONTWEIGHT.bold,
                  letterSpacing: -1, // Sesuaikan nilai
                }}
              >
                Dokumen Belum Ditandatangani
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor:
                  variant === "signed"
                    ? COLORS.secondaryLighter
                    : COLORS.bgLightGrey,
                borderRadius: 8,
                width: "49%",
                //shadow ios
                shadowOffset: { width: -2, height: 4 },
                shadowColor: "#171717",
                shadowOpacity: 0.2,
                //shadow android
                elevation: 2,
                justifyContent: "center",
                padding: 5,
              }}
              onPress={() => filterHandlerSigned()}
            >
              <Text
                style={{
                  // marginTop: 10,
                  fontSize: fontSizeResponsive("H4", device),
                  fontWeight: FONTWEIGHT.bold,
                  width: "100%",
                  textAlign: "left",
                }}
              >
                Signed
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <View
                  style={{
                    padding: 5,
                    backgroundColor: COLORS.successLight,
                    borderRadius: 50,
                  }}
                >
                  <MaterialCommunityIcons
                    name={"file-check-outline"}
                    size={device === "tablet" ? 40 : 30}
                    color={COLORS.success}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      // fontSize: fontSizeResponsive("H1", device),
                      fontSize: 40,
                    }}
                  >
                    {counterDS?.data?.dokumen_lain_count?.done}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  marginTop: 5,
                  fontSize: fontSizeResponsive("H5", device),
                  color: COLORS.grey,
                  fontWeight: FONTWEIGHT.bold,
                  letterSpacing: -1, // Sesuaikan nilai
                }}
              >
                Dokumen Sudah Ditandatangani
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "90%", marginHorizontal: "5%", marginTop: 10 }}>
            {/* <Search placeholder={"Cari"} onSearch={filter} /> */}
            <View style={styles.input}>
              <Ionicons
                name="search"
                size={fontSizeResponsive("H3", device)}
                color={COLORS.primary}
              />
              <TextInput
                placeholder={"Cari"}
                placeholderTextColor={COLORS.tertiary}
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  flex: 1,
                }}
                maxLength={30}
                onSubmitEditing={(event) => setSearch(event.nativeEvent.text)}
                clearButtonMode="always"
                allowFontScaling={false}
              />
            </View>
          </View>
        </View>
        {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}> */}
        <View
          style={{
            paddingVertical: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: "5%",
          }}
        >
          <TouchableOpacity
            style={{
              width: device === "tablet" ? "19%" : null,
              padding: 6,
              borderWidth: 1,
              backgroundColor:
                variant === "composer" ? COLORS.primary : COLORS.input,
              borderRadius: 30,
              borderColor: variant === "composer" ? null : COLORS.ExtraDivinder,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => filterHandlerComposer()}
          >
            <Text
              style={{
                color:
                  variant === "composer" ? COLORS.white : COLORS.foundation,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              List Saya
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={{
              width: device === "tablet" ? "19%" : null,

              paddingHorizontal: 6,
              paddingVertical: 6,
              borderWidth: 1,
              backgroundColor:
                variant === "draft" ? COLORS.primary : COLORS.input,
              borderRadius: 30,
              borderColor: variant === "draft" ? null : COLORS.ExtraDivinder,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => filterHandlerDraft()}
          >
            <Text
              style={{
                color: variant === "draft" ? COLORS.white : COLORS.foundation,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Draft
            </Text>
          </TouchableOpacity> */}
          <TouchableOpacity
            style={{
              width: device === "tablet" ? "19%" : null,
              padding: 6,
              borderWidth: 1,
              backgroundColor:
                variant === "inprogress" ? COLORS.primary : COLORS.input,
              borderRadius: 30,
              borderColor:
                variant === "inprogress" ? null : COLORS.ExtraDivinder,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => filterHandlerInProgress()}
          >
            <Text
              style={{
                color:
                  variant === "inprogress" ? COLORS.white : COLORS.foundation,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Need Sign
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: device === "tablet" ? "19%" : null,
              padding: 6,
              borderWidth: 1,
              backgroundColor:
                variant === "rejected" ? COLORS.primary : COLORS.input,
              borderRadius: 30,
              borderColor: variant === "rejected" ? null : COLORS.ExtraDivinder,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => filterHandlerRejected()}
          >
            <Text
              style={{
                color:
                  variant === "rejected" ? COLORS.white : COLORS.foundation,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Rejected
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: device === "tablet" ? "19%" : null,
              padding: 6,
              borderWidth: 1,
              backgroundColor:
                variant === "signed" ? COLORS.primary : COLORS.input,
              borderRadius: 30,
              borderColor: variant === "signed" ? null : COLORS.ExtraDivinder,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => filterHandlerSigned()}
          >
            <Text
              style={{
                color: variant === "signed" ? COLORS.white : COLORS.foundation,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Signed
            </Text>
          </TouchableOpacity>
        </View>
        {/* </ScrollView> */}
        {/* <ModalSubmit
          status={status}
          setStatus={setStatus}
          messageSuccess={"Data berhasil dihapus"}
          navigate={"MainDigitalSign"}
        /> */}
        <View style={{ flex: 1 }}>
          <FlatList
            data={dokumenlain.lists}
            keyExtractor={(item) => item?.id}
            renderItem={({ item }) => (
              <View key={item.id}>
                <ListDokumenLain
                  item={item}
                  token={token}
                  variant={variant}
                  device={device}
                />
              </View>
            )}
            ListEmptyComponent={() => <ListEmpty />}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={{ height: "69%" }}
          />
        </View>

        {/* <TouchableOpacity onPress={() => {
                        navigation.navigate('TambahDokumenLain')
                    }}
                        style={{ position: 'absolute', bottom: 40, right: 30, zIndex: 99 }}
                    >
                        <View style={{ backgroundColor: COLORS.primary, borderRadius: 50, width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}>
                            <Ionicons name='add-outline' size={24} color={COLORS.white} />
                        </View>
                    </TouchableOpacity> */}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  input: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.ExtraDivinder,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
});
