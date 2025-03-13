import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
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
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
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
import {
  parafBeforeTTDEPerizinan,
  parafPerizinan,
  revisiPerizinan,
  tandaTanganMentri,
} from "../../service/api";
import * as LocalAuthentication from "expo-local-authentication";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Timeline from "react-native-timeline-flatlist";
import RenderHTML from "react-native-render-html";
import WebView from "react-native-webview";

export const DetailPKRL = ({ route }) => {
  const variant = route.params;
  const navigation = useNavigation();
  const bottomSheetModalRef = useRef(null);
  const { digitalsign, status, loading, message } = useSelector(
    (state) => state.digitalsign
  );

  const [revisi, setRevisi] = useState("");
  const [modalLog, setModalLog] = useState(false);
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

  const handleBeforeTTDE = () => {
    const approver = item?.approvers;

    if (approver[approver.length - 2]?.nip === profile.nip) {
      return true;
    }

    return false;
  };

  const { profile } = useSelector((state) => state.superApps);

  const handleShowAttachment = (type) => {
    let idxAtt = -1;

    let attachments = item?.attachments;

    if (attachments?.length !== 0) {
      attachments.map((item, i) => {
        let name = item.name.toLowerCase();
        if (name.includes(type)) {
          idxAtt = i;
        }
      });
    }

    if (attachments?.length !== 0 && attachments[idxAtt] !== undefined) {
      navigation.navigate("PdfViewer", {
        data: attachments[idxAtt]?.file,
        type: "DokumenLain",
      });
    } else {
      Alert.alert("File Tidak Ada");
    }
  };

  const isMenkp = () => {
    if (item?.approvers?.length) {
      const lastApprover = item.approvers[item.approvers.length - 1];
      if (
        item?.sequence === lastApprover?.sequence &&
        profile?.nip === lastApprover?.nip
      ) {
        return true;
      }
    }
    return false;
  };

  const handleParaf = () => {
    let payload = {
      id_documents: [item.id],
    };

    const data = {
      token: variant.token,
      payload: payload,
    };

    if (handleBeforeTTDE()) {
      dispatch(parafBeforeTTDEPerizinan(data));
    } else {
      dispatch(parafPerizinan(data));
    }
  };

  const handleRevisi = () => {
    let payload = {
      id_documents: [item.id],
      comment: revisi,
    };
    const data = {
      token: variant.token,
      payload: payload,
    };
    bottomSheetAttachClose(); // Tutup Bottom Sheet terlebih dahulu
    setTimeout(() => {
      dispatch(revisiPerizinan(data)); // Dispatch setelah Bottom Sheet selesai ditutup
    }, 300);
  };

  const handleBiometricAuth = async () => {
    // Check if hardware supports biometrics
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    // Fallback to default authentication method (password) if Fingerprint is not available
    if (!isBiometricAvailable) {
      handleSubmit();
    }

    // Check Biometrics types available (Fingerprint, Facial recognition, Iris recognition)
    let supportedBiometrics;
    if (isBiometricAvailable)
      supportedBiometrics =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

    // Check Biometrics are saved locally in user's device
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics) {
      handleSubmit();
    }

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

  const handleGetFileLampiran = (tipe) => {
    const data = [...item?.attachments];
    let temp = "";

    if (tipe === "perizinan") {
      if (isMenkp()) {
        temp = "perizinan";
      } else if (item?.authors[0] === "88888") {
        temp = "perizinan";
      } else {
        temp = "draft-perizinan";
      }
    } else {
      temp = tipe;
    }

    let index = -1;

    if (item?.authors[0] === "88888" && tipe === "perizinan") {
      index = data.findIndex(
        (x, index) => x.name.split("_")[0] === temp && index !== 0
      );
    } else if (variant.variant === "signed" && tipe === "perizinan") {
      index = 0;
    } else {
      index = data.findIndex((x) => x.name.split("_")[0] === temp);
    }

    if (index > -1) {
      return index;
    }

    return -1;
  };

  //   const handleGetFileLampiran = (tipe) => {
  //     const data = [...item?.attachments]
  //     let temp = ''

  //     if (tipe === 'perizinan') {
  //         if (isMenkp()) {
  //             temp = 'perizinan'
  //         } else if (item?.authors[0] === '88888') {
  //             temp = 'perizinan'
  //         } else {
  //             temp = 'draft-perizinan'
  //         }
  //     } else {
  //         temp = tipe
  //     }

  //     let index = -1

  //     if (item?.authors[0] === '88888') {
  //         index = 1
  //     } else if(variant.variant === "signed"){
  //         index = 0
  //     }else{
  //         index = data.findIndex(x => x.name.split('_')[0] === temp)
  //     }

  //     if (index > -1) {
  //         return index
  //     }

  //     return -1
  // }

  const timelineData = item?.logs?.map((log) => ({
    time: moment(log.created_at, "YYYY-MM-DD HH:mm:ss").format(
      "DD MMMM YYYY | HH:mm:ss"
    ),
    title: log.user,
    description: log.message ? log.message : "No message",
    action: log.action,
    icon:
      log.action === "submit" ? (
        <View
          style={{
            padding: 5,
            backgroundColor: COLORS.infoLight,
            borderRadius: 20,
          }}
        >
          <MaterialCommunityIcons
            name="send"
            size={device === "tablet" ? 30 : 20}
            color={COLORS.info}
          />
        </View>
      ) : log.action === "paraf" ? (
        <View
          style={{
            padding: 5,
            backgroundColor: COLORS.successLight,
            borderRadius: 20,
          }}
        >
          <MaterialIcons
            name="gesture"
            size={device === "tablet" ? 30 : 20}
            color={COLORS.success}
          />
        </View>
      ) : log.action === "revisi" ? (
        <View
          style={{
            padding: 5,
            backgroundColor: COLORS.infoDangerLight,
            borderRadius: 20,
          }}
        >
          <MaterialIcons
            name="content-paste-off"
            size={device === "tablet" ? 30 : 20}
            color={COLORS.infoDanger}
          />
        </View>
      ) : log.action === "approve" ? (
        <View
          style={{
            padding: 5,
            backgroundColor: "#efbbff",
            borderRadius: 20,
          }}
        >
          <MaterialIcons
            name="check"
            size={device === "tablet" ? 30 : 20}
            color={"#be29ec"}
          />
        </View>
      ) : null,
  }));

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  const handleGetTimeParaf = (user) => {
    const data = item.logs.filter((x) => x.action === "paraf");
    let logs = null;

    const check = data?.findIndex((x) => x.user === user);

    if (check > -1 && data[check].action === "paraf") {
      logs = data[check];
    }

    return logs;
  };

  const tagsStyles = {
    body: {
      margin: 0,
      padding: 0,
    },
    p: {
      marginBottom: 10,
      marginTop: 0,
    },
    br: {
      height: 0,
    },
    h1: {
      marginBottom: 10,
      marginTop: 0,
      fontWeight: "bold",
    },
    h2: {
      marginBottom: 10,
      marginTop: 0,
      fontWeight: "bold",
    },
    h3: {
      marginBottom: 10,
      marginTop: 0,
      fontWeight: "bold",
    },
    h4: {
      marginBottom: 10,
      marginTop: 0,
      fontWeight: "bold",
    },
    h5: {
      marginBottom: 10,
      marginTop: 0,
      fontWeight: "bold",
    },
    h6: {
      marginBottom: 10,
      marginTop: 0,
      fontWeight: "bold",
    },
    ul: {
      marginBottom: 10,
      marginTop: 0,
      paddingLeft: 20,
    },
    ol: {
      marginBottom: 10,
      marginTop: 0,
      paddingLeft: 20,
    },
    li: {
      marginBottom: 5,
      marginTop: 0,
    },
    div: {
      marginBottom: 10,
      marginTop: 0,
    },
    span: {
      marginBottom: 0,
      marginTop: 0,
    },
    strong: {
      fontWeight: "bold",
    },
    em: {
      fontStyle: "italic",
    },
    blockquote: {
      marginBottom: 0,
      marginTop: 0,
      // borderLeftColor: "#ccc",
    },
    img: {
      maxWidth: "100%", // Agar gambar tidak melebihi lebar container
      height: "auto", // Menjaga rasio aspek gambar
      marginBottom: 10, // Menghindari jarak berlebihan di bawah gambar,
      marginTop: 0,
    },
    table: {
      borderCollapse: "collapse", // Gabungkan border agar rapi
      width: "100%",
    },
    th: {
      borderWidth: 1,
      borderColor: "#000", // Warna border hitam
      borderStyle: "solid",
      textAlign: "left",
    },
    td: {
      borderWidth: 1,
      borderColor: "#000",
      borderStyle: "solid",
    },
  };
  const cleanHtml = item?.extra_attributes?.keterangan?.replace(
    /<p>(&nbsp;|\s|<br>)*<\/p>/g,
    ""
  );
  const classesStyles = {
    content: {
      padding: 10,
    },
    "news-title": {
      fontSize: 18,
      textAlign: "center",
      fontWeight: "bold",
    },
    // description: {
    //   backgroundColor: "red",
    // },
    media: {
      fontSize: 16,
    },
  };

  const baseStyles = {
    fontSize: 16, // Set font size sesuai kebutuhan
  };

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

          {Object.keys(item)?.length !== 0 ? (
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
                      width: "41%",
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Nomor Perizinan
                  </Text>
                  <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                    :
                  </Text>
                  <View style={{ width: "50%" }}>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4, width: "100%" }}
                        height={20}
                      />
                    ) : (
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        {item?.extra_attributes.no_perizinan !== ""
                          ? item?.extra_attributes.no_perizinan
                          : "-"}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={{ marginTop: 10 }}>
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Konseptor
                  </Text>
                  <View>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4, width: "100%" }}
                        height={20}
                      />
                    ) : (
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 5,
                          alignItems: "center",
                          marginTop: 10,
                        }}
                      >
                        <Image
                          source={{ uri: item.composer.avatar_url }}
                          height={device === "tablet" ? 50 : 30}
                          width={device === "tablet" ? 50 : 30}
                          borderRadius={device === "tablet" ? 50 : 30}
                        />
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H4", device),
                            width: "90%",
                          }}
                        >
                          {item.composer.is_title
                            ? item.composer.officer.nama
                            : item.composer.nama}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                  <Text
                    style={{
                      width: "41%",
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Tanggal Dokumen
                  </Text>
                  <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                    :
                  </Text>
                  <View style={{ width: "50%" }}>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4, width: "100%" }}
                        height={20}
                      />
                    ) : (
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        {moment(item.created_at, "YYYY-MM-DD hh:mm:ss").format(
                          DATETIME.LONG_DATETIME
                        )}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                  <Text
                    style={{
                      width: "41%",
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Jenis Perizinan
                  </Text>
                  <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                    :
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      width: "50%",
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
                            {item?.extra_attributes?.jenis_perizinan}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                  <Text
                    style={{
                      width: "41%",
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Kategori Perizinan
                  </Text>
                  <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                    :
                  </Text>
                  <View style={{ width: "50%" }}>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4, width: "100%" }}
                        height={20}
                      />
                    ) : (
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        {item.extra_attributes?.kategori_perizinan}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                  <Text
                    style={{
                      width: "41%",
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Jenis Penomoran
                  </Text>
                  <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                    :
                  </Text>
                  <View style={{ width: "50%" }}>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4, width: "100%" }}
                        height={20}
                      />
                    ) : (
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        {item.extra_attributes?.jenis_permohonan}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={{ gap: 10, marginTop: 10 }}>
                  <Text
                    style={{
                      width: "41%",
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Deskripsi
                  </Text>
                  <View>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4, width: "100%" }}
                        height={20}
                      />
                    ) : (
                      // <Text
                      //   style={{ fontSize: fontSizeResponsive("H4", device) }}
                      // >
                      //   {item?.extra_attributes?.deskripsi !== undefined
                      //     ? item?.extra_attributes?.deskripsi !== ""
                      //       ? item?.extra_attributes?.deskripsi
                      //       : "-"
                      //     : "-"}
                      // </Text>
                      <RenderHTML
                        source={{ html: cleanHtml }}
                        tagsStyles={tagsStyles}
                        defaultTextProps={{ allowFontScaling: false }}
                      />

                      // <View>
                      //   <WebView
                      //     source={{ html: item?.extra_attributes?.keterangan }}
                      //     style={{
                      //       flex: 1,
                      //       height: 100,
                      //     }}
                      //     allowFileAccess={true}
                      //     textZoom={100}
                      //     androidLayerType={"hardware"}
                      //     mixedContentMode={"always"}
                      //     allowUniversalAccessFromFileURLs={true}
                      //     scalesPageToFit={true}
                      //   />
                      // </View>
                    )}
                  </View>
                </View>

                <TouchableOpacity
                  style={{
                    padding: 10,
                    backgroundColor: COLORS.info,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                  onPress={() => {
                    setModalLog(true);
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                      color: COLORS.white,
                    }}
                  >
                    Riwayat aktivitas
                  </Text>
                </TouchableOpacity>

                {/* {isMenkp() || item?.state === "done" ? (
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      backgroundColor: COLORS.danger,
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                    onPress={() => {
                      //   navigation.navigate("PdfViewer", {
                      //     // data: data.file,
                      //     type: "DokumenLain",
                      //   });

                      handleGetFileLampiran("perizinan");
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H4", device),
                        fontWeight: FONTWEIGHT.bold,
                        color: COLORS.white,
                      }}
                    >
                      Lihat Dokumen
                    </Text>
                  </TouchableOpacity>
                ) : ( */}
                <View style={{ marginTop: 10 }}>
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Lampiran
                  </Text>
                  <View style={{ width: "100%" }}>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4, width: "100%" }}
                        height={20}
                      />
                    ) : (
                      <View
                        style={{
                          flexDirection: "row", // Tetap dalam baris
                          flexWrap: "wrap", // Membungkus item ke bawah jika melebihi lebar
                          gap: device === "tablet" ? 12 : 10, // Jarak antar item
                          justifyContent: "flex-start", // Mulai dari kiri
                        }}
                      >
                        {/* {item.attachments.map((data, index) => {
                            if (data.name.split("_")[0] === "draft_perizinan" || data.name.st) {
                              return (
                                <TouchableOpacity
                                  key={index} // Tambahkan key untuk setiap item
                                  style={{
                                    marginTop: 10,
                                    padding: 10,
                                    backgroundColor: COLORS.bgLightGrey,
                                    borderRadius: 8,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: device === "tablet" ? "49%" : "48%", // Kontrol lebar agar responsif
                                  }}
                                  onPress={() => {
                                    navigation.navigate("PdfViewer", {
                                      data: data.file,
                                      type: "DokumenLain",
                                    });
                                  }}
                                >
                                  <Image
                                    source={require("../../assets/superApp/pdf.png")}
                                    style={{ height: 50, width: 50 }} // Ukuran gambar
                                  />
                                  <Text
                                    style={{
                                      fontSize: fontSizeResponsive(
                                        "H4",
                                        device
                                      ),
                                      textAlign: "center",
                                      marginTop: 5,
                                    }}
                                  >
                                    {data.name}
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: fontSizeResponsive(
                                        "H4",
                                        device
                                      ),
                                      textAlign: "center",
                                      marginTop: 5,
                                    }}
                                  >
                                    {(data.file_size / 1024).toFixed(2)} KB
                                  </Text>
                                </TouchableOpacity>
                              );
                            } else {
                              return (
                                <Text
                                  style={{
                                    fontSize: fontSizeResponsive("H4", device),
                                  }}
                                >
                                  -
                                </Text>
                              );
                            }
                          })} */}
                        {handleGetFileLampiran("perizinan") !== -1 ? (
                          // &&
                          // variant.variant === "signed"
                          <TouchableOpacity
                            style={{
                              marginTop: 10,
                              padding: 10,
                              backgroundColor: COLORS.bgLightGrey,
                              borderRadius: 8,
                              justifyContent: "center",
                              alignItems: "center",
                              width: device === "tablet" ? "49%" : "48%", // Kontrol lebar agar responsif
                            }}
                            onPress={() => {
                              navigation.navigate("PdfViewer", {
                                data: item.attachments[
                                  handleGetFileLampiran("perizinan")
                                ]?.file,
                                type: "DokumenLain",
                              });
                            }}
                          >
                            <Image
                              source={require("../../assets/superApp/pdf.png")}
                              style={{ height: 50, width: 50 }} // Ukuran gambar
                            />
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                                textAlign: "center",
                                marginTop: 5,
                              }}
                            >
                              {
                                item.attachments[
                                  handleGetFileLampiran("perizinan")
                                ]?.name
                              }
                            </Text>
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                                textAlign: "center",
                                marginTop: 5,
                              }}
                            >
                              {(
                                item.attachments[
                                  handleGetFileLampiran("perizinan")
                                ]?.file_size / 1024
                              ).toFixed(2)}{" "}
                              KB
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                        {/* {handleGetFileLampiran("draft-perizinan") !== -1 &&
                        variant.variant !== "signed" ? (
                          <TouchableOpacity
                            style={{
                              marginTop: 10,
                              padding: 10,
                              backgroundColor: COLORS.bgLightGrey,
                              borderRadius: 8,
                              justifyContent: "center",
                              alignItems: "center",
                              width: device === "tablet" ? "49%" : "48%", // Kontrol lebar agar responsif
                            }}
                            onPress={() => {
                              navigation.navigate("PdfViewer", {
                                data: item.attachments[
                                  handleGetFileLampiran("draft-perizinan")
                                ]?.file,
                                type: "DokumenLain",
                              });
                            }}
                          >
                            <Image
                              source={require("../../assets/superApp/pdf.png")}
                              style={{ height: 50, width: 50 }} // Ukuran gambar
                            />
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                                textAlign: "center",
                                marginTop: 5,
                              }}
                            >
                              {
                                item.attachments[
                                  handleGetFileLampiran("draft-perizinan")
                                ]?.name
                              }
                            </Text>
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                                textAlign: "center",
                                marginTop: 5,
                              }}
                            >
                              {(
                                item.attachments[
                                  handleGetFileLampiran("draft-perizinan")
                                ]?.file_size / 1024
                              ).toFixed(2)}{" "}
                              KB
                            </Text>
                          </TouchableOpacity>
                        ) : null} */}
                        {handleGetFileLampiran("lampiran") >= 0 ? (
                          <TouchableOpacity
                            style={{
                              marginTop: 10,
                              padding: 10,
                              backgroundColor: COLORS.bgLightGrey,
                              borderRadius: 8,
                              justifyContent: "center",
                              alignItems: "center",
                              width: device === "tablet" ? "49%" : "48%", // Kontrol lebar agar responsif
                            }}
                            onPress={() => {
                              navigation.navigate("PdfViewer", {
                                data: item.attachments[
                                  handleGetFileLampiran("lampiran")
                                ]?.file,
                                type: "DokumenLain",
                              });
                            }}
                          >
                            <Image
                              source={require("../../assets/superApp/pdf.png")}
                              style={{ height: 50, width: 50 }} // Ukuran gambar
                            />
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                                textAlign: "center",
                                marginTop: 5,
                              }}
                            >
                              {
                                item.attachments[
                                  handleGetFileLampiran("lampiran")
                                ]?.name
                              }
                            </Text>
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                                textAlign: "center",
                                marginTop: 5,
                              }}
                            >
                              {(
                                item.attachments[
                                  handleGetFileLampiran("lampiran")
                                ]?.file_size / 1024
                              ).toFixed(2)}{" "}
                              KB
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    )}
                  </View>
                </View>
                {/* )} */}
              </View>
              <View
                style={{
                  flexDirection: device === "tablet" ? "row" : "column", // Tetap dalam baris
                  flexWrap: "wrap", // Membungkus item ke bawah jika melebihi lebar
                  gap: device === "tablet" ? 0 : 10, // Jarak antar item
                  justifyContent: "flex-start", // Mulai dari kiri
                }}
              >
                {item.approvers.map((data, index) => {
                  if (index !== 0 && index < item?.approvers?.length - 1) {
                    return (
                      <View
                        style={{
                          borderWidth: 1,
                          width: device === "tablet" ? "47%" : "94%",
                          marginBottom: 10,
                          borderColor: "#DBDADE",
                          marginHorizontal:
                            device === "tablet" && orientation === "landscape"
                              ? 14
                              : device === "tablet" && orientation === "potrait"
                              ? 10
                              : 10,
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
                            Paraf
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <View style={{ width: "100%" }}>
                            <View
                              style={{
                                flexDirection: "row",
                                marginTop: 10,
                                alignItems: "center",
                                marginLeft: 5,
                                gap: 20,
                              }}
                            >
                              <Text
                                style={{
                                  fontWeight: FONTWEIGHT.bold,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                Paraf {index}
                              </Text>
                              {item.sequence > index ? (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    width: "60%",
                                    gap: 5,
                                    alignItems: "center",
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
                                      Sudah Paraf
                                    </Text>
                                  </View>
                                </View>
                              ) : item.sequence <= index ? (
                                <View
                                  style={{
                                    flexDirection: "row",
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
                                      Belum Paraf
                                    </Text>
                                  </View>
                                </View>
                              ) : null}
                            </View>
                            {handleGetTimeParaf(data.nama) !== null &&
                              item?.sequence > index && (
                                <Text
                                  style={{
                                    fontSize: fontSizeResponsive("H4", device),
                                    marginTop: 10,
                                    color: COLORS.grey,
                                    marginHorizontal: 5,
                                  }}
                                >
                                  Diparaf :{" "}
                                  {moment(
                                    handleGetTimeParaf(data?.nama)?.created_at,
                                    "YYYY-MM-DD HH:mm:ss"
                                  ).format("DD MMMM YYYY | HH:mm:ss")}
                                </Text>
                              )}
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10,
                                marginVertical: 10,
                              }}
                            >
                              <Image
                                source={{ uri: data.avatar_url }}
                                style={{
                                  width: device === "tablet" ? 80 : 50,
                                  height: device === "tablet" ? 80 : 50,
                                  borderRadius: device === "tablet" ? 80 : 50,
                                  marginHorizontal: 10,
                                  marginLeft: 5,
                                }}
                              />
                              <View>
                                {data?.officer ? (
                                  <View
                                    style={{
                                      width:
                                        device === "tablet" &&
                                        orientation === "landscape"
                                          ? 400
                                          : 230,
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
                                      <>
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
                                      </>
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
                                      <>
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
                                          {data?.officer?.nama != undefined
                                            ? data?.officer?.nama
                                            : "-" || data?.nama !== undefined
                                            ? data?.nama
                                            : "-"}
                                        </Text>
                                      </>
                                    )}
                                  </View>
                                ) : (
                                  <View
                                    style={{
                                      width:
                                        device === "tablet" &&
                                        orientation === "landscape"
                                          ? 400
                                          : 230,
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
                                      <>
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
                                      </>
                                    )}
                                  </View>
                                )}
                              </View>
                            </View>
                          </View>
                        </View>

                        {item?.sequence === data?.sequence &&
                        profile.nip === data.nip &&
                        variant.variant === "inprogress" ? (
                          <View
                            style={{
                              flexDirection: "row",
                              marginBottom: 10,
                              marginLeft: 5,
                              gap: 8,
                            }}
                          >
                            <TouchableOpacity
                              style={{
                                flexDirection: "row",
                                gap: 5,
                                backgroundColor: COLORS.successLight,
                                padding: 5,
                                borderRadius: 8,
                                justifyContent: "center",
                                alignItems: "center",
                                width: "48%",
                              }}
                              onPress={() => {
                                handleParaf();
                              }}
                            >
                              <MaterialIcons
                                name="gesture"
                                size={24}
                                color={COLORS.success}
                              />
                              <Text
                                style={{
                                  color: COLORS.success,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                Paraf
                              </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={{
                                flexDirection: "row",
                                gap: 5,
                                backgroundColor: COLORS.infoDangerLight,
                                padding: 5,
                                borderRadius: 8,
                                justifyContent: "center",
                                alignItems: "center",
                                width: "48%",
                              }}
                              onPress={() => {
                                bottomSheetAttach();
                              }}
                            >
                              <MaterialIcons
                                name="border-color"
                                size={24}
                                color={COLORS.infoDanger}
                              />
                              <Text
                                style={{
                                  color: COLORS.infoDanger,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                Revisi
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : null}
                      </View>
                    );
                  }
                })}
              </View>
            </View>
          ) : (
            ""
          )}

          {variant.variant === "inprogress" &&
          isMenkp() &&
          item?.state !== "done" ? (
            <TouchableOpacity
              style={{
                padding: 10,
                backgroundColor: COLORS.primary,
                borderRadius: 8,
                marginTop: 20,
                marginBottom: 40,
                marginHorizontal: 18,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                handleBiometricAuth();
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                  fontWeight: FONTWEIGHT.bold,
                  color: COLORS.white,
                }}
              >
                Proses Tanda Tangan
              </Text>
            </TouchableOpacity>
          ) : null}

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
                    <Ionicons
                      name="chevron-back-outline"
                      size={device === "tablet" ? 30 : 24}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      alignItems: "center",
                      flex: 1,
                      marginRight: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H1", device),
                        fontWeight: 500,
                      }}
                    >
                      Komentar
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
                  <BottomSheetTextInput
                    editable
                    multiline
                    numberOfLines={4}
                    maxLength={40}
                    placeholder="Masukan Komentar"
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
                    onChangeText={(e) => {
                      setRevisi(e);
                    }}
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
                    handleRevisi();
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                      color: COLORS.white,
                    }}
                  >
                    Revisi
                  </Text>
                </TouchableOpacity>
              </View>
            </BottomSheetView>
          </BottomSheetModal>
          <ModalSubmit
            status={status}
            setStatus={setStatus}
            messageSuccess={message}
            navigate={"MainPerizinanMenteri"}
          />

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalLog}
            onRequestClose={() => {
              setModalLog(false);
            }}
          >
            <TouchableOpacity
              style={[
                Platform.OS === "ios"
                  ? styles.iOSBackdrop
                  : styles.androidBackdrop,
                styles.backdrop,
              ]}
            />
            <View
              style={{
                alignItems: "center",
                flex: 1,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.white,
                  width: "90%",
                  borderRadius: 10,
                  height: "60%",
                }}
              >
                <View
                  style={{
                    marginHorizontal: 20,
                    marginTop: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 10,
                    borderBottomWidth: 2,
                    borderBottomColor: COLORS.grey,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Riwayat Aktivitas
                  </Text>
                  <TouchableOpacity
                    style={{}}
                    onPress={() => {
                      setModalLog(false);
                    }}
                  >
                    <Ionicons
                      name="close-outline"
                      size={device === "tablet" ? 30 : 24}
                      color={COLORS.lighter}
                    />
                  </TouchableOpacity>
                </View>

                <Timeline
                  style={{
                    flex: 1,
                    marginTop: 10,
                    marginHorizontal: 20,
                  }}
                  data={timelineData}
                  circleSize={device === "tablet" ? 60 : 30}
                  iconStyle={{ marginRight: device === "tablet" ? 20 : 0 }}
                  circleColor="white"
                  lineColor="gray"
                  timeStyle={{
                    textAlign: "center",
                    padding: 5,
                    borderRadius: 13,
                    minWidth: 10, // Add minWidth to maintain consistent size for timeß
                  }}
                  descriptionStyle={{ color: "grey" }}
                  innerCircle={"icon"}
                  showTime={false}
                  renderDetail={(rowData) => (
                    <View
                      style={{
                        marginTop: -10,
                        marginLeft: device === "tablet" ? 20 : 0,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        {rowData.title}
                      </Text>
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        {rowData.time}
                      </Text>
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        {rowData.description}
                      </Text>
                    </View>
                  )}
                />
              </View>
            </View>
          </Modal>
        </ScrollView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  Card: {
    backgroundColor: COLORS.white,
    width: "90%", // Adjust the width as needed, e.g., "90%" or a fixed value like 300
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // Adds shadow for Android
  },
  iOSBackdrop: {
    backgroundColor: "#000",
    opacity: 0.5,
  },
  androidBackdrop: {
    backgroundColor: "#000",
    opacity: 0.7,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
