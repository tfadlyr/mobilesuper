import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  Button,
  Card,
  Checkbox,
  IconButton,
  Switch,
  TextInput,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import { GlobalStyles } from "../../../constants/styles";
import { nde_api } from "../../../utils/api.config";
import {
  getHTTP,
  handlerError,
  headerToken,
  postHTTP,
} from "../../../utils/http";
import moment from "moment";
import {
  addDispoMulti,
  removeDispoMulti,
  setNotaTindakan,
  setNotaTindakanFree,
  setTodoDuedate,
  setTodoPriority,
  switchTodo,
} from "../../../store/dispoMulti";
import { Config } from "../../../constants/config";
import { COLORS, fontSizeResponsive } from "../../../config/SuperAppps";
import { useRef } from "react";
import { Platform } from "react-native";
import { setUnker } from "../../../store/profile";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import SignatureScreen from "react-native-signature-canvas";
import { Ionicons } from "@expo/vector-icons";
import { setAddressbookSelected } from "../../../store/AddressbookKKP";
import {
  Collapse,
  CollapseBody,
  CollapseHeader,
} from "accordion-collapse-react-native";
import { detailEselonII } from "../../../components/DetailDispo/eselon2";
import { detailMenteri } from "../../../components/DetailDispo/menteri";
import { detailEselonI } from "../../../components/DetailDispo/eselon1";
import { detailMenteriDef } from "../../../components/DetailDispo/menteriDef";

function DispositionLembar({ route, id, data, tipe }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { profile, selectedAttr } = useSelector((state) => state.profile);
  const [senderAttr, setSenderAttr] = useState(selectedAttr);
  let dispoMulti = useSelector((state) => state.dispoMulti.data);
  const { addressbook } = useSelector((state) => state.addressBookKKP);
  const [selectedAddressbook, setSelectedAddressbook] = useState(addressbook);
  const [ids, setid] = useState();
  const [detail, setDetail] = useState();
  const [tipes, setTipe] = useState();
  const [tindakanList, setTindakanList] = useState();
  const [visibleDatePicker, setvisibleDatePicker] = useState();
  const [isFocusPrio, setIsFocusPrio] = useState();
  const [btnAdd, setbtnAdd] = useState(false);
  const [isLoading, setIsLoading] = useState();
  const [scrollEnabled, setScrollEnabled] = useState();
  const [stylusEnabled, setStylusEnabled] = useState(false);
  const [stylusFile, setStylusFile] = useState("");

  const [receiversDispo, setReceiversDispo] = useState({});
  const [collapse, setCollapse] = useState({
    addressbook: true,
    petunjuk: true,
  });
  const [expandedItems, setExpandedItems] = useState({});
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  console.log(screenWidth);
  const toggleCollapse = (index) => {
    setExpandedItems({});
    setCollapse((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Toggle expand/collapse untuk item
  const toggleItem = (code) => {
    setExpandedItems((prev) => ({
      ...prev,
      [code]: !prev[code],
    }));
  };
  const { device } = useSelector((state) => state.apps);
  const [selectedTindakan, setSelectedTindakan] = useState([]);
  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
  const priority = [
    { view: "Tinggi", value: "hi" },
    { view: "Normal", value: "nr" },
    { view: "Rendah", value: "lo" },
  ];
  const [pilihanKepada, setPilihanKepada] = useState([]);
  useEffect(() => {
    setPilihanKepada(addressbook.selected);
  }, [addressbook.selected]);

  const refresh = navigation.addListener("focus", () => {
    setSelectedAddressbook(addressbook);
  });
  useEffect(() => {
    if (id == undefined) {
      setid(route?.params?.id);
    } else {
      setid(id);
    }
    if (tipe == undefined) {
      setTipe(route?.params?.tipe);
    } else {
      setTipe(tipe);
    }
    if (data == undefined) {
      setDetail(route?.params?.data);
    } else {
      if (data?.obj) {
        setDetail(data?.obj);
      } else {
        setDetail(data);
      }
    }
    getHeader();
    if (profile.title.length == 1) {
      setSenderAttr(profile.title[0]);
    }
    if (
      (route?.params?.tipe == "disposition" ||
        route?.params?.tipe == "in" ||
        tipe == "disposition") &&
      (profile?.nik === "88888" || profile?.nik === "99999")
    ) {
      getReceiversDispo();
    } else if (
      (route?.params?.tipe == "detail" || tipe == "detail") &&
      data?.obj
    ) {
      setReceiversDispo(data?.receivers_config);

      //set matching receivers
      let temp = [];
      data?.receivers_config?.kepada_dispo?.map((item) => {
        temp = temp.concat(transformData(item));
      });
      const matchingCodes = findMatchReceivers(temp, data?.receivers_ids);
      setreceiverDispo(matchingCodes);
      //set matching action
      const actionArray = data?.action?.split("\n").map((item) => item.trim());
      const matches = data?.sender?.actions?.filter((actionItem) =>
        actionArray?.some((sender) => sender === actionItem.name)
      );
      setactionDispo(matches);
    }
    return refresh;
  }, [data]);
  const [receiverDispo, setreceiverDispo] = useState([]);
  const [actionDispo, setactionDispo] = useState([]);

  const findMatchReceivers = (x, receivers_ids) => {
    let matches = [];

    data?.receivers_config?.yth_dispo?.forEach((child) => {
      if (receivers_ids.includes(child.code)) {
        matches.push({
          code: child.code,
          name: child.display_label,
        });
      }
    });
    const searchInChildren = (children) => {
      children.forEach((child) => {
        if (receivers_ids.includes(child.code)) {
          matches.push({
            code: child.code,
            name: child.display_label + " (" + child?.name + ")",
          });
        }
        if (child.children) {
          searchInChildren(child.children);
        }
      });
    };
    x?.forEach((section) => {
      searchInChildren(section.child);
    });

    return matches;
  };
  useEffect(() => {
    getTindakan();
  }, [senderAttr]);

  async function getHeader() {
    header = await headerToken();
  }
  const renderItemTindakan = ({ item, index }) => (
    <View
      style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
      key={index}
    >
      <Checkbox.Item
        mode="android"
        position="leading"
        color={COLORS.primary}
        status={
          selectedTindakan?.findIndex((data) => data == item.name) != -1
            ? "checked"
            : "unchecked"
        }
        label={item.name}
        labelStyle={[
          styles.labelCheckbox,
          {
            fontSize: GlobalStyles.font.sm,
            textAlignVertical: "center",
            marginTop: -7,
          },
        ]}
        onPress={() => {
          dispatch(
            setNotaTindakan({
              index: 0,
              nota_tindakan1: item,
            })
          );
          selectedTindakan?.findIndex((data) => data == item.name) == -1
            ? setSelectedTindakan([...selectedTindakan, item.name])
            : setSelectedTindakan(
                selectedTindakan.filter(
                  (tind, i) =>
                    i !==
                    selectedTindakan?.findIndex((data) => data == item.name)
                )
              );
        }}
        style={{
          height: 27,
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: 0,
        }}
      />
    </View>
  );
  const renderItemReceivers = ({ item, index }) => (
    <View style={{ marginBottom: 5 }} key={index}>
      <Checkbox.Item
        mode="android"
        position="leading"
        color={COLORS.primary}
        status={checkedNodeRadio(item) ? "checked" : "unchecked"}
        label={
          item.name
            ? item.display_label + " (" + item?.name + ")"
            : item.display_label
        }
        labelStyle={[
          styles.labelCheckbox,
          {
            fontSize: GlobalStyles.font.sm,
            textAlignVertical: "center",
            marginTop: screenWidth <= 375 ? null : -7,
          },
        ]}
        onPress={() => {
          const checkNode = addressbook.selected.filter(
            (data) => data.code === item.code
          );
          if (checkNode.length > 0) {
            checkNode.map((item) => {
              deleteItem(item.code);
            });
          } else {
            dispatch(setAddressbookSelected([...addressbook.selected, item]));
          }
        }}
        style={{
          height: screenWidth <= 375 ? null : 27,
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: 0,
        }}
        disabled={item?.code?.length == 0}
      />
    </View>
  );
  const deleteItem = (id) => {
    let data;
    data = addressbook.selected.filter((data) => {
      let code = data.code;
      return code !== id;
    });
    dispatch(setAddressbookSelected(data));
  };
  const checkedNodeRadio = (node) => {
    const checkNode = addressbook.selected.filter(
      (item) => item.code === node.code
    );
    if (checkNode.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  async function getTindakan() {
    setIsLoading(true);
    try {
      const response = await getHTTP(nde_api.dispoaction);
      setTindakanList(response.data.action);
      dispatch(
        setUnker({
          key: response?.data?.unker_id,
          value: response?.data?.unker,
        })
      );
      setIsLoading(false);
    } catch (error) {
      handlerError(error, "Peringatan!", "Nota Tindakan tidak berfungsi!");
      setIsLoading(false);
    }
  }
  //menambah form disposisi
  function addDispo() {
    let payload = {
      kepadaDispo: [],
      btnDel: true,
      tindakan1: true,
      nota_tindakan1: "",
      nota_tindakan_free1: "",
      create_todo1: false,
      duedate_todo1: "",
      send_priority_todo1: "",
      remind_todo1: false,
      remind_count_todo1: 0,
    };
    dispatch(addDispoMulti(payload));
  }
  //menghapus form disposisi
  function delDispo(i) {
    dispatch(removeDispoMulti(i));
  }
  async function postDisposition() {
    setIsLoading(true);
    try {
      let status = 1;
      // validasi
      dispoMulti.map((items) => {
        if (senderAttr?.code == undefined) {
          status = 0;
        } else if (pilihanKepada.length == 0 || pilihanKepada == "") {
          status = 0;
        } else if (
          items.nota_tindakan1 == undefined ||
          items.nota_tindakan1.length == 0
        ) {
          status = 0;
        } else if (
          items.create_todo1 &&
          (items.duedate_todo1 == undefined ||
            items.duedate_todo1 == "" ||
            items.send_priority_todo1 == "")
        ) {
          status = 0;
        } else if (items.create_todo1 && items.remind_todo1) {
          if (
            items.remind_count_todo1 == undefined ||
            items.remind_count_todo1 == 0
          ) {
            status = 0;
          }
        }
      });
      if (status == 1) {
        //prep-data
        let request = [];
        dispoMulti.map((items, i) => {
          request.push({
            kepada: "",
            kepada_ids: "",
            tindakan: "0",
            form_version:
              profile?.nik == "88888"
                ? profile?.receivers_dispo_key.men
                : profile?.nik == "99999"
                ? profile?.receivers_dispo_key?.wamen
                : "",
            nota_tindakan:
              selectedTindakan.length != 0 ? selectedTindakan.join("\n") : "",
            nota_tindakan_free: items.nota_tindakan_free1
              ? items.nota_tindakan_free1
              : "",
            create_todo: items.create_todo1 ? "on" : "off",
            duedate_todo: "",
            send_priority_todo: "",
            remind_todo: items.remind_todo1 ? "on" : "off",
            remind_count_todo: parseInt(items.remind_count_todo1),
          });
          let temp = [];
          let temp_ids = [];
          pilihanKepada.map((item, j) => {
            temp.push(
              item.fullname
                ? item.fullname
                : item.title
                ? item.title
                : item.person
                ? item.person
                : item.label
            );
            temp_ids.push(item.nik ? item.nik : item.code);
          });
          request[i].kepada = temp.join("\n");
          request[i].kepada_ids = temp_ids.join("\n");

          if (items.create_todo1) {
            request[i].duedate_todo = moment(items.duedate_todo1).format(
              "DD/MM/YYYY"
            );
            request[i].send_priority_todo = items.send_priority_todo1.value;
          }
        });
        let payload = {
          attachments:
            stylusFile === ""
              ? []
              : [
                  {
                    base64: stylusFile,
                    description: "notes-stylus",
                    name: "Catatan_Disposisi.svg",
                    size: 0,
                  },
                ],
          request: request,
          id: ids,
          copy_log: "1",
        };
        // post api dispo
        const response = await postHTTP(
          nde_api.postDisposition
            .replace("{$type}", tipes)
            .replace("{$id}", ids),
          payload
        );
        // alert response
        if (response.data.status == "Error") {
          Alert.alert("Peringatan!", response.data.msg);
        } else {
          Alert.alert("Berhasil!", "Disposisi berhasil terkirim!");
          navigation.goBack();
          // navigation.goBack();
        }
      } else {
        Alert.alert("Peringatan!", "Silakan isi lembar disposisi!");
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      handlerError(error, "Peringatan!", "Disposisi tidak berfungsi!");
      setIsLoading(false);
    }
  }
  const ref = useRef();
  // Called after ref.current.readSignature() reads a non-empty base64 string
  const handleOK = (signature) => {
    console.log(signature);
    setStylusFile(signature);
  };
  // Called after ref.current.readSignature() reads an empty string
  const handleEmpty = () => {
    setStylusFile("");
    console.log("Empty");
  };
  // Called after ref.current.clearSignature()
  const handleClear = () => {
    setStylusFile("");
    console.log("clear success!");
  };
  // Called after end of stroke
  const handleEnd = () => {
    setScrollEnabled(true);
    ref.current.readSignature();
  };
  // Called after ref.current.getData()
  const handleData = (data) => {
    console.log(data);
  };

  const [transformReceiver, settransformReceiver] = useState();
  const getReceiversDispo = async () => {
    setIsLoading(true);
    try {
      let response = await getHTTP(
        nde_api.disporeceivers.replace(
          "{$receivers_dispo_key}",
          profile?.nik == "88888"
            ? profile?.receivers_dispo_key.men
            : profile?.nik == "99999"
            ? profile?.receivers_dispo_key?.wamen
            : ""
        )
      );
      setReceiversDispo(response.data);
    } catch (error) {
      handlerError(error, "Warning", "Disposition receiver data not working");
      navigation.goBack();
    }
    setIsLoading(false);
  };
  const renderBody = (child) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "85%",
        }}
      >
        <Checkbox.Item
          mode="android"
          position="leading"
          color={COLORS.primary}
          status={checkedNodeRadio(child) ? "checked" : "unchecked"}
          label={
            child.name
              ? child.display_label + " (" + child?.name + ")"
              : child.display_label
          }
          labelStyle={[
            styles.labelCheckbox,
            {
              fontSize: GlobalStyles.font.sm,
              textAlignVertical: "center",
              marginTop: screenWidth <= 375 ? null : -7,
            },
          ]}
          onPress={() => {
            const checkNode = addressbook.selected.filter(
              (data) => data.code === child.code
            );
            if (checkNode.length > 0) {
              checkNode.map((child) => {
                deleteItem(child.code);
              });
            } else {
              dispatch(
                setAddressbookSelected([...addressbook.selected, child])
              );
            }
          }}
          style={{
            height: screenWidth <= 375 ? null : 27,
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 0,
          }}
          disabled={child?.code?.length == 0}
        />
        {child.isHead && (
          <Text>
            {expandedItems[child.code] ? (
              <Ionicons name="chevron-up-outline" size={18} />
            ) : (
              <Ionicons name="chevron-down-outline" size={18} />
            )}
          </Text>
        )}
      </View>
    );
  };
  const renderReceiverDispo = () => (
    <View style={{ marginBottom: 10 }}>
      {transformReceiver?.map((item, i) => (
        <View key={i}>
          {item.header != transformReceiver[i - 1]?.header && (
            <View style={{ marginVertical: 5 }}>
              <Text
                style={{
                  textDecorationLine: "underline",
                }}
              >
                {item.header}
              </Text>
            </View>
          )}
          {item.child.map((child, index) => (
            <View key={index}>
              {child.isHead && (
                <Collapse
                  isExpanded={!!expandedItems[item.code]}
                  onToggle={() => {
                    toggleItem(child.code);
                  }}
                >
                  <CollapseHeader>
                    <View>{renderBody(child)}</View>
                  </CollapseHeader>
                  {child.children?.length > 0 && (
                    <CollapseBody>
                      {child.children.map((child, index) => (
                        <View
                          key={index}
                          style={[styles.body, { paddingLeft: 16 }]}
                        >
                          {renderBody(child)}
                        </View>
                      ))}
                    </CollapseBody>
                  )}
                </Collapse>
              )}

              {!child.isHead && <View>{renderBody(child)}</View>}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
  const transformData = (data) => {
    return data?.map((section) => {
      const result = [];
      let currentHead = null;
      section.child.forEach((item) => {
        if (item.isHead) {
          // Jika item adalah head, tambahkan ke result sebagai parent baru
          currentHead = { ...item, children: [] };
          result.push(currentHead);
        } else if (currentHead) {
          // Jika item bukan head, tambahkan ke children dari head yang sedang aktif
          currentHead.children.push(item);
        }
      });
      return {
        ...section,
        child: result?.length == 0 ? section.child : result,
      };
    });
  };
  useEffect(() => {
    let temp = [];
    receiversDispo?.kepada_dispo?.map((item) => {
      temp = temp.concat(transformData(item));
    });
    settransformReceiver(temp);
  }, [receiversDispo]);
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {tipes == "detail" &&
          data?.sender?.type == "m" &&
          data?.form_version == "def" &&
          detailMenteriDef(data, {
            receiverDispo: receiverDispo,
            actionDispo: actionDispo,
            device,
          })}
        {tipes == "detail" &&
          data?.sender?.type == "m" &&
          data?.form_version != "def" &&
          detailMenteri(data, {
            receiverDispo: receiverDispo,
            actionDispo: actionDispo,
            device,
          })}
        {tipes == "detail" &&
          (data?.sender?.type == "1" || data?.sender?.type == "a") &&
          detailEselonI(
            data,
            {
              receiverDispo: receiverDispo,
              actionDispo: actionDispo,
            },
            device
          )}
        {tipes == "detail" &&
          (data?.sender?.type == "b" ||
            data?.sender?.type == "c" ||
            data?.sender?.type == "2" ||
            data?.sender?.type == "3" ||
            data?.sender?.type == "4") &&
          detailEselonII(
            data,
            {
              receiverDispo: receiverDispo,
              actionDispo: actionDispo,
            },
            device
          )}
        {tipes != "detail" && (
          <ScrollView scrollEnabled={scrollEnabled} nestedScrollEnabled={true}>
            {loadingOverlay}
            <View style={styles.screen}>
              {tipes && tipes != "detail" && (
                <>
                  {profile?.nik != "88888" && profile?.nik != "99999" && (
                    <>
                      <View style={styles.containerLabel}>
                        <Text style={styles.title}>
                          {data?.sender?.organization}
                        </Text>
                      </View>
                      <View style={styles.containerLabel}>
                        <Text style={styles.title}>
                          {data?.sender?.satker != data?.sender?.organization
                            ? data?.satker
                            : ""}
                        </Text>
                      </View>
                    </>
                  )}
                  <View style={styles.containerLabel}>
                    <Text style={styles.title}>LEMBAR DISPOSISI</Text>
                  </View>
                  <View style={styles.containerLabel}>
                    <Text style={styles.title}>
                      {profile?.nik === "88888"
                        ? "MENTERI KELAUTAN DAN PERIKANAN"
                        : profile?.nik === "99999"
                        ? "WAKIL MENTERI KELAUTAN DAN PERIKANAN"
                        : null}
                    </Text>
                  </View>
                </>
              )}
              <View style={{ marginBottom: 16 }}>
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    padding: 20,
                    borderRadius: 16,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      borderBottomWidth: 2,
                      borderBottomColor: "#DBDADE",
                      paddingBottom: 10,
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
                      Sifat Surat
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        width: "60%",
                        paddingRight: 20,
                      }}
                    >
                      {detail?.priority ? detail?.priority : detail?.prio}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      borderBottomWidth: 2,
                      borderBottomColor: "#DBDADE",
                      paddingVertical: 10,
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
                      Nomor Surat
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        width: "60%",
                        paddingRight: 20,
                      }}
                    >
                      {detail?.ref_number}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      borderBottomWidth: 2,
                      borderBottomColor: "#DBDADE",
                      paddingVertical: 10,
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
                      Tanggal Diterima
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        width: "60%",
                        paddingRight: 20,
                      }}
                    >
                      {moment(new Date()).format("D MMMM YYYY")}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      borderBottomWidth: 2,
                      borderBottomColor: "#DBDADE",
                      paddingVertical: 10,
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
                      Tanggal Surat
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        width: "60%",
                        paddingRight: 20,
                      }}
                    >
                      {detail?.letter_date}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      borderBottomWidth: 2,
                      borderBottomColor: "#DBDADE",
                      paddingVertical: 10,
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
                      Asal Surat
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        width: "60%",
                        paddingRight: 20,
                      }}
                    >
                      {detail && detail?.senders[0].title
                        ? detail?.senders[0].title
                        : detail?.senders[0].name}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", paddingVertical: 10 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        width: "40%",
                        paddingRight: 20,
                      }}
                    >
                      Hal
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        width: "60%",
                        paddingRight: 20,
                      }}
                    >
                      {detail?.subject}
                    </Text>
                  </View>
                </View>
              </View>
              {dispoMulti.map((item, index) => (
                <Card key={index} style={styles.containerCard}>
                  {item.btnDel && (
                    <View style={styles.headerCard}>
                      <IconButton
                        icon="close"
                        onPress={() => delDispo(index)}
                      />
                    </View>
                  )}
                  <View style={[styles.containerTitle, { paddingTop: 0 }]}>
                    <Text style={styles.title}>Kepada Yth.</Text>
                  </View>
                  <View>
                    <FlatList
                      data={receiversDispo.yth_dispo}
                      renderItem={renderItemReceivers}
                      keyExtractor={(item) => item.code}
                      nestedScrollEnabled
                      keyboardShouldPersistTaps="handled"
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "black",
                        flex: 1,
                        marginVertical: 10,
                      }}
                    />
                    <Text onPress={() => toggleCollapse("addressbook")}>
                      {collapse["addressbook"] ? (
                        <Ionicons
                          name="remove-circle-outline"
                          size={24}
                          onPress={toggleCollapse[item.header]}
                        />
                      ) : (
                        <Ionicons name="add-circle-outline" size={24} />
                      )}
                    </Text>
                  </View>
                  {collapse["addressbook"] && (
                    <View>{renderReceiverDispo()}</View>
                  )}
                  <View style={styles.containerTitle}>
                    <Text style={styles.title}>Petunjuk</Text>
                    <Text onPress={() => toggleCollapse("petunjuk")}>
                      {collapse["petunjuk"] ? (
                        <Ionicons
                          name="remove-circle-outline"
                          size={24}
                          onPress={toggleCollapse[item.header]}
                        />
                      ) : (
                        <Ionicons name="add-circle-outline" size={24} />
                      )}
                    </Text>
                  </View>
                  {collapse["petunjuk"] && (
                    <View>
                      <FlatList
                        data={tindakanList}
                        renderItem={renderItemTindakan}
                        keyExtractor={(item, index) =>
                          item?.code
                            ? item.code.toString()
                            : `fallback-${index}`
                        }
                        nestedScrollEnabled
                        numColumns={device === "tablet" ? 2 : 1}
                        columnWrapperStyle={
                          device === "tablet"
                            ? { justifyContent: "space-between" }
                            : null
                        } // Agar grid lebih rapi di tablet
                      />
                    </View>
                  )}
                  <View style={styles.containerTitle}>
                    <Text style={styles.title}>Catatan</Text>
                  </View>
                  <TextInput
                    value={item.nota_tindakan_free1}
                    mode="outlined"
                    multiline={true}
                    theme={{ roundness: 6 }}
                    placeholder="Masukkan catatan..."
                    onChangeText={(text) => {
                      dispatch(
                        setNotaTindakanFree({
                          index: index,
                          nota_tindakan_free1: text,
                        })
                      );
                    }}
                    style={[styles.titleLabel, { paddingVertical: 12 }]}
                    allowFontScaling={false}
                  />
                  <View
                    style={[
                      styles.containerTitleLeft,
                      {
                        borderWidth: 1,
                        borderRadius: 8,
                        padding: 10,
                        justifyContent: "space-between",
                        marginTop: 10,
                        borderColor: GlobalStyles.colors.tertiery70,
                      },
                    ]}
                  >
                    {/* <Button
                                      labelStyle={{
                                        fontSize: GlobalStyles.font.sm,
                                      }}
                                      mode="outlined"
                                      textColor="white"
                                      onPress={() => {
                                        if (stylusEnabled == true) {
                                          handleClear();
                                        }
                                        setStylusEnabled(!stylusEnabled);
                                      }}
                                      style={{ width: "100%", backgroundColor: COLORS.info }}
                                    >
                                      <Ionicons name="pencil" size={16} />
                                      Catatan
                                    </Button> */}
                    <View
                      style={{
                        width: device === "tablet" ? 300 : 230,
                      }}
                    >
                      <Text style={[styles.titleTodo, { paddingRight: 8 }]}>
                        Stylus Pen
                      </Text>
                      <Text
                        style={{
                          paddingRight: 8,
                          color: GlobalStyles.colors.grey,
                          marginTop: 5,
                        }}
                      >
                        Tambah catatan dengan stylus
                      </Text>
                    </View>
                    <Switch
                      value={stylusEnabled}
                      onValueChange={() => {
                        if (stylusEnabled == true) {
                          handleClear();
                        }
                        setStylusEnabled(!stylusEnabled);
                      }}
                    />
                  </View>
                  {stylusEnabled && (
                    <View
                      style={{
                        height: 600,
                        width: "90%",
                        marginLeft: "5%",
                        marginTop: 10,
                      }}
                    >
                      <SignatureScreen
                        ref={ref}
                        onBegin={() => setScrollEnabled(false)}
                        onEnd={handleEnd}
                        onOK={handleOK}
                        onEmpty={handleEmpty}
                        onClear={handleClear}
                        onGetData={handleData}
                        autoClear={false}
                        imageType="image/svg+xml"
                        descriptionText=" "
                        webStyle={`
                      .m-signature-pad {
                        position: absolute;
                        width: 100%;
                        height: 89%;
                        top: 0;
                        left: 0;
                        margin-left: 0;
                        margin-top: 0;
                        border: 1px solid #e8e8e8;
                        background-color: #ffff;
                        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.08) inset;
                      }
                     .m-signature-pad button {
                        font-size: 10px !important; /* Ukuran font untuk button */
                        line-height: normal !important;
                        padding: 10px 20px; /* Sesuaikan padding */
                        display: inline-block; /* Memastikan button tidak terpotong */
                        text-size-adjust: none !important;
                      }
                        
                    `}
                        clearText="Hapus"
                        confirmText="Simpan"
                      />
                    </View>
                  )}
                  {Config.todo && (
                    <>
                      <View style={styles.containerTitleLeft}>
                        <Switch
                          value={item.create_todo1}
                          onValueChange={() => dispatch(switchTodo(index))}
                        />
                        <Text style={[styles.titleTodo, styles.switchLabel]}>
                          Aktifkan {Config.labelTodo}
                        </Text>
                      </View>

                      {item.create_todo1 && (
                        <>
                          <View style={styles.containerTanggalPrioritas}>
                            <View style={{ width: "45%" }}>
                              <Text style={styles.titleLabelTodo}>Tanggal</Text>
                              <Button
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: 55,
                                  borderColor: GlobalStyles.colors.black,
                                  borderRadius: 6,
                                }}
                                labelStyle={{
                                  fontSize: GlobalStyles.font.sm,
                                }}
                                mode="outlined"
                                textColor="black"
                                onPress={() => {
                                  setvisibleDatePicker(!visibleDatePicker);
                                }}
                              >
                                {item.duedate_todo1 != ""
                                  ? moment(new Date(item.duedate_todo1)).format(
                                      "DD/MM/YYYY"
                                    )
                                  : "Tgl Duedate"}
                              </Button>
                              <DateTimePickerModal
                                isVisible={visibleDatePicker}
                                mode="date"
                                display={
                                  Platform.OS == "android"
                                    ? "inline"
                                    : "spinner"
                                }
                                style={{ width: "100%", height: 300 }}
                                onConfirm={(date) => {
                                  dispatch(
                                    setTodoDuedate({
                                      index: index,
                                      duedate_todo1: date.toDateString(),
                                    })
                                  );
                                  setvisibleDatePicker(false);
                                }}
                                onCancel={() => {
                                  setvisibleDatePicker(false);
                                }}
                                minimumDate={new Date()}
                              />
                            </View>
                            <View style={{ width: "47%" }}>
                              <Text style={styles.titleLabelTodo}>
                                Prioritas
                              </Text>
                              <Dropdown
                                style={[
                                  styles.dropdown,
                                  isFocusPrio && {
                                    borderColor: GlobalStyles.colors.tertiery50,
                                  },
                                ]}
                                itemTextStyle={{
                                  fontSize: GlobalStyles.font.sm,
                                }}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                // inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={priority}
                                // search
                                maxHeight={300}
                                labelField="view"
                                valueField="value"
                                placeholder={
                                  !isFocusPrio ? "Pilih Prioritas" : "..."
                                }
                                // searchPlaceholder="Search..."
                                value={item.send_priority_todo1}
                                onFocus={() => setIsFocusPrio(true)}
                                onBlur={() => setIsFocusPrio(false)}
                                onChange={(item) => {
                                  dispatch(
                                    setTodoPriority({
                                      index: index,
                                      send_priority_todo1: item,
                                    })
                                  );
                                  setIsFocusPrio(false);
                                }}
                              />
                            </View>
                          </View>
                        </>
                      )}
                    </>
                  )}
                </Card>
              ))}
              {btnAdd && (
                <Button
                  onPress={addDispo}
                  mode="contained"
                  style={{
                    marginBottom: 16,
                    backgroundColor: GlobalStyles.colors.tertiery,
                  }}
                >
                  Add Disposition
                </Button>
              )}
              <Button
                mode="contained"
                style={{ backgroundColor: GlobalStyles.colors.tertiery }}
                onPress={postDisposition}
              >
                Kirim
              </Button>
            </View>
          </ScrollView>
        )}
      </GestureHandlerRootView>
    </>
  );
}

export default DispositionLembar;

const styles = StyleSheet.create({
  screen: {
    padding: 16,
    backgroundColor: GlobalStyles.colors.tertiery20,
  },
  containerCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: GlobalStyles.colors.tertiery10,
  },
  containerTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
  },
  containerLabel: {
    flexDirection: "row",
    marginBottom: 16,
    justifyContent: "center",
  },
  title: {
    marginBottom: 6,
    fontSize: GlobalStyles.font.md,
  },
  titleLabel: {
    fontSize: GlobalStyles.font.md,
  },
  containerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  containerTindakanChecked: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: GlobalStyles.colors.textWhite,
    paddingHorizontal: 12,
  },
  containerTitleLeft: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  titleTodo: {
    fontSize: GlobalStyles.font.md,
    fontWeight: "bold",
  },
  containerBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  switchLabel: {
    paddingLeft: 8,
  },
  titleLabelTodo: {
    marginBottom: 12,
    fontSize: GlobalStyles.font.md,
    fontWeight: "bold",
  },
  dropdown: {
    height: 55,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: GlobalStyles.colors.black,
    paddingHorizontal: 12,
  },
  containerTanggalPrioritas: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  containerRemind: {
    flexDirection: "row",
  },
  title: {
    marginBottom: 6,
    fontSize: GlobalStyles.font.md,
    fontWeight: "bold",
  },
  placeholderStyle: {
    fontSize: GlobalStyles.font.sm,
  },
  selectedTextStyle: {
    fontSize: GlobalStyles.font.sm,
  },
  labelRemind: {
    fontSize: GlobalStyles.font.sm,
    fontWeight: "bold",
  },
  labelCheckbox: {
    width: "95%",
    textAlign: "left",
    // fontSize: GlobalStyles.font.sm,
  },
  // });

  // const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#f4f4f4",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  body: {
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
});
