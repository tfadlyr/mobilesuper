import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Avatar, Drawer, Text, List } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

import { setOrganization, setProfile } from "../../store/profile";
import { logout, setFirstLogin, setToken } from "../../store/auth";
import { nde_api } from "../../utils/api.config";
import { getHTTP, headerToken, postHTTP } from "../../utils/http";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IncomingList from "./List/IncomingList";
import DispositionList from "./List/DispositionList";
import SubmittedList from "./List/SubmittedList";
import NeedFollowUpList from "./List/NeedFollowUpList";
import TrackingList from "./List/TrackingList";
import SecretaryList from "./List/SecretaryList";
import DelegationList from "./List/DelegationList";
import Dashboard from "./Dashboard/Dasboard";
import TermOfUse from "./TermOfUse";
import { Profile } from "./Profile";
import { PencarianKorespondensi } from "./Pencarian/PencarianKorespondensi";
import { Config } from "../../constants/config";
import MyDispositionList from "./List/MyDispositionList";
import ScanLogList from "./List/ScanLogList";
import SearchGlobalList from "./List/SearchGlobalList";
import { GlobalStyles } from "../../constants/styles";
import { COLORS, FONTSIZE } from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { OutgoingList } from "./List/OutgoingList";
import { useNavigation } from "@react-navigation/native";

const DrawerItemsData1 = [
  {
    label: "Beranda",
    name: "Dashboard",
    icon: "home",
    key: 2,
  },
  // {
  //   label: "Buat Surat",
  //   name: "",
  //   icon: "file-plus",
  //   key: 3,
  // },
  {
    label: "Surat Masuk",
    name: "Incoming",
    icon: "email",
    key: 4,
  },
];

const DrawerItemsData2 = [
  {
    label: "Disposisi",
    name: "Disposition",
    icon: "chat-processing",
    key: 5,
  },
];

const DrawerItemsData3 = [
  {
    label: "Perlu Diproses",
    name: "NeedFollowUp",
    icon: "",
    key: 6,
  },
  {
    label: "Lacak",
    name: "Tracking",
    icon: "",
    key: 7,
  },
  {
    label: "Terkirim",
    name: "Submitted",
    icon: "",
    key: 8,
  },
];

const DrawerItemsData4 = [
  {
    label: "Arsip",
    name: "Submitted",
    icon: "file-multiple",
    key: 9,
  },
];
const DrawerItemsData5 = [
  {
    label: "Delegasi",
    name: "Delegation",
    icon: "",
    key: 10,
  },
  {
    label: "Sekretaris",
    name: "Secretary",
    icon: "",
    key: 11,
  },
];

// const DrawerItemsData = [
//   {
//     label: "Incoming Letter",
//     name: "Incoming",
//     icon: "inbox-arrow-down",
//     key: 1,
//   },
//   {
//     label: "Disposition",
//     name: "Disposition",
//     icon: "email-send",
//     key: 2,
//   },
//   {
//     label: "My Disposition",
//     name: "MyDisposition",
//     icon: "share",
//     key: 3,
//   },
//   {
//     label: "Need Follow Up",
//     name: "NeedFollowUp",
//     icon: "email-edit",
//     key: 4 },
//   {
//     label: "Tracking Letter",
//     name: "Tracking",
//     icon: "email-search",
//     key: 5,
//   },
//   {
//     label: "Submitted Letter",
//     name: "Submitted",
//     icon: "email-check",
//     key: 6,
//   },
// ];

const DrawerNav = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const [errorAvatarProfile, setErrorAvatarProfile] = useState(false);
  const dispatch = useDispatch();
  const [drawerItemIndex, setDrawerItemIndex] = useState(0);
  const profileLogin = useSelector((state) => state.profile.profile);
  const device_uuid = useSelector((state) => state.profile.device_uuid);
  const token = useSelector((state) => state.auth.token);
  let header = {};
  const [inputToken, setInputToken] = useState("");

  useEffect(() => {
    getProfile();
    // ambil token dari superapps belum bisa. coba set token manual untuk testing
    dispatch(setToken({ token: inputToken }));
  }, [inputToken]);

  async function getProfile() {
    try {
      AsyncStorage.removeItem("profileLogin");
      //get profile login
      let data = await AsyncStorage.getItem("profileLogin");
      if (data === null) {
        // || data === []
        let response = await getHTTP(nde_api.profile);
        dispatch(setProfile(response.data));
        dispatch(setOrganization(response.data));
        header = await headerToken();
      }
    } catch (error) {
      if (error?.response?.status == 401) {
        handlerLogout();
      }
      // Alert.alert("Warning!", "Profile not working!");
    }
  }
  async function offnotification() {
    try {
      data = {
        device_uuid: device_uuid,
      };
      //send data
      const response = await postHTTP(nde_api.switchoffdevice, data);
      // Alert.alert(
      //   "Info switchoff device",
      //   JSON.stringify(response?.data?.message)
      // );
    } catch (error) {
      // Alert.alert(
      //   "Warning!",
      //   "Switchoff push notification may not work" + error
      // );
    }
  }
  function handlerLogout() {
    //off notification
    offnotification();
    //set to login fingerprint
    dispatch(setFirstLogin(false));
    dispatch(logout());
  }

  const navigation = useNavigation();

  return (
    <DrawerContentScrollView
      {...props}
      style={{
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: GlobalStyles.colors.textWhite,
      }}
    >
      <View style={styles.containerProfile}>
        {errorAvatarProfile && (
          <Avatar.Image
            {...props}
            source={Config.avatar}
            theme={{
              colors: {
                primary: GlobalStyles.colors.textWhite,
              },
            }}
          />
        )}
        {!errorAvatarProfile && (
          <Avatar.Image
            source={{
              uri: `${nde_api.baseurl + profileLogin?.avatar}`,
              method: "GET",
              headers: header,
            }}
            style={styles.avatar}
            onError={(e) => setErrorAvatarProfile(true)}
            theme={{
              colors: {
                primary: GlobalStyles.colors.textWhite,
              },
            }}
          />
        )}
        <Text style={styles.fullname}>
          {profileLogin?.fullname?.split("/")[0]}
        </Text>
        <Text>{profileLogin?.fullname?.split("/")[1]}</Text>
        {profileLogin?.title?.map((data) => (
          <Text key={data.code} style={styles.title}>
            {data.name}
          </Text>
        ))}
      </View>
      <View
        style={[
          styles.containerProfile,
          { flexDirection: "row", gap: 10, marginLeft: 20 },
        ]}
      >
        <TextInput
          editable
          multiline
          placeholder="Masukan Token"
          onChangeText={setInputToken}
          style={{ padding: 10, height: 40, borderWidth: 1, width: "80%" }}
          allowFontScaling={false}
        />
        <TouchableOpacity
          onPress={() => {
            dispatch(setToken({ token: inputToken }));
            setDrawerItemIndex(2);
            props.navigation.navigate("Dashboard");
          }}
        >
          <Ionicons name="send-outline" size={24} />
        </TouchableOpacity>
      </View>
      <Drawer.Section style={{ marginHorizontal: -5 }}>
        <Drawer.Item
          style={styles.drawerItem}
          label="Pencarian"
          icon={
            drawerItemIndex == 1 ? "feature-search" : "feature-search-outline"
          }
          key="1"
          active={drawerItemIndex === 1}
          onPress={() => {
            setDrawerItemIndex(1);
            props.navigation.navigate("PencarianKorespondensi");
          }}
          theme={{
            colors: {
              secondaryContainer: COLORS.infoDangerLight,
              onSecondaryContainer: COLORS.primary,
            },
          }}
        />
      </Drawer.Section>
      {/* <Drawer.Section style={{ marginHorizontal: -5 }} showDivider={false}>
        <Drawer.Item
          style={styles.drawerItem}
          label="Dashboard"
          icon={drawerItemIndex == 0 ? "home" : "home-outline"}
          key="0"
          active={drawerItemIndex === 0}
          onPress={() => {
            setDrawerItemIndex(0);
            props.navigation.navigate("Dashboard");
          }}
        />
      </Drawer.Section> */}
      <Drawer.Section>
        {DrawerItemsData1.map((data, index) => (
          <Drawer.Item
            style={styles.drawerItem}
            {...data}
            icon={
              drawerItemIndex == data.key ? data.icon : data.icon + "-outline"
            }
            key={data.key}
            active={drawerItemIndex === data.key}
            onPress={() => {
              setDrawerItemIndex(data.key);
              props.navigation.navigate(data.name, {
                title: data.name,
                unread: false,
              });
            }}
            theme={{
              colors: {
                secondaryContainer: COLORS.infoDangerLight,
                onSecondaryContainer: COLORS.primary,
              },
            }}
          />
        ))}
        {/* surat disposisi */}
        {DrawerItemsData2.map((data, index) => (
          <Drawer.Item
            style={styles.drawerItem}
            {...data}
            icon={
              drawerItemIndex == data.key ? data.icon : data.icon + "-outline"
            }
            key={data.key}
            active={drawerItemIndex === data.key}
            onPress={() => {
              setDrawerItemIndex(data.key);
              props.navigation.navigate(data.name, {
                title: data.name,
                unread: false,
              });
            }}
            theme={{
              colors: {
                secondaryContainer: COLORS.infoDangerLight,
                onSecondaryContainer: COLORS.primary,
              },
            }}
          />
        ))}
        {/* surat keluar */}
        <List.Section>
          <List.Accordion
            title="Surat Keluar"
            titleStyle={{ fontSize: FONTSIZE.H2 }}
            left={(props) => <List.Icon {...props} icon="email-send-outline" />}
            style={[
              styles.drawerItem,
              {
                backgroundColor: GlobalStyles.colors.textWhite,
                height: 55,
                left: 10,
              },
            ]}
          >
            {DrawerItemsData3.map((data, index) => (
              <Drawer.Item
                style={styles.drawerItem}
                {...data}
                key={data.key}
                active={drawerItemIndex === data.key}
                onPress={() => {
                  setDrawerItemIndex(data.key);
                  props.navigation.navigate(data.name, {
                    title: data.name,
                    unread: false,
                  });
                }}
                theme={{
                  colors: {
                    secondaryContainer: COLORS.infoDangerLight,
                    onSecondaryContainer: COLORS.primary,
                  },
                }}
              />
            ))}
          </List.Accordion>
        </List.Section>
        {DrawerItemsData4.map((data, index) => (
          <Drawer.Item
            style={styles.drawerItem}
            {...data}
            icon={
              drawerItemIndex == data.key ? data.icon : data.icon + "-outline"
            }
            key={data.key}
            active={drawerItemIndex === data.key}
            onPress={() => {
              setDrawerItemIndex(data.key);
              props.navigation.navigate(data.name, {
                title: data.name,
                unread: false,
              });
            }}
            theme={{
              colors: {
                secondaryContainer: COLORS.infoDangerLight,
                onSecondaryContainer: COLORS.primary,
              },
            }}
          />
        ))}

        {/* Alat */}
        <List.Section>
          <List.Accordion
            title="Alat"
            titleStyle={{ fontSize: FONTSIZE.H2 }}
            left={(props) => <List.Icon {...props} icon="cog-outline" />}
            style={[
              styles.drawerItem,
              {
                backgroundColor: GlobalStyles.colors.textWhite,
                height: 55,
                left: 10,
              },
            ]}
          >
            {DrawerItemsData5.map((data, index) => (
              <Drawer.Item
                style={styles.drawerItem}
                {...data}
                key={data.key}
                active={drawerItemIndex === data.key}
                onPress={() => {
                  setDrawerItemIndex(data.key);
                  props.navigation.navigate(data.name, {
                    title: data.name,
                    unread: false,
                  });
                }}
                theme={{
                  colors: {
                    secondaryContainer: COLORS.infoDangerLight,
                    onSecondaryContainer: COLORS.primary,
                  },
                }}
              />
            ))}
          </List.Accordion>
        </List.Section>
        <Drawer.Item
          style={styles.drawerItem}
          label="Keluar"
          icon="logout"
          key="12"
          active={drawerItemIndex === 12}
          // onPress={() => {
          //   AlertConfirm("Confirm", "Are you sure to Sign Out?", () => {
          //     setDrawerItemIndex(8);
          //     handlerLogout();
          //   });
          // }}
          onPress={() => navigation.navigate("Home")}
        />
      </Drawer.Section>
      <Drawer.Item
        style={styles.drawerItem}
        label="Profil"
        icon={
          drawerItemIndex == 9 ? "account-circle" : "account-circle-outline"
        }
        key="13"
        active={drawerItemIndex === 13}
        onPress={() => {
          setDrawerItemIndex(13);
          props.navigation.navigate("Profile");
        }}
        theme={{
          colors: {
            secondaryContainer: COLORS.infoDangerLight,
            onSecondaryContainer: COLORS.primary,
          },
        }}
      />
      {/* <Drawer.Section style={{ margin: -5 }} title="Tools">
        <Drawer.Item
          style={styles.drawerItem}
          label="Delegation"
          icon={drawerItemIndex == 7 ? "file-tree" : "file-tree-outline"}
          key="7"
          active={drawerItemIndex === 7}
          onPress={() => {
            setDrawerItemIndex(7);
            props.navigation.navigate("Delegation");
          }}
        />
        <Drawer.Item
          style={styles.drawerItem}
          label="Secretary"
          icon={
            drawerItemIndex == 8
              ? "card-account-details"
              : "card-account-details-outline"
          }
          key="8"
          active={drawerItemIndex === 8}
          onPress={() => {
            setDrawerItemIndex(8);
            props.navigation.navigate("Secretary");
          }}
        />
      </Drawer.Section>
      <Drawer.Section style={{ margin: -5 }} title="Scan Letter">
        <Drawer.Item
          style={styles.drawerItem}
          label="Scan Log Letter"
          icon={drawerItemIndex == 9 ? "line-scan" : "line-scan"}
          key="9"
          active={drawerItemIndex === 9}
          onPress={() => {
            setDrawerItemIndex(9);
            props.navigation.navigate("ScanLogList");
          }}
        />
      </Drawer.Section> */}
      {/* <Drawer.Section style={{ margin: -5 }} title="Info">
        {Config.termOfUse && (
          <Drawer.Item
            style={styles.drawerItem}
            label="Term of Use"
            icon={drawerItemIndex == 10 ? "information" : "information-outline"}
            key="10"
            active={drawerItemIndex === 10}
            onPress={() => {
              setDrawerItemIndex(10);
              props.navigation.navigate("TermOfUse");
            }}
          />
        )}
        <Drawer.Item
          style={styles.drawerItem}
          label="Sign Out"
          icon="logout"
          key="11"
          active={drawerItemIndex === 11}
          onPress={() => {
            AlertConfirm("Confirm", "Are you sure to Sign Out?", () => {
              setDrawerItemIndex(11);
              handlerLogout();
            });
          }}
        />
      </Drawer.Section> */}
    </DrawerContentScrollView>
  );
};

function DrawerNavigator({ navigation }) {
  return (
    <DrawerNav.Navigator
      useLegacyImplementation
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ drawerStyle: { backgroundColor: "transparent" } }}
    >
      <DrawerNav.Screen
        name="Dashboard"
        component={Dashboard}
        options={defaultOptions({ title: "Dashboard", navigation: navigation })}
      />
      <DrawerNav.Screen
        name="SearchGlobalList"
        component={SearchGlobalList}
        options={defaultOptions({
          title: "Search Letter",
          navigation: navigation,
        })}
      />
      <DrawerNav.Screen
        name="Incoming"
        component={IncomingList}
        options={defaultOptions({
          title: "Surat Masuk",
          navigation: navigation,
        })}
      />
      <DrawerNav.Screen
        name="Outgoing"
        component={OutgoingList}
        options={defaultOptions({
          title: "Surat Keluar",
          navigation: navigation,
        })}
      />
      <DrawerNav.Screen
        name="IncomingUnread"
        component={IncomingList}
        options={defaultOptions({
          title: "Surat Masuk\nBelum Dibaca",
          navigation: navigation,
        })}
      />
      <DrawerNav.Screen
        name="Disposition"
        component={DispositionList}
        options={defaultOptions({
          title: "Disposisi",
          navigation: navigation,
        })}
      />
      <DrawerNav.Screen
        name="MyDisposition"
        component={MyDispositionList}
        options={defaultOptions({
          title: "My Disposition Letter",
          navigation: navigation,
        })}
      />
      <DrawerNav.Screen
        name="DispositionUnread"
        component={DispositionList}
        options={defaultOptions({
          title: "Disposisi\nBelum Dibaca",
          navigation: navigation,
        })}
      />
      <DrawerNav.Screen
        name="NeedFollowUp"
        component={NeedFollowUpList}
        options={defaultOptions({
          title: "Surat Keluar\nPerlu Diproses",
          navigation: navigation,
        })}
      />
      <DrawerNav.Screen
        name="Tracking"
        component={TrackingList}
        options={defaultOptions({
          title: "Surat Keluar\nLacak",
          navigation: navigation,
        })}
      />
      <DrawerNav.Screen
        name="Submitted"
        component={SubmittedList}
        options={defaultOptions({
          title: "Surat Keluar\nTerkirim",
          navigation: navigation,
        })}
      />
      <DrawerNav.Screen
        name="Delegation"
        component={DelegationList}
        options={defaultOptions({
          title: "Delegasi",
          navigation: navigation,
        })}
      />
      <DrawerNav.Screen
        name="Secretary"
        component={SecretaryList}
        options={defaultOptions({
          title: "Sekretaris",
          navigation: navigation,
        })}
      />
      <DrawerNav.Screen
        name="ScanLogList"
        component={ScanLogList}
        options={defaultOptions({
          title: "Scan Log List",
          navigation: navigation,
        })}
      />
      <DrawerNav.Screen
        name="TermOfUse"
        component={TermOfUse}
        options={defaultOptions({
          title: "Term of Use",
          navigation: navigation,
        })}
      />
      <DrawerNav.Screen
        name="Profile"
        component={Profile}
        options={defaultOptions({
          title: "Profil",
          navigation: navigation,
        })}
      />
      <DrawerNav.Screen
        name="Pencarian"
        component={PencarianKorespondensi}
        options={defaultOptions({
          title: "Pencarian",
          navigation: navigation,
        })}
      />
    </DrawerNav.Navigator>
  );
}

export default DrawerNavigator;

const styles = StyleSheet.create({
  containerHeader: {
    // backgroundColor: "red",
  },
  containerHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginStart: 15,
    gap: 10,
    alignItems: "center",
  },
  logoHeader: {
    height: 30,
    width: 60,
  },
  drawerItem: {
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginRight: 0,
    height: 50,
  },
  containerProfile: {
    marginTop: 20,
    marginBottom: 20,
    // marginHorizontal: 24,
    alignItems: "center",
  },
  avatar: {
    marginBottom: 8,
  },
  fullname: {
    fontWeight: "bold",
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
});
