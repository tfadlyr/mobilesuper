import React, { useMemo, useRef } from "react";
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { Text, Image } from "react-native";
import {
  COLORS,
  DATETIME,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
  getOrientation,
} from "../../config/SuperAppps";
import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
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
  tandaTanganMentri,
  getListRetry,
  getCounterPerizinanMenteri,
  getListTrack,
  getCounterPKRL,
  getListMonitoring,
  getCounterPKRLMonitoring,
} from "../../service/api";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getTokenValue } from "../../service/session";
import {
  resetDetail,
  resetList,
  setDigitalSignLists,
  setStatus,
} from "../../store/DigitalSign";
import { RefreshControl } from "react-native";
import { Config } from "../../constants/config";
import { CardListPerizinanMenteri } from "../../components/CardlistPerizinanMenteri";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { ModalSubmit } from "../../components/ModalSubmit";
import moment from "moment";
import * as LocalAuthentication from "expo-local-authentication";
import { CardListPKRL } from "../../components/CardListPKRL";
import { CollapsePKRLSigned } from "../../components/CollapsePKRLSigned";
import { CollapsePKRLSignIn } from "../../components/CollapsePKRLSignIn";
import { Loading } from "../../components/Loading";
import { current } from "@reduxjs/toolkit";

export const PKRL = ({ route }) => {
  const routeCounter = route?.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const currentTab = useNavigationState(
    (state) => state.routes[state.index].name
  );
  const [token, setToken] = useState("");
  const [search, setSearch] = useState("");
  const [tipe, setTipe] = useState("dokumen_pkrl");
  const [dashboard, setDashboard] = useState("dashboard");
  const [variant, SetVariant] = useState("");
  const [isSelected, setSelection] = useState([]);
  const [filterDirektorat, setFilterDirektorat] = useState("");
  const [filterDirektoratSigned, setFilterDirektoratSigned] = useState("");
  const [page, setPage] = useState(10);
  const isFocus = useIsFocused();
  const { profile } = useSelector((state) => state.superApps);

  const rolePerizinanOperator = ["OPERATOR_PERIZINAN_MENTERI"];
  const roleMonitoring = ["MONITORING_DIGITAL_SIGN"];

  const isRolePerizinanOperator = profile.roles_access?.some((item) =>
    rolePerizinanOperator.includes(item)
  );

  const isRoleMonitoring = profile.roles_access?.some((item) =>
    roleMonitoring.includes(item)
  );

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  const { dokumenlain, loading, counterPKRL } = useSelector(
    (state) => state.digitalsign
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "" && currentTab === "PKRL") {
        dispatch(getCounterPKRL({ token: token, dashboard: dashboard }));
        if (variant === "inprogress") {
          dispatch(
            getListInProgress({
              token: token,
              tipe: tipe,
              search: search,
              filter: filterDirektorat,
            })
          );
        } else if (variant === "signed") {
          dispatch(
            getListSignedDigiSign({
              token: token,
              tipe: tipe,
              search: search,
              filter: filterDirektoratSigned,
            })
          );
        } else if (variant === "composer") {
          dispatch(
            getListComposer({
              token: token,
              tipe: tipe,
              page: page,
              search: search,
            })
          );
        } else if (variant === "track") {
          dispatch(
            getListTrack({
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

  const bottomSheetModalRef = useRef(null);
  const initialSnapPoints = useMemo(() => ["25%"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetAttach = () => {
    bottomSheetModalRef.current?.present();
  };

  const filterHandlerInProgress = (filterDashboard) => {
    if (filterDashboard !== undefined) {
      setFilterDirektorat(filterDashboard);
    } else {
      setFilterDirektorat("");
    }
    setFilterDirektoratSigned("");
    SetVariant("inprogress");
    dispatch(
      getListInProgress({
        token: token,
        tipe: tipe,
        search: search,
        filter: filterDashboard === undefined ? "" : filterDashboard,
      })
    );
    navigation.setParams({ route: undefined }); // Atur ke undefined
  };

  const filterHandlerSigned = (filterDashboard) => {
    if (filterDashboard !== undefined) {
      setFilterDirektoratSigned(filterDashboard);
    } else {
      setFilterDirektoratSigned("");
    }
    setFilterDirektorat("");
    SetVariant("signed");
    dispatch(
      getListSignedDigiSign({
        token: token,
        tipe: tipe,
        search: search,
        filter: filterDashboard == undefined ? "" : filterDashboard,
      })
    );
    navigation.setParams({ route: undefined }); // Atur ke undefined
  };

  const filterHandlerTrack = () => {
    SetVariant("track");
    setFilterDirektorat("");
    setFilterDirektoratSigned("");
    dispatch(getListTrack({ token: token, tipe: tipe, search: search }));
    navigation.setParams({ route: undefined }); // Atur ke undefined
  };

  const filterHandlerRetry = () => {
    SetVariant("composer");
    setFilterDirektorat("");
    setFilterDirektoratSigned("");
    dispatch(
      getListComposer({ token: token, tipe: tipe, page: page, search: search })
    );
    navigation.setParams({ route: undefined }); // Atur ke undefined
  };

  const { device } = useSelector((state) => state.apps);

  const loadMore = () => {
    if (dokumenlain?.lists?.length !== 0) {
      if (dokumenlain.lists.length % 10 === 0) {
        setPage((prevPage) => prevPage + 10);
      }
    }
  };

  useEffect(() => {
    let variant = "";
    if (isRolePerizinanOperator) {
      variant = "composer";
    } else if (isRoleMonitoring) {
      variant = "monitoring";
    } else {
      variant = "inprogress";
    }

    SetVariant(variant);
  }, []);

  useEffect(() => {
    if (token !== "" && variant !== "") {
      let filterDirektorat = "";
      if (routeCounter) {
        filterDirektorat = routeCounter?.route?.params?.direktorat;
      }

      if (
        currentTab === "PKRL" &&
        routeCounter?.route?.params?.screen === "PKRL" &&
        isRoleMonitoring == false
      ) {
        dispatch(getCounterPKRL({ token: token, dashboard: dashboard }));
        filterHandlerInProgress(routeCounter?.route?.params?.direktorat);
        console.log("masuk bukan monitoring");
      } else if (currentTab === "PKRL" && isRoleMonitoring === true) {
        dispatch(getCounterPKRLMonitoring({ token: token }));
        console.log("masuk  monitoring");
        dispatch(
          getListMonitoring({
            token: token,
            tipe: tipe,
            page: page,
            search: search,
          })
        );
      } else if (currentTab === "PKRL") {
        dispatch(getCounterPKRL({ token: token, dashboard: dashboard }));
        console.log("masuk bukan monitoring 2");
      }

      if (routeCounter?.route?.params?.screen !== "PKRL") {
        if (variant === "inprogress" && currentTab === "PKRL") {
          dispatch(
            getListInProgress({
              token: token,
              tipe: tipe,
              page: page,
              search: search,
              filter: filterDirektorat,
            })
          );
        } else if (variant === "signed" && currentTab === "PKRL") {
          dispatch(
            getListSignedDigiSign({
              token: token,
              tipe: tipe,
              page: page,
              search: search,
              filter: filterDirektoratSigned,
            })
          );
        } else if (variant === "composer" && currentTab === "PKRL") {
          dispatch(
            getListComposer({
              token: token,
              tipe: tipe,
              page: page,
              search: search,
            })
          );
        } else if (variant === "track" && currentTab === "PKRL") {
          dispatch(
            getListTrack({
              token: token,
              tipe: tipe,
              page: page,
              search: search,
            })
          );
        }
      }
    }
  }, [page, token, search, currentTab, isFocus]);

  console.log(variant);
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
      <BottomSheetModalProvider>
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
                Perizinan Menteri
              </Text>
            </View>
            {/* {isSelected.length !== 0 ? (
              <View
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 20,
                  width: 28,
                  height: 28,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    bottomSheetAttach();
                  }}
                >
                  <Ionicons
                    name="checkmark-outline"
                    size={18}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            ) : null} */}
          </View>

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

          <View
            style={{
              marginTop: 10,
              marginHorizontal: "5%",
              flexDirection: "row",
              gap:
                device === "tablet" && orientation === "potrait"
                  ? 5
                  : device === "tablet" && orientation === "landscape"
                  ? 10
                  : 3,
            }}
          >
            <View style={{ width: "49.5%" }}>
              <CollapsePKRLSignIn
                device={device}
                counter={counterPKRL}
                filterHandlerInProgress={filterHandlerInProgress}
                filterDirektorat={filterDirektorat}
                variant={variant}
              />
            </View>
            <View style={{ width: "49.5%" }}>
              <CollapsePKRLSigned
                device={device}
                counter={counterPKRL}
                filterHandlerSigned={filterHandlerSigned}
                filterDirektoratSigned={filterDirektoratSigned}
                variant={variant}
              />
            </View>
          </View>

          {variant !== "monitoring" ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "white",
                marginHorizontal: "5%",
                padding: 16,
                marginTop: 10,
                alignItems: "center",
                borderRadius: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                }}
              >
                {isRolePerizinanOperator ? (
                  <TouchableOpacity
                    style={{
                      padding: 5,
                      borderWidth: 1,
                      backgroundColor:
                        variant === "composer" ? COLORS.primary : COLORS.input,
                      borderRadius: 30,
                      borderColor:
                        variant === "composer" ? null : COLORS.ExtraDivinder,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => filterHandlerRetry()}
                  >
                    <Text
                      style={{
                        color:
                          variant === "composer"
                            ? COLORS.white
                            : COLORS.foundation,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      List saya
                    </Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  style={{
                    padding: 5,
                    borderWidth: 1,
                    backgroundColor:
                      variant === "track" ? COLORS.primary : COLORS.input,
                    borderRadius: 30,
                    borderColor:
                      variant === "track" ? null : COLORS.ExtraDivinder,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => filterHandlerTrack()}
                >
                  <Text
                    style={{
                      color:
                        variant === "track" ? COLORS.white : COLORS.foundation,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    In Progress
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    padding: 5,
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
                        variant === "inprogress"
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
                    padding: 5,
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
            </View>
          ) : null}

          <View style={{ flex: 1 }}>
            <FlatList
              data={dokumenlain?.lists}
              keyExtractor={(item) => item?.id}
              renderItem={({ item }) => (
                <CardListPKRL
                  item={item}
                  token={token}
                  variant={variant}
                  device={device}
                  isSelected={isSelected}
                  setSelection={setSelection}
                  nip={profile.nip}
                />
              )}
              ListEmptyComponent={() => <ListEmpty />}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </View>
        </View>

        {/* <TouchableOpacity
          style={{ position: "absolute", right: 10, top: "85%" }}
          onPress={() => {
            dispatch(resetDetail());
            navigation.navigate("TambahDokumenPerizinan", {
              itemId: "",
            });
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: 50,
              padding: device === "tablet" ? 20 : 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="add"
              size={device === "tablet" ? 35 : 24}
              color={COLORS.white}
            />
          </View>
        </TouchableOpacity> */}
      </BottomSheetModalProvider>
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
    marginHorizontal: "5%",
    marginTop: 10,
  },
});
