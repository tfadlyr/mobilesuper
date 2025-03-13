import React, { useCallback, useMemo, useRef } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Text, Image } from "react-native";
import {
  COLORS,
  DATETIME,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import {
  useFocusEffect,
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
  tandaTanganMentri,
  getCounterProdukHukum,
  getListProdukHukum,
} from "../../service/api";
import { getTokenValue } from "../../service/session";
import { Loading } from "../../components/Loading";
import { RefreshControl } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { ModalSubmit } from "../../components/ModalSubmit";
import moment from "moment";
import * as LocalAuthentication from "expo-local-authentication";
import { CardListProdukHukum } from "../../components/CardlistProdukHukum";
import { Dropdown } from "../../components/DropDown";
import { setCounterCat } from "../../store/ProdukHukum";

export const ProdukHukum = ({ route }) => {
  const routeCounter = route.params;
  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [variant, setVariant] = useState(
    profile?.nip == "88888"
      ? { key: "paraf", value: "Perlu Disetujui" }
      : {
          key: "monitoring",
          value: "Monitoring",
        }
  );
  const [isSelected, setSelection] = useState([]);
  const [page, setPage] = useState(10);

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      dispatch(getCounterProdukHukum({ token: token, category: counterCat }));
      dispatch(
        getListProdukHukum({
          token: token,
          tipe: variant?.key,
          page: page,
          search: search,
        })
      );
    }, [variant])
  );

  useEffect(() => {
    if (profile?.roles_access?.includes("UPLOAD.PRODUK.HUKUM")) {
      setIsConseptor(true);
      dispatch(setCounterCat(1));
      dispatch(getCounterProdukHukum({ token: token, category: 1 }));
      setVariant({ key: "revision", value: "Perlu Revisi" });
    } else {
      setIsConseptor(false);
      dispatch(setCounterCat(0));
      dispatch(getCounterProdukHukum({ token: token, category: 0 }));
      profile?.nip == "88888"
        ? setVariant({ key: "paraf", value: "Perlu Disetujui" })
        : setVariant({
            key: "monitoring",
            value: "Monitoring",
          });
    }
    dispatch(
      getListProdukHukum({
        token: token,
        tipe: variant?.key,
        page: page,
        search: search,
      })
    );
  }, [token]);

  useEffect(() => {
    if (routeCounter?.route === "ProdukHukum") {
      filterHandler({ key: "need-sign", value: "Perlu TTDE" });
    }
  }, [route, token, page, search]);

  const [isConceptor, setIsConseptor] = useState(false);
  const { lists, loading, status, counter, counterCat } = useSelector(
    (state) => state.produkHukum
  );
  const [refreshing, setRefreshing] = useState(false);
  const dropdownConceptor = [
    { key: "revision", value: "Perlu Revisi" },
    { key: "monitoring", value: "Monitoring" },
    { key: "signed", value: "Selesai" },
  ];
  const dropdownMenKP = [
    { key: "paraf", value: "Perlu Disetujui" },
    { key: "need-sign", value: "Perlu TTDE" },
    // { key: "monitoring", value: "Monitoring" },
    { key: "signed", value: "Selesai" },
  ];
  const dropdownDefault = [
    { key: "paraf", value: "Paraf" },
    { key: "monitoring", value: "Monitoring" },
    { key: "signed", value: "Selesai" },
  ];

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        dispatch(getCounterProdukHukum({ token: token, category: counterCat }));
      }
    } catch (error) {}
    setSearch("");
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token, variant]);

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
    if (isSelected.length === lists.length) {
      setSelection([]);
    }
    // If isSelected still empty or all data hasn't checked
    else {
      let tmp = [];
      lists.map((item) => {
        tmp.push(item?.id);
      });
      setSelection(tmp);
    }
  };

  const filterHandler = (item) => {
    setVariant(item);
    dispatch(
      getListProdukHukum({
        token: token,
        tipe: item?.key,
        page: page,
        search: search,
      })
    );
  };

  const { profile } = useSelector((state) => state.superApps);

  const { device } = useSelector((state) => state.apps);

  const loadMore = () => {
    if (lists?.length !== 0) {
      if (lists.length % 5 === 0) {
        setPage((prevPage) => prevPage + 10);
      }
    }
  };
  useEffect(() => {
    dispatch(
      getListProdukHukum({
        token: token,
        tipe: variant?.key,
        page: page,
        search: search,
      })
    );
  }, [page, variant, token, search]);

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
                Produk Hukum
              </Text>
            </View>
            {isSelected.length !== 0 ? (
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
              defaultValue={search}
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
              borderRadius: 8,
              marginTop: 10,
              padding: 10,
              marginHorizontal: 16,
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: "wrap",
              minHeight: device === "tablet" ? 120 : 100,
              backgroundColor: COLORS.white,
              rowGap: 10,
            }}
          >
            {/* <View
              style={{
                flexDirection: "row",
                gap: 5,
                justifyContent: "space-between",
                flexWrap: "wrap",
                minHeight: 100,
                backgroundColor: COLORS.info,
              }}
            > */}
            {counterCat != 1 && (
              <View
                style={{
                  flexDirection: "column",
                  width:
                    device === "tablet" &&
                    counterCat != 1 &&
                    profile?.nip !== "88888"
                      ? "30%"
                      : device === "tablet" &&
                        profile?.nip === "88888" &&
                        counterCat != 1
                      ? "30%"
                      : "48%",
                  height: device === "tablet" ? 130 : 100,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor:
                      variant?.key === "paraf"
                        ? COLORS.secondaryLighter
                        : COLORS.bgLightGrey,
                    borderRadius: 8,
                    flex: 1,
                    //shadow ios
                    shadowOffset: { width: -2, height: 4 },
                    shadowColor: "#171717",
                    shadowOpacity: 0.2,
                    //shadow android
                    elevation: 2,
                    padding: 8,
                    display: "flex",
                  }}
                  onPress={() =>
                    filterHandler({
                      key: "paraf",
                      value:
                        profile?.nip == "88888" ? "Perlu Disetujui" : "Paraf",
                    })
                  }
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        // marginTop: 10,
                        fontSize: fontSizeResponsive("H5", device),
                        fontWeight: FONTWEIGHT.bold,
                        width: "100%",
                        textAlign: "left",
                      }}
                    >
                      Perlu {profile?.nip == "88888" ? "Disetujui" : "Paraf"}
                    </Text>
                  </View>
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
                        backgroundColor: COLORS.warningLight,
                        borderRadius: 50,
                      }}
                    >
                      <MaterialCommunityIcons
                        name={"file-alert-outline"}
                        size={device === "tablet" ? 40 : 30}
                        color={COLORS.warning}
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
                        {counter?.data?.paraf}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            {profile?.nip == "88888" && (
              <View
                style={{
                  flexDirection: "column",
                  width:
                    device === "tablet" &&
                    counterCat != 1 &&
                    profile?.nip !== "88888"
                      ? "30%"
                      : device === "tablet" &&
                        profile?.nip === "88888" &&
                        counterCat != 1
                      ? "30%"
                      : "48%",
                  height: device === "tablet" ? 130 : 100,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor:
                      variant?.key === "need-sign"
                        ? COLORS.secondaryLighter
                        : COLORS.bgLightGrey,
                    borderRadius: 8,
                    flex: 1,
                    //shadow ios
                    shadowOffset: { width: -2, height: 4 },
                    shadowColor: "#171717",
                    shadowOpacity: 0.2,
                    //shadow android
                    elevation: 2,
                    padding: 8,
                    display: "flex",
                  }}
                  onPress={() =>
                    filterHandler({ key: "need-sign", value: "Perlu TTDE" })
                  }
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
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
                      Perlu TTDE
                    </Text>
                  </View>
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
                        {counter?.data?.need_sign}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            {profile?.nip != "88888" && (
              <View
                style={{
                  flexDirection: "column",
                  width:
                    device === "tablet" &&
                    counterCat != 1 &&
                    profile?.nip !== "88888"
                      ? "30%"
                      : device === "tablet" &&
                        profile?.nip === "88888" &&
                        counterCat != 1
                      ? "30%"
                      : "48%",
                  height: device === "tablet" ? 130 : 100,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor:
                      variant?.key === "monitoring"
                        ? COLORS.secondaryLighter
                        : COLORS.bgLightGrey,
                    borderRadius: 8,
                    flex: 1,
                    //shadow ios
                    shadowOffset: { width: -2, height: 4 },
                    shadowColor: "#171717",
                    shadowOpacity: 0.2,
                    //shadow android
                    elevation: 2,
                    padding: 8,
                    display: "flex",
                  }}
                  onPress={() =>
                    filterHandler({ key: "monitoring", value: "Monitoring" })
                  }
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      alignItems: "center",
                    }}
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
                      Dalam Proses
                    </Text>
                  </View>
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
                        backgroundColor: COLORS.infoLight,
                        borderRadius: 50,
                      }}
                    >
                      <MaterialCommunityIcons
                        name={"file-alert-outline"}
                        size={device === "tablet" ? 40 : 30}
                        color={COLORS.info}
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
                        {counter?.data?.monitoring}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            <View
              style={{
                flexDirection: "column",
                width:
                  device === "tablet" &&
                  counterCat != 1 &&
                  profile?.nip !== "88888"
                    ? "30%"
                    : device === "tablet" &&
                      profile?.nip === "88888" &&
                      counterCat != 1
                    ? "30%"
                    : "48%",
                height: device === "tablet" ? 130 : 100,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor:
                    variant?.key === "signed"
                      ? COLORS.secondaryLighter
                      : COLORS.bgLightGrey,
                  borderRadius: 8,
                  flex: 1,
                  //shadow ios
                  shadowOffset: { width: -2, height: 4 },
                  shadowColor: "#171717",
                  shadowOpacity: 0.2,
                  //shadow android
                  elevation: 2,
                  padding: 5,
                  display: "flex",
                }}
                onPress={() =>
                  filterHandler({ key: "signed", value: "Selesai" })
                }
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
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
                    Telah Selesai
                  </Text>
                </View>
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
                      {counter?.data?.done}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            {/* </View> */}
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              backgroundColor: "white",
              marginVertical: 10,
              borderRadius: 8,
              marginHorizontal: 16,
            }}
          >
            {/* {variant?.key === "need-sign" && profile.nip == "197208122001121002" && (
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <Checkbox
                  value={lists.length === isSelected.length}
                  onValueChange={() => checkAll()}
                  color={isSelected === true ? COLORS.lighter : null}
                />
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  Pilih Semua
                </Text>
              </View>
            )} */}
            <View style={styles.dropdown}>
              <Dropdown
                data={
                  counterCat == 1
                    ? dropdownConceptor
                    : profile?.nip == "88888"
                    ? dropdownMenKP
                    : dropdownDefault
                }
                placeHolder={"Filter"}
                backgroundColor={COLORS.white}
                selected={variant}
                setSelected={filterHandler}
              />
            </View>
          </View>

          {/* </ScrollView> */}
          <View style={{ flex: 1 }}>
            <FlatList
              data={lists}
              keyExtractor={(item) => item?.id}
              renderItem={({ item }) => (
                <View key={item.id}>
                  <CardListProdukHukum
                    item={item}
                    token={token}
                    variant={variant}
                    device={device}
                    isSelected={isSelected}
                    setSelection={setSelection}
                    nip={profile.nip}
                    disabled={counterCat == 1 && variant.key == "revision"}
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

          {/* <BottomSheetModal
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
                      // setVariant("signed");
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
          </BottomSheetModal> */}

          {/* <ModalSubmit
            status={status}
            setStatus={setStatus}
            messageSuccess={"Dokumen telah diparaf"}
            navigate={"ProdukHukum"}
          /> */}
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
    marginHorizontal: 16,
    marginTop: 10,
  },
  dropdown: {
    flex: 1,
    //shadow ios
    shadowOffset: { width: -2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    //shadow android
    elevation: 2,
  },
});
