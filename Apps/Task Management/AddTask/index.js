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
  getDetailProjectTM,
  postAttachmentTM,
  postCategoryTM,
  postTaskTM,
} from "../../../service/api";
import DatePicker from "react-native-modern-datepicker";
import moment from "moment/min/moment-with-locales";
import { Dropdown } from "../../../components/DropDown";
import { Pressable } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Search } from "../../../components/Search";
import Checkbox from "expo-checkbox";
import { Loading } from "../../../components/Loading";

const dataPrioritas = [
  {
    key: "high",
    value: "High",
  },
  {
    key: "normal",
    value: "Normal",
  },
  {
    key: "low",
    value: "Low",
  },
];

const dataPengingat = [
  {
    key: "1 hari",
    value: "1 Hari",
  },
  {
    key: "3 hari",
    value: "3 Hari",
  },
  {
    key: "5 hari",
    value: "5 Hari",
  },
];

export const AddTask = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { id_project, id_list } = route.params;
  const { status, treeView, detailProject, attachment, loading } = useSelector(
    (state) => state.task
  );
  const [token, setToken] = useState("");
  const [modalVisiblePicker, setModalVisiblePicker] = useState(false);
  const [modalVisibleMember, setModalVisibleMember] = useState(false);
  const [dataTask, setDataTask] = useState({
    project: "",
    list: "",
    judulTask: "",
    member: [],
    deskripsi: "",
  });
  const [document, setDocument] = useState([]);
  const [type, setType] = useState();
  const [prioritas, setPrioritas] = useState("");
  const [pengingat, setPengingat] = useState("");
  const [targetTanggal, setTargetTanggal] = useState("");
  const [memberIsChecked, setMemberIsChecked] = useState([]);

  const handleInputTask = (key, value) => {
    setDataTask({
      ...dataTask,
      [key]: value,
    });
  };

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (id_list !== undefined || id_project !== undefined) {
      dispatch(getDetailProjectTM({ token: token, id_project: id_project }));

      let project_name = "";
      let list_name = "";

      treeView?.map((ipro) => {
        if (ipro.id === id_project) {
          ipro?.list_tasks?.map((ilist) => {
            if (ilist.id === id_list) {
              project_name = ipro.name;
              list_name = ilist.name;
            }
          });
        }
      });

      setDataTask({
        ...dataTask,
        project: project_name,
        list: list_name,
      });
    }
  }, [token]);

  useEffect(() => {
    if (detailProject !== null) {
      setDataTask({
        ...dataTask,
        member: detailProject.members,
      });
    }
  }, [detailProject]);

  const handleSubmit = () => {
    const member = [];
    memberIsChecked.map((item) => {
      if (item?.code) {
        member.push(item?.code);
      } else {
        member.push(item.nip);
      }
    });

    const idAtt = [];
    attachment?.map((item) => {
      idAtt.push(item.id);
    });

    const payload = {
      list_id: id_list,
      parent_task_id: "",
      title: dataTask.judulTask,
      description: dataTask.deskripsi,
      due_date: targetTanggal,
      members_list: member,
      id_attachment: [],
      priority: prioritas.key,
      reminder: pengingat.key,
    };
    const data = {
      token: token,
      payload: payload,
    };
    dispatch(postTaskTM(data));
  };

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
      result: result,
    };
    dispatch(postAttachmentTM(data));
  };

  const handleChangeChecked = (item) => {
    const index = memberIsChecked.map((e) => e.nip).indexOf(item.nip);
    const isChecked = index > -1;
    const arr = [...memberIsChecked];
    if (isChecked) {
      arr.splice(index, 1);
    } else {
      arr.push(item);
    }
    setMemberIsChecked(arr);
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
              Tambah Tugas
            </Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.Card}>
            <View style={{ flexDirection: "column", gap: 6 }}>
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Text
                  style={{
                    width: 100,
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: FONTSIZE.H3,
                  }}
                >
                  Project
                </Text>
                <Text style={{ flex: 1, fontSize: FONTSIZE.H3 }}>
                  {dataTask.project}
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <Text
                  style={{
                    width: 100,
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: FONTSIZE.H3,
                  }}
                >
                  List
                </Text>
                <Text style={{ flex: 1, fontSize: FONTSIZE.H3 }}>
                  {dataTask.list}
                </Text>
              </View>
            </View>

            <View style={styles.input}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H3 }}
                >
                  Judul Tugas
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
                  onChangeText={(e) => handleInputTask("judulTask", e)}
                  value={dataTask.judulTask}
                  allowFontScaling={false}
                />
              </View>
            </View>

            <View style={styles.input}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H3 }}
                >
                  Target Tanggal
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
                onPress={() => setModalVisiblePicker(true)}
              >
                <TextInput
                  editable
                  multiline
                  placeholder="Pilih Target Tanggal"
                  style={{ padding: 10 }}
                  value={targetTanggal}
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
                    name="calendar-outline"
                    size={24}
                    color={COLORS.grey}
                  />
                </View>
              </TouchableOpacity>
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
                onPress={() => setModalVisibleMember(true)}
              >
                <TextInput
                  editable={false}
                  multiline
                  placeholder="Pilih Penanggung Jawab"
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
                data={memberIsChecked}
                renderItem={({ item }) => (
                  <CardListPeserta
                    item={item}
                    addressbook={memberIsChecked}
                    persetaSubAgenda={true}
                    setPilihanPeserta={setMemberIsChecked}
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
                  Prioritas
                </Text>
                <Text style={{ color: COLORS.danger }}>*</Text>
              </View>
              <Dropdown
                placeHolder={"Pilih prioritas"}
                borderWidth={1}
                data={dataPrioritas}
                setSelected={setPrioritas}
                borderColor={COLORS.ExtraDivinder}
                borderwidthDrop={1}
                borderColorDrop={COLORS.ExtraDivinder}
                borderWidthValue={1}
                borderColorValue={COLORS.ExtraDivinder}
              />
            </View>

            <View style={styles.input}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H3 }}
                >
                  Pengingat
                </Text>
                <Text style={{ color: COLORS.danger }}>*</Text>
              </View>
              <Dropdown
                placeHolder={"Pilih pengingat"}
                borderWidth={1}
                data={dataPengingat}
                setSelected={setPengingat}
                borderColor={COLORS.ExtraDivinder}
                borderwidthDrop={1}
                borderColorDrop={COLORS.ExtraDivinder}
                borderWidthValue={1}
                borderColorValue={COLORS.ExtraDivinder}
              />
            </View>

            <View style={styles.input}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H3 }}
                >
                  Detail Tugas
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
                  onChangeText={(e) => handleInputTask("deskripsi", e)}
                  value={dataTask.deskripsi}
                  allowFontScaling={false}
                />
              </View>
            </View>

            <View style={styles.input}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H3 }}
                >
                  Lampiran
                </Text>
              </View>
              <View>
                <Pressable onPress={pickDocument}>
                  <View
                    style={{
                      borderWidth: 1,
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

                <View>
                  <Text style={{ color: COLORS.lighter }}>
                    *) Hanya png, jpg, jpeg, pdf, doc, docx, ppt, pptx, xls,
                    xlsx yang akan diterima dan ukuran file maks 100 MB
                  </Text>
                </View>
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
                      {type[i] === "doc" || type[i] === "docx" ? (
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
                            source={require("../../../assets/superApp/word.png")}
                          />
                        </View>
                      ) : type[i] === "pdf" ? (
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
                            source={require("../../../assets/superApp/pdf.png")}
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
                            source={require("../../../assets/superApp/ppt.png")}
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
                            source={require("../../../assets/superApp/excel.png")}
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
            </View>
          </View>
        </ScrollView>

        <View style={{ position: "absolute", bottom: 20, right: 20 }}>
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisiblePicker}
        onRequestClose={() => {
          setModalVisiblePicker(false);
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
              width: "90%",
              height: 500,
              borderRadius: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setModalVisiblePicker(false)}
              style={{ paddingRight: "85%", marginBottom: 3, marginLeft: 20 }}
            >
              <View
                style={{
                  backgroundColor: COLORS.primary,
                  borderRadius: 50,
                  width: 35,
                  height: 35,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="close-outline" size={24} color={COLORS.white} />
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
                current={moment(Date.now()).locale("id").format("YYYY-MM-DD")}
                mode="calendar"
                minuteInterval={30}
                style={{ borderRadius: 10 }}
                onSelectedChange={(date) => {
                  const [year, month, day] = date.split("/").map(Number);
                  const formattedDate = new Date(year, month - 1, day);
                  setTargetTanggal(
                    moment(formattedDate).locale("id").format("YYYY-MM-DD")
                  );
                }}
              />
              <TouchableOpacity
                onPress={() => setModalVisiblePicker(false)}
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
                  <Text style={{ color: COLORS.white }}>Ok</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisibleMember}
        onRequestClose={() => {
          setModalVisibleMember(false);
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
              width: "90%",
              height: "70%",
              borderRadius: 8,
              padding: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity onPress={() => setModalVisibleMember(false)}>
                <Ionicons name="close-outline" size={24} />
              </TouchableOpacity>
              <Text style={{ fontWeight: FONTWEIGHT.bold }}>
                Penanggung Jawab
              </Text>
            </View>
            {/* custom divider */}
            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#DBDADE",
                marginTop: 10,
              }}
            />
            <View>
              <View style={{ marginVertical: 20 }}>
                <Search
                  onSearch={(e) => {
                    const data = dataTask.member.filter((item) =>
                      item.nama.toLowerCase().includes(e.toLowerCase())
                    );
                    if (e !== "" || data.length > 0) {
                      handleInputTask("member", data);
                    } else {
                      handleInputTask("member", detailProject?.members);
                    }
                  }}
                  placeholder={"Cari Berdasarkan Nama"}
                />
              </View>
              <ScrollView>
                {dataTask.member?.map((item) => {
                  return item.is_employee ? (
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Ionicons name="person-circle-outline" size={24} />
                          <Text>{item.nama}</Text>
                        </View>
                        <Checkbox
                          value={
                            memberIsChecked
                              .map((e) => e.nip)
                              .indexOf(item.nip) > -1
                          }
                          onValueChange={() => handleChangeChecked(item)}
                          // color={isChecked ? '#4630EB' : undefined}
                        />
                      </View>
                      {/* custom divider */}
                      <View
                        style={{
                          height: 1,
                          width: "100%",
                          backgroundColor: "#DBDADE",
                          marginVertical: 10,
                        }}
                      />
                    </View>
                  ) : (
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Ionicons name="person-circle-outline" size={24} />
                          <Text>{item.title.name}</Text>
                        </View>
                        <Checkbox
                          value={
                            memberIsChecked
                              .map((e) => e.nip)
                              .indexOf(item.nip) > -1
                          }
                          onValueChange={() => handleChangeChecked(item)}
                        />
                      </View>
                      {/* custom divider */}
                      <View
                        style={{
                          height: 1,
                          width: "100%",
                          backgroundColor: "#DBDADE",
                          marginVertical: 10,
                        }}
                      />
                    </View>
                  );
                })}
              </ScrollView>
            </View>
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
