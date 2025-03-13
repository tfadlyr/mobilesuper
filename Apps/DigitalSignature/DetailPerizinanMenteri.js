import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
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
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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
import { ModalSubmit } from "../../components/ModalSubmit";
import { setStatus } from "../../store/DigitalSign";
import { tandaTanganMentri } from "../../service/api";
import * as LocalAuthentication from "expo-local-authentication";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const DetailPerizinanMenteri = ({ route }) => {
  const variant = route.params;
  const navigation = useNavigation();
  const bottomSheetModalRef = useRef(null);
  const { digitalsign, status, loading } = useSelector(
    (state) => state.digitalsign
  );
  const item = digitalsign.detail;

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

  // const [file, setFile] = useState();
  // const [fileMemo, setFileMemo] = useState();
  // useEffect(() => {
  //   // if (item && item?.attachments?.length === 2) {
  //   if (file === undefined) {
  //     item.attachments?.map((item, index) => {
  //       if (index === 0) {
  //         setFile(item.file);
  //       } else {
  //         setFileMemo(item.file);
  //       }
  //     });
  //   }
  //   //   if (fileMemo === undefined) {
  //   //     item.attachments[1]?.map((item) => {
  //   //       setFileMemo({ link: item.file });
  //   //     });
  //   //   }
  //   // } else {
  //   //   if (file === undefined) {
  //   //     item.attachments[0]?.map((item) => {
  //   //       setFileMemo({ link: item.file });
  //   //     });
  //   //   }
  //   // }
  // }, [item, file]);
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);
  const { device } = useSelector((state) => state.apps);
  const dispatch = useDispatch();

  const currentDate = new Date();

  const handleSubmit = () => {
    const payload = {
      passphrase: "",
      id_documents: [item.id],
      sign_date: moment(currentDate, "YYYY-MM-DD HH:mm:ss").format(
        DATETIME.LONG_DATE
      ),
      comment: "Dokumen sudah di tanda tangan",
    };
    const data = {
      token: variant.token,
      payload: payload,
    };
    dispatch(tandaTanganMentri(data));
  };

  //FINGERPRINT

  const handleBiometricAuth = async () => {
    // Check if hardware supports biometrics
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    // Fallback to default authentication method (password) if Fingerprint is not available
    // if (!isBiometricAvailable) return bottomSheetModalRef.current?.present();
    if (!isBiometricAvailable) return handleSubmit();

    // Check Biometrics types available (Fingerprint, Facial recognition, Iris recognition)
    let supportedBiometrics;
    if (isBiometricAvailable)
      supportedBiometrics =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

    // Check Biometrics are saved locally in user's device
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    // if (!savedBiometrics) return bottomSheetModalRef?.current?.present();
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

  const { profile } = useSelector((state) => state.superApps);

  const handleShowAttachment = (type) => {
    let idxAtt = -1;

    let attachments = item?.attachments;

    if (attachments.length !== 0) {
      attachments.map((item, i) => {
        let name = item.name.toLowerCase();
        if (name.includes(type)) {
          idxAtt = i;
        }
      });
    }

    if (attachments.length !== 0 && attachments[idxAtt] !== undefined) {
      navigation.navigate("PdfViewer", {
        data: attachments[idxAtt].file,
        type: "DokumenLain",
      });
    } else {
      Alert.alert("File Tidak Ada");
    }
  };

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
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
                Detail Perizinan Menteri
              </Text>
            </View>
          </View>

          {Object.keys(item).length !== 0 ? (
            <View
              style={{
                width: "90%",
                backgroundColor: COLORS.white,
                marginHorizontal: "5%",
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
                      width: "45%",
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    ID Dokumen
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
                        {item.extra_attributes?.id_permohonan}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
                  <Text
                    style={{
                      width: "45%",
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Nomor Surat
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

                <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
                  <Text
                    style={{
                      width: "45%",
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Jenis Permohonan
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
                        {item.extra_attributes?.jenis}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
                  <Text
                    style={{
                      width: "45%",
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Operator
                  </Text>
                  <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                    :
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      width: "49%",
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
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {item?.composer?.is_title
                              ? item?.composer?.officer?.nama
                              : item?.composer?.nama}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
                  <Text
                    style={{
                      width: "45%",
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

                {/* <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
                  <Text
                    style={{
                      width: "45%",
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Jenis Dokumen
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
                        {item.extra_attributes?.jenisDokumen}
                      </Text>
                    )}
                  </View>
                </View> */}

                <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
                  <Text
                    style={{
                      width: "45%",
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Keterangan
                  </Text>
                  <Text>:</Text>
                  <View style={{ width: "45%" }}>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4, width: "100%" }}
                        height={20}
                      />
                    ) : (
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H4", device),
                          width: 150,
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

                <View style={styles.container}>
                  {(profile?.nip === "196212301990031006" ||
                    profile?.nip === "69030175" ||
                    profile?.nip === "88888") && (
                    <TouchableOpacity
                      style={[
                        styles.card,
                        {
                          backgroundColor: COLORS.info,
                          width: device === "tablet" ? "35%" : 100,
                        },
                        styles.selectedCard,
                      ]}
                      onPress={() => handleShowAttachment("undangan")}
                    >
                      <MaterialIcons
                        name="insert-drive-file"
                        size={32}
                        color={COLORS.white}
                      />
                      <Text
                        style={[
                          styles.selectedText,
                          { fontSize: fontSizeResponsive("H4", device) },
                        ]}
                      >
                        Dokumen Undangan
                      </Text>
                    </TouchableOpacity>
                  )}
                  {(profile?.nip === "69030175" ||
                    profile?.nip === "88888") && (
                    <TouchableOpacity
                      style={[
                        styles.card,
                        {
                          backgroundColor: COLORS.warning,
                          width: device === "tablet" ? "35%" : 100,
                        },
                        styles.selectedCard,
                      ]}
                      onPress={() => handleShowAttachment("memo")}
                    >
                      <MaterialIcons
                        name="insert-drive-file"
                        size={32}
                        color={COLORS.white}
                      />
                      <Text
                        style={[
                          styles.selectedText,
                          { fontSize: fontSizeResponsive("H4", device) },
                        ]}
                      >
                        Dokumen Memo
                      </Text>
                    </TouchableOpacity>
                  )}
                  {profile?.nip === "88888" && (
                    <TouchableOpacity
                      style={[
                        styles.card,
                        {
                          backgroundColor: "#33CCCC",
                          width: device === "tablet" ? "35%" : 100,
                        },
                        styles.selectedCard,
                      ]}
                      onPress={() => handleShowAttachment("persetujuan")}
                    >
                      <MaterialIcons
                        name="insert-drive-file"
                        size={32}
                        color={COLORS.white}
                      />
                      <Text
                        style={[
                          styles.selectedText,
                          { fontSize: fontSizeResponsive("H4", device) },
                        ]}
                      >
                        Dokumen Perizinan
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              {item.approvers.map((data, index) => {
                if (index > 0) {
                  return (
                    <View
                      style={{
                        borderWidth: 1,
                        borderRadius: 4,
                        width: "95%",
                        marginHorizontal: device === "tablet" ? 18 : 10,
                        marginBottom: 20,
                        borderColor: "#DBDADE",
                        paddingBottom: 10,
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
                          Penandatangan
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 10,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <View style={{ width: "98%" }}>
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
                              Penandatangan
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
                                    height: 20,
                                    width: 20,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Ionicons
                                    name="checkmark-outline"
                                    color={COLORS.white}
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
                                    Ditandatangani
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
                                    height: 20,
                                    width: 20,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Ionicons name="close" color={COLORS.white} />
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
                                    Belum Ditandatangani
                                  </Text>
                                </View>
                              </View>
                            ) : null}
                          </View>
                          <View style={{ flexDirection: "row", columnGap: 20 }}>
                            <Image
                              source={{ uri: data.avatar_url }}
                              style={{
                                width: device === "tablet" ? 80 : 50,
                                height: device === "tablet" ? 80 : 50,
                                borderRadius: device === "tablet" ? 80 : 50,
                                marginVertical: 10,
                                marginHorizontal: 10,
                                marginLeft: 5,
                              }}
                            />
                            <View>
                              {data?.officer ? (
                                <View style={{ width: "95%" }}>
                                  {loading ? (
                                    <View style={{ width: "45%" }}>
                                      <ShimmerPlaceHolder
                                        style={{
                                          borderRadius: 4,
                                          marginTop: 5,
                                        }}
                                        height={20}
                                      />
                                    </View>
                                  ) : (
                                    <Text
                                      style={{
                                        marginTop: 10,
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
                                    <View style={{ width: "45%" }}>
                                      <ShimmerPlaceHolder
                                        style={{
                                          borderRadius: 4,
                                          marginTop: 5,
                                        }}
                                        height={20}
                                      />
                                    </View>
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
                                    width: device === "tablet" ? 500 : 240,
                                    flex: 1,
                                    justifyContent: "center",
                                  }}
                                >
                                  {loading ? (
                                    <View style={{ width: "45%" }}>
                                      <ShimmerPlaceHolder
                                        style={{
                                          borderRadius: 4,
                                          marginTop: 5,
                                        }}
                                        height={20}
                                      />
                                    </View>
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
          ) : (
            ""
          )}

          {/* {profile?.nip === "88888" ? (
                
                ) : null}
                 */}
          <View style={{ gap: 15, marginTop: 15, marginBottom: 15 }}>
            {/* {(profile?.nip === "196212301990031006" ||
              profile?.nip === "69030175" ||
              profile?.nip === "88888") && (
              <TouchableOpacity
                onPress={() => handleShowAttachment("undangan")}
                style={{
                  width: "90%",
                  backgroundColor: "#2296f4",
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
                  Lihat Dokumen Undangan
                </Text>
              </TouchableOpacity>
            )}

            {(profile?.nip === "69030175" || profile?.nip === "88888") && (
              <TouchableOpacity
                onPress={() => handleShowAttachment("memo")}
                style={{
                  width: "90%",
                  backgroundColor: "rgb(245, 127, 23)",
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
                  Lihat Dokumen Memo
                </Text>
              </TouchableOpacity>
            )}

            {profile?.nip === "88888" && (
              <TouchableOpacity
                onPress={() => handleShowAttachment("persetujuan")}
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
                  Lihat Dokumen Perizinan
                </Text>
              </TouchableOpacity>
            )} */}

            {variant.variant === "inprogress" &&
            profile.nip !== "197208122001121002" ? (
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
                    handleBiometricAuth();
                    // handleSubmit();
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
                  }}
                >
                  <TextInput
                    editable
                    multiline
                    numberOfLines={4}
                    maxLength={40}
                    placeholder="Masukan Passphrase"
                    style={{
                      borderWidth: 1,
                      width: "90%",
                      height: 40,
                      paddingHorizontal: 10,
                      paddingTop: 10,
                      borderRadius: 6,
                      borderColor: "#D0D5DD",
                    }}
                    allowFontScaling={false}
                  />
                </View>

                <View
                  style={{
                    marginBottom: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                    marginTop: 20,
                  }}
                >
                  <TextInput
                    editable
                    multiline
                    numberOfLines={4}
                    maxLength={40}
                    placeholder="Masukan Passphrase"
                    style={{
                      borderWidth: 1,
                      width: "90%",
                      height: 40,
                      paddingHorizontal: 10,
                      paddingTop: 10,
                      borderRadius: 6,
                      borderColor: "#D0D5DD",
                    }}
                    allowFontScaling={false}
                  />
                </View>

                <TouchableOpacity
                  style={{
                    width: "90%",
                    backgroundColor: COLORS.danger,
                    height: 50,
                    marginVertical: 40,
                    borderRadius: 6,
                    alignItems: "center",
                    marginHorizontal: 20,
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    bottomSheetAttachClose();
                  }}
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
            messageSuccess={"Data Ditambahkan"}
            navigate={"PerizinanMenteri"}
          />
        </ScrollView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 5,
    marginTop: 10,
    justifyContent: "flex-start",
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },

  selectedText: {
    marginTop: 8,
    textAlign: "center",
    color: COLORS.white,
  },
});
