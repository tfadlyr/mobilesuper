import React, { useMemo, useRef } from "react";
import {
  BackHandler,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Text, Image } from "react-native";
import {
  COLORS,
  DATETIME,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";
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
  getListMonitoring,
  getCounterPKRLMonitoring,
} from "../../service/api";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getTokenValue } from "../../service/session";
import { setDigitalSignLists, setStatus } from "../../store/DigitalSign";
import { Loading } from "../../components/Loading";
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

export const PerizinanMenteri = () => {
  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const currentTab = useNavigationState(
    (state) => state.routes[state.index].name
  );
  const { profile } = useSelector((state) => state.superApps);
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [tipe, setTipe] = useState("perizinan-mentri");
  const [variant, SetVariant] = useState("inprogress");
  const [filterData, setFilterData] = useState([]);
  const [isSelected, setSelection] = useState([]);
  const [page, setPage] = useState(10);

  const roleMonitoring = ["MONITORING_DIGITAL_SIGN"];
  const isRoleMonitoring = profile.roles_access?.some((item) =>
    roleMonitoring.includes(item)
  );

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (currentTab === "PerizinanMenteri" && isRoleMonitoring === true) {
      SetVariant("monitoring");
      dispatch(getCounterPKRLMonitoring({ token: token }));
    } else if (
      currentTab === "PerizinanMenteri" &&
      isRoleMonitoring === false
    ) {
      SetVariant("inprogress");
      dispatch(getCounterPerizinanMenteri({ token: token }));
      dispatch(getListInProgress({ token: token, tipe: tipe, search: search }));
    }
  }, [token, tipe]);

  const { dokumenlain, loading, status, counter, counterPKRL } = useSelector(
    (state) => state.digitalsign
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "" && currentTab === "PerizinanMenteri") {
        dispatch(getCounterPerizinanMenteri({ token: token }));
        if (variant === "inprogress") {
          dispatch(
            getListInProgress({ token: token, tipe: tipe, search: search })
          );
        } else if (variant === "signed") {
          dispatch(
            getListSignedDigiSign({ token: token, tipe: tipe, search: search })
          );
        } else if (variant === "retry") {
          dispatch(
            getListRetry({
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

  const bottomSheetAttachClose = () => {
    if (bottomSheetModalRef.current) bottomSheetModalRef.current?.close();
  };

  const currentDate = new Date();

  const handleBiometricAuth = async () => {
    // Check if hardware supports biometrics
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    // Fallback to default authentication method (password) if Fingerprint is not available
    if (!isBiometricAvailable) return handleSubmit();

    // Check Biometrics types available (Fingerprint, Facial recognition, Iris recognition)
    let supportedBiometrics;
    if (isBiometricAvailable)
      supportedBiometrics =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

    // Check Biometrics are saved locally in user's device
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics) return handleSubmit();

    // Authenticate use with Biometrics (Fingerprint, Facial recognition, Iris recognition)

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login with Biometrics",
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    });
    // Log the user in on success
    if (biometricAuth.success) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const payload = {
      passphrase: "",
      id_documents: isSelected,
      sign_date: moment(currentDate, "YYYY-MM-DD HH:mm:ss").format(
        DATETIME.LONG_DATE
      ),
      comment: "Dokumen sudah di tanda tangan",
    };
    const data = {
      token: token,
      payload: payload,
    };
    dispatch(tandaTanganMentri(data));
  };

  const checkAll = () => {
    // Check If isSelected already exists (length !== 0)
    if (isSelected.length === dokumenlain.lists.length) {
      setSelection([]);
    }
    // If isSelected still empty or all data hasn't checked
    else {
      let tmp = [];
      dokumenlain.lists.map((item) => {
        tmp.push(item?.id);
      });
      setSelection(tmp);
    }
  };

  const filterHandlerInProgress = () => {
    SetVariant("inprogress");
    dispatch(getListInProgress({ token: token, tipe: tipe, search: search }));
  };

  const filterHandlerSigned = () => {
    SetVariant("signed");
    dispatch(
      getListSignedDigiSign({ token: token, tipe: tipe, search: search })
    );
  };

  const filterHandlerRetry = () => {
    SetVariant("retry");
    dispatch(
      getListRetry({ token: token, tipe: tipe, page: page, search: search })
    );
  };

  const { device } = useSelector((state) => state.apps);

  const loadMore = () => {
    if (dokumenlain?.lists?.length !== 0) {
      if (dokumenlain.lists.length % 5 === 0) {
        setPage((prevPage) => prevPage + 10);
      }
    }
  };

  useEffect(() => {
    if (variant === "inprogress" && currentTab === "PerizinanMenteri") {
      dispatch(
        getListInProgress({
          token: token,
          tipe: tipe,
          page: page,
          search: search,
        })
      );
    } else if (variant === "signed" && currentTab === "PerizinanMenteri") {
      dispatch(
        getListSignedDigiSign({
          token: token,
          tipe: tipe,
          page: page,
          search: search,
        })
      );
    } else if (variant === "retry" && currentTab === "PerizinanMenteri") {
      dispatch(
        getListRetry({ token: token, tipe: tipe, page: page, search: search })
      );
    } else if (variant === "monitoring" && currentTab === "PerizinanMenteri") {
      dispatch(
        getListMonitoring({
          token: token,
          tipe: "dokumen_esea",
          page: page,
          search: search,
        })
      );
    }
  }, [page, token, tipe, search, currentTab]);

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
                  marginLeft: isSelected.length === 0 ? null : 50,
                }}
              >
                Perizinan Menteri
              </Text>
            </View>
            {isSelected.length !== 0 ? (
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
                <TouchableOpacity
                  onPress={() => {
                    bottomSheetAttach();
                  }}
                >
                  <Ionicons
                    name="checkmark-outline"
                    size={device === "tablet" ? 30 : 18}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>

          {/* <View style={{ flexDirection: "row", gap: 10 }}>
            <View
              style={{ width: "90%", marginHorizontal: "5%", marginTop: 20 }}
            >
              <Search placeholder={"Cari"} onSearch={filter} />
            </View>
          </View> */}

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
              padding: 10,
              borderRadius: 8,
              backgroundColor: COLORS.white,
              marginTop: 10,
              width: "90%",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Dokumen Perizinan Menteri
            </Text>
            <View style={{ flexDirection: "row", gap: 5, marginTop: 10 }}>
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
                disabled={variant === "monitoring" ? true : false}
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
                      {variant !== "monitoring"
                        ? counter?.data?.need_sign
                        : counterPKRL?.data?.esea?.total_in_progress}
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
                disabled={variant === "monitoring" ? true : false}
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
                      {variant !== "monitoring"
                        ? counter?.data?.done
                        : counterPKRL?.data?.esea?.total_done}
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

          {variant !== "monitoring" ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "white",
                marginHorizontal: "5%",
                width: "90%",
                padding: 16,
                marginTop: 10,
                alignItems: "center",
                borderRadius: 8,
              }}
            >
              {variant === "inprogress" &&
                profile.nip !== "197208122001121002" && (
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    {/* Checkbox All */}
                    <Checkbox
                      value={dokumenlain?.lists?.length === isSelected?.length}
                      onValueChange={() => checkAll()}
                      color={isSelected === true ? COLORS.lighter : null}
                    />
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
                      Pilih Semua
                    </Text>
                  </View>
                )}

              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                }}
              >
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
                      variant === "retry" ? COLORS.primary : COLORS.input,
                    borderRadius: 30,
                    borderColor:
                      variant === "retry" ? null : COLORS.ExtraDivinder,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => filterHandlerRetry()}
                >
                  <Text
                    style={{
                      color:
                        variant === "retry" ? COLORS.white : COLORS.foundation,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Retry
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
          {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}> */}

          {/* </ScrollView> */}
          <View style={{ flex: 1 }}>
            <FlatList
              data={dokumenlain?.lists}
              keyExtractor={(item) => item?.id}
              renderItem={({ item }) => (
                <View key={item.id}>
                  <CardListPerizinanMenteri
                    item={item}
                    token={token}
                    variant={variant}
                    device={device}
                    isSelected={isSelected}
                    setSelection={setSelection}
                    nip={profile.nip}
                  />
                </View>
              )}
              ListEmptyComponent={() => <ListEmpty />}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </View>

          <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={animatedSnapPoints}
            handleHeight={animatedHandleHeight}
            contentHeight={animatedContentHeight}
            index={0}
            style={{ borderRadius: 50 }}
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjust"
            backdropComponent={({ style }) => (
              <View
                style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}
              />
            )}
          >
            <BottomSheetView onLayout={handleContentLayout}>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
              >
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      marginHorizontal: 20,
                      marginTop: 20,
                    }}
                  >
                    <TouchableOpacity onPress={() => bottomSheetAttachClose()}>
                      <Ionicons name="chevron-back-outline" size={24} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H1", device),
                          fontWeight: 500,
                        }}
                      >
                        Tanda Tangan Dokumen
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={{
                      width: "90%",
                      backgroundColor: COLORS.danger,
                      height: 50,
                      borderRadius: 6,
                      alignItems: "center",
                      marginHorizontal: 20,
                      justifyContent: "center",
                      marginTop: 10,
                    }}
                    onPress={() => {
                      bottomSheetAttachClose();
                      {
                        setTimeout(() => {
                          // handleSubmit();
                          handleBiometricAuth();
                        }, 2000);
                      }
                      setSelection([]);
                      // SetVariant("signed");
                      // setParaphrase("");
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.white,
                        fontSize: fontSizeResponsive("H1", device),
                        fontWeight: 500,
                      }}
                    >
                      Tanda Tangan
                    </Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </BottomSheetView>
          </BottomSheetModal>

          {/* <TouchableOpacity onPress={() => {
                      navigation.navigate('TambahDokumenLain')
                  }}
                      style={{ position: 'absolute', bottom: 40, right: 30, zIndex: 99 }}
                  >
                      <View style={{ backgroundColor: COLORS.primary, borderRadius: 50, width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}>
                          <Ionicons name='add-outline' size={24} color={COLORS.white} />
                      </View>
                  </TouchableOpacity> */}

          <ModalSubmit
            status={status}
            setStatus={setStatus}
            messageSuccess={"Data Ditambahkan"}
            navigate={"PerizinanMenteri"}
          />
        </View>
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
    width: "90%",
    marginHorizontal: "5%",
    marginTop: 10,
  },
});
