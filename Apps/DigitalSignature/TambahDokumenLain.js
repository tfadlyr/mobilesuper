import React, { useEffect } from "react";
import { Platform, Text } from "react-native";
import {} from "react-native-safe-area-context";
import { AVATAR, COLORS, FONTSIZE, FONTWEIGHT } from "../../config/SuperAppps";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { Pressable } from "react-native";
import { useRef } from "react";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native";
import { Image } from "react-native";
import {
  addAttachmentDigiSign,
  addDocumentDigiSign,
  getCourseDigiSign,
  postAttachment,
} from "../../service/api";
import { useDispatch, useSelector } from "react-redux";
import { getTokenValue } from "../../service/session";
import { Dropdown } from "../../components/DropDown";
import * as DocumentPicker from "expo-document-picker";
import { setAttachment } from "../../store/Event";
import { Modal } from "react-native";
import { setStatus } from "../../store/DigitalSign";

export const TambahDokumenLain = () => {
  const navigation = useNavigation();
  const richText = useRef(null);
  const [document, setDocument] = useState([]);

  const [Subject, setSubject] = useState("");
  const [Nodokumen, setNoDokumen] = useState("");
  const [Jenisdokumen, setJenisDokumen] = useState([]);
  const [Keterangan, setKeterangan] = useState("");
  const [token, setToken] = useState("");
  const [type, setType] = useState([]);
  const [stateConfig, setStateConfig] = useState({});
  const [pilihanPenandatangan, setPilihanPenandatangan] = useState([]);

  const dispatch = useDispatch();
  const { courseList, status } = useSelector((state) => state.digitalsign);
  const { profile } = useSelector((state) => state.superApps);
  const { attachment } = useSelector((state) => state.event);
  const { addressbook } = useSelector((state) => state.addressBookKKP);

  let dummyDokumen = [
    {
      key: "1",
      value: "dokumen",
    },
    {
      key: "2",
      value: "dokumen2",
    },
  ];
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    // const file = convertFileToObject(result)
    let tipe = result.uri.split("/");
    tipe = tipe[tipe.length - 1];
    tipe = tipe.split(".");
    tipe = tipe[tipe.length - 1];
    setDocument([...document, result]);
    setType([...type, tipe]);
    const data = {
      token: token,
      result: result,
    };
    dispatch(postAttachment(data));
  };

  useEffect(() => {
    if (stateConfig.title === "Pimpinan Event") {
      setPilihanPenandatangan(addressbook.selected);
    }
  }, [addressbook]);

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getCourseDigiSign(token));
    }
    dispatch(setAttachment([]));
  }, [token]);

  const handleSubmitUnggah = () => {
    const pilihTtd = [];
    pilihanPenandatangan?.map((item) => {
      if (item?.code) {
        pilihTtd.push(item?.code);
      } else {
        pilihTtd.push(item.nip);
      }
    });

    let id_attch = [];
    attachment.map((item) => {
      id_attch.push(item.id);
    });
    const payload = {
      subject: Subject,
      senders: [profile.nip],
      approvers: pilihTtd,
      action: "submit",
      id_attachments: id_attch,
      extra_attributes: {
        noDokumen: Nodokumen,
        keterangan: Keterangan,
        jenisDokumen:
          Jenisdokumen.value === undefined ? "" : Jenisdokumen.value,
        tanggalDokumen: new Date(),
      },
      comment: "comment",
      tipe_dokumen: "dokumen_lain",
    };
    const data = {
      token: token,
      payload: payload,
    };
    dispatch(addDocumentDigiSign(data));
  };

  const handleSubmitDraft = () => {
    const pilihTtd = [];
    pilihanPenandatangan?.map((item) => {
      if (item?.code) {
        pilihTtd.push(item?.code);
      } else {
        pilihTtd.push(item.nip);
      }
    });

    let id_attch = [];
    attachment.map((item) => {
      id_attch.push(item.id);
    });
    const payload = {
      subject: Subject,
      senders: [profile.nip],
      approvers: pilihTtd,
      action: "draft",
      id_attachments: id_attch,
      extra_attributes: {
        noDokumen: Nodokumen,
        keterangan: Keterangan,
        jenisDokumen: Jenisdokumen.key === undefined ? "" : Jenisdokumen.key,
        tanggalDokumen: new Date(),
      },
      comment: "comment",
      tipe_dokumen: "dokumen_lain",
    };
    const data = {
      token: token,
      payload: payload,
    };
    // dispatch(addDocumentDigiSign(data))
  };

  const pickCourse = () => {
    let judulCourse = [];
    courseList.map((item) => {
      judulCourse.push({
        key: item.id,
        value: item.shortname,
      });
    });
    return judulCourse;
  };

  return (
    <>
      <ScrollView>
        <Pressable onPress={() => richText.current?.dismissKeyboard()}>
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
                width: 28,
                height: 28,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 20,
              }}
            >
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, alignItems: "center", marginRight: 50 }}>
              <Text
                style={{ fontSize: 15, fontWeight: 600, color: COLORS.white }}
              >
                Dokumen Baru
              </Text>
            </View>
          </View>

          <View style={styles.Card}>
            <View
              style={{
                marginTop: 20,
                marginBottom: 10,
                marginLeft: 17,
                flexDirection: "row",
              }}
            >
              <Text
                style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H3 }}
              >
                Judul Dokumen
              </Text>
              <Text style={{ color: COLORS.danger }}>*</Text>
            </View>
            <View
              style={{
                borderWidth: 1,
                width: "90%",
                marginLeft: 17,
                borderRadius: 4,
                borderColor: COLORS.ExtraDivinder,
              }}
            >
              <TextInput
                required={true}
                editable
                multiline
                numberOfLines={4}
                maxLength={40}
                placeholder="Masukan Judul Dokumen"
                style={{ padding: 10 }}
                onChangeText={setSubject}
                value={Subject}
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
                style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H3 }}
              >
                No Dokumen
              </Text>
              <Text style={{ color: COLORS.danger }}>*</Text>
            </View>
            <View
              style={{
                borderWidth: 1,
                width: "90%",
                marginLeft: 17,
                borderRadius: 4,
                borderColor: COLORS.ExtraDivinder,
                flexDirection: "row",
              }}
            >
              <TextInput
                required={true}
                editable
                multiline
                numberOfLines={4}
                maxLength={40}
                placeholder="Masukan Nomor Dokumen"
                style={{ padding: 10 }}
                onChangeText={setNoDokumen}
                value={Nodokumen}
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
                style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H3 }}
              >
                Penandatangan
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
                required={true}
                editable
                multiline
                numberOfLines={4}
                maxLength={40}
                placeholder="Pilih member"
                style={{ padding: 10, width: "80%" }}
                value={pilihanPenandatangan[0]?.title}
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
                      title: "Pimpinan Event",
                      tabs: {
                        jabatan: true,
                        pegawai: false,
                      },
                      multiselect: false,
                      payload: pilihanPenandatangan,
                    };
                    setStateConfig(config);
                    navigation.navigate("AddressBook", { config: config });
                  }}
                >
                  <Ionicons
                    name="people-outline"
                    size={24}
                    color={COLORS.grey}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                marginTop: 20,
                marginBottom: 10,
                marginLeft: 17,
                flexDirection: "row",
              }}
            >
              <Text
                style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H3 }}
              >
                Judul Dokumen
              </Text>
            </View>
            <View style={{ marginHorizontal: 17 }}>
              <Dropdown
                data={dummyDokumen}
                setSelected={setJenisDokumen}
                borderWidth={1}
                borderColor={COLORS.ExtraDivinder}
                borderwidthDrop={1}
                borderColorDrop={COLORS.ExtraDivinder}
                borderWidthValue={1}
                borderColorValue={COLORS.ExtraDivinder}
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
                style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H3 }}
              >
                Lampiran
              </Text>
            </View>
            <Pressable onPress={pickDocument}>
              <View
                style={{
                  borderWidth: 1,
                  width: "90%",
                  marginLeft: 17,
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
                    name="md-cloud-upload-outline"
                    size={30}
                    color={"#66656C"}
                  />
                </View>
                <Text style={{ color: "#66656C" }}>Klik Untuk Unggah</Text>
              </View>
            </Pressable>
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
                    ) : (
                      <Image
                        key={doc.uri}
                        source={{ uri: doc.uri }}
                        style={{ width: 97, height: 97, borderRadius: 8 }}
                      />
                    )}
                  </>
                ))}
              </View>
            )}
            <View style={{ marginVertical: 10, marginHorizontal: 17 }}>
              <Text style={{ color: COLORS.lighter }}>
                *) Hanya pdf yang akan diterima dan ukuran file maks 10 MB
              </Text>
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
                style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H3 }}
                onChangeText={setKeterangan}
                value={Keterangan}
              >
                Keterangan
              </Text>
            </View>
            <View
              style={{
                borderWidth: 1,
                width: "90%",
                marginLeft: 17,
                borderRadius: 4,
                borderColor: COLORS.ExtraDivinder,
                flexDirection: "row",
                marginBottom: 20,
              }}
            >
              <KeyboardAvoidingView style={{ flex: 1 }}>
                <TextInput
                  editable
                  multiline
                  numberOfLines={4}
                  maxLength={40}
                  placeholder="Ketikan Sesuatu"
                  style={{ padding: 10, height: 150 }}
                  onChangeText={setKeterangan}
                  value={Keterangan}
                  allowFontScaling={false}
                />
              </KeyboardAvoidingView>
            </View>
          </View>

          {/* <TouchableOpacity style={{ marginVertical: 30 }} onPress={()=> {}}>
                        <View style={{ alignItems: 'flex-end', marginRight: 40, marginBottom: 40 }}>
                            <View style={{ backgroundColor: COLORS.infoDanger, borderRadius: 50, width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}>
                                <Ionicons name='checkmark-outline' size={24} color={COLORS.white} />
                            </View>
                        </View>
                    </TouchableOpacity> */}
          <View
            style={{ flexDirection: "row", justifyContent: "center", gap: 10 }}
          >
            <TouchableOpacity
              style={{
                marginVertical: 30,
                backgroundColor: "#D2B48C",
                padding: 20,
                borderRadius: 10,
                width: 180,
              }}
              onPress={() => {
                handleSubmitDraft();
              }}
            >
              <Text style={{ textAlign: "center", color: "white" }}>
                Simpan Draft
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginVertical: 30,
                backgroundColor: "#752A2B",
                padding: 20,
                borderRadius: 10,
                width: 180,
              }}
              onPress={() => {
                handleSubmitUnggah();
              }}
            >
              <Text style={{ textAlign: "center", color: "white" }}>Kirim</Text>
            </TouchableOpacity>
          </View>
        </Pressable>

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
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
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
                        navigation.navigate("DokumenLain");
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
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  Card: {
    backgroundColor: COLORS.white,
    width: "90%",
    marginVertical: 20,
    marginLeft: 20,
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
