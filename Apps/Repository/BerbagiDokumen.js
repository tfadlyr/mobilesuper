import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  COLORS,
  FONTSIZE,
  fontSizeResponsive,
  FONTWEIGHT,
} from "../../config/SuperAppps";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { CardListPesertaAddresbook } from "../../components/CardListPesertaAddresbook";
import DatePicker from "react-native-modern-datepicker";
import moment from "moment";
import {
  postAttachmentRepo,
  postBerbagiDokumen,
  putBerbagiDokumen,
} from "../../service/api";
import { getTokenValue } from "../../service/session";
import { Loading } from "../../components/Loading";
import * as DocumentPicker from "expo-document-picker";
import { Config } from "../../constants/config";
import Checkbox from "expo-checkbox";
import { ModalSubmit } from "../../components/ModalSubmit";
import { setAttachments, setStatus } from "../../store/Repository";
import { CardListPreshareAddressbook } from "../../components/CardListPreshareAddressbook";

const CardListPeserta = ({
  item,
  addressbook,
  persetaSubAgenda = false,
  setPilihanPeserta,
  device,
}) => {
  const dispatch = useDispatch();
  const deleteItem = (id, state) => {
    let data;
    let datas = persetaSubAgenda ? addressbook : addressbook.selected;
    if (state === "jabatan") {
      data = datas.filter((data) => {
        let nip = data.nip || data.officer.official?.split("/")[1];
        return nip !== id;
      });
      if (persetaSubAgenda) {
        setPilihanPeserta(data);
      } else {
        dispatch(setAddressbookSelected(data));
      }
    } else {
      data = datas.filter((data) => data.nip !== id);
      if (persetaSubAgenda) {
        setPilihanPeserta(data);
      } else {
        dispatch(setAddressbookSelected(data));
      }
    }
  };
  return (
    <View key={item.nip || item.id}>
      {item.code !== undefined ||
      (item.title !== undefined && item.title.name !== "") ? (
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
          <Text style={{ fontSize: fontSizeResponsive("H5", device) }}>-</Text>
          <Text
            style={{
              width: device === "tablet" ? "90%" : "80%",
              fontSize: fontSizeResponsive("H5", device),
            }}
          >
            {item.title.name !== undefined ? item.title.name : item.title}
          </Text>
          <TouchableOpacity
            onPress={() => {
              deleteItem(
                item.nip || item.officer.official?.split("/")[1],
                "jabatan"
              );
            }}
          >
            <Ionicons name="trash-outline" size={24} />
          </TouchableOpacity>
        </View>
      ) : (
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
          <Text style={{ fontSize: fontSizeResponsive("H5", device) }}>-</Text>
          <Text
            style={{
              width: device === "tablet" ? "90%" : "80%",
              fontSize: fontSizeResponsive("H5", device),
            }}
          >
            {item.nama || item.fullname}
          </Text>
          <TouchableOpacity
            onPress={() => {
              deleteItem(item.nip, "pegawai");
            }}
          >
            <Ionicons name="trash-outline" size={24} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const DataList = ({ item, device }) => {
  let tipe = item.name.split(".");

  const size = (item.file_size / (1024 * 1024)).toFixed(2);

  const navigation = useNavigation();

  if (item.name.toLowerCase().includes("copy")) {
    return (
      <TouchableOpacity
        style={{
          shadowColor: "black",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          elevation: 3,
          padding: 10,
          backgroundColor: COLORS.white,
          borderRadius: 8,
          marginTop: 2,
          marginHorizontal: 20,
        }}
        onPress={() => {
          navigation.navigate("PdfViewer", {
            data: item?.files,
            type: "DokumenLain",
          });
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 5,
            width: device === "tablet" ? 400 : 200,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H2", device),
              fontWeight: FONTWEIGHT.normal,
              color: COLORS.lighter,
              width: device === "tablet" ? 160 : 80,
            }}
          >
            Nama File
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H2", device) }}>:</Text>
          <Text style={{ fontSize: fontSizeResponsive("H2", device) }}>
            {tipe[0]}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 5,
            width: device === "tablet" ? 400 : 200,
            marginTop: 5,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H2", device),
              fontWeight: FONTWEIGHT.normal,
              color: COLORS.lighter,
              width: device === "tablet" ? 160 : 80,
            }}
          >
            Size
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H2", device) }}>:</Text>
          <Text style={{ fontSize: fontSizeResponsive("H2", device) }}>
            {size} MB
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 5,
            width: device === "tablet" ? 400 : 200,
            marginTop: 5,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H2", device),
              fontWeight: FONTWEIGHT.normal,
              color: COLORS.lighter,
              width: device === "tablet" ? 160 : 80,
            }}
          >
            Ekstensi
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H2", device) }}>:</Text>
          <Text style={{ fontSize: fontSizeResponsive("H2", device) }}>
            {tipe[1]}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 5,
            width: device === "tablet" ? 400 : 200,
            marginTop: 5,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H2", device),
              fontWeight: FONTWEIGHT.normal,
              color: COLORS.lighter,
              width: device === "tablet" ? 160 : 80,
            }}
          >
            Dilihat
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H2", device) }}>:</Text>
          <Text style={{ fontSize: fontSizeResponsive("H2", device) }}>
            {item.views_count}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 5,
            width: device === "tablet" ? 400 : 200,
            marginTop: 5,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H2", device),
              fontWeight: FONTWEIGHT.normal,
              color: COLORS.lighter,
              width: device === "tablet" ? 160 : 80,
            }}
          >
            Diunduh
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H2", device) }}>:</Text>
          <Text style={{ fontSize: fontSizeResponsive("H2", device) }}>
            {item.download_count}
          </Text>
        </View>
      </TouchableOpacity>
    ); // Do not render anything if "copy" is found in the name
  }
  return null;
};

export const BerbagiDokumen = ({ route }) => {
  const { device } = useSelector((state) => state.apps);
  const item = route.params;
  const navigation = useNavigation();
  const [stateConfig, setStateConfig] = useState({});
  const [token, setToken] = useState("");
  const [judulKegiatan, setJudulKegiatan] = useState("");
  const [pilihanAnggotaGrup, setPilihanAnggotaGrup] = useState([]);
  const [pilihanPeninjauGrup, setPilihanPeninjauGrup] = useState([]);
  const [tempatAcara, setTempatAcara] = useState("");
  const [catatan, setCatatan] = useState("");
  const [modalVisiblePicker, setModalVisiblePicker] = useState(false);
  const [tanggal, setTanggal] = useState("");
  const [document, setDocument] = useState([]);
  const [payloaDocument, setPayloadDocument] = useState([]);
  const [type, setType] = useState([]);
  const [isSelected, setSelection] = useState(false);
  const dispatch = useDispatch();
  const { addressbook } = useSelector((state) => state.addressBookKKP);

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
    dispatch(setAttachments([]));
  }, []);

  useEffect(() => {
    if (item?.type === "draft" || item?.type === "edit") {
      setJudulKegiatan(item?.data?.title);
      setTanggal(
        moment(item?.data?.attributes?.tanggal, "YYYY-MM-DD HH:mm:ss")
          .locale("id")
          .format("YYYY-MM-DD")
      );
      setTempatAcara(item?.data?.attributes?.tempat);
      setCatatan(item?.data?.attributes?.deskripsi);

      const pilihanAnggotaGrup = item?.data?.objid_members.map(
        (member, index) => ({
          id: item?.data?.attributes?.id_addressbook?.[index],
          code: member?.objidposisi,
          title: member?.title,
          name: member?.name,
          objidposisi: member?.objidposisi,
          officer: {
            official: member?.name,
          },
        })
      );
      setPilihanAnggotaGrup(pilihanAnggotaGrup);

      // const pilihanPeninjauGrup = item?.data?.reviewers.map(
      //   (member, index) => ({
      //     id: item?.data?.attributes?.id_addressbook?.[index],
      //     code: member?.objidposisi,
      //     title: member?.title,
      //     name: member?.name,
      //     objidposisi: member?.objidposisi,
      //     officer: {
      //       official: member?.name,
      //     },
      //   })
      // );

      setPilihanPeninjauGrup(
        item?.data?.reviewers === null ? [] : item?.data?.reviewers
      );
    }
    if (item?.type === "draft") {
      let typeDoc = [];
      item?.data?.attachments.map((item) => {
        let tipe = item?.files.split("/");
        tipe = tipe[tipe?.length - 1];
        tipe = tipe.split(".");
        tipe = tipe[tipe?.length - 1];
        typeDoc.push(tipe);
      });
      setType(typeDoc);
      setDocument(item?.data.attachments);
      setPayloadDocument(item?.data.attachments);
    }
  }, [item]);

  useEffect(() => {
    if (stateConfig.title === "Peserta Grup") {
      setPilihanAnggotaGrup(addressbook.selected);
    } else if (stateConfig.title === "Peninjau") {
      setPilihanPeninjauGrup(addressbook.selected);
    }
  }, [addressbook]);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});

    // const file = convertFileToObject(result)
    let tipe = result.assets[0].uri.split("/");
    tipe = tipe[tipe.length - 1];
    tipe = tipe.split(".");
    tipe = tipe[tipe.length - 1];

    const size = (result.assets[0].size / (1024 * 1024)).toFixed(3);

    if (size <= 100) {
      setDocument([...document, result.assets]);
      setType([...type, tipe]);
      const data = {
        token: token,
        result: result.assets[0],
      };
      dispatch(postAttachmentRepo(data));
    } else Alert.alert("Peringatan!", "File terlalu besar, maksimal 50MB");
  };

  const { attachment, loading, status } = useSelector(
    (state) => state.repository
  );

  const handleSubmit = (action) => {
    let attachments = [];
    attachment.map((item) => {
      attachments?.push(item.id);
    });

    let document = [];
    payloaDocument.map((item) => {
      document?.push(item.id);
    });

    const combinedIds = [...new Set([...attachments, ...document])];

    let objid_member = [];
    pilihanAnggotaGrup.map((item) => {
      objid_member.push(item.code);
    });

    let id_addressbook = [];
    pilihanAnggotaGrup.map((item) => {
      id_addressbook.push(item.id);
    });

    let nipReviewer = [];
    pilihanPeninjauGrup.map((item) => {
      nipReviewer.push(item?.officer?.official.split("/")[1]);
    });

    let nipReviewerEdit = [];
    pilihanPeninjauGrup.map((item) => {
      nipReviewerEdit.push(item.nip);
    });

    const result = {
      title: judulKegiatan,
      objid_members: objid_member,
      attachments:
        item?.type === "edit" || item?.type === "draft"
          ? combinedIds
          : attachments,
      attributes: {
        tanggal: moment(tanggal),
        tempat: tempatAcara,
        deskripsi: catatan,
        send_notification: isSelected,
        id_addressbook: id_addressbook,
      },
      reviewers_ids:
        item.type === "edit" || item.type === "draft"
          ? nipReviewerEdit
          : nipReviewer,
      action: action === "publish" ? "submit" : "draft",
      published: action === "publish" ? true : false,
      public: false,
      base_url: "-",
    };

    const data = {
      token: token,
      result: result,
      id: item?.data?.id,
    };

    const datas = {
      token: token,
      result: result,
    };

    if (item?.type === "edit" || item?.type === "draft") {
      dispatch(putBerbagiDokumen(data));
      console.log(data);
    } else {
      dispatch(postBerbagiDokumen(datas));
    }
  };

  const transformedData = {
    employee: [],
    id: 11,
    listsDivision: [
      { key: 1, value: "KEMENTERIAN KELAUTAN DAN PERIKANAN" },
      { key: 2, value: "SEKRETARIAT JENDERAL" },
      {
        key: 3,
        value: "DIREKTORAT JENDERAL PENGELOLAAN KELAUTAN DAN RUANG LAUT",
      },
      { key: 4, value: "DIREKTORAT JENDERAL PERIKANAN TANGKAP" },
      { key: 5, value: "DIREKTORAT JENDERAL PERIKANAN BUDI DAYA" },
      {
        key: 6,
        value:
          "DIREKTORAT JENDERAL PENGUATAN DAYA SAING PRODUK KELAUTAN DAN PERIKANAN",
      },
      {
        key: 7,
        value:
          "DIREKTORAT JENDERAL PENGAWASAN SUMBER DAYA KELAUTAN DAN PERIKANAN",
      },
      { key: 8, value: "INSPEKTORAT JENDERAL" },
      {
        key: 9,
        value:
          "BADAN PENYULUHAN DAN PENGEMBANGAN SUMBER DAYA MANUSIA KELAUTAN DAN PERIKANAN",
      },
      {
        key: 10,
        value:
          "BADAN PENGENDALIAN DAN PENGAWASAN MUTU HASIL KELAUTAN DAN PERIKANAN",
      },
    ],
    listsDivisionPara: [],
    listsDivisiontree: [
      {
        code: "",
        header: true,
        id: 4,
        node: 1,
        nodes: [],
        officer: {},
        title: "KEMENTERIAN KELAUTAN DAN PERIKANAN",
      },
    ],
    listsFavorit: [],
    selected: pilihanAnggotaGrup,
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ display: "flex", flex: 1 }}
    >
      {loading ? <Loading /> : null}
      <ScrollView style={{ display: "flex", flex: 1 }}>
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
              backgroundColor: "white",
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
                fontSize: fontSizeResponsive("H3", device),
                fontWeight: 600,
                color: "white",
              }}
            >
              {item?.type === "edit" ? "Edit Dokumen" : "Tambah Dokumen"}
            </Text>
          </View>
        </View>

        <View
          style={{
            padding: 5,
            backgroundColor: COLORS.white,
            borderRadius: 8,
            margin: 18,
          }}
        >
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
              Judul Kegiatan
            </Text>
            <Text style={{ color: COLORS.danger }}>*</Text>
          </View>

          <View
            style={{
              borderWidth: 1,
              width: device === "tablet" ? "95%" : "90%",
              marginLeft: 17,
              borderRadius: 4,
              borderColor: COLORS.ExtraDivinder,
            }}
          >
            <TextInput
              editable
              multiline
              numberOfLines={4}
              maxLength={40}
              placeholder="Masukan Judul Kegiatan"
              style={{
                padding: 10,
                fontSize: fontSizeResponsive("H4", device),
              }}
              onChangeText={setJudulKegiatan}
              value={judulKegiatan}
              allowFontScaling={false}
            />
          </View>

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
              Berbagi Dengan
            </Text>
            <Text style={{ color: COLORS.danger }}>*</Text>
          </View>

          <View
            style={{
              borderWidth: 1,
              width: device === "tablet" ? "95%" : "90%",
              marginLeft: 17,
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
              placeholder="Pilih member"
              style={{
                padding: 10,
                fontSize: fontSizeResponsive("H4", device),
              }}
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
                    title: "Peserta Grup",
                    tabs: {
                      jabatan: true,
                      pegawai: false,
                    },
                    multiselect: true,
                    payload: pilihanAnggotaGrup,
                    // tipeAddress: "korespondensi",
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
          {item.type === "edit" ? (
            <FlatList
              data={pilihanAnggotaGrup}
              renderItem={({ item }) => (
                <CardListPreshareAddressbook
                  item={item}
                  addressbook={transformedData}
                  pilihanAnggotaGrup={pilihanAnggotaGrup}
                  setStateConfig={setStateConfig}
                  device={device}
                />
              )}
              scrollEnabled={false}
              keyExtractor={(index) => index}
            />
          ) : (
            <FlatList
              data={pilihanAnggotaGrup}
              renderItem={({ item }) => (
                <CardListPeserta
                  item={item}
                  addressbook={pilihanAnggotaGrup}
                  persetaSubAgenda={true}
                  setPilihanPeserta={setPilihanAnggotaGrup}
                  device={device}
                />
              )}
              scrollEnabled={false}
              keyExtractor={(index) => index}
            />
          )}
          {pilihanAnggotaGrup.length !== 0 ? (
            <View
              style={{
                flexDirection: "row",
                gap: device === "tablet" ? 10 : 5,
                marginHorizontal: 18,
                marginTop: 10,
                alignItems: "center",
              }}
            >
              <Checkbox
                value={isSelected}
                onValueChange={setSelection}
                color={isSelected === true ? COLORS.primary : null}
              />
              <Text style={{ fontSize: fontSizeResponsive("H5", device) }}>
                Kirim Notifikasi
              </Text>
            </View>
          ) : null}

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
              Peninjau
            </Text>
            <Text style={{ color: COLORS.danger }}>*</Text>
          </View>

          <View
            style={{
              borderWidth: 1,
              width: device === "tablet" ? "95%" : "90%",
              marginLeft: 17,
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
              placeholder="Pilih member"
              style={{
                padding: 10,
                fontSize: fontSizeResponsive("H5", device),
              }}
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
                    title: "Peninjau",
                    tabs: {
                      jabatan: true,
                      pegawai: false,
                    },
                    multiselect: true,
                    payload: pilihanPeninjauGrup,
                    // tipeAddress: "korespondensi",
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

          <FlatList
            data={pilihanPeninjauGrup}
            renderItem={({ item }) => (
              <CardListPeserta
                item={item}
                addressbook={pilihanPeninjauGrup}
                persetaSubAgenda={true}
                setPilihanPeserta={setPilihanPeninjauGrup}
                device={device}
              />
            )}
            scrollEnabled={false}
            keyExtractor={(index) => index}
          />

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
              Tanggal Acara
            </Text>
            <Text style={{ color: COLORS.danger }}>*</Text>
          </View>

          <View
            style={{
              borderWidth: 1,
              width: device === "tablet" ? "95%" : "90%",
              marginLeft: 17,
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
              placeholder="Pilih Tanggal"
              style={{
                padding: 10,
                fontSize: fontSizeResponsive("H5", device),
              }}
              allowFontScaling={false}
              value={tanggal}
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
                  setModalVisiblePicker(true);
                }}
              >
                <Ionicons
                  name="calendar-outline"
                  size={device === "tablet" ? 30 : 24}
                  color={COLORS.grey}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <View>
              <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisiblePicker}
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
                      onPress={() => setModalVisiblePicker(false)}
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
                          const formattedDate = new Date(year, month - 1, day);

                          setTanggal(
                            moment(formattedDate)
                              .locale("id")
                              .format("YYYY-MM-DD")
                          );
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
                              fontSize: fontSizeResponsive("H4", device),
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
              Tempat Acara
            </Text>
            <Text style={{ color: COLORS.danger }}>*</Text>
          </View>

          <View
            style={{
              borderWidth: 1,
              width: device === "tablet" ? "95%" : "90%",
              marginLeft: 17,
              borderRadius: 4,
              borderColor: COLORS.ExtraDivinder,
            }}
          >
            <TextInput
              editable
              multiline
              numberOfLines={4}
              maxLength={40}
              placeholder="Masukan Tempat"
              style={{
                padding: 10,
                fontSize: fontSizeResponsive("H5", device),
              }}
              onChangeText={setTempatAcara}
              value={tempatAcara}
              allowFontScaling={false}
            />
          </View>

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
              Catatan
            </Text>
            <Text style={{ color: COLORS.danger }}>*</Text>
          </View>

          <View
            style={{
              borderWidth: 1,
              width: device === "tablet" ? "95%" : "90%",
              marginLeft: 17,
              borderRadius: 4,
              borderColor: COLORS.ExtraDivinder,
            }}
          >
            <TextInput
              editable
              multiline
              numberOfLines={4}
              placeholder="Masukan Catatan"
              style={{
                padding: 10,
                height: 100,
                fontSize: fontSizeResponsive("H5", device),
              }}
              onChangeText={setCatatan}
              value={catatan}
              allowFontScaling={false}
            />
          </View>

          {item.type === "edit" ? (
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
                  Revisi Lampiran
                </Text>
                <Text style={{ color: COLORS.danger }}>*</Text>
              </View>

              <FlatList
                data={item?.data?.attachments}
                renderItem={({ item }) => (
                  <>
                    <DataList item={item} device={device} />
                  </>
                )}
                style={{ height: 150 }}
                keyExtractor={(item) => item.id}
              />
            </>
          ) : null}

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
              Lampiran
            </Text>
            <Text style={{ color: COLORS.danger }}>*</Text>
          </View>

          <Pressable onPress={pickDocument}>
            <View
              style={{
                borderWidth: 1,
                width: device === "tablet" ? "95%" : "90%",
                marginLeft: 17,
                borderRadius: 4,
                borderColor: COLORS.ExtraDivinder,
                height: 100,
                justifyContent: "center",
                alignItems: "center",
                gap: 5,
              }}
            >
              <View>
                <Ionicons
                  name="cloud-upload-outline"
                  size={device === "tablet" ? 40 : 30}
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

          <View
            style={{
              marginHorizontal: 17,
              marginTop: 5,
              marginBottom: document.length == 0 ? 20 : 0,
            }}
          >
            <Text
              style={{
                color: COLORS.lighter,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              *) Hanya png, jpg, jpeg, pdf, doc, docx, ppt, pptx, xls, xlsx yang
              akan diterima dan ukuran file maks 100 MB
            </Text>
          </View>
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
                  ) : type[i] === "jpg" ||
                    type[i] === "jpeg" ||
                    type[i] === "png" ? (
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
                        source={require("../../assets/superApp/photos.png")}
                        style={{ width: 60, height: 60 }}
                      />
                    </View>
                  ) : type[i] === "ppt" || type[i] === "pptx" ? (
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
                        source={require("../../assets/superApp/ppt.png")}
                      />
                    </View>
                  ) : type[i] === "doc" || type[i] === "docx" ? (
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
                        source={require("../../assets/superApp/word.png")}
                      />
                    </View>
                  ) : type[i] === "xls" || type[i] === "xlsx" ? (
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
                        source={require("../../assets/superApp/excel.png")}
                      />
                    </View>
                  ) : // <>
                  //   <Image
                  //     key={doc.uri}
                  //     source={{ uri: doc.uri }}
                  //     style={{ width: 97, height: 97, borderRadius: 8 }}
                  //   />
                  // </>
                  null}
                </>
              ))}
            </View>
          )}
        </View>
        {item.type !== "edit" ? (
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: COLORS.lightBrown,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 18,
            }}
            onPress={() => {
              handleSubmit("draft");
            }}
          >
            <Text
              style={{
                color: COLORS.white,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Draft
            </Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={{
            padding: 10,
            backgroundColor: COLORS.primary,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: 18,
            marginTop: 10,
          }}
          onPress={() => {
            handleSubmit("publish");
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

        <ModalSubmit
          status={status}
          setStatus={setStatus}
          messageSuccess={"Data Ditambahkan"}
          navigate={"MainRepo"}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
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
