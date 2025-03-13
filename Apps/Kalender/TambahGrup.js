import React, { useEffect, useState } from "react";
import { Image, Modal, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Text } from "react-native";
import { AVATAR, COLORS, FONTSIZE, FONTWEIGHT } from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native";
import { TextInput } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { useMemo } from "react";
import { useRef } from "react";
import { Search } from "../../components/Search";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native";
import { CardPilihMember } from "../../components/CardPilihMember";
import {} from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { setAddressbookSelected } from "../../store/AddressbookKKP";
import { postGrup } from "../../service/api";
import { setStatus } from "../../store/GrupKalender";
import { getTokenValue } from "../../service/session";
import { ModalSubmit } from "../../components/ModalSubmit";
import { CardListPesertaAddresbook } from "../../components/CardListPesertaAddresbook";
import { Loading } from "../../components/Loading";

// const CardListPeserta = ({ item, addressbook }) => {
//     const dispatch = useDispatch()
//     const deleteItem = (id, state) => {
//         let data;
//         if (state === "jabatan") {
//             data = addressbook.selected.filter(data => data.id !== id)
//             dispatch(setAddressbookSelected(data))
//         } else {
//             data = addressbook.selected.filter(data => data.nip !== id)
//             dispatch(setAddressbookSelected(data))
//         }
//     }
//     return (
//         <View>
//             {item.title === undefined ? (
//                 null
//             ) : (
//                 <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', marginTop: 10, marginHorizontal: '5%', gap: 10 }}>
//                     <Text>-</Text>
//                     <Text style={{ width: '80%' }}>{item.title}</Text>
//                     <TouchableOpacity onPress={() => {
//                         deleteItem(item.id, 'jabatan')
//                     }}>
//                         <Ionicons name='trash-outline' size={24} />
//                     </TouchableOpacity>
//                 </View>
//             )}
//             {item.fullname === undefined ? (
//                 null
//             ) : (
//                 <View style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', marginTop: 10, marginHorizontal: '5%', gap: 10 }}>
//                     <Text>-</Text>
//                     <Text style={{ width: '80%' }}>{item.fullname}</Text>
//                     <TouchableOpacity onPress={() => {
//                         deleteItem(item.nip, 'pegawai')
//                     }}>
//                         <Ionicons name='trash-outline' size={24} />
//                     </TouchableOpacity>
//                 </View>
//             )}
//         </View>
//     )
// }

export const TambahGrup = () => {
  const bottomSheetModalMemberRef = useRef(null);
  const navigation = useNavigation();

  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetMember = () => {
    bottomSheetModalMemberRef.current?.present();
  };

  const [dataFilter, setDataFilter] = useState([]);
  const handleClickItem = (id, toggle) => {
    if (toggle) {
      const result = items.find((item) => item.id === id);
      setDataFilter([...dataFilter, result]);
    } else {
      const index = dataFilter.findIndex((item) => item.id === id);
      dataFilter.splice(index, 1);
      let result = dataFilter;
      setDataFilter(result);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [namaGrup, setNamaGrup] = useState("");
  const [busana, setBusana] = useState("");
  const [perlengkapan, setPerlengkapan] = useState("");
  const [atribut, setAtribut] = useState("");

  const [pilihanPimpinanGrup, setPilihanPimpinanGrup] = useState([]);
  const [pilihanEditorGrup, setPilihanEditorGrup] = useState([]);
  const [pilihanAnggotaGrup, setPilihanAnggotaGrup] = useState([]);
  const [stateConfig, setStateConfig] = useState({});
  const [token, setToken] = useState("");
  const dispatch = useDispatch();

  const { addressbook } = useSelector((state) => state.addressBookKKP);
  const { status, loading } = useSelector((state) => state.grupKalender);

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (stateConfig.title === "Pimpinan Grup") {
      setPilihanPimpinanGrup(addressbook.selected);
    } else if (stateConfig.title === "Editor Grup") {
      setPilihanEditorGrup(addressbook.selected);
    } else if (stateConfig.title === "Peserta Grup") {
      setPilihanAnggotaGrup(addressbook.selected);
    }
  }, [addressbook]);

  useEffect(() => {
    handleStateAddressBook();
  }, [addressbook]);

  const handleStateAddressBook = () => {
    if (stateConfig.title === "Pimpinan Grup") {
      let pilihan_pic = [];

      const editor = pilihanEditorGrup;
      const member = pilihanAnggotaGrup;
      let sameName = "";
      let sameNameMember = "";

      if (addressbook.selected.length) {
        for (let i = 0; i < addressbook.selected.length; i++) {
          const filterEditor = editor.filter(
            (x) => x.title === addressbook.selected[i].title
          );
          const filterMember = member.filter(
            (x) => x.title === addressbook.selected[i].title
          );
          if (filterEditor.length < 1 && filterMember.length < 1) {
            pilihan_pic.push(addressbook.selected[i]);
          } else if (filterEditor.length > 0) {
            sameName = addressbook.selected[i].title;
          } else if (filterMember.length > 0) {
            sameNameMember = addressbook.selected[i].title;
          }
        }
      }
      setPilihanPimpinanGrup(pilihan_pic);
      if (sameName !== "") {
        alert(`Mohon maaf, ${sameName} sudah menjadi grup editor`);
      } else if (sameNameMember !== "") {
        alert(`Mohon maaf, ${sameNameMember} sudah menjadi grup anggota`);
      }
    } else if (stateConfig.title === "Editor Grup") {
      let pilihan_editor = [];

      const pic = pilihanPimpinanGrup;
      const member = pilihanAnggotaGrup;
      let sameNamePIC = "";
      let sameNameMember = "";

      if (addressbook.selected.length) {
        for (let i = 0; i < addressbook.selected.length; i++) {
          const filterPic = pic.filter(
            (x) => x.title === addressbook.selected[i].title
          );
          const filterMember = member.filter(
            (x) => x.title === addressbook.selected[i].title
          );
          if (filterPic.length < 1 && filterMember.length < 1) {
            pilihan_editor.push(addressbook.selected[i]);
          } else if (filterPic.length > 0) {
            sameNamePIC = addressbook.selected[i].title;
          } else if (filterMember.length > 0) {
            sameNameMember = addressbook.selected[i].title;
          }
        }
      }
      setPilihanEditorGrup(pilihan_editor);
      if (sameNamePIC !== "") {
        alert(`Mohon maaf, ${sameNamePIC} sudah menjadi PIC`);
      } else if (sameNameMember !== "") {
        alert(`Mohon maaf, ${sameNameMember} sudah menjadi Member`);
      }
    } else if (stateConfig.title === "Peserta Grup") {
      let pilihan_anggota = [];

      const editor = pilihanEditorGrup;
      const pic = pilihanPimpinanGrup;
      let sameNameEditor = "";
      let sameNamePIC = "";
      if (addressbook.selected.length) {
        for (let i = 0; i < addressbook.selected.length; i++) {
          const filterEditor = editor.filter(
            (x) => x.title === addressbook.selected[i].title
          );
          const filterPic = pic.filter(
            (x) => x.title === addressbook.selected[i].title
          );
          if (filterEditor.length < 1 && filterPic.length < 1) {
            pilihan_anggota.push(addressbook.selected[i]);
          } else if (filterEditor.length > 0) {
            sameNameEditor = addressbook.selected[i].title;
          } else if (filterPic.length > 0) {
            sameNamePIC = addressbook.selected[i].title;
          }
        }
      }
      setPilihanAnggotaGrup(pilihan_anggota);
      if (sameNameEditor !== "") {
        alert(`Mohon maaf, ${sameNameEditor} sudah menjadi grup editor`);
      } else if (sameNamePIC !== "") {
        alert(`Mohon maaf, ${sameNamePIC} sudah menjadi PIC`);
      }
    }
  };

  const handleSubmit = () => {
    const pilihEditor = [];
    pilihanEditorGrup?.map((item) => {
      if (item?.code) {
        pilihEditor.push(item?.code);
      } else {
        pilihEditor.push(item.nip);
      }
    });

    const pilihAnggota = [];
    pilihanAnggotaGrup?.map((item) => {
      if (item?.code) {
        pilihAnggota.push(item?.code);
      } else {
        pilihAnggota.push(item.nip);
      }
    });

    const payload = {
      name: namaGrup,
      description: "",
      editors_list: pilihEditor,
      members_list: pilihAnggota,
      pic_objid: pilihanPimpinanGrup[0]?.code,
      extra_attributes: {
        ketentuan_busana: busana,
        perlengkapan: perlengkapan,
        atribut: atribut,
      },
    };
    const data = {
      token: token,
      payload: payload,
    };
    dispatch(postGrup(data));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <>
        {loading ? <Loading /> : null}
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
                  Grup Baru
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
                  Nama Grup
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
                  editable
                  multiline
                  numberOfLines={4}
                  maxLength={40}
                  placeholder="Masukan Nama Grup"
                  style={{ padding: 10 }}
                  onChangeText={setNamaGrup}
                  value={namaGrup}
                  allowFontScaling={false}
                />
              </View>
              <View
                style={{
                  marginTop: 10,
                  marginLeft: 17,
                  backgroundColor: COLORS.primary,
                  width: "90%",
                  height: 30,
                  justifyContent: "center",
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: FONTSIZE.H3,
                    color: COLORS.white,
                    marginLeft: 4,
                  }}
                >
                  Akses Kontrol
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
                >
                  PIC
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
                  editable
                  multiline
                  numberOfLines={4}
                  maxLength={40}
                  placeholder="Pilih member"
                  style={{ padding: 10 }}
                  value={pilihanPimpinanGrup[0]?.title}
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
                        title: "Pimpinan Grup",
                        tabs: {
                          jabatan: true,
                          pegawai: false,
                        },
                        multiselect: false,
                        payload: pilihanPimpinanGrup,
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
                  marginTop: 10,
                  marginBottom: 10,
                  marginLeft: 17,
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H3 }}
                >
                  Grup Editor
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
                  editable
                  multiline
                  numberOfLines={4}
                  maxLength={40}
                  placeholder="Pilih member"
                  style={{ padding: 10 }}
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
                        title: "Editor Grup",
                        tabs: {
                          jabatan: true,
                          pegawai: false,
                        },
                        multiselect: true,
                        payload: pilihanEditorGrup,
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
              <FlatList
                data={pilihanEditorGrup}
                renderItem={({ item }) => (
                  <CardListPesertaAddresbook
                    item={item}
                    addressbook={addressbook}
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
                  style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H3 }}
                >
                  Grup Anggota
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
                  editable
                  multiline
                  numberOfLines={4}
                  maxLength={40}
                  placeholder="Pilih member"
                  style={{ padding: 10 }}
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
              <FlatList
                data={pilihanAnggotaGrup}
                renderItem={({ item }) => (
                  <CardListPeserta item={item} addressbook={addressbook} />
                )}
                scrollEnabled={false}
                keyExtractor={(index) => index}
              />

              <View
                style={{
                  marginTop: 10,
                  marginLeft: 17,
                  backgroundColor: COLORS.primary,
                  width: "90%",
                  height: 30,
                  justifyContent: "center",
                  borderRadius: 4,
                }}
              >
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: FONTSIZE.H3,
                    color: COLORS.white,
                    marginLeft: 4,
                  }}
                >
                  Parameter
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
                >
                  Ketentuan Busana
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
                }}
              >
                <TextInput
                  editable
                  multiline
                  numberOfLines={4}
                  maxLength={40}
                  placeholder="Ketikan sesuatu"
                  style={{ padding: 10 }}
                  onChangeText={setBusana}
                  value={busana}
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
                  Perlengkapan
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
                }}
              >
                <TextInput
                  editable
                  multiline
                  numberOfLines={4}
                  maxLength={40}
                  placeholder="Ketikan sesuatu"
                  style={{ padding: 10 }}
                  onChangeText={setPerlengkapan}
                  value={perlengkapan}
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
                  Atribut Lainnya
                </Text>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  width: "90%",
                  marginLeft: 17,
                  borderRadius: 4,
                  borderColor: COLORS.ExtraDivinder,
                  marginBottom: 20,
                  flexDirection: "row",
                }}
              >
                <TextInput
                  editable
                  multiline
                  numberOfLines={4}
                  maxLength={40}
                  placeholder="Ketikan sesuatu"
                  style={{ padding: 10 }}
                  onChangeText={setAtribut}
                  value={atribut}
                  allowFontScaling={false}
                />
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: "100%",
                  // backgroundColor: "black",
                  paddingVertical: 20,
                  paddingHorizontal: "5%",
                }}
              >
                <TouchableOpacity onPress={() => handleSubmit()}>
                  <View
                    style={{
                      backgroundColor: COLORS.primary,
                      width: "100%",
                      padding: 15,
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: COLORS.white }}>Simpan Grup</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <ModalSubmit />
          </ScrollView>
        </BottomSheetModalProvider>
      </>
    </GestureHandlerRootView>
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
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
