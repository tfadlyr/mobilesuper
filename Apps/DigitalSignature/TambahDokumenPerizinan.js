import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native";
import { Dropdown } from "../../components/DropDown";
import * as DocumentPicker from "expo-document-picker";
import { useDispatch, useSelector } from "react-redux";
import { getTokenValue } from "../../service/session";
import {
  COLORS,
  FONTSIZE,
  fontSizeResponsive,
  FONTWEIGHT,
} from "../../config/SuperAppps";
import {
  addAttachmentDigiSign,
  addDocumentDigiSign,
  getNomorPerizinanMenteri,
  putDocumentPerizinan,
} from "../../service/api";
import { setAddressbookSelected } from "../../store/AddressbookKKP";
import {
  jenisPerizinan,
  jenisPermohonan,
  kategoriPerizinan,
  listParaf,
} from "./dataDokPerizinan";
import AlertConfirm from "../../components/UI/AlertConfirm";
import moment from "moment";
import {
  resetNomorDokPerizinan,
  setStatus,
  resetAttachment,
  setAttachmentDokPerizinan,
  setAttachmentLampiran,
  resetDetail,
} from "../../store/DigitalSign";
import { Loading } from "../../components/Loading";

export default TambahDokumenPerizinan = ({ route }) => {
  const dispatch = useDispatch();
  const { itemId } = route.params;
  const navigation = useNavigation();

  const { device } = useSelector((state) => state.apps);
  const { profile } = useSelector((state) => state.superApps);
  const { addressbook } = useSelector((state) => state.addressBookKKP);
  const {
    status,
    digitalsign,
    attachmentDokPerizinan,
    attachmentLampiran,
    nomorDokPerizinan,
    loading,
  } = useSelector((state) => state.digitalsign);

  const detail = digitalsign.detail;
  const [token, setToken] = useState("");
  const [stateConfig, setStateConfig] = useState({});
  const [jenisPermohonanOption, setJenisPermohonanOption] = useState([]);
  const [dataForm, setDataForm] = useState({
    jenisPerizinan: {
      key: "",
      value: "",
    },
    kategoriPerizinan: {
      key: "",
      value: "",
    },
    jenisPermohonan: {
      key: "",
      value: "",
    },
    perihal: "",
    nomorPerizinan: "",
    paraf: [],
    dokumenPerizinan: [],
    lampiran: [],
  });
  const [uploadedFilesDraft, setUploadedFilesDraft] = useState([]);

  const handleSetData = (name, value) => {
    if (name === "jenisPerizinan") {
      setDataForm({
        ...dataForm,
        [name]: value,
        kategoriPerizinan: { key: "", value: "" },
        jenisPermohonan: { key: "", value: "" },
        paraf: [],
      });
      return; // Hentikan eksekusi setelah kondisi terpenuhi
    }

    if (name === "kategoriPerizinan") {
      setJenisPermohonanOption(value.jenisPermohonan);
      setDataForm({
        ...dataForm,
        [name]: value,
        jenisPermohonan: { key: "", value: "" },
        paraf: listParaf?.filter((x) => x?.group?.includes(value?.key)),
      });
      dispatch(
        setAddressbookSelected(
          listParaf?.filter((x) => x?.group?.includes(value?.key))
        )
      );
      return; // Hentikan eksekusi setelah kondisi terpenuhi
    }

    // Default handler jika name bukan "jenisPerizinan" atau "kategoriPerizinan"
    setDataForm({
      ...dataForm,
      [name]: value,
    });
  };

  const handleCheckButtonAmbilNomor = () => {
    if (
      dataForm.jenisPerizinan.key === "" ||
      dataForm.kategoriPerizinan.key === "" ||
      dataForm?.jenisPermohonan.key === "" ||
      dataForm.nomorPerizinan !== ""
    ) {
      return true;
    } else return false;
  };

  const handleGetNomorDokumen = () => {
    const tgl = moment(new Date()).format("YYYY-MM-DD");
    const jp = dataForm.jenisPermohonan.key;
    const jd = jp === "pemerintah" ? "-P" : jp === "non-berusaha" ? "-NB" : "";
    let payload = {
      tanggal: tgl,
      jenisDokumen: dataForm.kategoriPerizinan.alias + jd,
    };
    let data = {
      token: token,
      param: payload,
    };
    dispatch(getNomorPerizinanMenteri(data));
  };

  const isDisabledButtonKirim = () => {
    if (
      dataForm.jenisPerizinan.key === "" ||
      dataForm.kategoriPerizinan.key === "" ||
      dataForm.jenisPermohonan.key === "" ||
      // dataForm.nomorPerizinan === "" ||
      dataForm.perihal === "" ||
      dataForm.paraf.length == 0 ||
      attachmentDokPerizinan.length == 0 ||
      attachmentLampiran.length == 0
    ) {
      return true;
      // } else if (
      //   dataForm.jenisPerizinan.key === "" ||
      //   dataForm.kategoriPerizinan.key === "" ||
      //   dataForm.jenisPermohonan.key === "" ||
      //   dataForm.nomorPerizinan === "" ||
      //   dataForm.perihal === "" ||
      //   dataForm.paraf.length == 0 ||
      //   attachmentDokPerizinan.length == 0 ||
      //   (attachmentLampiran.length == 0 && itemId)
      // ) {
      //   return true;
    } else {
      return false;
    }
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    const size = (result.assets[0].size / (1024 * 1024)).toFixed(2);

    if (size <= 50) {
      const fileName = result.assets[0].name; // Ambil nama file
      if (("perizinan_" + fileName).length >= 200) {
        Alert.alert(
          "Peringatan!",
          "Nama file terlalu panjang, maksimal 200 karakter"
        );
      } else {
        const data = {
          token: token,
          file: result.assets[0],
          name: "perizinan_" + fileName,
        };
        dispatch(addAttachmentDigiSign(data));
      }
    } else {
      Alert.alert("Peringatan!", "File terlalu besar, maksimal 50MB");
    }
  };

  const pickDocumentLampiran = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    const size = (result.assets[0].size / (1024 * 1024)).toFixed(2);
    if (size <= 50) {
      const fileName = result.assets[0].name; // Ambil nama file
      if (("perizinan_" + fileName).length >= 200) {
        Alert.alert(
          "Peringatan!",
          "Nama file terlalu panjang, maksimal 200 karakter"
        );
      } else {
        const data = {
          token: token,
          file: result.assets[0],
          name: "lampiran_" + fileName,
        };
        dispatch(addAttachmentDigiSign(data));
      }
    }
  };

  const handleGetKategoriPerizinan = () => {
    if (dataForm?.jenisPerizinan?.key !== "") {
      return kategoriPerizinan?.filter(
        (x) => x?.group === dataForm?.jenisPerizinan?.group
      );
    }
    return [];
  };

  const handleSubmit = () => {
    const idAtt = [];
    const approvers = [];

    dataForm.paraf?.map((item) => {
      approvers.push(item.nip);
    });
    attachmentDokPerizinan?.map((item) => {
      idAtt.push(item.id);
    });
    attachmentLampiran?.map((item) => {
      idAtt.push(item.id);
    });

    const payload = {
      subject: dataForm.perihal,
      senders: [profile.nip],
      approvers: [...approvers, "88888"],
      action: "submit",
      id_attachments: idAtt,
      extra_attributes: {
        jenis_perizinan: dataForm.jenisPerizinan.value,
        kategori_perizinan: dataForm.kategoriPerizinan.value,
        jenis_permohonan: dataForm.jenisPermohonan.value,
        no_perizinan: dataForm.nomorPerizinan,
      },
      comment: "comment",
      tipe_dokumen: "dokumen_pkrl",
    };

    const data = {
      token: token,
      payload: payload,
    };

    if (itemId) {
      data["id"] = itemId;
      dispatch(putDocumentPerizinan(data));
    } else {
      dispatch(addDocumentDigiSign(data));
    }
  };

  const resetState = () => {
    setDataForm({
      jenisPerizinan: {
        key: "",
        value: "",
      },
      kategoriPerizinan: {
        key: "",
        value: "",
      },
      jenisPermohonan: {
        key: "",
        value: "",
      },
      perihal: "",
      nomorPerizinan: "",
      paraf: [],
      dokumenPerizinan: [],
      lampiran: [],
    });
  };

  useEffect(() => {
    resetState();
    dispatch(resetAttachment());
    dispatch(resetNomorDokPerizinan(""));

    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (itemId && detail) {
      let approvers = [];

      detail?.attachments?.map((item) => {
        if (item.name.startsWith("lampiran")) {
          dispatch(setAttachmentLampiran(item));
        } else if (
          item.name.startsWith("perizinan") &&
          detail?.state !== "ttde"
        ) {
          dispatch(setAttachmentDokPerizinan(item));
        }
      });

      if (detail?.state === "ttde") {
        index = detail.attachments.findIndex(
          (x) => x.name.split("_")[0] === "draft-perizinan"
        );
        if (index > -1) {
          setUploadedFilesDraft([detail?.attachments[index]]);
        }
      }

      detail?.approvers?.map((item, index) => {
        if (index > 0 && index < detail.approvers.length - 2) {
          approvers.push({
            key: item.is_title ? item.objidposisi : item.nip,
            code: item.is_title ? item.objidposisi : item.nip,
            text: item.is_title ? item.display_title : item.nama,
            nip: item.is_title ? item.officer.nip : item.nip,
            title: item.is_title ? item.display_title : item.nama,
            name: item.is_title ? item.officer.nama : item.nama,
          });
        }
      });

      let jenis = { key: "", value: "" };
      const checkJenis = jenisPerizinan?.filter(
        (x) => x.value === detail?.extra_attributes?.jenis_perizinan
      );
      if (checkJenis) {
        jenis = checkJenis[0];
      }

      let kategori = { key: "", value: "" };
      const checkKategori = kategoriPerizinan.filter(
        (x) => x.value === detail?.extra_attributes?.kategori_perizinan
      );
      if (checkKategori) {
        kategori = checkKategori[0];
        setJenisPermohonanOption(kategori?.jenisPermohonan);
      }

      let jenisp = { key: "", value: "" };
      const checkJenisp = jenisPermohonan?.filter(
        (x) => x.value === detail?.extra_attributes?.jenis_permohonan
      );
      if (checkJenisp) {
        jenisp = checkJenisp[0];
      }

      setDataForm({
        jenisPerizinan: jenis,
        kategoriPerizinan: kategori,
        jenisPermohonan: jenisp,
        perihal: detail?.subject,
        nomorPerizinan: detail?.extra_attributes?.no_perizinan,
        paraf: approvers,
        dokumenPerizinan: [],
        lampiran: [],
      });

      dispatch(setAddressbookSelected(approvers));
    }
  }, [itemId, detail]);

  useEffect(() => {
    setDataForm({
      ...dataForm,
      nomorPerizinan: nomorDokPerizinan,
    });
  }, [nomorDokPerizinan]);

  useEffect(() => {
    if (stateConfig.title === "Paraf") {
      handleSetData("paraf", addressbook.selected);
    }
  }, [addressbook]);

  const handleBeforeTTDE = () => {
    if (Object.keys(detail).length !== 0 && detail?.state === "ttde") {
      return true;
    }
    return false;
  };

  console.log(Object.keys(detail).length);
  console.log(detail);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        {loading ? <Loading /> : null}
        <ScrollView>
          {/* Header Section */}
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
                  fontWeight: 600,
                  color: COLORS.white,
                }}
              >
                {itemId ? "Edit Data Perizinan" : "Tambah Data Perizinan"}
              </Text>
            </View>
          </View>
          {/* Form Data */}
          <View style={styles.Card}>
            {/* Jenis Perizinan */}
            <View
              style={{
                marginTop: 10,
                marginBottom: 10,
                marginLeft: 17,
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                Jenis Perizinan
              </Text>
              <Text style={{ color: COLORS.danger }}>*</Text>
            </View>
            <View style={{ marginHorizontal: 17 }}>
              <Dropdown
                data={jenisPerizinan}
                borderWidth={1}
                borderwidthDrop={1}
                borderWidthValue={1}
                selected={dataForm.jenisPerizinan}
                borderColor={COLORS.ExtraDivinder}
                placeHolder={"Pilih Jenis Perizinan"}
                borderColorDrop={COLORS.ExtraDivinder}
                borderColorValue={COLORS.ExtraDivinder}
                editable={dataForm.nomorPerizinan === ""}
                setSelected={(item) => handleSetData("jenisPerizinan", item)}
              />
            </View>

            {/* Kategori Perizinan */}
            <View
              style={{
                marginTop: 20,
                marginBottom: 10,
                marginLeft: 17,
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                Kategori Perizinan
              </Text>
              <Text style={{ color: COLORS.danger }}>*</Text>
            </View>
            <View style={{ marginHorizontal: 17 }}>
              <Dropdown
                borderWidth={1}
                borderwidthDrop={1}
                borderWidthValue={1}
                borderColor={COLORS.ExtraDivinder}
                selected={dataForm.kategoriPerizinan}
                data={handleGetKategoriPerizinan()}
                borderColorDrop={COLORS.ExtraDivinder}
                borderColorValue={COLORS.ExtraDivinder}
                placeHolder={"Pilih Kategori Perizinan"}
                editable={dataForm.nomorPerizinan === ""}
                setSelected={(item) => handleSetData("kategoriPerizinan", item)}
              />
            </View>

            {/* Jenis Permohonan */}
            <View
              style={{
                marginTop: 20,
                marginBottom: 10,
                marginLeft: 17,
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                Jenis Permohonan
              </Text>
              <Text style={{ color: COLORS.danger }}>*</Text>
            </View>
            <View style={{ marginHorizontal: 17 }}>
              <Dropdown
                borderWidth={1}
                borderwidthDrop={1}
                borderWidthValue={1}
                data={jenisPermohonanOption}
                borderColor={COLORS.ExtraDivinder}
                selected={dataForm.jenisPermohonan}
                borderColorDrop={COLORS.ExtraDivinder}
                placeHolder={"Pilih Jenis Permohonan"}
                borderColorValue={COLORS.ExtraDivinder}
                editable={dataForm.nomorPerizinan === ""}
                setSelected={(item) => handleSetData("jenisPermohonan", item)}
              />
            </View>

            {/* Nomor Perizinan */}
            {handleBeforeTTDE() ? (
              <>
                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 17,
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Nomor Perizinan
                  </Text>
                  <Text style={{ color: COLORS.danger }}>*</Text>
                </View>
                {/* Button Ambil Nomor */}
                <TouchableOpacity
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    marginHorizontal: 18,
                    marginBottom: 10,
                    backgroundColor: handleCheckButtonAmbilNomor()
                      ? COLORS.grey
                      : COLORS.infoDanger,
                  }}
                  disabled={handleCheckButtonAmbilNomor()}
                  onPress={() =>
                    AlertConfirm(
                      "Ambil Nomor",
                      "Mohon Cek Kembali Kelengkapan Dokumen Perizinan, Apakah Anda Yakin Akan Mengambil Penomoran?",
                      handleGetNomorDokumen,
                      "Ya"
                    )
                  }
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Ambil Nomor
                  </Text>
                </TouchableOpacity>
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 4,
                    marginHorizontal: 17,
                    borderColor: COLORS.ExtraDivinder,
                  }}
                >
                  <TextInput
                    multiline
                    maxLength={40}
                    editable={false}
                    numberOfLines={4}
                    style={{
                      padding: 10,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                    allowFontScaling={false}
                    value={dataForm.nomorPerizinan}
                    placeholder="Masukan Nomor Perizinan"
                    onChangeText={(value) =>
                      handleSetData("nomorPerizinan", value)
                    }
                  />
                </View>
              </>
            ) : null}

            {/* Perihal Perizinan */}
            <View
              style={{
                marginTop: 10,
                marginBottom: 10,
                marginLeft: 17,
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                Perihal Perizinan
              </Text>
              <Text style={{ color: COLORS.danger }}>*</Text>
            </View>
            <View
              style={{
                borderWidth: 1,
                marginHorizontal: 17,
                borderRadius: 4,
                borderColor: COLORS.ExtraDivinder,
              }}
            >
              <TextInput
                editable
                multiline
                maxLength={100}
                numberOfLines={4}
                value={dataForm.perihal}
                style={{
                  padding: 10,
                  fontSize: fontSizeResponsive("H4", device),
                }}
                allowFontScaling={false}
                placeholder="Masukan Perihal Perizinan"
                onChangeText={(value) => handleSetData("perihal", value)}
              />
            </View>

            {/* Paraf */}
            <View
              style={{
                marginTop: 10,
                marginBottom: 10,
                marginLeft: 17,
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                Paraf
              </Text>
              <Text style={{ color: COLORS.danger }}>*</Text>
            </View>
            <View
              style={{
                borderWidth: 1,
                marginHorizontal: 17,
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
                placeholder="Pilih dari Addressbook"
                style={{
                  padding: 10,
                  width: "80%",
                  fontSize: fontSizeResponsive("H4", device),
                }}
                value={dataForm.paraf}
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
                  onPress={() => {
                    const config = {
                      title: "Paraf",
                      tabs: {
                        jabatan: true,
                        pegawai: false,
                      },
                      multiselect: true,
                      payload: dataForm.paraf,
                    };
                    setStateConfig(config);
                    navigation.navigate("AddressBook", { config: config });
                  }}
                >
                  <Ionicons
                    name="people-outline"
                    size={device === "tablet" ? 30 : 24}
                    color={COLORS.grey}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* List Paraf */}
            <FlatList
              data={dataForm.paraf}
              renderItem={({ item }) => (
                <CardListPeserta
                  item={item}
                  addressbook={addressbook}
                  device={device}
                  setDataForm={setDataForm}
                  dataForm={dataForm}
                />
              )}
              scrollEnabled={false}
              keyExtractor={(index) => index}
            />

            {/* Dokumen Perizinan */}
            {handleBeforeTTDE() && (
              <>
                <View
                  style={{
                    marginTop: 10,
                    marginBottom: 10,
                    marginLeft: 17,
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Dokumen Draft Perizinan
                  </Text>
                </View>
                {uploadedFilesDraft.length < 1 ? null : (
                  <View
                    style={{
                      flexDirection: "row",
                      marginHorizontal: 20,
                      marginVertical: 10,
                      flexWrap: "wrap",
                      gap: 10,
                    }}
                  >
                    {uploadedFilesDraft?.map((doc, i) => (
                      <TouchableOpacity
                        key={i}
                        style={{
                          width: "100%",
                          height: "auto",
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          borderWidth: 1,
                          borderRadius: 8,
                          paddingVertical: 20,
                          paddingHorizontal: 10,
                          borderColor: COLORS.ExtraDivinder,
                        }}
                        onPress={() => {
                          navigation.navigate("PdfViewer", {
                            data: doc?.file,
                            type: "DokumenLain",
                          });
                        }}
                      >
                        <Image
                          style={{ marginRight: 5 }}
                          source={require("../../assets/superApp/pdf.png")}
                        />
                        <View style={{ width: "85%" }}>
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {doc?.name}
                          </Text>
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {(doc?.file_size / 1024).toFixed(2)} KB
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            )}

            {/* Dokumen Perizinan */}
            <View
              style={{
                marginTop: 10,
                marginBottom: 10,
                marginLeft: 17,
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Dokumen Perizinan
              </Text>
              <Text
                style={{
                  color: COLORS.danger,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                *
              </Text>
            </View>
            <Pressable onPress={pickDocument}>
              <View
                style={{
                  borderWidth: 1,
                  marginHorizontal: 17,
                  borderRadius: 4,
                  borderColor: COLORS.ExtraDivinder,
                  height: 250,
                  marginBottom: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <View style={{ marginBottom: 10 }}>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={device == "tablet" ? 40 : 30}
                    color={"#66656C"}
                  />
                </View>
                <Text
                  style={{
                    color: "#66656C",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Klik Untuk Unggah
                </Text>
              </View>
            </Pressable>
            {attachmentDokPerizinan.length < 1 ? null : (
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 20,
                  marginVertical: 10,
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {attachmentDokPerizinan?.map((doc, i) => (
                  <TouchableOpacity
                    key={i}
                    style={{
                      width: "100%",
                      height: "auto",
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      borderWidth: 1,
                      borderRadius: 8,
                      paddingVertical: 20,
                      paddingHorizontal: 10,
                      borderColor: COLORS.ExtraDivinder,
                    }}
                    onPress={() => {
                      navigation.navigate("PdfViewer", {
                        data: doc?.file,
                        type: "DokumenLain",
                      });
                    }}
                  >
                    <Image
                      style={{ marginRight: 5 }}
                      source={require("../../assets/superApp/pdf.png")}
                    />
                    <View style={{ width: "85%" }}>
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        {doc?.name}
                      </Text>
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        {(doc?.file_size / 1024).toFixed(2)} KB
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={{ marginVertical: 10, marginHorizontal: 17 }}>
              <Text
                style={{
                  color: COLORS.lighter,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                *) Hanya pdf yang akan diterima dan ukuran file maks 50 MB
              </Text>
            </View>

            {/* Dokumen Lampiran Pendukung */}
            <View
              style={{
                marginTop: 10,
                marginBottom: 10,
                marginLeft: 17,
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                Dokumen Lampiran Pendukung
              </Text>
              <Text style={{ color: COLORS.danger }}>*</Text>
            </View>
            <Pressable onPress={pickDocumentLampiran}>
              <View
                style={{
                  borderWidth: 1,
                  marginHorizontal: 17,
                  borderRadius: 4,
                  borderColor: COLORS.ExtraDivinder,
                  height: 250,
                  marginBottom: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <View style={{ marginBottom: 10 }}>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={device == "tablet" ? 40 : 30}
                    color={"#66656C"}
                  />
                </View>
                <Text
                  style={{
                    color: "#66656C",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Klik Untuk Unggah
                </Text>
              </View>
            </Pressable>
            {attachmentLampiran.length < 1 ? null : (
              <View
                style={{
                  flexDirection: "row",
                  marginHorizontal: 20,
                  marginVertical: 10,
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                {attachmentLampiran?.map((doc, i) => (
                  <TouchableOpacity
                    key={1}
                    style={{
                      width: "100%",
                      height: "auto",
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      borderWidth: 1,
                      borderRadius: 8,
                      paddingVertical: 20,
                      paddingHorizontal: 10,
                      borderColor: COLORS.ExtraDivinder,
                    }}
                    onPress={() => {
                      navigation.navigate("PdfViewer", {
                        data: doc?.file,
                        type: "DokumenLain",
                      });
                    }}
                  >
                    <Image
                      style={{ marginRight: 5 }}
                      source={require("../../assets/superApp/pdf.png")}
                    />
                    <View style={{ width: "85%" }}>
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        {doc?.name}
                      </Text>
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        {(doc.file_size / 1024).toFixed(2)} KB
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={{ marginVertical: 10, marginHorizontal: 17 }}>
              <Text
                style={{
                  color: COLORS.lighter,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                *) Hanya pdf yang akan diterima dan ukuran file maks 50 MB
              </Text>
            </View>
          </View>

          {/* Button Kirim */}
          <TouchableOpacity
            style={{
              padding: 10,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 18,
              marginBottom: 10,
              backgroundColor: isDisabledButtonKirim()
                ? COLORS.grey
                : COLORS.primary,
            }}
            disabled={isDisabledButtonKirim()}
            onPress={() => {
              handleSubmit();
            }}
          >
            <Text
              style={{
                color: COLORS.white,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Kirim
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          animationType="fade"
          transparent={true}
          visible={status === "" ? false : true}
          onRequestClose={() => {
            dispatch(setStatus(""));
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
                width: 325,
                height: 350,
              }}
            >
              <TouchableOpacity
                onPress={() => dispatch(setStatus(""))}
                style={{ marginTop: 5, paddingRight: "80%" }}
              >
                <Ionicons name="close-outline" size={24} />
              </TouchableOpacity>
              {status === "berhasil" ? (
                <>
                  <View style={{ marginBottom: 40 }}>
                    <Image
                      source={require("../../assets/superApp/alertBerhasil.png")}
                    />
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 20,
                      }}
                    >
                      <Text>Berhasil Ditambahkan!</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        dispatch(setStatus(""));
                        navigation.navigate("MainPerizinanMenteri");
                      }}
                      style={{
                        marginTop: 20,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: COLORS.success,
                          width: 217,
                          height: 39,
                          borderRadius: 8,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ color: COLORS.white }}>Ok</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={{ marginBottom: 40 }}>
                  <Image
                    source={require("../../assets/superApp/alertGagal.png")}
                  />
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 20,
                    }}
                  >
                    <Text>Terjadi Kesalahan!</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => dispatch(setStatus(""))}
                    style={{
                      marginTop: 20,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: COLORS.danger,
                        width: 217,
                        height: 39,
                        borderRadius: 8,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ color: COLORS.white }}>Ok</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  Card: {
    backgroundColor: COLORS.white,
    marginVertical: 20,
    marginHorizontal: 20,
    borderRadius: 16,
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
});

const CardListPeserta = ({
  item,
  addressbook,
  device,
  setDataForm,
  dataForm,
}) => {
  const dispatch = useDispatch();
  const deleteItem = (id, state) => {
    let data;
    if (state === "jabatan") {
      data = addressbook.selected.filter((data) => {
        let nip = data.nip;
        return nip !== id;
      });
      setDataForm({ ...dataForm, paraf: data });
      dispatch(setAddressbookSelected(data));
    } else {
      data = addressbook.selected.filter((data) => {
        let nip = data.nip;
        return nip !== id;
      });
      setDataForm({ ...dataForm, paraf: data });
      dispatch(setAddressbookSelected(data));
    }
  };
  return (
    <View>
      {item.title === undefined ? null : (
        <View
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            marginTop: 10,
            marginHorizontal: "5%",
            gap: 10,
          }}
        >
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>-</Text>
          <Text
            style={{ width: "80%", fontSize: fontSizeResponsive("H4", device) }}
          >
            {item.title}
          </Text>
          <TouchableOpacity
            onPress={() => {
              deleteItem(item.nip, "jabatan");
            }}
          >
            <Ionicons
              name="trash-outline"
              size={device === "tablet" ? 30 : 24}
            />
          </TouchableOpacity>
        </View>
      )}
      {item.fullname === undefined ? null : (
        <View
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            marginTop: 10,
            marginHorizontal: "5%",
            gap: 10,
          }}
        >
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>-</Text>
          <Text
            style={{ width: "80%", fontSize: fontSizeResponsive("H4", device) }}
          >
            {item.fullname}
          </Text>
          <TouchableOpacity
            onPress={() => {
              deleteItem(item.nip, "pegawai");
            }}
          >
            <Ionicons
              name="trash-outline"
              size={device === "tablet" ? 30 : 24}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
