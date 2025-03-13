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
  Alert,
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
  getFormCuti,
  getPilihApproval,
  getPilihApprovalPejabat,
  postAttachmentCuti,
  postPengajuanCuti,
  postPengajuanCutiDraft,
  postTanggalCuti,
} from "../../service/api";
import { ModalSubmit } from "../../components/ModalSubmit";
import { setAttachmentCuti, setJumlahCuti, setStatus } from "../../store/Cuti";
import * as DocumentPicker from "expo-document-picker";
import CalendarPicker from "react-native-calendar-picker";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { Loading } from "../../components/Loading";
import { getTokenValue } from "../../service/session";

const kategories = [
  { key: "q", value: "satu" },
  { key: "e", value: "dua" },
  { key: "r", value: "tiga" },
  { key: "t", value: "empat" },
];

export const CardlPimpinan = ({ item }) => {
  return (
    <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
      {item.nama_lengkap}
    </Text>
  );
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
                justifyContent: listData.pdf === "" ? null : "space-around",
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
              {listData.pdf === "" ? null : (
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
              )}
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

export const TambahCutiTahunan = ({ route }) => {
  const { tipe } = route.params;
  const navigation = useNavigation();
  const [collapse, setCollapse] = useState({
    nip: "",
    toggle: false,
  });

  const [token, setToken] = useState("");

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  const { profile } = useSelector((state) => state.superApps);
  const {
    form,
    pilih,
    status,
    attachment,
    jumlahCuti,
    arsip,
    pilihPejabat,
    loading,
  } = useSelector((state) => state.cuti);
  const arsipDetail = arsip.detail;

  useEffect(() => {
    if (tipe === "draft") {
      if (arsipDetail?.detail_dokumen?.jenis_cuti?.nama === "Cuti Tahunan") {
        const params = { token: token, id: 1 };
        dispatch(getFormCuti(params));
      } else if (
        arsipDetail?.detail_dokumen?.jenis_cuti?.nama === "Cuti Besar"
      ) {
        const params = { token: token, id: 2 };
        dispatch(getFormCuti(params));
      } else if (
        arsipDetail?.detail_dokumen?.jenis_cuti?.nama === "Cuti Alasan Penting"
      ) {
        const params = { token: token, id: 3 };
        dispatch(getFormCuti(params));
      } else if (
        arsipDetail?.detail_dokumen?.jenis_cuti?.nama === "Cuti Sakit"
      ) {
        const params = { token: token, id: 4 };
        dispatch(getFormCuti(params));
      } else if (
        arsipDetail?.detail_dokumen?.jenis_cuti?.nama === "Cuti Melahirkan"
      ) {
        const params = { token: token, id: 5 };
        dispatch(getFormCuti(params));
      } else if (
        arsipDetail?.detail_dokumen?.jenis_cuti?.nama ===
        "Cuti Diluar Tanggungan Negara"
      ) {
        const params = { token: token, id: 6 };
        dispatch(getFormCuti(params));
      }
    }
  }, [arsipDetail]);

  const [modalVisiblePicker, setModalVisiblePicker] = useState("");

  const [TanggalMulai, setTanggalMulai] = useState("");
  const [TanggalSelesai, setTanggalSelsai] = useState("");
  const [alamat, setAlamat] = useState("");
  const [telepon, setTelepon] = useState("");
  const [atasan, setAtasan] = useState("");
  const [pejabat, setPejabat] = useState("");
  const [jenisCuti, setJenisCuti] = useState({});
  const [alasanCuti, setAlasanCuti] = useState("");
  const [kota, setKota] = useState("");
  const [tanggalLibur, setTanggalLibur] = useState();
  const [periodeTahunCuti, setPeriodeTahunCuti] = useState({
    key: 2024,
    value: 2024,
  });

  const [document, setDocument] = useState([]);
  const [type, setType] = useState([]);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    // const file = convertFileToObject(result);
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
    dispatch(setJumlahCuti({}));
  }, []);

  useEffect(() => {
    if (tipe === "draft") {
      setJenisCuti({
        key: arsipDetail?.detail_dokumen?.jenis_cuti?.advance_role_id,
        value: arsipDetail?.detail_dokumen?.jenis_cuti?.definition,
      });
      setTanggalMulai(
        tipe === "draft"
          ? moment(
              arsipDetail?.detail_dokumen?.dokumen?.mulai_cuti,
              "DD-MMMM-YYYY HH:mm:ss"
            )
              .locale("id")
              .format("YYYY-MM-DD")
          : ""
      );
      setTanggalSelsai(
        tipe === "draft"
          ? moment(
              arsipDetail?.detail_dokumen?.dokumen?.akhir_cuti,
              "DD-MMMM-YYYY HH:mm:ss"
            )
              .locale("id")
              .format("YYYY-MM-DD")
          : ""
      );
      setAlasanCuti(arsipDetail?.detail_dokumen?.dokumen?.alasan_cuti);
      setDocument(
        arsipDetail?.detail_dokumen?.attachment === undefined
          ? []
          : arsipDetail?.detail_dokumen?.attachment
      );
      setAtasan({
        key: arsipDetail?.detail_dokumen?.approver[0]?.id,
        value: arsipDetail?.detail_dokumen?.approver[0]?.nama_approver,
      });
      setPejabat({
        key: arsipDetail?.detail_dokumen?.approver[1]?.id,
        value: arsipDetail?.detail_dokumen?.approver[1]?.nama_approver,
      });
      setKota(arsipDetail?.detail_dokumen?.dokumen?.kota);
    }
  }, [arsipDetail]);

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
    form?.data_jenis_cuti?.advancerole.map((item) => {
      jenis.push({
        key: item.id,
        value: item.definisi,
        day: item.maksimal_hari,
      });
    });
    return jenis;
  };

  const handleSubmit = () => {
    const payload = {
      // nip_pengaju: profile?.nip,
      id_dokumen:
        tipe === "draft" ? arsipDetail?.detail_dokumen?.dokumen?.id : "",
      id_jenis_cuti: form?.data_jenis_cuti?.id,
      id_sub_jenis_cuti: jenisCuti?.key === undefined ? "" : jenisCuti.key,
      mulai_cuti: TanggalMulai,
      akhir_cuti: TanggalSelesai,
      alasan_cuti: alasanCuti,
      alamat_cuti: alamat,
      nomor_telpon: telepon,
      nip_approval1: atasan.key,
      nip_approval2: pejabat !== "" ? pejabat.key : atasan.key,
      attachment: attachment,
      kota: kota,
    };
    const data = {
      token: token,
      payload: payload,
    };
    dispatch(postPengajuanCuti(data));
  };

  const handleSubmitDraft = () => {
    const payload = {
      // nip_pengaju: profile?.nip,
      id_dokumen: "",
      id_jenis_cuti: form.data_jenis_cuti?.id,
      id_sub_jenis_cuti: jenisCuti?.key === undefined ? "" : jenisCuti.key,
      mulai_cuti: TanggalMulai,
      akhir_cuti: TanggalSelesai,
      alasan_cuti: alasanCuti,
      alamat_cuti: alamat,
      nomor_telpon: telepon,
      nip_approval1: atasan.key,
      nip_approval2: pejabat.key,
      attachment: attachment,
      kota: kota,
    };
    const data = {
      token: token,
      payload: payload,
    };
    dispatch(postPengajuanCutiDraft(data));
  };

  const selectDate = () => {
    const payload = {
      id_jenis_cuti: form.data_jenis_cuti?.id,
      nip: profile?.nip,
      tanggal_mulai: TanggalMulai,
      tanggal_akhir: TanggalSelesai,
    };
    const data = {
      token: token,
      payload: payload,
    };
    dispatch(postTanggalCuti(data));
  };

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const nextYear = new Date().getFullYear() + 1;

  const getDatesForAdjacentYears = (year) => {
    const dates = [];

    // Fungsi untuk mendapatkan semua tanggal dalam satu tahun
    const getAllDatesInYear = (year) => {
      const yearDates = [];
      const startDate = new Date(Date.UTC(year, 0, 1)); // 1 Januari
      const endDate = new Date(Date.UTC(year, 11, 31)); // 31 Desember

      let currentDate = startDate;
      while (currentDate <= endDate) {
        yearDates.push(new Date(currentDate)); // Tambahkan tanggal ke array
        currentDate.setUTCDate(currentDate.getUTCDate() + 1); // Tambah satu hari
      }

      return yearDates;
    };

    // Dapatkan tanggal untuk tahun sebelumnya dan berikutnya
    dates.push(...getAllDatesInYear(year - 1)); // Tahun sebelumnya
    dates.push(...getAllDatesInYear(year + 1)); // Tahun berikutnya

    return dates;
  };

  // Gunakan fungsi dengan input 2024
  const adjacentDates = getDatesForAdjacentYears(periodeTahunCuti.value);

  useEffect(() => {
    setAlamat(form?.data_user?.alamat);
    setTelepon(form?.data_user?.no_telpon);

    if (currentMonth !== 12) {
      if (form.data_kalender?.tanggal_sppd.length === 0) {
        setTanggalLibur([
          ...form.data_kalender?.tanggal_pernah_dipakai,
          ...form.data_kalender?.tanggal_libur,
        ]);
      } else if (form.data_kalender?.tanggal_pernah_dipakai.length === 0) {
        setTanggalLibur([
          ...form.data_kalender?.tanggal_libur,
          ...form.data_kalender?.tanggal_sppd,
        ]);
      } else {
        setTanggalLibur([]);
      }
    } else {
      if (form.data_kalender?.tanggal_sppd.length === 0) {
        setTanggalLibur([
          ...form.data_kalender?.tanggal_pernah_dipakai,
          ...form.data_kalender?.tanggal_libur,
          ...adjacentDates,
        ]);
      } else if (form.data_kalender?.tanggal_pernah_dipakai.length === 0) {
        setTanggalLibur([
          ...form.data_kalender?.tanggal_libur,
          ...form.data_kalender?.tanggal_sppd,
          ...adjacentDates,
        ]);
      }
      // setTanggalLibur(adjacentDates);
    }
  }, [form, periodeTahunCuti]);

  //styling kalender
  const customDayHeaderStyles = ({ dayOfWeek }) => {
    switch (
      dayOfWeek // can also evaluate month, year
    ) {
      case 7: // Thursday
        return {
          textStyle: {
            color: COLORS.primary,
            fontWeight: "bold",
          },
        };
      case 6: // Thursday
        return {
          textStyle: {
            color: COLORS.primary,
            fontWeight: "bold",
          },
        };
    }
  };

  const customDatesStyles = (date) => {
    switch (date.isoWeekday()) {
      case 7: // Monday
        return {
          textStyle: {
            color: COLORS.primary,
            fontWeight: "bold",
          },
        };
      case 6: // Sunday
        return {
          textStyle: {
            color: COLORS.primary,
            fontWeight: "bold",
          },
        };
    }
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
  const { device } = useSelector((state) => state.apps);

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  useEffect(() => {
    if (jumlahCuti?.jumlah_cuti > form.data_kuota_cuti?.kuota_sisa_n) {
      Alert.alert("Peringatan!", "Durasi cuti melebihi kuota cuti");
      setTanggalMulai("");
      setTanggalSelsai("");
      dispatch(setJumlahCuti({}));
    }
  }, [jumlahCuti]);

  const periodeTahun = [
    { key: currentYear, value: currentYear },
    { key: nextYear, value: nextYear },
  ];

  useEffect(() => {
    if (periodeTahunCuti.value <= currentYear) {
      if (jumlahCuti?.jumlah_cuti > form.data_kuota_cuti?.kuota_sisa_n) {
        Alert.alert("Peringatan!", "Durasi cuti melebihi kuota cuti");
        setTanggalMulai("");
        setTanggalSelsai("");
        dispatch(setJumlahCuti({}));
      }
    } else if (periodeTahun > currentYear) {
      if (jumlahCuti?.jumlah_cuti > form.data_kuota_cuti?.kuota_sisa_np1) {
        Alert.alert("Peringatan!", "Durasi cuti melebihi kuota cuti");
        setTanggalMulai("");
        setTanggalSelsai("");
        dispatch(setJumlahCuti({}));
      }
    }
  }, [jumlahCuti]);

  return (
    <GestureHandlerRootView>
      {loading ? (
        <Loading />
      ) : (
        <>
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
                <View
                  style={{ flex: 1, alignItems: "center", marginRight: 50 }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H1", device),
                      fontWeight: FONTWEIGHT.bold,
                      color: COLORS.white,
                    }}
                  >
                    Pengajuan Cuti
                  </Text>
                </View>
              </View>

              <View style={{ padding: 20, gap: 20 }}>
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
                      size={18}
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
                            fontSize: fontSizeResponsive("H3", device),
                            fontWeight: 600,
                            width: "40%",
                            paddingRight: 20,
                          }}
                        >
                          Jenis Cuti
                        </Text>
                        {tipe === "draft" ? (
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H3", device),
                              fontWeight: 400,
                              width: "60%",
                              paddingRight: 20,
                            }}
                          >
                            {arsipDetail?.detail_dokumen?.jenis_cuti?.nama}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H3", device),
                              fontWeight: 400,
                              width: "60%",
                              paddingRight: 20,
                            }}
                          >
                            {form.data_jenis_cuti?.nama}
                          </Text>
                        )}
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
                            fontSize: fontSizeResponsive("H3", device),
                            fontWeight: 600,
                            width: "40%",
                            paddingRight: 20,
                          }}
                        >
                          Tipe Hari
                        </Text>
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H3", device),
                            fontWeight: 400,
                            width: "60%",
                            paddingRight: 20,
                            color: "#B745FF",
                          }}
                        >
                          {tipe === "draft"
                            ? arsipDetail?.detail_dokumen?.jenis_cuti?.tipe_hari
                            : form.data_jenis_cuti?.tipe_hari}
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
                            fontSize: fontSizeResponsive("H3", device),
                            fontWeight: 600,
                            width: "40%",
                            paddingRight: 20,
                          }}
                        >
                          Status Dokumen
                        </Text>
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H3", device),
                            fontWeight: 400,
                            width: "60%",
                            paddingRight: 20,
                            color: COLORS.success,
                          }}
                        >
                          {tipe === "draft" ? "Draft" : "Dokumen Baru"}
                        </Text>
                      </View>

                      {form.data_jenis_cuti?.advancerole?.length ===
                      0 ? null : (
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
                              fontSize: fontSizeResponsive("H3", device),
                              fontWeight: 600,
                              width: "40%",
                              paddingRight: 20,
                            }}
                          >
                            Maksimal
                          </Text>
                          {tipe === "draft" ? (
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H3", device),
                                fontWeight: 400,
                                width: "60%",
                                paddingRight: 20,
                              }}
                            >
                              {arsipDetail?.detail_dokumen?.jenis_cuti?.max_day}{" "}
                              Hari
                            </Text>
                          ) : (
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H3", device),
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
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {form.data_jenis_cuti?.advancerole?.length === 0 ? null : (
                  <View
                    style={{
                      backgroundColor: COLORS.white,
                      padding: 20,
                      borderRadius: 16,
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H3", device),
                          fontWeight: 600,
                        }}
                      >
                        Sub jenis Cuti
                      </Text>
                      <Text
                        style={{
                          color: COLORS.danger,
                          fontSize: fontSizeResponsive("H3", device),
                        }}
                      >
                        *
                      </Text>
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
                )}

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
                      size={18}
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
                          setCollapse({ nip: profile.nip, toggle: true })
                        }
                      >
                        <View style={{ flexDirection: "row" }}>
                          <View style={{ width: "90%" }}>
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              {form.data_user?.nama}
                            </Text>
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              NIP. {form.data_user?.nip}
                            </Text>
                          </View>
                          {collapse.nip === profile.nip &&
                          collapse.toggle === true ? (
                            <TouchableOpacity
                              onPress={() =>
                                setCollapse({ nip: "", toggle: false })
                              }
                            >
                              <Ionicons name="chevron-up" size={24} />
                            </TouchableOpacity>
                          ) : (
                            <Ionicons name="chevron-down" size={24} />
                          )}
                        </View>
                      </TouchableOpacity>

                      {collapse.nip === profile.nip &&
                      collapse.toggle === true ? (
                        <View>
                          <TouchableOpacity
                            onPress={() =>
                              setCollapse({ nip: "", toggle: false })
                            }
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
                              {form.data_user?.golongan}
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
                              {form.data_user?.jabatan}
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
                              {form.data_user?.unit_kerja}
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
                      gap: 20,
                    }}
                  >
                    {currentMonth === 12 && form?.data_jenis_cuti?.id === 1 ? (
                      <>
                        <Text
                          style={{ fontSize: fontSizeResponsive("H4", device) }}
                        >
                          Periode Tahun Cuti
                        </Text>

                        <Dropdown
                          data={periodeTahun}
                          setSelected={setPeriodeTahunCuti}
                          selected={periodeTahunCuti}
                          borderWidth={1}
                          borderwidthDrop={1}
                          borderWidthValue={1}
                          borderColor={COLORS.ExtraDivinder}
                          borderColorDrop={COLORS.ExtraDivinder}
                          borderColorValue={COLORS.ExtraDivinder}
                        />
                      </>
                    ) : null}

                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
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
                            width: device === "tablet" ? 300 : 140,
                            borderRadius: 4,
                            borderColor: COLORS.ExtraDivinder,
                            flexDirection: "row",
                          }}
                        >
                          <TextInput
                            editable
                            multiline
                            numberOfLines={4}
                            maxLength={40}
                            placeholder="Mulai"
                            style={{
                              padding: 10,
                              height: 40,
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                            value={TanggalMulai}
                            allowFontScaling={false}
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
                          </View>
                        </View>
                      </View>

                      <View>
                        <View
                          style={{
                            borderWidth: 1,
                            width: device === "tablet" ? 300 : 140,
                            borderRadius: 4,
                            borderColor: COLORS.ExtraDivinder,
                            flexDirection: "row",
                          }}
                        >
                          <TextInput
                            editable
                            multiline
                            numberOfLines={4}
                            maxLength={40}
                            placeholder="Selesai"
                            style={{
                              padding: 10,
                              height: 40,
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                            value={TanggalSelesai}
                            allowFontScaling={false}
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
                              onPress={() => setModalVisiblePicker("selesai")}
                            >
                              <Ionicons
                                name="calendar-outline"
                                size={24}
                                color={COLORS.grey}
                              />
                            </TouchableOpacity>
                          </View>
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
                                  borderRadius: 10,
                                  height: device === "tablet" ? "90%" : "70%",
                                }}
                              >
                                <View style={{ width: "100%", flex: 1 }}>
                                  {/* <CalendarPicker
                                startFromMonday={true}
                                width={wp(90)}
                                weekdays={['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']}
                                months={['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'Desember']}
                                previousComponent={<CustomPreviousComponent />}
                                nextComponent={<CustomNextComponent />}
                                selectedRangeStyle={{ backgroundColor: COLORS.infoDangerLight, fontWeight: 'bold' }}
                                customDayHeaderStyles={customDayHeaderStyles}
                                customDatesStyles={customDatesStyles}
                                onDateChange={handleDateChange}
                                allowRangeSelection={true}
                              />
                              <TouchableOpacity
                              onPress={() => setModalVisiblePicker("")}
                              style={{
                                marginBottom: 3,
                                paddingLeft: "70%",
                                marginBottom: 20,
                                marginLeft: 20,
                                alignContent:"center",
                                justifyContent:"center",
                                marginLeft:"35%"
                              }}
                              >
                              <View
                                style={{
                                  backgroundColor: COLORS.primary,
                                  borderRadius: 10,
                                  width: wp(25),
                                  height: 35,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  marginTop:10,
                                }}
                              >
                                <Text style={{color:"white"}}>
                                  Confirm
                                </Text>
                              </View>
                            </TouchableOpacity> */}
                                  <View
                                    style={{
                                      width: "100%",
                                      paddingTop: 10,
                                      alignSelf: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    {/* <DatePicker
                                options={{
                                  backgroundColor: COLORS.white,
                                  textHeaderColor: COLORS.primary,
                                  textDefaultColor: COLORS.primary,
                                  selectedTextColor: "#fff",
                                  mainColor: COLORS.primary,
                                  textSecondaryColor: COLORS.primary,
                                  borderColor: "rgba(122, 146, 165, 0.1)",
                                }}
                                current={moment(Date.now()).format(
                                  "YYYY-MM-DD"
                                )}
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
                                      moment(formattedDate).format("YYYY-MM-DD")
                                    );
                                  } else if (
                                    modalVisiblePicker === "selesai" &&
                                    !dataPernahDipakai &&
                                    !dataLibur &&
                                    !dataSppd
                                  ) {
                                    setTanggalSelsai(
                                      moment(formattedDate).format("YYYY-MM-DD")
                                    );
                                  } else {
                                    alert(
                                      "Tidak Dapat Memilih Tanggal Tersebut"
                                    );
                                    setTanggalMulai("");
                                  }
                                }}
                              /> */}
                                    <View
                                      style={{
                                        paddingHorizontal: 20,
                                        paddingVertical: 10,
                                        alignItems: "flex-end",
                                      }}
                                    >
                                      <View
                                        style={{
                                          backgroundColor: COLORS.primary,
                                          borderRadius: 20,
                                          marginLeft: 20,
                                          width: device === "tablet" ? 40 : 24,
                                          height: device === "tablet" ? 40 : 24,
                                          justifyContent: "center",
                                          alignItems: "center",
                                        }}
                                      >
                                        <TouchableOpacity
                                          onPress={() =>
                                            setModalVisiblePicker("")
                                          }
                                        >
                                          <Ionicons
                                            name="close-outline"
                                            size={device === "tablet" ? 40 : 24}
                                            color={COLORS.white}
                                          />
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                    <CalendarPicker
                                      todayBackgroundColor={COLORS.info}
                                      disabledDates={tanggalLibur}
                                      previousComponent={
                                        <Ionicons
                                          name="chevron-back-outline"
                                          size={24}
                                          color={COLORS.primary}
                                        />
                                      }
                                      nextComponent={
                                        <Ionicons
                                          name="chevron-forward-outline"
                                          size={24}
                                          color={COLORS.primary}
                                        />
                                      }
                                      customDayHeaderStyles={
                                        customDayHeaderStyles
                                      }
                                      customDatesStyles={customDatesStyles}
                                      startFromMonday={true}
                                      width={device === "tablet" ? 700 : 350}
                                      weekdays={[
                                        "Sen",
                                        "Sel",
                                        "Rab",
                                        "Kam",
                                        "Jum",
                                        "Sab",
                                        "Min",
                                      ]}
                                      months={[
                                        "Januari",
                                        "Februari",
                                        "Maret",
                                        "April",
                                        "Mei",
                                        "Juni",
                                        "Juli",
                                        "Augustus",
                                        "September",
                                        "Oktober",
                                        "November",
                                        "Desember",
                                      ]}
                                      onDateChange={(date) => {
                                        if (modalVisiblePicker === "mulai") {
                                          setTanggalMulai(
                                            moment(date, "YYYY-MM-DD HH:mm:ss")
                                              .locale("id")
                                              .format("YYYY-MM-DD")
                                          );
                                        } else {
                                          setTanggalSelsai(
                                            moment(date, "YYYY-MM-DD HH:mm:ss")
                                              .locale("id")
                                              .format("YYYY-MM-DD")
                                          );
                                        }
                                      }}
                                    />
                                    <TouchableOpacity
                                      onPress={() => {
                                        if (modalVisiblePicker === "mulai") {
                                          setModalVisiblePicker("");
                                        } else {
                                          selectDate();
                                          setModalVisiblePicker("");
                                        }
                                      }}
                                      style={{
                                        marginTop: 10,
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
                        {tipe === "draft" ? (
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {arsipDetail?.detail_dokumen?.dokumen?.jumlah_cuti}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {jumlahCuti?.jumlah_cuti === undefined
                              ? "0"
                              : jumlahCuti?.jumlah_cuti.toString()}
                          </Text>
                        )}
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
                        <TextInput
                          editable
                          multiline
                          onChangeText={setAlamat}
                          value={alamat}
                          style={{ fontSize: fontSizeResponsive("H4", device) }}
                          allowFontScaling={false}
                        />
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
                        <TextInput
                          editable
                          multiline
                          numberOfLines={4}
                          maxLength={40}
                          onChangeText={setTelepon}
                          value={telepon}
                          style={{ fontSize: fontSizeResponsive("H4", device) }}
                          allowFontScaling={false}
                        />
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
                          value={alasanCuti}
                          style={{ fontSize: fontSizeResponsive("H4", device) }}
                          allowFontScaling={false}
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
                          placeholder="Kota di Surat Cuti"
                          onChangeText={setKota}
                          value={kota}
                          style={{ fontSize: fontSizeResponsive("H4", device) }}
                          allowFontScaling={false}
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
                      Lampiran
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
                      *) Hanya pdf yang akan diterima dari total berkas file
                      maks 5mb
                    </Text>
                  </View>
                </View>
                {form.data_kuota_cuti === null ? null : (
                  <>
                    <View style={{ gap: currentMonth !== 12 ? 5 : 10 }}>
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
                          Info Cuti
                        </Text>
                      </View>

                      <View
                        style={{
                          padding: currentMonth !== 12 ? 0 : 5,
                          columnGap: 10,
                        }}
                      >
                        {currentMonth !== 12 ? null : (
                          <Text
                            style={{
                              fontWeight: FONTWEIGHT.bold,
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            Kuota Periode Tahun Berjalan
                          </Text>
                        )}
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
                            {form.data_kuota_cuti?.full_kuota_n}
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
                            {form.data_kuota_cuti?.kuota_terpakai_n}
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
                            {form.data_kuota_cuti?.kuota_sisa_n}
                          </Text>
                        </View>
                      </View>

                      {currentMonth !== 12 ? null : (
                        <>
                          <View
                            style={{
                              padding: 5,
                              columnGap: 10,
                            }}
                          >
                            <Text
                              style={{
                                fontWeight: FONTWEIGHT.bold,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              Kuota Periode Tahun Depan
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
                                {form.data_kuota_cuti?.full_kuota_np1}
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
                                {form.data_kuota_cuti?.kuota_terpakai_np1}
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
                                {form.data_kuota_cuti?.kuota_sisa_np1}
                              </Text>
                            </View>
                          </View>
                        </>
                      )}
                    </View>
                  </>
                )}

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
                      name="people-outline"
                      size={18}
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
                            fontSize: fontSizeResponsive("H3", device),
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
                            fontSize: fontSizeResponsive("H3", device),
                            fontWeight: 600,
                            paddingRight: 20,
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
                {tipe === "draft" ? (
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
                ) : null}
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
                      <View
                        style={[
                          style,
                          { backgroundColor: "rgba(0, 0, 0, 0.5)" },
                        ]}
                      />
                    )}
                  >
                    <BottomSheetView onLayout={handleContentLayout} style={{}}>
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
                        style={{ height: 500 }}
                      />

                      {/* <View style={{ justifyContent: "flex-end" }}>
                                <View
                                    style={{
                                        height: 1,
                                        width: "90%",
                                        backgroundColor: COLORS.lighter,
                                        opacity: 0.3,
                                        marginTop: 10,
                                        marginHorizontal: 20,
                                    }}
                                />
                                <View
                                    style={{
                                        borderWidth: 1,
                                        width: "90%",
                                        marginLeft: 17,
                                        borderRadius: 16,
                                        borderColor: COLORS.ExtraDivinder,
                                        flexDirection: "row",
                                        backgroundColor: COLORS.ExtraDivinder,
                                        marginTop: 10,
                                        marginBottom: 40,
                                    }}
                                >
                                    <BottomSheetTextInput
                                        numberOfLines={1}
                                        maxLength={40}
                                        placeholder="Ketik Komentar Disini"
                                        ref={inputRef}
                                        style={{ padding: 10 }}
                                        onChangeText={setKomen}
                                        value={komen}
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
                                            onPress={() => {
                                                handleComment();
                                            }}
                                        >
                                            <Ionicons
                                                name="send-sharp"
                                                size={20}
                                                color={COLORS.primary}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View> */}
                      {/* </KeyboardAvoidingView> */}
                    </BottomSheetView>
                  </BottomSheetModal>
                </BottomSheetModalProvider>
              </View>

              <View
                style={{
                  marginLeft: 17,
                  flexDirection: "row",
                  gap: 10,
                  paddingBottom: 10,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.success,
                    paddingVertical: 10,
                    borderRadius: 10,
                    width: "46.5%",

                    justifyContent: "center",
                  }}
                  onPress={handleSubmit}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: COLORS.white,
                      fontSize: fontSizeResponsive("H2", device),
                    }}
                  >
                    Kirim
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#B745FF",
                    paddingVertical: 10,
                    borderRadius: 10,
                    width: "46.5%",

                    justifyContent: "center",
                  }}
                  onPress={() => {
                    handleSubmitDraft();
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: COLORS.white,
                      fontSize: fontSizeResponsive("H2", device),
                    }}
                  >
                    Simpan Draft
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
          <ModalSubmit
            status={status}
            setStatus={setStatus}
            messageSuccess={"Data Ditambahkan"}
            navigate={"MainCuti"}
          />
        </>
      )}
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
