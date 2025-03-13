import React, { useEffect, useMemo, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { Image } from "react-native";
import { ScrollView } from "react-native";
import { Text } from "react-native";
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
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import ListEmpty from "../../components/ListEmpty";
import moment from "moment/min/moment-with-locales";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { getTokenValue } from "../../service/session";
import { putTandaTangan } from "../../service/api";
import { ModalSubmit } from "../../components/ModalSubmit";
import { setStatus } from "../../store/DigitalSign";

export const DetailSertifikat = ({ route }) => {
  const data = route.params;
  const navigation = useNavigation();
  const bottomSheetModalRef = useRef(null);
  const [paraphrase, setParaphrase] = useState("");
  const [isApprover, setIsApprover] = useState("");
  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const { digitalsign, loading, status } = useSelector(
    (state) => state.digitalsign
  );
  const { profile } = useSelector((state) => state.superApps);
  const item = digitalsign.detail;
  let tanggalApprove = [];

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

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  // const [file, setFile] = useState();
  // useEffect(() => {
  //   if (file === undefined) {
  //     item.attachments?.map((item) => {
  //       setFile({ link: item.file });
  //     });
  //   }
  // }, [file, item]);

  useEffect(() => {
    let nipApprover = [];
    for (let i = 0; i < item?.approvers?.length; i++) {
      if (i > 0) {
        if (!item?.approvers[i].is_title)
          nipApprover.push(item?.approvers[i].nip);
        else nipApprover.push(item?.approvers[i].officer.nip);
      }
    }

    if (nipApprover.includes(profile.nip)) setIsApprover(true);
    else setIsApprover(false);
  }, [data, item]);

  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);

  const currentDate = new Date();

  const handleSubmit = () => {
    const payload = {
      passphrase: paraphrase,
      id_documents: [item.id],
      signature_date: moment(currentDate, "YYYY-MM-DD HH:mm:ss").format(
        DATETIME.LONG_DATE
      ),
      komentar: "",
    };
    const data = {
      token: token,
      payload: payload,
    };
    dispatch(putTandaTangan(data));
  };

  const { device } = useSelector((state) => state.apps);

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
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 20,
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
                Detail Sertifikat
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
                    No Sertifikat
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
                        {item?.extra_attributes?.noSertif}
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
                          color: COLORS.lighter,
                        }}
                      >
                        {item?.composer?.nama}
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
                    {/* <Image source={item.composer.avatar} /> */}
                    <View style={{ width: "100%" }}>
                      {loading ? (
                        <ShimmerPlaceHolder
                          style={{ borderRadius: 4, width: "100%" }}
                          height={20}
                        />
                      ) : (
                        <View>
                          {item.receivers[0]?.display_title !== undefined ? (
                            <View>
                              <Text
                                style={{
                                  fontWeight: FONTWEIGHT.bold,
                                  color: COLORS.info,
                                  marginBottom: 5,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {item.receivers[0]?.display_title !== undefined
                                  ? item.receivers[0]?.display_title
                                  : null}
                              </Text>
                              <Text
                                style={{
                                  color: COLORS.lighter,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {item.receivers[0].officer.nama !== undefined
                                  ? item.receivers[0].officer.nama
                                  : null}
                              </Text>
                            </View>
                          ) : (
                            <Text
                              style={{
                                color: COLORS.lighter,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              {item.receivers[0].nama}
                            </Text>
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
                        {item.extra_attributes?.tanggalSertif}
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
                    Jenis Sertifikat
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
                        {item.extra_attributes?.tipe}
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
                    Judul Pelatihan
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
                        {item.extra_attributes?.course?.name !== undefined
                          ? item.extra_attributes?.course?.name
                          : item.extra_attributes?.nama_course}
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
                    Penyelenggara
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
                        {item.extra_attributes?.penyelenggara !== undefined
                          ? item.extra_attributes?.penyelenggara
                          : "-"}
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
                    Tempat Pelatihan
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
                        {item.extra_attributes?.tempat === undefined
                          ? "-"
                          : item.extra_attributes?.tempat}
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
                        {item.extra_attributes?.keterangan === undefined ||
                        item.extra_attributes?.keterangan === ""
                          ? "-"
                          : item.extra_attributes?.keterangan}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              {item.approvers?.map((data, index) => {
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
                            {item.sequence === 1 && item.sequence <= index ? (
                              <View
                                style={{
                                  flexDirection: "row",
                                  width: "60%",
                                  justifyContent: "center",
                                  alignItems: "center",
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
                                    marginHorizontal: 3,
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
                            ) : item.sequence === 2 &&
                              item.sequence !== index ? (
                              <View
                                style={{
                                  flexDirection: "row",
                                  width: "60%",
                                  justifyContent: "center",
                                  alignItems: "center",
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
                            ) : item.sequence === 2 &&
                              item.sequence === index ? (
                              <View
                                style={{
                                  flexDirection: "row",
                                  width: "60%",
                                  justifyContent: "center",
                                  alignItems: "center",
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
                                    marginHorizontal: 3,
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
                            ) : item.sequence === 3 ? (
                              <View
                                style={{
                                  flexDirection: "row",
                                  width: "60%",
                                  justifyContent: "center",
                                  alignItems: "center",
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
                            ) : null}
                          </View>
                          <View style={{ flexDirection: "row", columnGap: 10 }}>
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
                                    <ShimmerPlaceHolder
                                      style={{ borderRadius: 4, marginTop: 5 }}
                                      width={330}
                                      height={20}
                                    />
                                  ) : (
                                    <Text
                                      style={{
                                        marginTop: 10,
                                        color: COLORS.info,
                                        fontWeight: FONTWEIGHT.bold,
                                        textAlign: "left",
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
                                      width={165}
                                      height={20}
                                    />
                                  ) : (
                                    <Text
                                      style={{
                                        marginTop: 2,
                                        color: COLORS.lighter,
                                        fontWeight: FONTWEIGHT.bold,
                                        textAlign: "left",
                                        fontSize: fontSizeResponsive(
                                          "H4",
                                          device
                                        ),
                                      }}
                                    >
                                      {data.officer.nama}
                                    </Text>
                                  )}
                                </View>
                              ) : (
                                <View style={{ width: "95%" }}>
                                  {loading ? (
                                    <ShimmerPlaceHolder
                                      style={{ borderRadius: 4, marginTop: 5 }}
                                      width={330}
                                      height={20}
                                    />
                                  ) : (
                                    <Text
                                      style={{
                                        marginTop: 10,
                                        color: COLORS.lighter,
                                        fontWeight: FONTWEIGHT.bold,
                                        fontSize: fontSizeResponsive(
                                          "H4",
                                          device
                                        ),
                                      }}
                                    >
                                      {data.nama}
                                    </Text>
                                  )}
                                </View>
                              )}
                              {/* {index < item?.logs?.length ? (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    gap: 10,
                                    marginTop: 5,
                                    marginBottom: 10,
                                  }}
                                >
                                  <Text style={{ color: COLORS.lighter }}>
                                    Disetujui :
                                  </Text>
                                  {loading ? (
                                    <ShimmerPlaceHolder
                                      style={{ borderRadius: 4, marginTop: 5 }}
                                      width={165}
                                      height={20}
                                    />
                                  ) : (
                                    <>
                                      <Text style={{ color: COLORS.lighter }}>
                                        {moment(tanggalApprove[index]).format(
                                          "DD MMMM YYYY"
                                        )}
                                      </Text>
                                      <View
                                        style={{
                                          height: "100%",
                                          width: 1,
                                          backgroundColor: COLORS.lighter,
                                        }}
                                      />
                                      <Text style={{ color: COLORS.lighter }}>
                                        {moment(tanggalApprove[index]).format(
                                          "HH:mm"
                                        )}
                                      </Text>
                                    </>
                                  )}
                                </View>
                              ) : (
                                <Text
                                  style={{
                                    color: COLORS.lighter,
                                    marginVertical: 10,
                                  }}
                                >
                                  -
                                </Text>
                              )} */}
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
          <View style={{ gap: 15, marginTop: 15 }}>
            {loading ? null : (
              <TouchableOpacity
                onPress={() => {
                  if (
                    item.attachments.length !== 0 &&
                    item.attachments[0].file !== undefined
                  ) {
                    navigation.navigate("PdfViewer", {
                      data: item?.attachments[0].file,
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
                    fontSize: fontSizeResponsive("H2", device),
                  }}
                >
                  Lihat Dokumen
                </Text>
              </TouchableOpacity>
            )}

            {isApprover === true && (data === "ready" || data === "retry") ? (
              <TouchableOpacity
                style={{
                  width: "90%",
                  backgroundColor: COLORS.infoDanger,
                  borderRadius: 6,
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginHorizontal: 20,
                }}
                onPress={() => bottomSheetAttach()}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    marginVertical: 15,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Sign
                </Text>
              </TouchableOpacity>
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
                      Tanda Tangan Sertifikat
                    </Text>
                  </TouchableOpacity>
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
                    onChangeText={setParaphrase}
                    allowFontScaling={false}
                  />
                </View>

                {/* <View
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
                  />
                </View> */}

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
                    marginBottom: 40,
                  }}
                  onPress={() => {
                    bottomSheetAttachClose();
                    handleSubmit();
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
            </BottomSheetView>
          </BottomSheetModal>

          <ModalSubmit
            status={status}
            setStatus={setStatus}
            messageSuccess={"Data Ditambahkan"}
            navigate={"MainDigitalSign"}
          />
        </ScrollView>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};
