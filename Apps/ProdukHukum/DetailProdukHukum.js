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
import {
  COLORS,
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
  BottomSheetTextInput,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/min/moment-with-locales";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { ModalSubmit } from "../../components/ModalSubmit";
import { setStatus } from "../../store/ProdukHukum";
import {
  parafProdukHukum,
  revisionProdukHukum,
  ttdeProdukHukum,
} from "../../service/api";
import * as LocalAuthentication from "expo-local-authentication";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Divider } from "react-native-paper";
import { getTokenValue } from "../../service/session";

export const DetailProdukHukum = ({ route }) => {
  const navigation = useNavigation();
  const bottomSheetModalRef = useRef(null);
  const { detail, status, loading, message } = useSelector(
    (state) => state.produkHukum
  );
  const [dataViewPdf, setDataViewPdf] = useState();
  const [isAuthors, setIsAuthors] = useState();
  const [passphrase, setPassphrase] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [comment, setComment] = useState("");
  const [bottomInput, setBottomInput] = useState("");
  useEffect(() => {
    //set posisi author
    if (Object.keys(detail)?.length != 0) {
      cekAttachment(detail);
      cekHakAksesUser(detail.approvers);
      if (detail?.authors) {
        cekAuthors(detail?.authors);
      }
    }
  }, [detail]);
  const [indexLampiran, setIndexLampiran] = useState("");
  const [indexDraft, setIndexDraft] = useState("");
  const [indexFinal, setIndexFinal] = useState("");
  const cekAttachment = (data) => {
    let tmpLampiran = data.attachments.findIndex((dat) =>
      dat.name.includes("attachment_")
    );
    let tmpDraft = "";
    let tmpFinal = "";
    if (data.tipe_dokumen == "dokumen_permen") {
      if (data.state == "done") {
        tmpDraft = data.attachments.findIndex(
          (dat) => dat.name.includes("permen_") && dat.description == "archived"
        );
        tmpFinal = data.attachments.findIndex(
          (dat) => dat.description == "signed"
        );
      } else if (data.state == "ttde") {
        tmpDraft = data.attachments.findIndex(
          (dat) => dat.name.includes("permen_") && dat.description == "archived"
        );
        tmpFinal = data.attachments.findIndex(
          (dat) => dat.name.includes("permen_") && dat.description == null
        );
      } else {
        tmpDraft = data.attachments.findIndex(
          (dat) => dat.name.includes("permen_") && dat.description == null
        );
      }
    } else if (data.tipe_dokumen == "dokumen_kepmen") {
      if (data.state == "done") {
        tmpDraft = data.attachments.findIndex(
          (dat) => dat.name.includes("kepmen_") && dat.description == "archived"
        );
        tmpFinal = data.attachments.findIndex(
          (dat) => dat.description == "signed"
        );
      } else if (data.state == "ttde") {
        tmpDraft = data.attachments.findIndex(
          (dat) => dat.name.includes("kepmen_") && dat.description == "archived"
        );
        tmpFinal = data.attachments.findIndex(
          (dat) => dat.name.includes("kepmen_") && dat.description == null
        );
      } else {
        tmpDraft = data.attachments.findIndex(
          (dat) => dat.name.includes("kepmen_") && dat.description == null
        );
      }
    }
    setIndexLampiran(tmpLampiran);
    setIndexDraft(tmpDraft);
    setIndexFinal(tmpFinal);
    console.log(tmpLampiran + "-" + tmpDraft + "-" + tmpFinal);
  };

  const [hakViewDocFinal, setHakViewDocFinal] = useState("");

  const cekHakAksesUser = (approvers) => {
    const lastApprovers = approvers.length - 1;
    if (
      profile.nip == approvers[0].nip ||
      profile.nip == approvers[1].nip ||
      profile.nip == approvers[lastApprovers].nip
    ) {
      setHakViewDocFinal(true);
    } else {
      setHakViewDocFinal(false);
    }
  };
  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetAttach = (tipe) => {
    setBottomInput(tipe);
    bottomSheetModalRef.current?.present();
  };

  const bottomSheetAttachClose = () => {
    if (bottomSheetModalRef.current) bottomSheetModalRef.current?.close();
  };
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);
  const { device } = useSelector((state) => state.apps);
  const dispatch = useDispatch();

  const handleParaf = () => {
    const payload = {
      id_documents: [detail?.id],
    };
    const data = {
      token: token,
      payload: payload,
    };
    dispatch(parafProdukHukum(data));
  };

  const handleRevision = () => {
    const payload = {
      comment: comment,
    };
    const data = {
      id: detail?.id,
      token: token,
      payload: payload,
    };
    dispatch(revisionProdukHukum(data));
  };
  const handleTTDE = () => {
    const payload = {
      passphrase: profile?.nip == "88888" ? "" : passphrase,
    };
    const data = {
      id: detail?.id,
      token: token,
      payload: payload,
    };
    dispatch(ttdeProdukHukum(data));
  };

  //FINGERPRINT

  const handleBiometricAuth = async () => {
    // Check if hardware supports biometrics
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    // Fallback to default authentication method (password) if Fingerprint is not available
    // if (!isBiometricAvailable) return bottomSheetModalRef.current?.present();
    if (!isBiometricAvailable) return handleTTDE();

    // Check Biometrics types available (Fingerprint, Facial recognition, Iris recognition)
    let supportedBiometrics;
    if (isBiometricAvailable)
      supportedBiometrics =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

    // Check Biometrics are saved locally in user's device
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    // if (!savedBiometrics) return bottomSheetModalRef?.current?.present();
    if (!savedBiometrics) return handleTTDE();

    // Authenticate use with Biometrics (Fingerprint, Facial recognition, Iris recognition)

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login with Biometrics",
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    });
    // Log the user in on success
    if (biometricAuth.success) {
      handleTTDE();
    }
  };

  const { profile } = useSelector((state) => state.superApps);

  const handleShowAttachment = (type) => {
    let idxAtt = -1;

    let attachments = detail?.attachments;

    if (attachments?.length !== 0) {
      attachments?.map((item, i) => {
        let name = item?.name.toLowerCase();
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
  const [token, setToken] = useState();
  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);
  const cekAuthors = (data) => {
    // let tmp_approved_by = detail?.approved_by ? detail?.approved_by : [];
    // const found = data.find((data) => data == profile?.nip);
    // const isApproved = tmp_approved_by.find((data) => data == profile?.nip);
    const found = data.find((dat) => dat.nip == profile?.nip && !dat.is_paraf);
    const konseptor = detail.authors.includes(profile?.nip);
    setIsAuthors(found || konseptor);
  };
  const listParaf = (data, index) => {
    return (
      <View
        key={data?.id}
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
              alignItems: "center",
              columnGap: 10,
            }}
          >
            <Image
              source={{ uri: data?.avatar_url }}
              style={{
                width: device === "tablet" ? 80 : 50,
                height: device === "tablet" ? 80 : 50,
                borderRadius: device === "tablet" ? 80 : 50,
                margin: 10,
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
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      {data?.display_title}
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
                        fontSize: fontSizeResponsive("H2", device),
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
                        fontSize: fontSizeResponsive("H2", device),
                      }}
                    >
                      {data?.nama !== undefined ? data?.nama : "-"}
                    </Text>
                  )}
                </View>
              )}

              {data?.is_paraf ? (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      width: "60%",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 5,
                      marginTop: 5,
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
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Sudah {data?.nip === "88888" ? "Menyetujui" : "Paraf"}
                      </Text>
                    </View>
                  </View>
                  {index < detail.approvers?.length - 1 && (
                    <View
                      style={{
                        width: "100%",
                        height: 2,
                        backgroundColor: COLORS.ExtraDivinder,
                        marginTop: 5,
                      }}
                    />
                  )}
                </>
              ) : (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      width: "60%",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 5,
                      marginTop: 5,
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
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        {data?.nip == "88888"
                          ? "Belum Menyetujui"
                          : "Belum Paraf"}
                      </Text>
                    </View>
                  </View>
                  {index < detail.approvers?.length - 1 && (
                    <View
                      style={{
                        width: "100%",
                        height: 2,
                        backgroundColor: COLORS.ExtraDivinder,
                        marginTop: 5,
                      }}
                    />
                  )}
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const { width } = useWindowDimensions();

  let responsive = 0;
  let widthFile = 0;

  if (device === "phone") {
    responsive = 2;
    widthFile = width / responsive - 48;
  } else if (device === "tablet") {
    responsive = 3;
    widthFile = width / responsive - 32;
  }

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
                Detail Produk Hukum
              </Text>
            </View>
          </View>

          {Object.keys(detail).length !== 0 ? (
            <>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  marginHorizontal: 16,
                  borderRadius: 8,
                  marginTop: 20,
                }}
              >
                <View style={{ margin: 20, width: "89%" }}>
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
                        textTransform: "capitalize",
                      }}
                    >
                      {detail?.subject}
                    </Text>
                  )}

                  <View
                    style={{ flexDirection: "row", gap: 10, marginTop: 20 }}
                  >
                    <Text
                      style={{
                        width: "45%",
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H2", device),
                      }}
                    >
                      Nomor Dokumen
                    </Text>
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
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
                          style={{ fontSize: fontSizeResponsive("H2", device) }}
                        >
                          {detail?.extra_attributes?.no_produk_hukum
                            ? detail?.extra_attributes?.no_produk_hukum
                            : "-"}
                        </Text>
                      )}
                    </View>
                  </View>

                  <View
                    style={{ flexDirection: "row", gap: 10, marginTop: 20 }}
                  >
                    <Text
                      style={{
                        width: "45%",
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H2", device),
                      }}
                    >
                      Tanggal Penetapan
                    </Text>
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
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
                          style={{ fontSize: fontSizeResponsive("H2", device) }}
                        >
                          {detail?.extra_attributes?.tanggal_penetapan
                            ? moment(
                                detail?.extra_attributes?.tanggal_penetapan
                              )
                                .locale("id")
                                .format("DD MMMM yyyy")
                            : "-"}
                        </Text>
                      )}
                    </View>
                  </View>

                  <View
                    style={{ flexDirection: "row", gap: 10, marginTop: 20 }}
                  >
                    <Text
                      style={{
                        width: "45%",
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H2", device),
                      }}
                    >
                      Jenis Perencanaan
                    </Text>
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
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
                          style={{ fontSize: fontSizeResponsive("H2", device) }}
                        >
                          {detail?.extra_attributes?.jenis_perencanaan}
                        </Text>
                      )}
                    </View>
                  </View>

                  <View
                    style={{ flexDirection: "row", gap: 10, marginTop: 20 }}
                  >
                    <Text
                      style={{
                        width: "45%",
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H2", device),
                      }}
                    >
                      Konseptor
                    </Text>
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
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
                            {/* <Image
                              source={{ uri: detail?.composer?.avatar_url }}
                              style={{
                                width: device === "tablet" ? 80 : 50,
                                height: device === "tablet" ? 80 : 50,
                                borderRadius: device === "tablet" ? 80 : 50,
                                marginVertical: 10,
                                marginHorizontal: 10,
                                marginLeft: 5,
                              }}
                            /> */}
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H2", device),
                              }}
                            >
                              {detail?.composer?.is_title
                                ? detail?.composer?.officer?.nama
                                : detail?.composer?.nama}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>

                  <View
                    style={{ flexDirection: "row", gap: 10, marginTop: 20 }}
                  >
                    <Text
                      style={{
                        width: "45%",
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H2", device),
                      }}
                    >
                      Pejabat Pemrakarsa
                    </Text>
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
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
                          style={{ fontSize: fontSizeResponsive("H2", device) }}
                        >
                          {detail?.approvers[2]?.[0]?.nama}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View
                    style={{ flexDirection: "row", gap: 10, marginTop: 20 }}
                  >
                    <Text
                      style={{
                        width: "45%",
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H2", device),
                      }}
                    >
                      Pejabat Unit Terkait
                    </Text>
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
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
                          style={{ fontSize: fontSizeResponsive("H2", device) }}
                        >
                          {detail?.approvers[2]?.[1]?.nama}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  marginHorizontal: 16,
                  borderRadius: 8,
                  marginTop: 20,
                }}
              >
                <View
                  style={{
                    borderRadius: 4,
                    margin: 20,
                    borderColor: "#DBDADE",
                    gap: 10,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H1", device),
                    }}
                  >
                    {detail?.state === "done"
                      ? "Dokumen"
                      : detail?.state === "ttde"
                      ? "Updated Draft"
                      : "Draft"}{" "}
                    Produk Hukum
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "flex-start",
                      gap: 10,
                    }}
                  >
                    {detail?.state === "done" && hakViewDocFinal && (
                      <TouchableOpacity
                        style={{
                          padding: 10,
                          backgroundColor: COLORS.bgLightGrey,
                          borderRadius: 8,
                          justifyContent: "center",
                          alignItems: "center",
                          width: widthFile,
                          flex: 0,
                          gap: 10,
                        }}
                        onPress={() =>
                          navigation.navigate("PdfViewer", {
                            data: detail?.attachments[0]?.file,
                            type: "DokumenLain",
                          })
                        }
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            fontWeight: FONTWEIGHT.bold,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          Final Dokumen
                        </Text>
                        <Image
                          source={require("../../assets/superApp/pdf.png")}
                          style={{ height: 50, width: 50 }}
                        />
                        <Text
                          style={{
                            textAlign: "center",
                            marginTop: 5,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          {(detail?.attachments[0]?.file_size / 1024).toFixed(
                            2
                          )}{" "}
                          KB
                        </Text>
                      </TouchableOpacity>
                    )}

                    {indexDraft >= 0 && (
                      <TouchableOpacity
                        style={{
                          padding: 10,
                          backgroundColor: COLORS.bgLightGrey,
                          borderRadius: 8,
                          justifyContent: "center",
                          alignItems: "center",
                          width: widthFile,
                          flex: 0,
                          gap: 10,
                        }}
                        onPress={() =>
                          navigation.navigate("PdfViewer", {
                            data: detail?.attachments[indexDraft]?.file,
                            type: "DokumenLain",
                          })
                        }
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            fontWeight: FONTWEIGHT.bold,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          Arsip Draft
                        </Text>
                        <Image
                          source={require("../../assets/superApp/pdf.png")}
                          style={{ height: 50, width: 50 }}
                        />
                        <Text
                          style={{
                            textAlign: "center",
                            marginTop: 5,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          {(
                            detail?.attachments[indexDraft]?.file_size / 1024
                          ).toFixed(2)}{" "}
                          KB
                        </Text>
                      </TouchableOpacity>
                    )}

                    {indexLampiran >= 0 && (
                      <TouchableOpacity
                        style={{
                          padding: 10,
                          backgroundColor: COLORS.bgLightGrey,
                          borderRadius: 8,
                          justifyContent: "center",
                          alignItems: "center",
                          width: widthFile,
                          flex: 0,
                          gap: 10,
                        }}
                        onPress={() =>
                          navigation.navigate("PdfViewer", {
                            data: detail?.attachments[indexLampiran]?.file,
                            type: "DokumenLain",
                          })
                        }
                      >
                        <Text
                          style={{
                            textAlign: "center",
                            fontWeight: FONTWEIGHT.bold,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          Arsip Lampiran
                        </Text>
                        <Image
                          source={require("../../assets/superApp/pdf.png")}
                          style={{ height: 50, width: 50 }}
                        />
                        <Text
                          style={{
                            textAlign: "center",
                            marginTop: 5,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          {(
                            detail?.attachments[indexLampiran]?.file_size / 1024
                          ).toFixed(2)}{" "}
                          KB
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: COLORS.white,
                  marginHorizontal: 16,
                  borderRadius: 8,
                  marginTop: 20,
                }}
              >
                <View
                  style={{
                    borderRadius: 4,
                    margin: 20,
                    borderColor: "#DBDADE",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H1", device),
                      }}
                    >
                      List Paraf
                    </Text>
                  </View>

                  {detail &&
                    detail?.approvers?.map((data, index) => {
                      if (index > 0) {
                        if (index == 2) {
                          return data?.map((item, i) => {
                            return listParaf(item, index);
                          });
                        } else {
                          return listParaf(data, index);
                        }
                      }
                    })}
                </View>
              </View>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  marginHorizontal: 16,
                  borderRadius: 8,
                  marginTop: 20,
                }}
              >
                <View
                  style={{
                    borderRadius: 4,
                    margin: 20,
                    borderColor: "#DBDADE",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H1", device),
                      }}
                    >
                      Log Aktivitas
                    </Text>
                  </View>

                  {detail?.logs?.map((data, index) => {
                    return (
                      <View>
                        <View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              marginVertical: 10,
                            }}
                          >
                            <View>
                              <Text
                                style={{
                                  fontWeight: FONTWEIGHT.bold,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {data?.user}
                              </Text>
                              <View
                                style={{
                                  backgroundColor: COLORS.bgLightGrey,
                                  alignSelf: "flex-start",
                                  paddingVertical: 5,
                                  borderRadius: 20,
                                  paddingHorizontal: 15,
                                }}
                              >
                                <Text
                                  style={{
                                    color: "black",
                                    fontSize: fontSizeResponsive("H4", device),
                                  }}
                                >
                                  {data?.action}
                                </Text>
                              </View>
                              <Text
                                style={{
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                ({data?.message})
                              </Text>
                            </View>
                            <View style={{ alignItems: "flex-end" }}>
                              <Text
                                style={{
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {data?.created_at
                                  ? moment(data?.created_at)
                                      .locale("id")
                                      .format("DD MMM yyyy")
                                  : "-"}
                              </Text>
                              <Text
                                style={{
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {data?.created_at
                                  ? moment(data?.created_at)
                                      .locale("id")
                                      .format("HH.mm")
                                  : "-"}
                              </Text>
                            </View>
                          </View>
                        </View>
                        {index != detail?.logs?.length - 1 && <Divider />}
                      </View>
                    );
                  })}
                </View>
              </View>
            </>
          ) : (
            ""
          )}
          <View style={{ gap: 15, marginTop: 15, marginBottom: 15 }}>
            {profile?.nip == "88888" && detail?.state == "ttde" && (
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.infoDanger,
                  borderRadius: 6,
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginHorizontal: 16,
                }}
                onPress={() => {
                  if (profile?.nip == "88888") {
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
                    fontSize: fontSizeResponsive("H2", device),
                  }}
                >
                  Proses Tanda Tangan
                </Text>
              </TouchableOpacity>
            )}
            {isAuthors && detail?.state == "in_progress" && (
              <>
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.infoDanger,
                    borderRadius: 6,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginHorizontal: 16,
                  }}
                  onPress={() => {
                    // handleBiometricAuth();
                    handleParaf();
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      marginVertical: 15,
                      fontSize: fontSizeResponsive("H2", device),
                    }}
                  >
                    {profile?.nip ==
                      detail?.approvers[detail?.approvers?.length - 1]?.nip &&
                    detail?.state != "done"
                      ? "Setujui"
                      : "Paraf"}{" "}
                    Dokumen
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.orange,
                    borderRadius: 6,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginHorizontal: 16,
                  }}
                  onPress={() => {
                    // handleBiometricAuth();
                    // handleRevision();

                    bottomSheetAttach("revisi");
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      marginVertical: 15,
                      fontSize: fontSizeResponsive("H2", device),
                    }}
                  >
                    Revisi
                  </Text>
                </TouchableOpacity>
              </>
            )}
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
                      {bottomInput == "revisi"
                        ? "Kembalikan Produk Hukum"
                        : "Tanda Tangan Produk Hukum"}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    borderWidth: 1,
                    width: "90%",
                    height: 40,
                    paddingHorizontal: 10,
                    borderRadius: 6,
                    borderColor: "#D0D5DD",
                    flexDirection: "row",
                    marginLeft: 20,
                    margin: 20,
                  }}
                >
                  {bottomInput == "revisi" ? (
                    <BottomSheetTextInput
                      style={{
                        width: "100%",
                        height: 40,
                        borderRadius: 6,
                        borderColor: "#D0D5DD",
                      }}
                      onChangeText={(e) => {
                        setComment(e);
                      }}
                      placeholder="Masukkan Komentar"
                      defaultValue={comment}
                      // autoFocus
                    />
                  ) : (
                    <>
                      <BottomSheetTextInput
                        style={{
                          width: "90%",
                          height: 40,
                          borderRadius: 6,
                          borderColor: "#D0D5DD",
                        }}
                        onChangeText={(e) => {
                          setPassphrase(e);
                        }}
                        placeholder="Masukkan Passphrase"
                        defaultValue={passphrase}
                        secureTextEntry={showPass}
                        autoFocus
                      />
                      <View
                        style={{
                          alignItems: "flex-end",
                          flex: 1,
                          marginRight: 10,
                          justifyContent: "center",
                        }}
                      >
                        {showPass == false ? (
                          <TouchableOpacity
                            onPress={() => {
                              setShowPass(true);
                            }}
                          >
                            <Ionicons
                              name="eye-off-sharp"
                              size={device === "tablet" ? 30 : 24}
                              color={COLORS.grey}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              setShowPass(false);
                            }}
                          >
                            <Ionicons
                              name="eye-sharp"
                              size={device === "tablet" ? 30 : 24}
                              color={COLORS.grey}
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </>
                  )}
                </View>

                <TouchableOpacity
                  style={{
                    width: "90%",
                    backgroundColor:
                      bottomInput == "revisi" ? COLORS.orange : COLORS.danger,
                    height: 50,
                    marginBottom: 40,
                    borderRadius: 6,
                    alignItems: "center",
                    marginHorizontal: 20,
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    bottomSheetAttachClose();
                    if (bottomInput == "revisi") {
                      handleRevision();
                    } else {
                      handleTTDE();
                    }
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: FONTSIZE.H1,
                      fontWeight: 500,
                    }}
                  >
                    {bottomInput == "revisi" ? "Kirim Revisi" : "Tanda Tangan"}
                  </Text>
                </TouchableOpacity>
              </View>
            </BottomSheetView>
          </BottomSheetModal>
          {status?.length != 0 && (
            <ModalSubmit
              status={status}
              setStatus={setStatus}
              messageSuccess={message}
              navigate={"ProdukHukum"}
            />
          )}
        </ScrollView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};
