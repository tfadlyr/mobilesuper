import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native";
import { COLORS, fontSizeResponsive } from "../config/SuperAppps";
import {
  FlatList,
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import {} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getTokenValue } from "../service/session";
import { getDivision, getDivisionTree, getEmployee } from "../service/api";
import { useNavigation } from "@react-navigation/native";
import { setAddressbookSelected } from "../store/AddressbookKKP";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { Portal } from "react-native-portalize";
import { TopAddressBook } from "../utils/menutab";

const CardListPilih = ({ item, addressbook, device, config }) => {
  const dispatch = useDispatch();
  const deleteItem = (id, state) => {
    let data;
    if (state === "jabatan") {
      if (config.tipeAddress == "korespondensi") {
        data = addressbook.selected.filter((data) => {
          let code = data.code;
          return code !== id;
        });
      } else {
        data = addressbook.selected.filter((data) => {
          let nip = data.nip || data?.officer?.official.split("/")[1];
          return nip !== id;
        });
      }
      dispatch(setAddressbookSelected(data));
    } else {
      if (config.tipeAddress == "korespondensi") {
        data = addressbook.selected.filter((data) => data.nik !== id);
      } else {
        data = addressbook.selected.filter((data) => data.nip !== id);
      }
      dispatch(setAddressbookSelected(data));
    }
  };
  return (
    <View style={{ paddingBottom: 10 }} key={item.nip ? item.nip : item.code}>
      {item.code !== undefined && item.person !== undefined ? (
        <View
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            marginTop: 10,
            marginHorizontal: "5%",
            gap: 10,
            backgroundColor: COLORS.white,
            padding: 10,
            borderRadius: 8,
            //shadow ios
            shadowOffset: { width: -2, height: 4 },
            shadowColor: "#171717",
            shadowOpacity: 0.2,
            //shadow android
            elevation: 2,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (config.tipeAddress == "korespondensi") {
                deleteItem(item.code, "jabatan");
              } else {
                deleteItem(
                  item.nip || item.officer.official.split("/")[1],
                  "jabatan"
                );
              }
            }}
          >
            <Ionicons name="close-circle" size={24} />
          </TouchableOpacity>
          <Text
            style={{ width: "80%", fontSize: fontSizeResponsive("H4", device) }}
          >
            {item.person !== undefined ? item.person : ""}
          </Text>
        </View>
      ) : item.code !== undefined && item.title !== undefined ? (
        <View
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            marginTop: 10,
            marginHorizontal: "5%",
            gap: 10,
            backgroundColor: COLORS.white,
            padding: 10,
            borderRadius: 8,
            //shadow ios
            shadowOffset: { width: -2, height: 4 },
            shadowColor: "#171717",
            shadowOpacity: 0.2,
            //shadow android
            elevation: 2,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (config.tipeAddress == "korespondensi") {
                deleteItem(item.code, "jabatan");
              } else {
                deleteItem(
                  item.nip || item.officer.official.split("/")[1],
                  "jabatan"
                );
              }
            }}
          >
            <Ionicons name="close-circle" size={24} />
          </TouchableOpacity>
          <Text
            style={{ width: "80%", fontSize: fontSizeResponsive("H4", device) }}
          >
            {item.title.name !== undefined ? item.title.name : item.title}
          </Text>
          {/* <TouchableOpacity>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity> */}
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
            backgroundColor: COLORS.white,
            padding: 10,
            borderRadius: 8,
            //shadow ios
            shadowOffset: { width: -2, height: 4 },
            shadowColor: "#171717",
            shadowOpacity: 0.2,
            //shadow android
            elevation: 2,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (config.tipeAddress == "korespondensi") {
                deleteItem(item.nik, "pegawai");
              } else {
                deleteItem(item.nip, "pegawai");
              }
            }}
          >
            <Ionicons name="close-circle" size={24} />
          </TouchableOpacity>
          <View style={{ width: "80%" }}>
            <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
              {item.nama || item.fullname}
            </Text>
            <Text
              style={{
                color: COLORS.lighter,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {item.nip ? item.nip : item.nik}
            </Text>
          </View>
          {/* <TouchableOpacity>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity> */}
        </View>
      )}
    </View>
  );
};

export const AddressBook = ({ route }) => {
  const [token, setToken] = useState("");
  const { config } = route.params;

  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      // dispatch(getDivision(token))
      dispatch(getEmployee({ token: token, search: "" }));
      // dispatch(getDivisionTree({ token: token, id: kategori.key }))
    }
  }, [token]);

  const { addressbook } = useSelector((state) => state.addressBookKKP);

  const navigation = useNavigation();

  useEffect(() => {
    dispatch(setAddressbookSelected(config.payload));
  }, [config]);

  const bottomSheetModalMemberRef = useRef(null);

  const initialSnapPoints = useMemo(() => ["10%", "90%"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  // const bottomSheetMember = () => {
  bottomSheetModalMemberRef.current?.present();
  // };

  handleDismiss = () => {
    bottomSheetModalMemberRef.current?.present();
  };

  // if (addressbook.selected.length > 0) {
  //   bottomSheetMember();
  // }

  // useEffect(() => {
  //   if (addressbook.selected.length > 0) {
  //     bottomSheetMember();
  //   }
  // }, []);

  const { device } = useSelector((state) => state.apps);

  return (
    <View style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            backgroundColor: COLORS.primary,
            height: 80,
            paddingBottom: 20,
            paddingHorizontal: 20,
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
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Ionicons
                name="chevron-back-outline"
                size={24}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                fontSize: fontSizeResponsive("H1", device),
                fontWeight: 600,
                color: COLORS.white,
              }}
            >
              AddressBook
            </Text>
          </View>

          <TouchableOpacity
            style={{
              width: 28,
              height: 28,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="checkmark-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={{ height: "90%" }}>
          <TopAddressBook config={config} device={device} />
        </View>
        {/* <View style={{ position: 'absolute', bottom: 50, left: 0, right: 0, width: '100%' }}>
                        <Text>selected {addressbook.selected.length}</Text>
                    </View> */}

        {/* <TouchableOpacity
          onPress={() => {
            bottomSheetMember();
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "90%",
            height: 50,
            backgroundColor: COLORS.primary,
            marginHorizontal: 20,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: COLORS.white }}>Lihat Pilihan</Text>
        </TouchableOpacity> */}

        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalMemberRef}
            snapPoints={animatedSnapPoints}
            handleHeight={animatedHandleHeight}
            contentHeight={animatedContentHeight}
            index={0}
            style={{ borderRadius: 50 }}
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjust"
            onDismiss={handleDismiss}
          >
            <BottomSheetView onLayout={handleContentLayout}>
              <View>
                <View
                  style={{
                    paddingHorizontal: 20,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    // backgroundColor: COLORS.primary,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 500,
                      marginBottom: 50,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Daftar ({addressbook.selected.length} Pilihan)
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(setAddressbookSelected([]));
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.infoDanger,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Hapus Semua
                    </Text>
                  </TouchableOpacity>
                </View>
                {addressbook.selected.length === 0 ? (
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        color: COLORS.lighter,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Belum ada yang dipilih
                    </Text>
                  </View>
                ) : (
                  <View>
                    <FlatList
                      data={addressbook.selected}
                      renderItem={({ item }) => (
                        <CardListPilih
                          item={item}
                          addressbook={addressbook}
                          device={device}
                          config={config}
                        />
                      )}
                      style={{ height: 600 }}
                      keyExtractor={(item) => (item.nip ? item.nip : item.code)}
                    />
                  </View>
                )}
              </View>
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </View>
  );
};
