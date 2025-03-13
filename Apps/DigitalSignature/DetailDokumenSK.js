import React, { useEffect, useMemo, useRef, useState } from "react";
import { TextInput, useWindowDimensions, View } from "react-native";
import { Image } from "react-native";
import { ScrollView } from "react-native";
import { Text } from "react-native";
import {} from "react-native-safe-area-context";
import {
  COLORS,
  DATETIME,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
  getOrientation,
} from "../../config/SuperAppps";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { useDispatch, useSelector } from "react-redux";
import { FlatList } from "react-native";
import ListEmpty from "../../components/ListEmpty";
import moment from "moment/min/moment-with-locales";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { getTokenValue } from "../../service/session";
import { Loading } from "../../components/Loading";
import {
  putBatalkanSK,
  putReleaseSK,
  putReturnSK,
  putRevisionSK,
  putSetujiSK,
  putTandaTanganSK,
} from "../../service/api";
import { setStatus } from "../../store/DigitalSign";
import { ModalSubmit } from "../../components/ModalSubmit";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as LocalAuthentication from "expo-local-authentication";

export const DetailDokumenSK = ({ route }) => {
  const variant = route.params;
  const navigation = useNavigation();
  const bottomSheetModalRef = useRef(null);
  const { digitalsign, loading, status, message } = useSelector(
    (state) => state.digitalsign
  );
  const item = digitalsign.detail;

  const dispatch = useDispatch();

  const [token, setToken] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);
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

  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);
  const { device } = useSelector((state) => state.apps);

  const handleGetTimeTTD = (user) => {
    const data = [...item?.logs].sort(
      (a, b) => new Date(b?.created_at) - new Date(a?.created_at)
    );

    const logs = data.find((x) => x.user === user && x.action === "approve");

    return logs || null;
  };

  const currentDate = new Date();
  const handleSetujui = () => {
    let payload = {
      passphrase: "approve",
      id_documents: [item.id],
      sign_date: moment(currentDate, "YYYY-MM-DD HH:mm:ss").format(
        DATETIME.LONG_DATE
      ),
    };
    const data = {
      payload: payload,
      token: token,
    };
    dispatch(putSetujiSK(data));
    console.log(data);
  };

  const handleTandaTangan = () => {
    let payload = {
      passphrase: passphrase,
      id_documents: [item.id],
      sign_date: moment(currentDate, "YYYY-MM-DD HH:mm:ss").format(
        DATETIME.LONG_DATE
      ),
    };
    const data = {
      payload: payload,
      token: token,
    };
    dispatch(putTandaTanganSK(data));
    // console.log(data);
  };

  const handleReturn = () => {
    let payload = {
      id_documents: [item.id],
    };
    const data = {
      payload: payload,
      token: token,
    };
    dispatch(putReturnSK(data));
    console.log(data);
  };

  const handleRevision = () => {
    let payload = {
      id_documents: [item.id],
    };
    const data = {
      payload: payload,
      token: token,
    };
    dispatch(putRevisionSK(data));
    console.log(data);
  };

  const handleBatalkan = () => {
    let payload = {
      id_documents: [item.id],
    };
    const data = {
      payload: payload,
      token: token,
    };
    dispatch(putBatalkanSK(data));
    console.log(data);
  };

  const handleRelease = () => {
    let id_receivers = [];
    item?.receivers.map((datas) => {
      if (datas.is_title === false) {
        id_receivers.push(datas.nip);
      } else {
        id_receivers.push(datas.officer.nip);
      }
    });

    let id_approvers = [];
    item?.approvers.map((datas) => {
      if (datas.is_title === false) {
        id_approvers.push(datas.nip);
      } else {
        id_approvers.push(datas.officer.nip);
      }
    });

    let payload = {
      action: "release",
      approvers: id_approvers,
      comment: "di release",
      extra_attributes: item?.extra_attributes,
      id_course: "",
      receivers: id_receivers,
      subject: item?.subject,
      tipe_dokumen: item?.tipe_dokumen,
    };
    const data = {
      payload: payload,
      token: token,
      id: item?.id,
    };
    dispatch(putReleaseSK(data));
    console.log(data);
  };

  const handleBiometricAuth = async () => {
    // Check if hardware supports biometrics
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    // Fallback to default authentication method (password) if Fingerprint is not available
    if (!isBiometricAvailable) {
      handleTandaTangan();
    }

    // Check Biometrics types available (Fingerprint, Facial recognition, Iris recognition)
    let supportedBiometrics;
    if (isBiometricAvailable)
      supportedBiometrics =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

    // Check Biometrics are saved locally in user's device
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics) {
      handleTandaTangan();
    }

    // Authenticate use with Biometrics (Fingerprint, Facial recognition, Iris recognition)

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login with Biometrics",
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    });
    // Log the user in on success
    if (biometricAuth.success) {
      handleTandaTangan();
    }
  };
  const { profile } = useSelector((state) => state.superApps);
  const roleReleaseSK = ["RELEASE.DIGISIGN.SK"];

  const isRoleReleaseSK = profile.roles_access?.some((item) =>
    roleReleaseSK.includes(item)
  );

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        {loading ? <Loading /> : null}
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
                marginLeft: 20,
                alignItems: "center",
                justifyContent: "center",
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
            <View style={{ flex: 1, alignItems: "center", marginRight: 50 }}>
              <Text
                style={{
                  color: "white",
                  fontSize: fontSizeResponsive("H1", device),
                  fontWeight: FONTWEIGHT.bold,
                }}
              >
                Detail Dokumen
              </Text>
            </View>
          </View>

          {Object.keys(item).length !== 0 ? (
            <View
              style={{
                backgroundColor: COLORS.white,
                marginHorizontal: "3%",
                borderRadius: 8,
                marginTop: 20,
              }}
            >
              <View
                style={{
                  marginHorizontal: 20,
                  marginVertical: 20,
                  width: "89%",
                }}
              >
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4, width: "100%" }}
                    height={20}
                  />
                ) : (
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("Judul", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    {item?.subject}
                  </Text>
                )}

                <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
                  <Text
                    style={{
                      width: "35%",
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    No Dokumen
                  </Text>
                  <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                    :
                  </Text>
                  <View style={{ width: "45%" }}>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4, width: "100%" }}
                        height={20}
                      />
                    ) : (
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        {item.extra_attributes?.noDokumen}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={{ marginTop: 20 }}>
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Operator
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      marginTop: 10,
                    }}
                  >
                    <View style={{ width: "100%" }}>
                      {loading ? (
                        <ShimmerPlaceHolder
                          style={{ borderRadius: 4, width: "100%" }}
                          height={20}
                        />
                      ) : (
                        <View>
                          {item?.composer !== undefined ? (
                            <View
                              style={{
                                flexDirection: "row",
                                gap: 10,
                                alignItems: "center",
                              }}
                            >
                              <Image
                                source={{ uri: item?.composer?.avatar_url }}
                                height={50}
                                width={50}
                                borderRadius={50}
                              />
                              <Text
                                style={{
                                  fontWeight: FONTWEIGHT.bold,
                                  marginBottom: 5,
                                  fontSize: fontSizeResponsive("H4", device),
                                  flexWrap: "wrap",
                                  flex: 1,
                                  color: COLORS.grey,
                                }}
                              >
                                {item.composer?.nama}
                              </Text>
                            </View>
                          ) : (
                            <>
                              <Text
                                style={{
                                  fontWeight: FONTWEIGHT.bold,
                                  color: COLORS.info,
                                  width: "80%",
                                  marginBottom: 5,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                -
                              </Text>
                            </>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
                  <Text
                    style={{
                      width: "35%",
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Tanggal Dibuat
                  </Text>
                  <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                    :
                  </Text>
                  <View style={{ width: "45%" }}>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4, width: "100%" }}
                        height={20}
                      />
                    ) : (
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        {moment(item.extra_attributes?.tanggalDokumen)
                          .locale("id")
                          .format("DD MMMM yyyy")}
                      </Text>
                    )}
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    marginTop: 20,
                  }}
                >
                  <Text
                    style={{
                      width: "35%",
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Jenis Dokumen
                  </Text>
                  <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                    :
                  </Text>
                  {loading ? (
                    <ShimmerPlaceHolder
                      style={{ borderRadius: 4, width: "100%" }}
                      height={20}
                    />
                  ) : (
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H4", device),
                        width: device === "tablet" ? "70%" : "60%",
                      }}
                    >
                      {item.extra_attributes?.jenisDokumen}
                    </Text>
                  )}
                </View>

                <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
                  <Text
                    style={{
                      width: "35%",
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Keterangan
                  </Text>
                  <Text>:</Text>
                  {loading ? (
                    <ShimmerPlaceHolder
                      style={{ borderRadius: 4, width: "100%" }}
                      height={20}
                    />
                  ) : (
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H4", device),
                        width: 180,
                      }}
                    >
                      {item.extra_attributes?.keterangan === undefined ||
                      item.extra_attributes?.keterangan === ""
                        ? "-"
                        : item.extra_attributes?.keterangan}
                    </Text>
                  )}
                </View>
              </View>

              <View
                style={{
                  flexDirection:
                    device === "tablet" && orientation === "landscape"
                      ? "row"
                      : "column", // Tetap dalam baris
                  flexWrap: "wrap", // Membungkus item ke bawah jika melebihi lebar
                  gap: device === "tablet" ? 0 : 10, // Jarak antar item
                  justifyContent: "flex-start", // Mulai dari kiri
                }}
              >
                {item.approvers.map((data, index) => {
                  if (index > 0) {
                    return (
                      <View
                        style={{
                          borderWidth: 1,
                          width:
                            device === "tablet" && orientation === "landscape"
                              ? "47%"
                              : "94%",
                          marginBottom: 10,
                          borderColor: "#DBDADE",
                          marginHorizontal:
                            device === "tablet" && orientation === "landscape"
                              ? 15
                              : 10,
                          minHeight: 150,
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: COLORS.primary,
                            alignItems: "center",
                            height: 30,
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: COLORS.white,
                              fontWeight: FONTWEIGHT.bold,
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            Penanggung jawab
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 5,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <View style={{ width: "95%" }}>
                            <View
                              style={{
                                flexDirection: "row",
                                gap: 5,
                                marginTop: 10,
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  fontWeight: FONTWEIGHT.bold,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {item?.approvers?.length - 1 === index
                                  ? "Penandatangan"
                                  : "Persetujuan " + index}
                              </Text>

                              {item.sequence > index ? (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    width: "60%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 5,
                                  }}
                                >
                                  <View
                                    style={{
                                      backgroundColor: COLORS.success,
                                      borderRadius: 50,
                                      padding: 5,
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Ionicons
                                      name="checkmark-outline"
                                      color={COLORS.white}
                                      size={device === "tablet" ? 25 : 15}
                                    />
                                  </View>
                                  <View
                                    style={{
                                      backgroundColor: COLORS.successLight,
                                      paddingVertical: 5,
                                      borderRadius: 20,
                                      paddingHorizontal: 15,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color: COLORS.success,
                                        fontSize: fontSizeResponsive(
                                          "H4",
                                          device
                                        ),
                                      }}
                                    >
                                      {item?.approvers?.length - 1 === index
                                        ? "Ditandatangani"
                                        : "Disetujui"}
                                    </Text>
                                  </View>
                                </View>
                              ) : item.sequence <= index ? (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    width: "60%",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: 5,
                                  }}
                                >
                                  <View
                                    style={{
                                      backgroundColor: COLORS.infoDanger,
                                      borderRadius: 50,
                                      padding: 5,
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Ionicons
                                      name="close"
                                      color={COLORS.white}
                                      size={device === "tablet" ? 25 : 15}
                                    />
                                  </View>
                                  <View
                                    style={{
                                      backgroundColor: COLORS.infoDangerLight,
                                      paddingVertical: 5,
                                      borderRadius: 20,
                                      paddingHorizontal: 15,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color: COLORS.infoDanger,
                                        fontSize: fontSizeResponsive(
                                          "H4",
                                          device
                                        ),
                                      }}
                                    >
                                      {item?.approvers?.length - 1 === index
                                        ? "Belum Ditandatangani"
                                        : "Belum Disetujui"}
                                    </Text>
                                  </View>
                                </View>
                              ) : null}
                            </View>
                            {handleGetTimeTTD(data.nama) !== null &&
                              item?.sequence > index && (
                                <Text
                                  style={{
                                    fontSize: fontSizeResponsive("H4", device),
                                    marginTop: 10,
                                    color: COLORS.grey,
                                    marginHorizontal: 5,
                                  }}
                                >
                                  Disetujui:{" "}
                                  {moment(
                                    handleGetTimeTTD(data?.nama)?.created_at,
                                    "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD MMMM YYYY | HH:mm")}
                                </Text>
                              )}

                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Image
                                source={{ uri: data.avatar_url }}
                                style={{
                                  width: device === "tablet" ? 80 : 50,
                                  height: device === "tablet" ? 80 : 50,
                                  borderRadius: device === "tablet" ? 80 : 50,
                                  marginVertical: 10,
                                  marginHorizontal: 10,
                                }}
                              />
                              <View>
                                {data?.officer ? (
                                  <View
                                    style={{
                                      width:
                                        device === "tablet" &&
                                        orientation === "potrait"
                                          ? 500
                                          : device === "tablet" &&
                                            orientation === "landscape"
                                          ? 350
                                          : 250,
                                    }}
                                  >
                                    {loading ? (
                                      <ShimmerPlaceHolder
                                        style={{
                                          borderRadius: 4,
                                          marginTop: 5,
                                        }}
                                        width={165}
                                        height={20}
                                      />
                                    ) : (
                                      <Text
                                        style={{
                                          color: COLORS.info,
                                          fontWeight: FONTWEIGHT.bold,
                                          fontSize: fontSizeResponsive(
                                            "H4",
                                            device
                                          ),
                                        }}
                                      >
                                        {data.display_title}
                                      </Text>
                                    )}
                                    {loading ? (
                                      <ShimmerPlaceHolder
                                        style={{
                                          borderRadius: 4,
                                          marginTop: 5,
                                        }}
                                        width={165}
                                        height={20}
                                      />
                                    ) : (
                                      <Text
                                        style={{
                                          marginTop: 2,
                                          color: COLORS.lighter,
                                          fontWeight: FONTWEIGHT.bold,
                                          fontSize: fontSizeResponsive(
                                            "H4",
                                            device
                                          ),
                                        }}
                                      >
                                        {data?.officer?.nama != undefined
                                          ? data?.officer?.nama
                                          : "-" || data?.nama !== undefined
                                          ? data?.nama
                                          : "-"}
                                      </Text>
                                    )}
                                  </View>
                                ) : (
                                  <View
                                    style={{
                                      width:
                                        device === "tablet" &&
                                        orientation === "potrait"
                                          ? 500
                                          : device === "tablet" &&
                                            orientation === "landscape"
                                          ? 350
                                          : 250,
                                    }}
                                  >
                                    {loading ? (
                                      <ShimmerPlaceHolder
                                        style={{
                                          borderRadius: 4,
                                          marginTop: 5,
                                        }}
                                        width={165}
                                        height={20}
                                      />
                                    ) : (
                                      <Text
                                        style={{
                                          color: COLORS.lighter,
                                          fontWeight: FONTWEIGHT.bold,
                                          fontSize: fontSizeResponsive(
                                            "H4",
                                            device
                                          ),
                                        }}
                                      >
                                        {data?.nama !== undefined
                                          ? data?.nama
                                          : "-"}
                                        {/* qweqweqwewqeewewqeqwewqeqweeqewqewqeqeqeqweeqeqqwe */}
                                      </Text>
                                    )}
                                  </View>
                                )}
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  }
                })}
              </View>

              {/* <View style={{ marginHorizontal: 20 }}>
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Penerima
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    marginTop: 10,
                  }}
                >
                  <View style={{ width: "100%" }}>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4, width: "100%" }}
                        height={20}
                      />
                    ) : (
                      item?.receivers.map((data) => {
                        return (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center", // Memastikan sejajar vertikal
                              gap: 10,
                              paddingVertical: 5, // Beri sedikit ruang vertikal untuk keseimbangan
                            }}
                          >
                            {data.avatar_url ? (
                              <Image
                                source={{ uri: data?.avatar_url }}
                                style={{
                                  height: 50,
                                  width: 50,
                                  borderRadius: 50,
                                }}
                              />
                            ) : (
                              <View
                                style={{
                                  height: 50,
                                  width: 50,
                                  borderRadius: 50,
                                  backgroundColor: COLORS.grey,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Ionicons
                                  name="person"
                                  size={24}
                                  color={COLORS.white}
                                />
                              </View>
                            )}

                            <View
                              style={{
                                flex: 1, // Memastikan teks menyesuaikan ruang yang ada
                                justifyContent: "center", // Membuat teks berada di tengah vertikal
                              }}
                            >
                              <Text
                                style={{
                                  fontWeight: FONTWEIGHT.bold,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {data?.display_title ?? data?.nama}
                              </Text>

                              {data?.officer?.nama && (
                                <Text
                                  style={{
                                    fontWeight: FONTWEIGHT.medium,
                                    color: COLORS.grey,
                                    fontSize: fontSizeResponsive("H4", device),
                                  }}
                                >
                                  {data?.officer?.nama}
                                </Text>
                              )}
                            </View>
                          </View>
                        );
                      })
                    )}
                  </View>
                </View>
              </View>

              <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Tembusan
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    marginTop: 10,
                  }}
                >
                  <View style={{ width: "100%" }}>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4, width: "100%" }}
                        height={20}
                      />
                    ) : (
                      item?.tembusans?.map((data) => {
                        return (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center", // Memastikan sejajar vertikal
                              gap: 10,
                              paddingVertical: 5, // Beri sedikit ruang vertikal untuk keseimbangan
                            }}
                          >
                            {data.avatar_url ? (
                              <Image
                                source={{ uri: data?.avatar_url }}
                                style={{
                                  height: 50,
                                  width: 50,
                                  borderRadius: 50,
                                }}
                              />
                            ) : (
                              <View
                                style={{
                                  height: 50,
                                  width: 50,
                                  borderRadius: 50,
                                  backgroundColor: COLORS.grey,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Ionicons
                                  name="person"
                                  size={24}
                                  color={COLORS.white}
                                />
                              </View>
                            )}

                            <View
                              style={{
                                flex: 1, // Memastikan teks menyesuaikan ruang yang ada
                                justifyContent: "center", // Membuat teks berada di tengah vertikal
                              }}
                            >
                              <Text
                                style={{
                                  fontWeight: FONTWEIGHT.bold,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {data?.display_title ?? data?.nama}
                              </Text>

                              {data?.officer?.nama && (
                                <Text
                                  style={{
                                    fontWeight: FONTWEIGHT.medium,
                                    color: COLORS.grey,
                                    fontSize: fontSizeResponsive("H4", device),
                                  }}
                                >
                                  {data?.officer?.nama}
                                </Text>
                              )}
                            </View>
                          </View>
                        );
                      })
                    )}
                  </View>
                </View>
              </View> */}
            </View>
          ) : (
            ""
          )}

          <View style={{ gap: 15, marginTop: 15, marginBottom: 15 }}>
            {loading ? null : (
              <TouchableOpacity
                onPress={() => {
                  if (
                    item.attachments.length !== 0 &&
                    item.attachments[0].file !== undefined
                  ) {
                    navigation.navigate("PdfViewer", {
                      data: item?.attachments[0]?.file,
                      type: "DokumenLain",
                    });
                  } else {
                    alert("File Tidak Ada");
                  }
                }}
                style={{
                  width: "90%",
                  backgroundColor: COLORS.info,
                  borderRadius: 6,
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginHorizontal: "5%",
                }}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    marginVertical: 15,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Lihat Dokumen
                </Text>
              </TouchableOpacity>
            )}
            {variant.variant === "sk-need-sign" ? (
              <>
                <TouchableOpacity
                  style={{
                    width: "90%",
                    backgroundColor: COLORS.infoDanger,
                    borderRadius: 6,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginHorizontal: "5%",
                  }}
                  onPress={() => {
                    // navigation.navigate("PdfPerisai", {
                    //   item: item,
                    //   tipe: "sk",
                    // })
                    if (profile.nip === "88888") {
                      handleBiometricAuth();
                    } else {
                      bottomSheetAttach();
                    }
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      marginVertical: 15,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Proses Tanda Tangan
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}

            {variant.variant === "signed" ? (
              <>
                <TouchableOpacity
                  style={{
                    width: "90%",
                    backgroundColor: COLORS.danger,
                    borderRadius: 6,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginHorizontal: "5%",
                  }}
                  onPress={() => handleBatalkan()}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      marginVertical: 15,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Batalkan
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}

            {variant.variant === "signed" ? (
              <>
                <TouchableOpacity
                  style={{
                    width: "90%",
                    backgroundColor: COLORS.infoDanger,
                    borderRadius: 6,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginHorizontal: "5%",
                  }}
                  onPress={() => handleRevision()}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      marginVertical: 15,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Revisi
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}

            {variant.variant === "signed" &&
            !item?.is_release &&
            isRoleReleaseSK === true ? (
              <>
                <TouchableOpacity
                  style={{
                    width: "90%",
                    backgroundColor: COLORS.success,
                    borderRadius: 6,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginHorizontal: "5%",
                  }}
                  onPress={() => {
                    handleRelease();
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      marginVertical: 15,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Release SK
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}

            {variant.variant === "sk-need-approval" ? (
              <>
                <TouchableOpacity
                  style={{
                    width: "90%",
                    backgroundColor: COLORS.infoDanger,
                    borderRadius: 6,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginHorizontal: "5%",
                  }}
                  onPress={() => handleReturn()}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      marginVertical: 15,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Return
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}

            {variant.variant === "sk-need-approval" ? (
              <>
                <TouchableOpacity
                  style={{
                    width: "90%",
                    backgroundColor: COLORS.success,
                    borderRadius: 6,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginHorizontal: "5%",
                  }}
                  onPress={() => handleSetujui()}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      marginVertical: 15,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Setujui
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}
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
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    marginHorizontal: 20,
                    marginTop: 20,
                    flex: 1,
                  }}
                >
                  <TouchableOpacity onPress={() => bottomSheetAttachClose()}>
                    <Ionicons name="chevron-back-outline" size={24} />
                  </TouchableOpacity>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <Text style={{ fontSize: FONTSIZE.H1, fontWeight: 500 }}>
                      Tanda Tangan Sertifikat
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    marginBottom: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                    marginTop: 20,
                    flexDirection: "row",
                    borderRadius: 6,
                    borderColor: "#D0D5DD",
                    borderWidth: 1,
                    marginHorizontal: 20,
                    padding: 10,
                    width: "90%",
                  }}
                >
                  <BottomSheetTextInput
                    placeholder="Masukan Passphrase"
                    style={{
                      width: "90%",
                    }}
                    allowFontScaling={false}
                    onChangeText={(text) => {
                      setPassphrase(text);
                    }}
                    // secureTextEntry={true} // Toggle secureTextEntry based on 'show'
                    secureTextEntry={!show}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      setShow(!show); // Toggle the show state
                    }}
                  >
                    <Ionicons
                      name={show ? "eye-sharp" : "eye-off-sharp"} // Toggle icon based on 'show'
                      size={device === "tablet" ? 30 : 24}
                      color={COLORS.grey}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={{
                    width: "90%",
                    backgroundColor:
                      passphrase === "" ? COLORS.ExtraDivinder : COLORS.danger,
                    height: 50,
                    marginVertical: 40,
                    borderRadius: 6,
                    alignItems: "center",
                    marginHorizontal: 20,
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    bottomSheetAttachClose();
                    handleBiometricAuth();
                  }}
                  disabled={passphrase === "" ? true : false}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: FONTSIZE.H1,
                      fontWeight: 500,
                    }}
                  >
                    Tanda Tangan
                  </Text>
                </TouchableOpacity>
              </View>
            </BottomSheetView>
          </BottomSheetModal>

          <ModalSubmit
            status={status}
            setStatus={setStatus}
            messageSuccess={message}
            navigate={"MainDigitalSign"}
          />
        </ScrollView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};
