import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CardDCounter from "../../../components/UI/CardDCounter";
import { nde_api } from "../../../utils/api.config";
import { getHTTP, handlerError } from "../../../utils/http";
import { useDispatch, useSelector } from "react-redux";
import {
  setOrganization,
  setProfile,
  setSelectedAttr,
} from "../../../store/profile";
import { setProfile as setProfileBridge } from "../../../store/SuperApps";
import { removeTokenValue } from "../../../service/session";
import { setLogout } from "../../../store/LoginAuth";
import * as Sentry from "@sentry/react-native";
import { setTypeLetter } from "../../../store/listBulk";
import CardDMenu from "../../../components/UI/CardDMenu";
import { PADDING } from "../../../config/SuperAppps";
import { Menu } from "react-native-paper";
import { GlobalStyles } from "../../../constants/styles";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";

function DCounter() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const { device } = useSelector((state) => state.apps);
  let [isCounter, setIsCounter] = useState([
    {
      count: 1,
      type: "onprogress",
      value: "-",
      icon: "email-edit-outline",
      color: "rgba(73, 189, 101, 0.6)",
      navName: "NeedFollowUpList",
    },
    {
      count: 2,
      type: "sign",
      value: "-",
      icon: "email-edit",
      color: "#49b0aa",
      navName: "NeedSignList",
    },
    {
      count: 3,
      type: "agenda_in",
      value: "-",
      icon: "inbox-arrow-down",
      color: "rgba(24, 104, 171, 0.6)",
      navName: "IncomingUnread",
    },
    {
      count: 4,
      type: "internal",
      value: "-",
      icon: "inbox",
      color: "rgba(236, 202, 12, 0.6)",
      navName: "InternalUnread",
    },
    {
      count: 5,
      type: "agenda_disposition",
      value: "-",
      icon: "email-send-outline",
      color: "rgba(244, 32, 32, 0.6)",
      navName: "DispositionUnread",
    },
    {
      count: 6,
      type: "not_dispo",
      value: "-",
      icon: "inbox-arrow-down",
      color: "#fdd7c7",
      navName: "IncomingList",
    },
  ]);

  let [isCounterNonPejabat, setIsCounterNonPejabat] = useState([
    {
      count: 1,
      type: "onprogress",
      value: "-",
      icon: "email-edit-outline",
      color: "rgba(73, 189, 101, 0.6)",
      navName: "NeedFollowUpList",
    },
    {
      count: 3,
      type: "agenda_in",
      value: "-",
      icon: "inbox-arrow-down",
      color: "rgba(24, 104, 171, 0.6)",
      navName: "IncomingUnread",
    },
    {
      count: 4,
      type: "internal",
      value: "-",
      icon: "inbox",
      color: "rgba(236, 202, 12, 0.6)",
      navName: "InternalUnread",
    },
    {
      count: 5,
      type: "agenda_disposition",
      value: "-",
      icon: "email-send-outline",
      color: "rgba(244, 32, 32, 0.6)",
      navName: "DispositionUnread",
    },
  ]);

  let [isCounterMenuDefault, setIsCounterMenuDefault] = useState([
    {
      count: 1,
      type: "agenda_in",
      value: "-",
      icon: "inbox-arrow-down",
      navName: "IncomingList",
    },
    {
      count: 2,
      type: "agenda_in_dispo",
      value: "-",
      icon: "inbox-arrow-down-outline",
      navName: "IncomingList",
    },
    {
      count: 3,
      type: "internal",
      value: "-",
      icon: "inbox",
      navName: "InternalSatkerList",
    },
    {
      count: 4,
      type: "agenda_disposition",
      value: "-",
      icon: "email-send-outline",
      navName: "DispositionList",
    },
    {
      count: 5,
      type: "onprogress",
      value: "-",
      icon: "email-edit-outline",
      navName: "NeedFollowUpList",
    },
    {
      count: 6,
      type: "sign",
      value: "-",
      icon: "email-edit",
      navName: "NeedSignList",
    },
    {
      count: 7,
      type: "tracking",
      value: "-",
      icon: "email-search-outline",
      navName: "TrackingList",
    },
    {
      count: 8,
      type: "submitted",
      value: "-",
      icon: "email-check-outline",
      navName: "SubmittedList",
    },
  ]);

  let [isCounterMenuNonPejabat, setIsCounterMenuNonPejabat] = useState([
    {
      count: 1,
      type: "agenda_in",
      value: "-",
      icon: "inbox-arrow-down",
      navName: "IncomingList",
    },
    {
      count: 2,
      type: "agenda_in_dispo",
      value: "-",
      icon: "inbox-arrow-down-outline",
      navName: "IncomingList",
    },
    {
      count: 3,
      type: "internal",
      value: "-",
      icon: "inbox",
      navName: "InternalSatkerList",
    },
    {
      count: 4,
      type: "agenda_disposition",
      value: "-",
      icon: "email-send-outline",
      navName: "DispositionList",
    },
    {
      count: 5,
      type: "onprogress",
      value: "-",
      icon: "email-edit-outline",
      navName: "NeedFollowUpList",
    },
    {
      count: 7,
      type: "tracking",
      value: "-",
      icon: "email-search-outline",
      navName: "TrackingList",
    },
    {
      count: 8,
      type: "submitted",
      value: "-",
      icon: "email-check-outline",
      navName: "SubmittedList",
    },
  ]);

  let [isCounterMenuSespri, setIsCounterMenuSespri] = useState([
    {
      count: 1,
      type: "agenda_in",
      value: "-",
      icon: "inbox-arrow-down",
      navName: "IncomingList",
    },
    {
      count: 2,
      type: "agenda_in_forward",
      value: "-",
      icon: "file-send-outline",
      navName: "IncomingList",
    },
    {
      count: 3,
      type: "agenda_in_dispo",
      value: "-",
      icon: "inbox-arrow-down-outline",
      navName: "IncomingList",
    },
    {
      count: 4,
      type: "internal",
      value: "-",
      icon: "inbox",
      navName: "InternalSatkerList",
    },
    {
      count: 5,
      type: "agenda_disposition",
      value: "-",
      icon: "email-send-outline",
      navName: "DispositionList",
    },
    {
      count: 6,
      type: "onprogress",
      value: "-",
      icon: "email-edit-outline",
      navName: "NeedFollowUpList",
    },
    {
      count: 7,
      type: "sign",
      value: "-",
      icon: "email-edit",
      navName: "NeedSignList",
    },
    {
      count: 8,
      type: "tracking",
      value: "-",
      icon: "email-search-outline",
      navName: "TrackingList",
    },
    {
      count: 9,
      type: "submitted",
      value: "-",
      icon: "email-check-outline",
      navName: "SubmittedList",
    },
  ]);
  let [isCounterMenu, setIsCounterMenu] = useState([
    {
      count: 1,
      type: "agenda_in",
      value: "-",
      icon: "inbox-arrow-down",
      navName: "IncomingList",
    },
    {
      count: 2,
      type: "agenda_in_dispo",
      value: "-",
      icon: "inbox-arrow-down-outline",
      navName: "IncomingList",
    },
    {
      count: 3,
      type: "agenda_in_eselon1",
      value: "-",
      icon: "mail-outline",
      navName: "IncomingList",
    },
    {
      count: 4,
      type: "internal",
      value: "-",
      icon: "inbox",
      navName: "InternalSatkerList",
    },
    {
      count: 5,
      type: "agenda_disposition",
      value: "-",
      icon: "email-send-outline",
      navName: "DispositionList",
    },
    {
      count: 6,
      type: "onprogress",
      value: "-",
      icon: "email-edit-outline",
      navName: "NeedFollowUpList",
    },
    {
      count: 7,
      type: "sign",
      value: "-",
      icon: "email-edit",
      navName: "NeedSignList",
    },
    {
      count: 8,
      type: "tracking",
      value: "-",
      icon: "email-search-outline",
      navName: "TrackingList",
    },
    {
      count: 9,
      type: "submitted",
      value: "-",
      icon: "email-check-outline",
      navName: "SubmittedList",
    },
  ]);
  let role_menu = ["88888", "197208122001121002"];
  let [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { selectedAttr, profile } = useSelector((state) => state.profile);
  const token = useSelector((state) => state.auth.token);

  async function getTypeLetter() {
    try {
      const response = await getHTTP(nde_api.typeletter);
      dispatch(setTypeLetter(response.data));
    } catch (error) {
      if (error?.response?.status == null && error?.status == null) {
        Alert.alert("Peringatan!", "Silakan cek koneksi anda");
      } else {
        handlerError(
          error,
          "Peringatan!",
          "Filter jenis surat tidak berfungsi!"
        );
      }
    }
  }
  useEffect(() => {
    getTypeLetter();
    // const response = getHTTP(nde_api.dashboard);
    getProfile();
  }, [token, isFocused, selectedAttr]);

  useEffect(() => {
    getisCounter();
  }, [profile, isFocused]);

  async function getProfile() {
    setIsLoading(true);
    try {
      //get isCounter
      const response = await getHTTP(nde_api.profile);
      dispatch(setProfile(response.data));
      dispatch(setOrganization(response.data));
      setIsLoading(false);
    } catch (error) {
      // console.log(error.response);
    }
  }
  async function getisCounter() {
    setIsLoading(true);
    try {
      //get isCounter
      const response = await getHTTP(nde_api.dashboard);
      if (response?.data?.length != 0) {
        const updatedCounter = isCounter?.map((dashItem) => {
          const responseItem = response?.data?.find(
            (resItem) => resItem.type === dashItem.type
          );
          return {
            ...dashItem,
            value: responseItem ? responseItem.value : dashItem.value, // Gunakan value dari response atau tetap "-"
          };
        });

        if (profile?.title.length == 0) {
          let idxSign = updatedCounter.findIndex((data) => {
            return data.type === "sign";
          });

          if (idxSign !== -1) {
            updatedCounter.splice(idxSign, 1);
          }

          let idxNotDispo = updatedCounter.findIndex((data) => {
            return data.type === "not_dispo";
          });

          if (idxNotDispo !== -1) {
            updatedCounter.splice(idxNotDispo, 1);
          }
        }

        setIsCounter(updatedCounter);
        const updatedMenu = isCounterMenu?.map((dashItem) => {
          const responseItem = response?.data?.find(
            (resItem) => resItem.type === dashItem.type
          );
          return {
            ...dashItem,
            value: responseItem ? responseItem.value : dashItem.value, // Gunakan value dari response atau tetap "-"
          };
        });
        setIsCounterMenu(updatedMenu);
      }
      setIsLoading(false);
    } catch (error) {
      if (error?.response?.status == null && error?.status == null) {
        setIsCounter([
          {
            count: 1,
            type: "onprogress",
            value: "-",
            icon: "email-edit-outline",
            color: "rgba(73, 189, 101, 0.6)",
            navName: "NeedFollowUpList",
          },
          {
            count: 2,
            type: "sign",
            value: "-",
            icon: "email-edit",
            color: "#49b0aa",
            navName: "NeedSignList",
          },
          {
            count: 3,
            type: "agenda_in",
            value: "-",
            icon: "inbox-arrow-down",
            color: "rgba(24, 104, 171, 0.6)",
            navName: "IncomingUnread",
          },
          {
            count: 4,
            type: "internal",
            value: "-",
            icon: "inbox",
            color: "rgba(236, 202, 12, 0.6)",
            navName: "InternalUnread",
          },
          {
            count: 5,
            type: "agenda_disposition",
            value: "-",
            icon: "email-send-outline",
            color: "rgba(244, 32, 32, 0.6)",
            navName: "DispositionUnread",
          },
          {
            count: 6,
            type: "not_dispo",
            value: "-",
            icon: "inbox-arrow-down",
            color: "#fdd7c7",
            navName: "IncomingList",
          },
        ]);
        setIsCounterMenu([
          {
            count: 1,
            type: "agenda_in",
            value: "-",
            icon: "inbox-arrow-down",
            navName: "IncomingList",
          },
          {
            count: 2,
            type: "internal",
            value: "-",
            icon: "inbox",
            navName: "InternalSatkerList",
          },
          {
            count: 3,
            type: "agenda_disposition",
            value: "-",
            icon: "email-send-outline",
            navName: "DispositionList",
          },
          {
            count: 4,
            type: "onprogress",
            value: "-",
            icon: "email-edit-outline",
            navName: "NeedFollowUpList",
          },
          {
            count: 5,
            type: "sign",
            value: "-",
            icon: "email-edit",
            navName: "NeedSignList",
          },
          {
            count: 6,
            type: "tracking",
            value: "-",
            icon: "email-search-outline",
            navName: "TrackingList",
          },
          {
            count: 7,
            type: "submitted",
            value: "-",
            icon: "email-check-outline",
            navName: "SubmittedList",
          },
        ]);
      } else if (error?.status === 401 || error?.response?.status === 401) {
        Sentry.captureEvent(error?.response);
        removeTokenValue();
        dispatch(setLogout());
        dispatch(setProfileBridge({}));
        navigation.reset({
          index: 0,
          routes: [{ name: "LoginToken" }],
        });
      } else {
        handlerError(error, "Peringatan!", "Counter tidak berfungsi!");
        console.log(error);
      }
      setIsLoading(false);
    }
  }
  const renderItem = ({ item }) => (
    <CardDCounter data={item} navigation={navigation} />
  );

  const [divisionList, setDivisionList] = useState([]);
  useEffect(() => {
    getDivisionList();
  }, []);
  async function getDivisionList() {
    try {
      let response = await getHTTP(nde_api.divisionList);
      let gabung = divisionList.concat(response.data);
      setDivisionList(gabung);
    } catch (error) {
      console.log(error);
      if (error?.response?.status == 401 || error?.status == 401) {
        Sentry.captureEvent(error?.response);
        dispatch(logout());
      } else {
        handlerError(
          error,
          "Peringatan!",
          "Daftar Surat Eselon I tidak berfungsi"
        );
      }
    }
  }

  console.log(isCounter);
  return (
    <ScrollView nestedScrollEnabled>
      <GestureHandlerRootView>
        <View style={{ flex: 1, padding: PADDING.Page }}>
          {profile?.title?.length > 1 && (
            <View style={styles.container}>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <Menu
                  visible={visible}
                  onDismiss={closeMenu}
                  anchor={
                    <TouchableOpacity onPress={openMenu}>
                      <Image
                        style={{
                          width: 35,
                          height: 35,
                        }}
                        source={require("../../../assets/superApp/userChange.png")}
                      />
                    </TouchableOpacity>
                  }
                  contentStyle={{
                    width: device == "tablet" ? 400 : 300,
                    borderRadius: 12,
                  }}
                >
                  {profile?.attr?.map((data, i) => (
                    <Menu.Item
                      key={i}
                      onPress={() => {
                        data.code == profile?.nik
                          ? dispatch(
                              setSelectedAttr({ code: "", name: data?.name })
                            )
                          : dispatch(setSelectedAttr(data));
                        closeMenu();
                      }}
                      title={<Text minimumFontScale={0.1}>{data.name}</Text>}
                      titleStyle={{ fontSize: 10 }}
                    />
                  ))}
                </Menu>
                {selectedAttr?.code?.length == 0 && (
                  <View style={{ width: "85%" }}>
                    <Text
                      style={[
                        { fontSize: 13, fontWeight: 400, fontWeight: "bold" },
                      ]}
                    >
                      SEMUA
                    </Text>
                    {profile?.attr?.map((data, index) => (
                      <Text
                        key={index}
                        style={[{ fontSize: 13, fontWeight: 400 }]}
                      >
                        {data?.name}
                      </Text>
                    ))}
                  </View>
                )}
                {selectedAttr?.code?.length != 0 && (
                  <View style={{ width: "85%" }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        fontWeight: "bold",
                      }}
                    >
                      {selectedAttr?.name}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
          {isCounter?.length != 0 && (
            <>
              <View style={styles.container}>
                {/* <Text style={styles.title}>SURAT BELUM DIBUKA</Text>
                {profile?.title.length == 0 && (
                  <FlatList
                    keyExtractor={(item) => item.count}
                    data={isCounterNonPejabat}
                    renderItem={renderItem}
                    numColumns={2}
                    columnWrapperStyle={{
                      justifyContent: "space-between",
                      margin: 5,
                    }}
                    refreshing={isLoading}
                    onRefresh={getisCounter}
                  />
                )}
                {profile?.title.length > 0 && ( */}
                <FlatList
                  keyExtractor={(item) => item.count}
                  data={isCounter}
                  renderItem={renderItem}
                  numColumns={2}
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                    margin: 5,
                  }}
                  refreshing={isLoading}
                  onRefresh={getisCounter}
                />
                {/* )} */}
              </View>
              <View style={styles.container}>
                <Text style={styles.title}>MENU</Text>
                {!role_menu.includes(profile?.nik) &&
                  profile?.is_secretary != "true" &&
                  isCounterMenuDefault?.map((item, index) => (
                    <CardDMenu
                      key={index}
                      data={item}
                      navigation={navigation}
                      divisionList={divisionList}
                    />
                  ))}
                {!role_menu.includes(profile?.nik) &&
                  profile?.is_secretary == "true" &&
                  isCounterMenuSespri?.map((item, index) => (
                    <CardDMenu
                      key={index}
                      data={item}
                      navigation={navigation}
                      divisionList={divisionList}
                    />
                  ))}
                {role_menu.includes(profile?.nik) &&
                  isCounterMenu?.map((item) => (
                    <CardDMenu
                      key={item?.type}
                      data={item}
                      navigation={navigation}
                      divisionList={divisionList}
                    />
                  ))}
              </View>
            </>
          )}
        </View>
      </GestureHandlerRootView>
    </ScrollView>
  );
}

export default DCounter;
const styles = StyleSheet.create({
  selectedAttr: {
    borderRadius: 10,
    backgroundColor: GlobalStyles.colors.textWhite,
    width: "98%",
    padding: 12,
    alignSelf: "center",
    marginBottom: 8,
  },
  container: {
    padding: 10,
    marginBottom: 10,
    gap: 5,
    borderRadius: 10,
    backgroundColor: "white",
    //shadow ios
    shadowOffset: { width: -2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    //shadow android
    elevation: 2,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
