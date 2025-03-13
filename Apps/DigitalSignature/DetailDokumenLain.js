import React, { useEffect, useMemo, useRef, useState } from "react";
import { TextInput, View } from "react-native";
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
import { Config } from "../../constants/config";
import { tandaTanganMentri, tolakDokumenLain } from "../../service/api";
import * as LocalAuthentication from "expo-local-authentication";
import { ModalSubmit } from "../../components/ModalSubmit";
import { setStatus } from "../../store/DigitalSign";

export const DetailDokumenLain = ({ route }) => {
  const variant = route.params;
  const navigation = useNavigation();
  const bottomSheetModalRef = useRef(null);
  const { digitalsign, status, loading, message } = useSelector(
    (state) => state.digitalsign
  );
  const item = digitalsign.detail;

  const dispatch = useDispatch();

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
  // useEffect(() => {
  //   if (file === undefined) {
  //     item.attachments?.map((item) => {
  //       setFile({ link: item.file });
  //     });
  //   }
  // }, [file, item]);

  // console.log(file);

  const handleGetFile = (tipe) => {
    const data = item?.attachments;
    let tmpIndex = -1;

    let split = "";
    if (tipe === "draft") {
      split = "-";
    } else if (tipe === "signed") {
      split = "_";
    }

    let check = data.findIndex((x) => x.name.split(split)[0] === tipe);
    if (check >= 0) {
      tmpIndex = check;
    } else {
      tmpIndex = 0;
    }

    return data[tmpIndex].file;
  };

  const isProd = Config.base_url.includes("apigw") ? "0" : "1";

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

  const handleTolak = () => {
    const payload = {
      id_documents: [item.id],
    };
    const data = {
      token: variant.token,
      payload: payload,
    };
    dispatch(tolakDokumenLain(data));
  };

  const handleBiometricAuth = async (tipe) => {
    console.log(tipe);
    // Check if hardware supports biometrics
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    // Fallback to default authentication method (password) if Fingerprint is not available
    if (!isBiometricAvailable) {
      if (tipe === "ttde") {
        handleSubmit();
      } else {
        handleTolak();
      }
    }

    // Check Biometrics types available (Fingerprint, Facial recognition, Iris recognition)
    let supportedBiometrics;
    if (isBiometricAvailable)
      supportedBiometrics =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

    // Check Biometrics are saved locally in user's device
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics) {
      if (tipe === "ttde") {
        handleSubmit();
      } else {
        handleTolak();
      }
    }

    // Authenticate use with Biometrics (Fingerprint, Facial recognition, Iris recognition)

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login with Biometrics",
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    });
    // Log the user in on success
    if (biometricAuth.success) {
      if (tipe === "ttde") {
        handleSubmit();
      } else {
        handleTolak();
      }
    }
  };

  const { profile } = useSelector((state) => state.superApps);

  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);
  const { device } = useSelector((state) => state.apps);
  return (
    <View style={{ flex: 1 }}>
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
                Detail Dokumen
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

                <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
                  <Text
                    style={{
                      width: "45%",
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Penerima Sertifikat
                  </Text>
                  <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                    :
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      width: "45%",
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
                          {item.receivers !== undefined ? (
                            <View>
                              {item.receivers?.display_title !== undefined ? (
                                <View>
                                  <Text
                                    style={{
                                      fontWeight: FONTWEIGHT.bold,
                                      color: COLORS.info,
                                      marginBottom: 5,
                                      fontSize: fontSizeResponsive(
                                        "H4",
                                        device
                                      ),
                                    }}
                                  >
                                    {item.receivers?.display_title !== undefined
                                      ? item.receivers?.display_title
                                      : null}
                                  </Text>
                                  <Text
                                    style={{
                                      color: COLORS.lighter,
                                      width: "80%",
                                      fontSize: fontSizeResponsive(
                                        "H4",
                                        device
                                      ),
                                    }}
                                  >
                                    {item.receivers?.officer?.nama !== undefined
                                      ? item.receivers?.officer?.nama
                                      : "-"}
                                  </Text>
                                </View>
                              ) : (
                                <Text
                                  style={{
                                    color: COLORS.lighter,
                                    width: "80%",
                                    fontSize: fontSizeResponsive("H4", device),
                                  }}
                                >
                                  {item.receivers?.nama !== undefined
                                    ? item.receivers?.nama
                                    : "-"}
                                </Text>
                              )}
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

                <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
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
                  <View>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{
                          borderRadius: 4,
                          width: device === "tablet" ? 330 : 140,
                        }}
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
                </View>

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
                  {loading ? (
                    <ShimmerPlaceHolder
                      style={{
                        borderRadius: 4,
                        width: device === "tablet" ? 330 : 140,
                      }}
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
              {item.approvers.map((data, index) => {
                if (index > 0) {
                  return (
                    <View
                      style={{
                        borderWidth: 1,
                        borderRadius: 4,
                        width: "95%",
                        marginHorizontal: 10,
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
                          Approval
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
                        <View>
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
                                <View style={{}}>
                                  {loading ? (
                                    <ShimmerPlaceHolder
                                      style={{ borderRadius: 4, marginTop: 5 }}
                                      width={device === "tablet" ? 330 : 200}
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
                                      style={{ borderRadius: 4, marginTop: 5 }}
                                      width={device === "tablet" ? 330 : 200}
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
                                <View style={{}}>
                                  {loading ? (
                                    <ShimmerPlaceHolder
                                      style={{ borderRadius: 4, marginTop: 5 }}
                                      width={device === "tablet" ? 330 : 200}
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

          <View style={{ gap: 15, marginTop: 15, marginBottom: 15 }}>
            {loading ? null : (
              <TouchableOpacity
                onPress={() => {
                  if (item.attachments.length !== 0) {
                    navigation.navigate("PdfViewer", {
                      data:
                        isProd === "0"
                          ? handleGetFile("draft")
                          : handleGetFile(
                              variant?.variant === "signed" ? "signed" : "draft"
                            ),
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
            {variant.variant === "inprogress" ? (
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
                    if (profile?.nip === "88888") {
                      handleBiometricAuth("ttde");
                    } else {
                      navigation.navigate("PdfPerisai", {
                        item: item,
                      });
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

            {profile?.nip === "88888" && variant.variant === "inprogress" ? (
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
                    handleBiometricAuth("tolak");
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      marginVertical: 15,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Tolak Dokumen
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>

          <ModalSubmit
            status={status}
            setStatus={setStatus}
            messageSuccess={message}
            navigate={"MainDigitalSign"}
          />

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
        </ScrollView>
      </BottomSheetModalProvider>
    </View>
  );
};
