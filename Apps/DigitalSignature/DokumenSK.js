import React, { useMemo, useRef } from "react";
import {
  BackHandler,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { Text, Image } from "react-native";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
  getOrientation,
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
  getListInbox,
  getListNeedSignSK,
  getListNeedApproveSK,
  getCounterDigitalSign,
  getCounterSK,
} from "../../service/api";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getTokenValue } from "../../service/session";
import { setDigitalSignLists } from "../../store/DigitalSign";
import { Loading } from "../../components/Loading";
import { RefreshControl } from "react-native";
import { Config } from "../../constants/config";
import { CardListDokumenSK } from "../../components/CardListDokumenSK";

export const DokumenSK = ({ route }) => {
  const routeCounter = route?.params;
  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [tipe, setTipe] = useState("dokumen_sk");
  const [variant, SetVariant] = useState("composer");
  const [filterData, setFilterData] = useState([]);
  const [page, setPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const isFocus = useIsFocused();

  const { profile } = useSelector((state) => state.superApps);

  const roleSK = ["APPROVER.DIGISIGN.SK"];
  const roleIsCreateSK = ["DIGISIGN.SK"];

  const isRoleSK = profile.roles_access?.some((item) => roleSK.includes(item));
  const isRoleCreateSK = profile.roles_access?.some((item) =>
    roleIsCreateSK.includes(item)
  );

  const currentTab = useNavigationState(
    (state) => state.routes[state.index].name
  );

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (
      currentTab === "DokumenSK" &&
      (isRoleSK || isRoleCreateSK) &&
      routeCounter?.route?.params?.screen === "DokumenSK"
    ) {
      SetVariant("sk-need-sign");
      dispatch(
        getListNeedSignSK({
          token: token,
          tipe: tipe,
          page: page,
          search: search,
        })
      );
      console.log("masuk");
      dispatch(getCounterSK({ token: token, tipe: "dokumen_sk" }));
    } else if (currentTab === "DokumenSK" && isRoleSK) {
      dispatch(
        getListComposer({
          token: token,
          tipe: tipe,
          page: page,
          search: search,
        })
      );
      dispatch(getCounterSK({ token: token, tipe: "dokumen_sk" }));
    } else {
      SetVariant("sk-completed");
      getListInbox({
        token: token,
        tipe: tipe,
        page: page,
        search: search,
      });
      dispatch(getCounterSK({ token: token, tipe: "dokumen_sk" }));
    }
  }, [token, tipe, currentTab, search, routeCounter]);

  const filterHandlerComposer = () => {
    SetVariant("composer");
    dispatch(
      getListComposer({ token: token, tipe: tipe, page: page, search: search })
    );
  };
  const filterHandlerInbox = () => {
    SetVariant("sk-completed");
    dispatch(
      getListInbox({ token: token, tipe: tipe, page: page, search: search })
    );
  };
  const filterHandlerNeedSign = () => {
    SetVariant("sk-need-sign");
    dispatch(
      getListNeedSignSK({
        token: token,
        tipe: tipe,
        page: page,
        search: search,
      })
    );
  };
  const filterHandlerNeedApprove = () => {
    SetVariant("sk-need-approval");
    dispatch(
      getListNeedApproveSK({
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
  const { dokumenlain, loading, counterDSSK } = useSelector(
    (state) => state.digitalsign
  );
  useEffect(() => {
    setFilterData(dokumenlain.lists);
  }, [dokumenlain]);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        if (variant === " composer" && currentTab === "DokumenSK") {
          dispatch(
            getListComposer({
              token: token,
              tipe: tipe,
              page: page,
              search: search,
            })
          );
          dispatch(getCounterSK({ token: token, tipe: "dokumen_sk" }));
        }
        if (variant === "sk-need-sign" && currentTab === "DokumenSK") {
          dispatch(
            getListNeedSignSK({
              token: token,
              tipe: tipe,
              page: page,
              search: search,
            })
          );
        }
        if (variant === "sk-need-approval" && currentTab === "DokumenSK") {
          dispatch(
            getListNeedApproveSK({
              token: token,
              tipe: tipe,
              page: page,
              search: search,
            })
          );
        }
        if (variant === "rejected" && currentTab === "DokumenSK") {
          dispatch(
            getListRejected({
              token: token,
              tipe: tipe,
              page: page,
              search: search,
            })
          );
        }
        if (variant === "draft" && currentTab === "DokumenSK") {
          dispatch(
            getListDraft({
              token: token,
              tipe: tipe,
              page: page,
              search: search,
            })
          );
        }
        if (variant === "signed" && currentTab === "DokumenSK") {
          dispatch(
            getListSignedDigiSign({
              token: token,
              tipe: tipe,
              page: page,
              search: search,
            })
          );
        }
        if (variant === "sk-completed" && currentTab === "DokumenSK") {
          dispatch(
            getListInbox({
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
  }, [token, tipe, currentTab, variant]);

  const loadMore = () => {
    if (dokumenlain?.lists?.length !== 0) {
      if (dokumenlain.lists.length % 5 === 0) {
        setPage((prevPage) => prevPage + 10);
      }
    }
  };

  useEffect(() => {
    if (variant === "composer" && currentTab === "DokumenSK") {
      dispatch(
        getListComposer({
          token: token,
          tipe: tipe,
          page: page,
          search: search,
        })
      );
    } else if (variant === "ready" && currentTab === "DokumenSK") {
      dispatch(
        getListReady({ token: token, tipe: tipe, page: page, search: search })
      );
    } else if (variant === "sk-need-sign" && currentTab === "DokumenSK") {
      dispatch(
        getListNeedSignSK({
          token: token,
          tipe: tipe,
          page: page,
          search: search,
        })
      );
    } else if (variant === "sk-need-approval" && currentTab === "DokumenSK") {
      dispatch(
        getListNeedApproveSK({
          token: token,
          tipe: tipe,
          page: page,
          search: search,
        })
      );
    } else if (variant === "rejected" && currentTab === "DokumenSK") {
      dispatch(
        getListRejected({
          token: token,
          tipe: tipe,
          page: page,
          search: search,
        })
      );
    } else if (variant === "signed" && currentTab === "DokumenSK") {
      dispatch(
        getListSignedDigiSign({
          token: token,
          tipe: tipe,
          page: page,
          search: search,
        })
      );
    } else if (variant === "sk-completed" && currentTab === "DokumenSK") {
      dispatch(
        getListInbox({
          token: token,
          tipe: tipe,
          page: page,
          search: search,
        })
      );
    }
  }, [page, token, tipe, search, currentTab, isFocus]);
  const { device } = useSelector((state) => state.apps);

  console.log(variant, "sk");

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

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
              Dokumen Surat Keputusan
            </Text>
          </View>
        </View>

        {isRoleSK === true || isRoleCreateSK === true ? (
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
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    variant === "sk-need-sign"
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
                onPress={() => filterHandlerNeedSign()}
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
                      {counterDSSK?.data?.sk_count?.need_sign}
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
                      {counterDSSK?.data?.sk_count?.done}
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
        ) : null}

        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "90%", marginHorizontal: "5%", marginTop: 20 }}>
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

        {isRoleSK === true || isRoleCreateSK === true ? (
          <ScrollView
            horizontal={true}
            style={{
              maxHeight: device === "tablet" ? 100 : 50,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                display: "flex",
                alignItems: "center",
                marginHorizontal:
                  device == "tablet" && orientation === "potrait"
                    ? 50
                    : device == "tablet" && orientation === "landscape"
                    ? 70
                    : 20,
              }}
            >
              <TouchableOpacity
                style={{
                  padding: device === "tablet" ? 10 : 5,
                  borderWidth: 1,
                  backgroundColor:
                    variant === "composer" ? COLORS.primary : COLORS.input,
                  borderRadius: 30,
                  borderColor:
                    variant === "composer" ? null : COLORS.ExtraDivinder,
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

              <TouchableOpacity
                style={{
                  padding: device === "tablet" ? 10 : 5,
                  borderWidth: 1,
                  backgroundColor:
                    variant === "sk-completed" ? COLORS.primary : COLORS.input,
                  borderRadius: 30,
                  borderColor:
                    variant === "sk-completed" ? null : COLORS.ExtraDivinder,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => filterHandlerInbox()}
              >
                <Text
                  style={{
                    color:
                      variant === "sk-completed"
                        ? COLORS.white
                        : COLORS.foundation,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Inbox
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  padding: device === "tablet" ? 10 : 5,
                  borderWidth: 1,
                  backgroundColor:
                    variant === "draft" ? COLORS.primary : COLORS.input,
                  borderRadius: 30,
                  borderColor:
                    variant === "draft" ? null : COLORS.ExtraDivinder,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => filterHandlerDraft()}
              >
                <Text
                  style={{
                    color:
                      variant === "draft" ? COLORS.white : COLORS.foundation,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Draft
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: device === "tablet" ? 10 : 5,
                  borderWidth: 1,
                  backgroundColor:
                    variant === "sk-need-sign" ? COLORS.primary : COLORS.input,
                  borderRadius: 30,
                  borderColor:
                    variant === "sk-need-sign" ? null : COLORS.ExtraDivinder,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => filterHandlerNeedSign()}
              >
                <Text
                  style={{
                    color:
                      variant === "sk-need-sign"
                        ? COLORS.white
                        : COLORS.foundation,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Need Sign
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  padding: device === "tablet" ? 10 : 5,
                  borderWidth: 1,
                  backgroundColor:
                    variant === "sk-need-approval"
                      ? COLORS.primary
                      : COLORS.input,
                  borderRadius: 30,
                  borderColor:
                    variant === "sk-need-approval"
                      ? null
                      : COLORS.ExtraDivinder,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => filterHandlerNeedApprove()}
              >
                <Text
                  style={{
                    color:
                      variant === "sk-need-approval"
                        ? COLORS.white
                        : COLORS.foundation,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Need Approval
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: device === "tablet" ? 10 : 5,
                  borderWidth: 1,
                  backgroundColor:
                    variant === "rejected" ? COLORS.primary : COLORS.input,
                  borderRadius: 30,
                  borderColor:
                    variant === "rejected" ? null : COLORS.ExtraDivinder,
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
                  padding: device === "tablet" ? 10 : 5,
                  borderWidth: 1,
                  backgroundColor:
                    variant === "signed" ? COLORS.primary : COLORS.input,
                  borderRadius: 30,
                  borderColor:
                    variant === "signed" ? null : COLORS.ExtraDivinder,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => filterHandlerSigned()}
              >
                <Text
                  style={{
                    color:
                      variant === "signed" ? COLORS.white : COLORS.foundation,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Signed
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : null}

        <View style={{ flex: 1 }}>
          <FlatList
            data={dokumenlain.lists}
            keyExtractor={(item) => item?.id}
            renderItem={({ item }) => (
              <View key={item.id}>
                <CardListDokumenSK
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
            nestedScrollEnabled={true}
          />
        </View>
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
