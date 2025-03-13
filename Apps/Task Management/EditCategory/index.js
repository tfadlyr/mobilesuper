import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Text, FlatList } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTSIZE, FONTWEIGHT } from "../../../config/SuperAppps";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setAddressbookSelected } from "../../../store/AddressbookKKP";
import { Modal } from "react-native";
import { Image } from "react-native";
import { setStatus } from "../../../store/Task";
import { getTokenValue } from "../../../service/session";
import {
  editCategoryTM,
  getDetailProjectTM,
  postCategoryTM,
} from "../../../service/api";
import { Loading } from "../../../components/Loading";

export const EditCategory = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { id } = route.params;
  const [stateConfig, setStateConfig] = useState({});
  const { addressbook } = useSelector((state) => state.addressBookKKP);
  const { status, detailProject, loading } = useSelector((state) => state.task);
  const [token, setToken] = useState("");
  const [dataKategori, setDataKategori] = useState({
    namaProject: "",
    deskripsi: "",
  });
  const [pilihanPIC, setPilihanPIC] = useState([]);
  const [pilihanMember, setPilihanMember] = useState([]);

  const handleInputKategori = (key, value) => {
    setDataKategori({
      ...dataKategori,
      [key]: value,
    });
  };

  useEffect(() => {
    if (stateConfig.title === "PIC") {
      setPilihanPIC(addressbook.selected);
    } else if (stateConfig.title === "Member") {
      setPilihanMember(addressbook.selected);
    }
  }, [addressbook]);

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    dispatch(getDetailProjectTM({ token: token, id_project: id, type: "" }));
  }, [token]);

  useEffect(() => {
    if (detailProject !== null) {
      setDataKategori({
        namaProject: detailProject.name,
        deskripsi: detailProject.description,
      });
      setPilihanPIC(detailProject.pic);
      setPilihanMember(detailProject.members);
    }
  }, [token]);

  const handleSubmit = () => {
    const pic = [];
    pilihanPIC?.map((item) => {
      if (item?.code) {
        pic.push(item?.code);
      } else {
        pic.push(item.nip);
      }
    });

    const member = [];
    pilihanMember.map((item) => {
      if (item?.code) {
        member.push(item?.code);
      } else {
        member.push(item.nip);
      }
    });

    const payload = {
      name: dataKategori.namaProject,
      description: dataKategori.deskripsi,
      pic_objid: pic[0],
      members_list: member,
    };
    const data = {
      token: token,
      payload: payload,
      id_project: detailProject.id,
    };
    dispatch(editCategoryTM(data));
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {loading ? <Loading /> : null}
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
            <TouchableOpacity style={{}} onPress={() => navigation.goBack()}>
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
              Ubah Project
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.Card}>
            <View style={styles.input}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H3 }}
                >
                  Nama Project
                </Text>
                <Text style={{ color: COLORS.danger }}>*</Text>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 4,
                  borderColor: COLORS.ExtraDivinder,
                }}
              >
                <TextInput
                  editable
                  multiline
                  placeholder="Ketikan Sesuatu"
                  style={{ padding: 10 }}
                  onChangeText={(e) => handleInputKategori("namaProject", e)}
                  value={dataKategori.namaProject}
                  allowFontScaling={false}
                />
              </View>
            </View>

            <View style={styles.input}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H3 }}
                >
                  Deskripsi
                </Text>
                <Text style={{ color: COLORS.danger }}>*</Text>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 4,
                  borderColor: COLORS.ExtraDivinder,
                }}
              >
                <TextInput
                  editable
                  multiline
                  placeholder="Ketikan Sesuatu"
                  style={{ padding: 10, minHeight: 150 }}
                  onChangeText={(e) => handleInputKategori("deskripsi", e)}
                  value={dataKategori.deskripsi}
                  allowFontScaling={false}
                />
              </View>
            </View>

            <View style={styles.input}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H3 }}
                >
                  PIC
                </Text>
                <Text style={{ color: COLORS.danger }}>*</Text>
              </View>

              <TouchableOpacity
                activeOpacity={1}
                style={{
                  borderWidth: 1,
                  borderRadius: 4,
                  borderColor: COLORS.ExtraDivinder,
                  flexDirection: "row",
                }}
                onPress={() => {
                  const config = {
                    title: "PIC",
                    tabs: {
                      jabatan: true,
                      pegawai: true,
                    },
                    multiselect: false,
                    payload: pilihanPIC,
                  };
                  setStateConfig(config);
                  navigation.navigate("AddressBook", { config: config });
                }}
              >
                <TextInput
                  editable={false}
                  multiline
                  placeholder="Pilih PIC"
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
                  <Ionicons
                    name="people-outline"
                    size={24}
                    color={COLORS.grey}
                  />
                </View>
              </TouchableOpacity>

              <FlatList
                data={pilihanPIC}
                renderItem={({ item }) => (
                  <CardListPeserta
                    item={item}
                    addressbook={pilihanPIC}
                    persetaSubAgenda={true}
                    setPilihanPeserta={setPilihanPIC}
                  />
                )}
                scrollEnabled={false}
                keyExtractor={(index) => index}
              />
            </View>

            <View style={styles.input}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H3 }}
                >
                  Penanggung Jawab
                </Text>
                <Text style={{ color: COLORS.danger }}>*</Text>
              </View>

              <TouchableOpacity
                activeOpacity={1}
                style={{
                  borderWidth: 1,
                  borderRadius: 4,
                  borderColor: COLORS.ExtraDivinder,
                  flexDirection: "row",
                }}
                onPress={() => {
                  const config = {
                    title: "Member",
                    tabs: {
                      jabatan: true,
                      pegawai: true,
                    },
                    multiselect: true,
                    payload: pilihanMember,
                  };
                  setStateConfig(config);
                  navigation.navigate("AddressBook", { config: config });
                }}
              >
                <TextInput
                  editable={false}
                  multiline
                  placeholder="Pilih Member"
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
                  <Ionicons
                    name="people-outline"
                    size={24}
                    color={COLORS.grey}
                  />
                </View>
              </TouchableOpacity>

              <FlatList
                data={pilihanMember}
                renderItem={({ item }) => (
                  <CardListPeserta
                    item={item}
                    addressbook={pilihanMember}
                    persetaSubAgenda={true}
                    setPilihanPeserta={setPilihanMember}
                  />
                )}
                scrollEnabled={false}
                keyExtractor={(index) => index}
              />
            </View>
          </View>
        </ScrollView>

        <View
          style={{ position: "absolute", bottom: 20, right: 20, zIndex: 1 }}
        >
          <TouchableOpacity onPress={() => handleSubmit()}>
            <View
              style={{
                backgroundColor: COLORS.primary,
                borderRadius: 50,
                width: 44,
                height: 44,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="checkmark-outline"
                size={24}
                color={COLORS.white}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

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
            Platform.OS === "ios" ? styles.iOSBackdrop : styles.androidBackdrop,
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
                    source={require("../../../assets/superApp/alertBerhasil.png")}
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
                      navigation.goBack();
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
                  source={require("../../../assets/superApp/alertGagal.png")}
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
    </GestureHandlerRootView>
  );
};

const CardListPeserta = ({
  item,
  addressbook,
  persetaSubAgenda = false,
  setPilihanPeserta,
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
          <Text>-</Text>
          <Text style={{ width: "80%" }}>
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
          <Text>-</Text>
          <Text style={{ width: "80%" }}>{item.nama || item.fullname}</Text>
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

const styles = StyleSheet.create({
  Card: {
    backgroundColor: COLORS.white,
    margin: 20,
    padding: 20,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 20,
    borderRadius: 16,
  },
  input: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
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
