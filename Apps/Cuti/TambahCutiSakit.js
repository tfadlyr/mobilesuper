import React, { useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import {
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Modal,
  Pressable,
  FlatList,
  Platform,
  useWindowDimensions,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { Text } from "react-native-paper";
import {
  COLORS,
  DATETIME,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
  getOrientation,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet } from "react-native";
import DatePicker from "react-native-modern-datepicker";
import moment from "moment/min/moment-with-locales";
import { Dropdown } from "../../components/DropDown";
import { Search } from "../../components/Search";
import {
  getPilihApproval,
  getPilihApprovalPejabat,
  postAttachmentCuti,
  postPembatalanCuti,
  postPengajuanCuti,
} from "../../service/api";
import { ModalSubmit } from "../../components/ModalSubmit";
import { setAttachmentCuti, setStatus } from "../../store/Cuti";
import * as DocumentPicker from "expo-document-picker";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { ResizeMode, Video } from "expo-av";
import { getTokenValue } from "../../service/session";

const kategories = [
  { key: "q", value: "satu" },
  { key: "e", value: "dua" },
  { key: "r", value: "tiga" },
  { key: "t", value: "empat" },
];

export const CardlPimpinan = ({ item }) => {
  return <Text>{item.nama_lengkap}</Text>;
};

const CardLampiran = ({ lampiran, onClick, type, id, name, size, device }) => {
  const navigation = useNavigation();

  return type === "png" || type === "jpg" || type === "jpeg" ? (
    <TouchableOpacity key={id} onPress={onClick}>
      <View
        style={{
          padding: 10,
          borderRadius: 8,
          backgroundColor: COLORS.secondaryLighter,
          alignItems: "center",
          width: 110,
          rowGap: 5,
          marginRight: 10,
        }}
      >
        <Image
          source={{ uri: lampiran }}
          style={{ width: 90, height: 90, borderRadius: 8 }}
        />
        {/* <Text
          style={{
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          style={{
            color: COLORS.lighter,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {Math.floor(size / 1000)} MB
        </Text> */}
      </View>
    </TouchableOpacity>
  ) : type === "mp4" ? (
    <TouchableOpacity key={id} onPress={onClick}>
      <View
        style={{
          padding: 10,
          borderRadius: 8,
          backgroundColor: COLORS.secondaryLighter,
          alignItems: "center",
          width: 110,
          rowGap: 5,
          marginRight: 10,
        }}
      >
        <Image
          source={require("../../assets/superApp/mp4.png")}
          style={{ width: 90, height: 90 }}
        />
        {/* <Text
          style={{
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          style={{
            color: COLORS.lighter,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {Math.floor(size / 1000)} MB
        </Text> */}
      </View>
    </TouchableOpacity>
  ) : type === "doc" || type === "docx" ? (
    <TouchableOpacity
      key={id}
      onPress={() =>
        navigation.navigate("FileViewer", {
          lampiran: lampiran,
          type: type,
        })
      }
    >
      <View
        style={{
          padding: 10,
          borderRadius: 8,
          backgroundColor: COLORS.secondaryLighter,
          alignItems: "center",
          width: 110,
          rowGap: 5,
          marginRight: 10,
        }}
      >
        <Image
          source={require("../../assets/superApp/word.png")}
          style={{ width: 90, height: 90 }}
        />
        {/* <Text
          style={{
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          style={{
            color: COLORS.lighter,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {Math.floor(size / 1000)} MB
        </Text> */}
      </View>
    </TouchableOpacity>
  ) : type === "xls" || type === "xlsx" ? (
    <TouchableOpacity
      key={id}
      onPress={() =>
        navigation.navigate("FileViewer", {
          lampiran: lampiran,
          type: type,
        })
      }
    >
      <View
        style={{
          padding: 10,
          borderRadius: 8,
          backgroundColor: COLORS.secondaryLighter,
          alignItems: "center",
          width: 110,
          rowGap: 5,
          marginRight: 10,
        }}
      >
        <Image
          source={require("../../assets/superApp/excel.png")}
          style={{ width: 90, height: 90 }}
        />
        {/* <Text
          style={{
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          style={{
            color: COLORS.lighter,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {Math.floor(size / 1000)} MB
        </Text> */}
      </View>
    </TouchableOpacity>
  ) : type === "pdf" ? (
    <TouchableOpacity
      key={id}
      onPress={() =>
        navigation.navigate("FileViewer", {
          lampiran: "https://" + lampiran,
          type: "pdf",
        })
      }
    >
      <View
        style={{
          padding: 10,
          borderRadius: 8,
          backgroundColor: COLORS.secondaryLighter,
          alignItems: "center",
          width: 110,
          rowGap: 5,
          marginRight: 10,
        }}
      >
        <Image
          source={require("../../assets/superApp/pdf.png")}
          style={{ width: 90, height: 90 }}
        />
        {/* <Text
          style={{
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          style={{
            color: COLORS.lighter,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {Math.floor(size / 1000)} MB
        </Text> */}
      </View>
    </TouchableOpacity>
  ) : type === "ppt" || type === "pptx" ? (
    <TouchableOpacity
      key={id}
      onPress={() =>
        navigation.navigate("FileViewer", {
          lampiran: lampiran,
          type: type,
        })
      }
    >
      <View
        style={{
          padding: 10,
          borderRadius: 8,
          backgroundColor: COLORS.secondaryLighter,
          alignItems: "center",
          width: 110,
          rowGap: 5,
          marginRight: 10,
        }}
      >
        <Image
          source={require("../../assets/superApp/ppt.png")}
          style={{ width: 70, height: 70 }}
        />
        {/* <Text
          style={{
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("H4", device),
          }}
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          style={{
            color: COLORS.lighter,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {Math.floor(size / 1000)} MB
        </Text> */}
      </View>
    </TouchableOpacity>
  ) : null;
};

const CardKomen = ({
  listData,
  inputRef,
  setParentId,
  bottomSheetAttachCommentClose,
  device,
}) => {
  const [toggleComment, setToggleComment] = useState({
    toggle: false,
    // id: data[0].Komentar[0].id
  });
  const clickBalas = (id, temp) => {
    setToggleComment({
      toggle: temp,
      id: id,
    });
  };

  const handleClickBalas = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setParentId(listData.id);
    }
  };
  const navigation = useNavigation();

  return (
    <View
      style={{
        justifyContent: "center",
        flex: 1,
        alignItems: "center",
        //shadow ios
        shadowOffset: { width: -2, height: 4 },
        shadowColor: "#171717",
        shadowOpacity: 0.2,
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.white,
          borderRadius: 10,
          width: "90%",
          marginVertical: 5,
          elevation: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            marginVertical: 10,
            marginHorizontal: 20,
          }}
        >
          <View>
            <Image
              source={{ uri: listData.foto }}
              style={{ width: 30, height: 30, borderRadius: 20 }}
            />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text
              style={{
                fontSize: fontSizeResponsive("H2", device),
                fontWeight: FONTWEIGHT.bold,
              }}
            >
              {listData.nama}
            </Text>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text
                style={{
                  color: COLORS.lighter,
                  fontSize: fontSizeResponsive("H5", device),
                  fontWeight: FONTWEIGHT.normal,
                }}
              >
                {listData.nip}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.danger,
                  alignItems: "center",
                  justifyContent: "center",
                  width: 100,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: fontSizeResponsive("H5", device),
                    fontWeight: FONTWEIGHT.normal,
                  }}
                >
                  {listData.aksi}
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  gap: 5,
                  alignItems: "center",
                  marginLeft: 60,
                }}
                onPress={() => {
                  navigation.navigate("FileViewer", {
                    lampiran: "https://" + listData.pdf,
                    type: "pdf",
                  });
                  bottomSheetAttachCommentClose();
                }}
              >
                <Ionicons
                  name="documents-outline"
                  size={device === "tablet" ? 40 : 10}
                />
                <Text
                  style={{
                    color: COLORS.info,
                    fontSize: fontSizeResponsive("H5", device),
                    fontWeight: FONTWEIGHT.normal,
                  }}
                >
                  (Lihat Dokumen)
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H5", device),
                  fontWeight: FONTWEIGHT.normal,
                  marginBottom: 5,
                }}
              >
                {moment(listData.tanggal, DATETIME.LONG_DATETIME)
                  .locale("id")
                  .format(DATETIME.LONG_DATETIME)}
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text
                style={{
                  color: COLORS.lighter,
                  fontSize: fontSizeResponsive("H5", device),
                  fontWeight: FONTWEIGHT.normal,
                  marginBottom: 5,
                }}
              >
                {listData.teks}
              </Text>
            </View>

            {/* <TouchableOpacity
                            style={{
                                color: COLORS.lighter,
                                fontSize: FONTSIZE.H3,
                                fontWeight: FONTWEIGHT.normal,
                                wordWrap: "break-word",
                                marginTop: 10,
                            }}
                            onPress={() => {
                                handleClickBalas();
                            }}
                        >
                            <Text
                                style={{ color: COLORS.primary, fontWeight: FONTWEIGHT.bold }}
                            >
                                Balas
                            </Text>
                        </TouchableOpacity> */}
            {/* 
                        {listData.child.length === 0 ? null : (
                            <View>
                                {(!toggleComment.toggle && toggleComment.id === listData.id) ||
                                    (toggleComment.id !== listData.id &&
                                        listData.child.length > 0) ? (
                                    <TouchableOpacity
                                        key={listData.id}
                                        onPress={() => clickBalas(listData.id, true)}
                                    >
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 5,
                                                marginTop: 10,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    height: 1,
                                                    width: 20,
                                                    backgroundColor: "#DBDADE",
                                                }}
                                            />
                                            <Text
                                                style={{
                                                    color: COLORS.lighter,
                                                    fontSize: FONTSIZE.H5,
                                                    fontWeight: FONTWEIGHT.normal,
                                                    lineHeight: 18,
                                                    wordWrap: "break-word",
                                                }}
                                            >
                                                Tampilkan {listData.child?.length} Balasan
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ) : null}

                                {listData.id === toggleComment.id && toggleComment.toggle ? (
                                    <View>
                                        {listData.child?.map((listKomen, index) => (
                                            <>
                                                <View
                                                    style={{
                                                        flexDirection: "row",
                                                        marginVertical: 10,
                                                        marginHorizontal: 20,
                                                    }}
                                                >
                                                    <View>
                                                        <Image
                                                            source={{ uri: listData.creator_avatar }}
                                                            style={{
                                                                width: 30,
                                                                height: 30,
                                                                borderRadius: 20,
                                                            }}
                                                        />
                                                    </View>
                                                    <View style={{ marginLeft: 10 }}>
                                                        <Text
                                                            style={{
                                                                fontSize: FONTSIZE.H2,
                                                                fontWeight: FONTWEIGHT.bold,
                                                                lineHeight: 20,
                                                                wordWrap: "break-word",
                                                            }}
                                                        >
                                                            {listKomen.creator}
                                                        </Text>
                                                        <View style={{ flexDirection: "row", gap: 5 }}>
                                                            <Text
                                                                style={{
                                                                    color: COLORS.lighter,
                                                                    fontSize: FONTSIZE.H5,
                                                                    fontWeight: FONTWEIGHT.normal,
                                                                    lineHeight: 18,
                                                                    wordWrap: "break-word",
                                                                    marginBottom: 10,
                                                                }}
                                                            >
                                                                {listKomen.created_at}
                                                            </Text>
                                                        </View>
                                                        <Text
                                                            style={{
                                                                color: "#999999",
                                                                fontSize: FONTSIZE.H3,
                                                                fontWeight: FONTWEIGHT.normal,
                                                                lineHeight: 18,
                                                                wordWrap: "break-word",
                                                            }}
                                                        >
                                                            {listKomen.message}
                                                        </Text>
                                                        {listData.child.length - 1 === index ? (
                                                            <TouchableOpacity
                                                                key={listKomen.id}
                                                                onPress={() => clickBalas(listData.id, false)}
                                                            >
                                                                <View
                                                                    style={{
                                                                        flexDirection: "row",
                                                                        alignItems: "center",
                                                                        gap: 5,
                                                                        marginTop: 10,
                                                                    }}
                                                                >
                                                                    <View
                                                                        style={{
                                                                            height: 1,
                                                                            width: 20,
                                                                            backgroundColor: "#DBDADE",
                                                                        }}
                                                                    />
                                                                    <Text
                                                                        style={{
                                                                            color: COLORS.lighter,
                                                                            fontSize: FONTSIZE.H5,
                                                                            fontWeight: FONTWEIGHT.normal,
                                                                            lineHeight: 18,
                                                                            wordWrap: "break-word",
                                                                        }}
                                                                    >
                                                                        Tutup {listData.child.length} Balasan
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                        ) : null}
                                                    </View>
                                                </View>
                                            </>
                                        ))}
                                    </View>
                                ) : null}
                            </View>
                        )} */}
          </View>
        </View>
      </View>
    </View>
  );
};

export const TambahCutiSakit = () => {
  const navigation = useNavigation();
  const [collapse, setCollapse] = useState({
    nip: "",
    toggle: false,
  });
  const { profile } = useSelector((state) => state.superApps);
  const { form, pilih, status, attachment, arsip, pilihPejabat } = useSelector(
    (state) => state.cuti
  );

  const [token, setToken] = useState("");

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  const arsipDetail = arsip.detail;

  const [modalVisiblePicker, setModalVisiblePicker] = useState("");

  const [TanggalMulai, setTanggalMulai] = useState("");
  const [TanggalSelesai, setTanggalSelsai] = useState("");
  const [alamat, setAlamat] = useState(
    arsipDetail.detail_dokumen?.dokumen?.alamat_cuti
  );
  const [telepon, setTelepon] = useState(
    arsipDetail.detail_dokumen?.dokumen?.nomor_telpon
  );
  const [atasan, setAtasan] = useState({
    key: arsipDetail?.detail_dokumen?.approver[0]?.id,
    value: arsipDetail?.detail_dokumen?.approver[0]?.nama_approver,
  });
  const [pejabat, setPejabat] = useState({
    key: arsipDetail?.detail_dokumen?.approver[1]?.id,
    value: arsipDetail?.detail_dokumen?.approver[1]?.nama_approver,
  });
  const [jenisCuti, setJenisCuti] = useState("");
  const [alasanCuti, setAlasanCuti] = useState(
    arsipDetail?.detail_dokumen?.dokumen?.alasan_cuti
  );
  const [kota, setKota] = useState(arsipDetail?.detail_dokumen?.dokumen?.kota);
  const [mulaiCuti, setMulaiCuti] = useState(
    moment(
      arsipDetail.detail_dokumen?.dokumen?.mulai_cuti,
      DATETIME.LONG_DATETIME
    )
      .locale("id")
      .format(DATETIME.LONG_DATE)
  );
  const [akhirCuti, setAkhirCuti] = useState(
    moment(
      arsipDetail.detail_dokumen?.dokumen?.akhir_cuti,
      DATETIME.LONG_DATETIME
    )
      .locale("id")
      .format(DATETIME.LONG_DATE)
  );

  const [komentarPembatalan, setKomentarPembatan] = useState("");

  const [lampiranById, setLampiranById] = useState(null);

  const getFileExtension = (lampiran) => {
    let jenis = lampiran?.split(".");
    jenis = jenis[jenis?.length - 1];
    return jenis;
  };

  const [document, setDocument] = useState([]);
  const [type, setType] = useState([]);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    // const file = convertFileToObject(result)
    let tipe = result.assets[0].uri.split("/");
    tipe = tipe[tipe.length - 1];
    tipe = tipe.split(".");
    tipe = tipe[tipe.length - 1];
    setDocument([...document, result]);
    setType([...type, tipe]);

    const data = {
      token: token,
      result: result.assets[0],
    };
    dispatch(postAttachmentCuti(data));
  };
  const dispatch = useDispatch();

  useEffect(() => {
    if (token !== "") {
      dispatch(getPilihApproval({ token: token, type: "1" }));
      dispatch(getPilihApprovalPejabat({ token: token, type: "2" }));
    }
  }, [token, atasan]);

  useEffect(() => {
    dispatch(setAttachmentCuti([]));
  }, []);

  const pickAtasan = () => {
    let nama = [];
    pilih.data?.map((item) => {
      nama.push({
        key: item.id,
        value: item.nama_lengkap,
      });
    });
    return nama;
  };

  const pickJabatan = () => {
    let nama = [];
    pilihPejabat.data?.map((item) => {
      nama.push({
        key: item.id,
        value: item.nama_lengkap,
      });
    });
    return nama;
  };

  const subJenisCuti = () => {
    let jenis = [];
    form.data_jenis_cuti?.advancerole.map((item) => {
      jenis.push({
        key: item.id,
        value: item.definisi,
        day: item.maksimal_hari,
      });
    });
    return jenis;
  };

  const inputRef = useRef(null);
  const [parentId, setParentId] = useState("");
  const bottomSheetModalRef = useRef(null);
  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetAttachComment = () => {
    bottomSheetModalRef.current?.present();
  };
  const bottomSheetAttachCommentClose = () => {
    if (bottomSheetModalRef.current) bottomSheetModalRef.current?.close();
  };

  const handleSubmit = () => {
    const payload = {
      // nip_pengaju: profile?.nip,
      id_dokumen: arsipDetail.detail_dokumen?.dokumen?.id.toString(),
      alasan_pembatalan: alasanCuti,
      nip_approval1: atasan.key,
      nip_approval2: pejabat.key,
      komentar: komentarPembatalan,
      attachment: attachment,
    };
    const data = {
      token: token,
      payload: payload,
    };
    dispatch(postPembatalanCuti(data));
    dispatch(setAttachmentCuti([]));
  };

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  const { device } = useSelector((state) => state.apps);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ position: "relative" }}>
        <ScrollView>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
              backgroundColor: COLORS.primary,
              height: 80,
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 20,
                marginLeft: 20,
                width: device === "tablet" ? 40 : 28,
                height: device === "tablet" ? 40 : 28,
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
                  fontSize: fontSizeResponsive("H1", device),
                  fontWeight: FONTWEIGHT.bold,
                  color: COLORS.white,
                }}
              >
                Pembatalan Cuti
              </Text>
            </View>
          </View>

          <View style={{ padding: 20, gap: 10 }}>
            <View style={{ gap: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  padding: 5,
                  columnGap: 10,
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="document-outline"
                  size={device === "tablet" ? 40 : 18}
                  color={COLORS.primary}
                />
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Jenis Cuti
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: COLORS.white,
                  padding: 20,
                  borderRadius: 16,
                }}
              >
                <View style={{ gap: 5 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      borderBottomWidth: 2,
                      borderBottomColor: "#DBDADE",
                      padding: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H4", device),
                        fontWeight: 600,
                        width: "40%",
                        paddingRight: 20,
                      }}
                    >
                      Jenis Cuti
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H4", device),
                        fontWeight: 400,
                        width: "60%",
                        paddingRight: 20,
                      }}
                    >
                      {arsipDetail.detail_dokumen?.jenis_cuti?.nama}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      borderBottomWidth: 2,
                      borderBottomColor: "#DBDADE",
                      padding: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H4", device),
                        fontWeight: 600,
                        width: "40%",
                        paddingRight: 20,
                      }}
                    >
                      Tipe Hari
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H4", device),
                        fontWeight: 400,
                        width: "60%",
                        paddingRight: 20,
                        color: "#B745FF",
                      }}
                    >
                      Hari Kerja
                      {/* {form.data_jenis_cuti?.tipe_hari} */}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      borderBottomWidth: 2,
                      borderBottomColor: "#DBDADE",
                      padding: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H4", device),
                        fontWeight: 600,
                        width: "40%",
                        paddingRight: 20,
                      }}
                    >
                      Status Dokumen
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H4", device),
                        fontWeight: 400,
                        width: "60%",
                        paddingRight: 20,
                        color: "red",
                      }}
                    >
                      Pembatalan Cuti
                    </Text>
                  </View>

                  {/* {form.data_jenis_cuti?.advancerole?.length === 0 ? null : (
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomWidth: 2,
                        borderBottomColor: "#DBDADE",
                        padding: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          width: "40%",
                          paddingRight: 20,
                        }}
                      >
                        Maksimal
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: 400,
                          width: "60%",
                          paddingRight: 20,
                        }}
                      >
                        {jenisCuti.day === undefined
                          ? "0"
                          : jenisCuti.day?.toString()}{" "}
                        Hari
                      </Text>
                    </View>
                  )} */}
                </View>
              </View>
            </View>

            {/* {form.data_jenis_cuti?.advancerole?.length === 0 ? null : (
              <View
                style={{
                  backgroundColor: COLORS.white,
                  padding: 20,
                  borderRadius: 16,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontSize: 13, fontWeight: 600 }}>
                    Sub jenis Cuti
                  </Text>
                  <Text style={{ color: COLORS.danger }}>*</Text>
                </View>
                <Dropdown
                  data={subJenisCuti()}
                  setSelected={setJenisCuti}
                  selected={jenisCuti}
                  borderWidth={1}
                  borderwidthDrop={1}
                  borderWidthValue={1}
                  borderColor={COLORS.ExtraDivinder}
                  borderColorDrop={COLORS.ExtraDivinder}
                  borderColorValue={COLORS.ExtraDivinder}
                />
              </View>
            )} */}

            <View>
              <View
                style={{
                  flexDirection: "row",
                  padding: 5,
                  columnGap: 10,
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="person-outline"
                  size={device === "tablet" ? 40 : 18}
                  color={COLORS.primary}
                />
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Profil Pegawai
                </Text>
              </View>

              <View>
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    padding: 15,
                    borderRadius: 8,
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      setCollapse({
                        nip: arsipDetail.detail_dokumen?.dokumen?.nip_pengaju,
                        toggle: true,
                      })
                    }
                  >
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ width: "90%" }}>
                        <Text
                          style={{ fontSize: fontSizeResponsive("H4", device) }}
                        >
                          {arsipDetail.detail_dokumen?.dokumen?.nama_pengaju}
                        </Text>
                        <Text
                          style={{ fontSize: fontSizeResponsive("H4", device) }}
                        >
                          NIP.{" "}
                          {arsipDetail.detail_dokumen?.dokumen?.nip_pengaju}
                        </Text>
                      </View>
                      {collapse.nip ===
                        arsipDetail.detail_dokumen?.dokumen?.nip_pengaju &&
                      collapse.toggle === true ? (
                        <TouchableOpacity
                          onPress={() =>
                            setCollapse({ nip: "", toggle: false })
                          }
                        >
                          <Ionicons
                            name="chevron-up"
                            size={device === "tablet" ? 40 : 24}
                          />
                        </TouchableOpacity>
                      ) : (
                        <Ionicons
                          name="chevron-down"
                          size={device === "tablet" ? 40 : 24}
                        />
                      )}
                    </View>
                  </TouchableOpacity>

                  {collapse.nip ===
                    arsipDetail.detail_dokumen?.dokumen?.nip_pengaju &&
                  collapse.toggle === true ? (
                    <View>
                      <TouchableOpacity
                        onPress={() => setCollapse({ nip: "", toggle: false })}
                      >
                        <Text
                          style={{
                            marginTop: 10,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          Golongan
                        </Text>
                        <Text
                          style={{
                            marginTop: 5,
                            fontWeight: FONTWEIGHT.bold,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          {
                            arsipDetail.detail_dokumen?.dokumen
                              ?.golongan_pengaju
                          }
                        </Text>

                        <Text
                          style={{
                            marginTop: 10,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          Jabatan
                        </Text>
                        <Text
                          style={{
                            marginTop: 5,
                            fontWeight: FONTWEIGHT.bold,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          {arsipDetail.detail_dokumen?.dokumen?.posisi_pengaju}
                        </Text>

                        <Text
                          style={{
                            marginTop: 10,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          Unit Kerja
                        </Text>
                        <Text
                          style={{
                            marginTop: 5,
                            fontWeight: FONTWEIGHT.bold,
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          {
                            arsipDetail.detail_dokumen?.dokumen
                              ?.dokumen_unit_kerja
                          }
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>

            <View style={{}}>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  padding: 15,
                  borderRadius: 8,
                  gap: 10,
                }}
              >
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  Periode Cuti
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <View
                      style={{
                        borderWidth: 1,
                        width: device === "tablet" ? 250 : 155,
                        borderRadius: 4,
                        borderColor: COLORS.ExtraDivinder,
                        flexDirection: "row",
                        height: 43,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* <TextInput
                        editable
                        multiline
                        numberOfLines={4}
                        maxLength={40}
                        placeholder="Mulai"
                        style={{ padding: 10, height: 40 }}
                        value={TanggalMulai}
                      />
                      <View
                        style={{
                          alignItems: "flex-end",
                          flex: 1,
                          marginRight: 10,
                          justifyContent: "center",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => setModalVisiblePicker("mulai")}
                        >
                          <Ionicons
                            name="calendar-outline"
                            size={24}
                            color={COLORS.grey}
                          />
                        </TouchableOpacity>
                      </View> */}
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        {mulaiCuti}
                      </Text>
                    </View>
                  </View>

                  <View>
                    <View
                      style={{
                        borderWidth: 1,
                        width: device === "tablet" ? 250 : 155,
                        borderRadius: 4,
                        borderColor: COLORS.ExtraDivinder,
                        flexDirection: "row",
                        height: 43,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* <TextInput
                        editable
                        multiline
                        numberOfLines={4}
                        maxLength={40}
                        placeholder="Selesai"
                        style={{ padding: 10, height: 40 }}
                        value={TanggalSelesai}
                      /> */}
                      {/* <View
                        style={{
                          alignItems: "flex-end",
                          flex: 1,
                          marginRight: 10,
                          justifyContent: "center",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => setModalVisiblePicker("selesai")}
                        >
                          <Ionicons
                            name="calendar-outline"
                            size={24}
                            color={COLORS.grey}
                          />
                        </TouchableOpacity>
                      </View> */}
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        {akhirCuti}
                      </Text>
                      <Modal
                        animationType="fade"
                        transparent={true}
                        visible={
                          modalVisiblePicker === "mulai" ||
                          modalVisiblePicker === "selesai"
                            ? true
                            : false
                        }
                        onRequestClose={() => {
                          setModalVisiblePicker(!modalVisiblePicker);
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
                            justifyContent: "center",
                            alignItems: "center",
                            flex: 1,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: COLORS.white,
                              alignItems: "center",
                              justifyContent: "center",
                              width: "90%",
                              height: 500,
                              borderRadius: 10,
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => setModalVisiblePicker("")}
                              style={{
                                paddingRight: "85%",
                                marginBottom: 3,
                                marginLeft: 20,
                              }}
                            >
                              <View
                                style={{
                                  backgroundColor: COLORS.primary,
                                  borderRadius: 50,
                                  width: device === "tablet" ? 40 : 35,
                                  height: device === "tablet" ? 40 : 35,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Ionicons
                                  name="close-outline"
                                  size={device === "tablet" ? 40 : 24}
                                  color={COLORS.white}
                                />
                              </View>
                            </TouchableOpacity>
                            <View style={{ width: "100%" }}>
                              <DatePicker
                                options={{
                                  backgroundColor: COLORS.white,
                                  textHeaderColor: COLORS.primary,
                                  textDefaultColor: COLORS.primary,
                                  selectedTextColor: "#fff",
                                  mainColor: COLORS.primary,
                                  textSecondaryColor: COLORS.primary,
                                  borderColor: "rgba(122, 146, 165, 0.1)",
                                }}
                                current={moment(Date.now())
                                  .locale("id")
                                  .format("YYYY-MM-DD")}
                                mode="calendar"
                                minuteInterval={30}
                                style={{ borderRadius: 10 }}
                                onSelectedChange={(date) => {
                                  const [year, month, day] = date
                                    .split("/")
                                    .map(Number);
                                  const formattedDate = new Date(
                                    year,
                                    month - 1,
                                    day
                                  );
                                  const [tahun, bulan, hari] = date
                                    .split("/")
                                    .map(String);
                                  const dataTanggal =
                                    tahun + "-" + bulan + "-" + hari;

                                  const dataPernahDipakai =
                                    form.data_kalender?.tanggal_pernah_dipakai?.some(
                                      (item) => item === dataTanggal
                                    );
                                  const dataLibur =
                                    form.data_kalender?.tanggal_libur?.some(
                                      (item) => item === dataTanggal
                                    );
                                  const dataSppd =
                                    form.data_kalender?.tanggal_sppd?.some(
                                      (item) => item === dataTanggal
                                    );
                                  if (
                                    modalVisiblePicker === "mulai" &&
                                    !dataPernahDipakai &&
                                    !dataLibur &&
                                    !dataSppd
                                  ) {
                                    setTanggalMulai(
                                      moment(formattedDate)
                                        .locale("id")
                                        .format("YYYY-MM-DD")
                                    );
                                  } else if (
                                    modalVisiblePicker === "selesai" &&
                                    !dataPernahDipakai &&
                                    !dataLibur &&
                                    !dataSppd
                                  ) {
                                    setTanggalSelsai(
                                      moment(formattedDate)
                                        .locale("id")
                                        .format("YYYY-MM-DD")
                                    );
                                  } else {
                                    alert(
                                      "Tidak Dapat Memilih Tanggal Tersebut"
                                    );
                                    setTanggalMulai("");
                                  }
                                }}
                              />
                              <TouchableOpacity
                                onPress={() => setModalVisiblePicker("")}
                                style={{
                                  marginTop: 20,
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <View
                                  style={{
                                    backgroundColor: COLORS.primary,
                                    width: 217,
                                    height: 39,
                                    borderRadius: 8,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: COLORS.white,
                                      fontSize: fontSizeResponsive(
                                        "H4",
                                        device
                                      ),
                                    }}
                                  >
                                    Ok
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </Modal>
                    </View>
                  </View>
                </View>

                <View style={{ gap: 8 }}>
                  <View>
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
                      Durasi Cuti
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: "#F8F8F8",
                      padding: 10,
                      width: "100%",
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
                      {arsipDetail.detail_dokumen?.dokumen?.jumlah_cuti}
                    </Text>
                  </View>
                </View>

                <View style={{ gap: 8 }}>
                  <View>
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
                      Alamat Cuti
                    </Text>
                  </View>
                  <View
                    style={{
                      padding: 10,
                      width: "100%",
                      borderRadius: 8,
                      borderColor: "#F8F8F8",
                      borderWidth: 1,
                    }}
                  >
                    {/* <TextInput
                      editable
                      multiline
                      onChangeText={setAlamat}
                      value={alamat}
                    /> */}
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
                      {alamat}
                    </Text>
                  </View>
                </View>

                <View style={{ gap: 8 }}>
                  <View>
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
                      Telepon
                    </Text>
                  </View>
                  <View
                    style={{
                      padding: 10,
                      width: "100%",
                      borderRadius: 8,
                      borderColor: "#F8F8F8",
                      borderWidth: 1,
                    }}
                  >
                    {/* <TextInput
                      editable
                      multiline
                      numberOfLines={4}
                      maxLength={40}
                      onChangeText={setTelepon}
                      value={telepon}
                    /> */}
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
                      {telepon}
                    </Text>
                  </View>
                </View>

                <View style={{ gap: 8 }}>
                  <View>
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
                      Alasan Cuti
                    </Text>
                  </View>
                  <View
                    style={{
                      padding: 10,
                      width: "100%",
                      borderRadius: 8,
                      borderColor: "#F8F8F8",
                      borderWidth: 1,
                    }}
                  >
                    <TextInput
                      editable
                      multiline
                      numberOfLines={2}
                      maxLength={50}
                      placeholder="Ketikan Sesuatu"
                      onChangeText={setAlasanCuti}
                      allowFontScaling={false}
                      value={alasanCuti}
                    />
                  </View>
                </View>

                <View style={{ gap: 8 }}>
                  <View>
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
                      Kota
                    </Text>
                  </View>
                  <View
                    style={{
                      padding: 10,
                      width: "100%",
                      borderRadius: 8,
                      borderColor: "#F8F8F8",
                      borderWidth: 1,
                    }}
                  >
                    <TextInput
                      editable
                      multiline
                      numberOfLines={2}
                      maxLength={50}
                      placeholder="Ketikan Sesuatu"
                      onChangeText={setKota}
                      allowFontScaling={false}
                      value={kota}
                    />
                  </View>
                </View>
              </View>
            </View>

            <View>
              <View
                style={{
                  flexDirection: "row",
                  padding: 5,
                  columnGap: 10,
                }}
              >
                <Ionicons
                  name="attach-outline"
                  size={device === "tablet" ? 40 : 18}
                  color={COLORS.primary}
                />
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Lampiran
                </Text>
              </View>

              {arsipDetail.detail_dokumen?.attachment?.length !== 0 ? (
                <View
                  style={{
                    borderRadius: 16,
                    backgroundColor: "white",
                    paddingVertical: 16,
                    //shadow ios
                    shadowOffset: { width: -2, height: 4 },
                    shadowColor: "#171717",
                    shadowOpacity: 0.2,
                    //shadow android
                    elevation: 2,
                    paddingHorizontal: 16,
                  }}
                >
                  <FlatList
                    key={"#"}
                    data={arsipDetail.detail_dokumen?.attachment}
                    renderItem={({ item }) => (
                      <View key={item.id}>
                        <CardLampiran
                          lampiran={item.attachment}
                          id={item.id}
                          name={item.name}
                          size={item.file_size}
                          type={getFileExtension(item.attachment)}
                          onClick={() => {
                            setVisibleModal(true);
                            setLampiranById(item);
                          }}
                          device={device}
                        />
                      </View>
                    )}
                    scrollEnabled={true}
                    horizontal={true}
                    // columnWrapperStyle={{ justifyContent: "space-evenly" }}
                    // numColumns={2}
                    keyExtractor={(item) => "#" + item.id}
                  />
                </View>
              ) : (
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <View style={{ flexDirection: "row" }}>
                    <View style={styles.cardStatus}>
                      <View
                        style={{
                          width: "30%",
                          alignItems: "center",
                          rowGap: 20,
                        }}
                      >
                        <Text
                          style={{ fontSize: fontSizeResponsive("H4", device) }}
                        >
                          -
                        </Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              )}

              {lampiranById !== null ? (
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={visibleModal}
                  onRequestClose={() => {
                    setVisibleModal(false);
                    setLampiranById(null);
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
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setVisibleModal(false);
                        setLampiranById(null);
                      }}
                      style={{
                        position: "absolute",
                        top: "15%",
                        left: 20,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: COLORS.primary,
                          width: 51,
                          height: 51,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 50,
                        }}
                      >
                        <Ionicons
                          name="close-outline"
                          color={COLORS.white}
                          size={device === "tablet" ? 40 : 24}
                        />
                      </View>
                    </TouchableOpacity>
                    {getFileExtension(lampiranById.name) === "png" ||
                    getFileExtension(lampiranById.name) === "jpg" ||
                    getFileExtension(lampiranById.name) === "jpeg" ? (
                      <View>
                        <Image
                          source={{ uri: lampiranById.file }}
                          style={{ width: 390, height: 283 }}
                        />
                      </View>
                    ) : getFileExtension(lampiranById.name) === "mp4" ? (
                      <Video
                        ref={video}
                        style={{ width: 390, height: 283 }}
                        source={{ uri: lampiranById.file }}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        isLooping
                        onPlaybackStatusUpdate={(status) =>
                          setStatus(() => status)
                        }
                      />
                    ) : (
                      <></>
                    )}
                  </View>
                </Modal>
              ) : null}
            </View>

            <View>
              <View
                style={{
                  flexDirection: "row",
                  padding: 5,
                  columnGap: 10,
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="document-outline"
                  size={18}
                  color={COLORS.primary}
                />
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Lampiran Pembatalan
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: COLORS.white,
                  padding: 15,
                  borderRadius: 8,
                  gap: 20,
                }}
              >
                <View style={{ gap: 5 }}>
                  <Pressable onPress={pickDocument}>
                    <View
                      style={{
                        width: "100%",
                        borderRadius: 8,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        gap: 10,
                        flex: 1,
                        backgroundColor: COLORS.grey,
                        padding: 10,
                      }}
                    >
                      <Ionicons
                        name="cloud-upload-outline"
                        size={30}
                        color={COLORS.white}
                      />
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Klik Untuk Unggah
                      </Text>
                    </View>
                  </Pressable>
                  {/* ) : null} */}
                  {document.length < 1 ? null : (
                    <View
                      style={{
                        flexDirection: "row",
                        marginHorizontal: 20,
                        marginVertical: 10,
                        flexWrap: "wrap",
                        gap: 10,
                      }}
                    >
                      {document?.map((doc, i) => (
                        <>
                          {type[i] === "pdf" ? (
                            <View
                              style={{
                                width: 97,
                                height: 97,
                                justifyContent: "center",
                                alignItems: "center",
                                borderWidth: 1,
                                borderRadius: 8,
                                borderColor: COLORS.ExtraDivinder,
                              }}
                            >
                              <Image
                                source={require("../../assets/superApp/pdf.png")}
                              />
                            </View>
                          ) : null}
                        </>
                      ))}
                    </View>
                  )}
                </View>

                <Text
                  style={{
                    color: COLORS.lighter,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  *) Hanya pdf yang akan diterima dari total berkas file maks
                  5mb
                </Text>
              </View>
            </View>
            {form.data_kuota_cuti === null ? null : (
              <>
                <View style={{ gap: 10 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      padding: 5,
                      columnGap: 10,
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name="document-outline"
                      size={device === "tablet" ? 40 : 18}
                      color={COLORS.primary}
                    />
                    <Text
                      style={{
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Info Cuti
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", gap: 5 }}>
                    <View
                      style={[
                        styles.cardInfoCuti,
                        { backgroundColor: COLORS.info },
                      ]}
                    >
                      <Text
                        style={{
                          color: COLORS.white,
                          textAlign: "center",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Kuota Penuh
                      </Text>
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        {arsipDetail.detail_dokumen?.kuota?.full_kuota}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.cardInfoCuti,
                        { backgroundColor: COLORS.danger },
                      ]}
                    >
                      <Text
                        style={{
                          color: COLORS.white,
                          textAlign: "center",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Kuota Terpakai
                      </Text>
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        {arsipDetail.detail_dokumen?.kuota?.kuota_terpakai}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.cardInfoCuti,
                        { backgroundColor: COLORS.success },
                      ]}
                    >
                      <Text
                        style={{
                          color: COLORS.white,
                          textAlign: "center",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Kuota Sisa
                      </Text>
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        {arsipDetail.detail_dokumen?.kuota?.kuota_sisa}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            )}

            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    padding: 5,
                    columnGap: 10,
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="chatbox-outline"
                    size={device === "tablet" ? 40 : 18}
                    color={COLORS.primary}
                  />
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Histori Komentar
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    justifyContent: "flex-end",
                    backgroundColor: COLORS.white,
                    borderRadius: 10,
                    padding: 15,
                    paddingHorizontal: 25,
                    //shadow ios
                    shadowOffset: { width: -2, height: 4 },
                    shadowColor: "#171717",
                    //shadow android
                    elevation: 2,
                  }}
                  onPress={() => {
                    bottomSheetAttachComment();
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Lihat Komentar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <View
                style={{
                  flexDirection: "row",
                  padding: 5,
                  columnGap: 10,
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="people-outline"
                  size={device === "tablet" ? 40 : 18}
                  color={COLORS.primary}
                />
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Yang Menyetujui
                </Text>
              </View>

              <View
                style={{
                  backgroundColor: COLORS.white,
                  padding: 20,
                  borderRadius: 16,
                }}
              >
                <View style={{ gap: 5 }}>
                  <View style={{ flexDirection: "row", padding: 10 }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H4", device),
                        fontWeight: 600,
                        paddingRight: 20,
                      }}
                    >
                      Atasan Langsung
                    </Text>
                  </View>

                  <Dropdown
                    data={pickAtasan()}
                    setSelected={setAtasan}
                    selected={atasan}
                    borderWidth={1}
                    borderwidthDrop={1}
                    borderWidthValue={1}
                    borderColor={COLORS.ExtraDivinder}
                    borderColorDrop={COLORS.ExtraDivinder}
                    borderColorValue={COLORS.ExtraDivinder}
                    search={true}
                  />

                  <View style={{ flexDirection: "row", padding: 10 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        paddingRight: 20,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Pejabat Berwenang
                    </Text>
                  </View>

                  <Dropdown
                    data={pickJabatan()}
                    setSelected={setPejabat}
                    selected={pejabat}
                    borderWidth={1}
                    borderwidthDrop={1}
                    borderWidthValue={1}
                    borderColor={COLORS.ExtraDivinder}
                    borderColorDrop={COLORS.ExtraDivinder}
                    borderColorValue={COLORS.ExtraDivinder}
                    search={true}
                  />
                </View>
              </View>
            </View>
            <>
              <View
                style={{
                  flexDirection: "row",
                  padding: 5,
                  columnGap: 10,
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="chatbox-outline"
                  size={device === "tablet" ? 40 : 18}
                  color={COLORS.primary}
                />
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Komentar
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  padding: 20,
                  borderRadius: 16,
                }}
              >
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  Komentar
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 4,
                    borderColor: COLORS.ExtraDivinder,
                    borderRadius: 16,
                    marginTop: 10,
                  }}
                >
                  <TextInput
                    editable
                    multiline
                    numberOfLines={4}
                    maxLength={40}
                    placeholder="Masukan Komentar"
                    onChangeText={setKomentarPembatan}
                    style={{ padding: 10, height: 40 }}
                    allowFontScaling={false}
                  />
                </View>
              </View>
            </>

            <View
              style={{
                flexDirection: "row",
                gap: 10,
                marginTop: 10,
                paddingBottom: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.success,
                  borderRadius: 10,
                  height: 50,
                  width: "100%",
                  justifyContent: "center",
                }}
                onPress={handleSubmit}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: COLORS.white,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Kirim
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <BottomSheetModalProvider>
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
            <View style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]} />
          )}
        >
          <BottomSheetView onLayout={handleContentLayout}>
            {/* <KeyboardAvoidingView
                                behavior={Platform.OS === "ios" ? "height" : "height"}
                            > */}
            <View
              style={{
                marginHorizontal: 20,
                marginTop: 20,
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
                Histori Komentar
              </Text>
              <TouchableOpacity
                onPress={() => {
                  bottomSheetAttachCommentClose();
                }}
              >
                <Ionicons
                  name="close-outline"
                  size={device === "tablet" ? 40 : 24}
                  color={COLORS.lighter}
                />
              </TouchableOpacity>
            </View>
            <ScrollView nestedScrollEnabled={true} style={{ height: 300 }}>
              <FlatList
                data={arsipDetail?.komentar_dokumen}
                renderItem={({ item }) => (
                  <CardKomen
                    listData={item}
                    inputRef={inputRef}
                    setParentId={setParentId}
                    bottomSheetAttachCommentClose={
                      bottomSheetAttachCommentClose
                    }
                    device={device}
                  />
                )}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                onScroll={(e) => {
                  console.log("Scrolling", e.nativeEvent.contentOffset.y);
                }}
              />
            </ScrollView>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
      <ModalSubmit
        status={status}
        setStatus={setStatus}
        messageSuccess={"Data Ditambahkan"}
        navigate={"MainCuti"}
      />
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  cardStatus: {
    width: 175,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    margin: 10,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  cardKouta: {
    width: 360,
    // padding: 1,
    borderRadius: 8,
    // marginHorizontal: 5,
    // margin:10,
    marginVertical: 10,
    flexDirection: "row",
  },
  iOSBackdrop: {
    backgroundColor: "#000000",
    opacity: 0.3,
  },
  androidBackdrop: {
    backgroundColor: "#232f34",
    opacity: 0.32,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardInfoCuti: {
    width: wp(35),
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    padding: 10,
    borderRadius: 8,
  },
});
