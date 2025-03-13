import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { getTokenValue } from "../../service/session";
import { getUnitKerjaTematik, getUnitKerjaTematikId } from "../../service/api";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "../../components/Loading";

const DataGrid = ({ judul, id, icon, device }) => {
  var iconsPath;

  switch (icon) {
    case "gambar.svg":
      iconsPath = require("../../assets/superApp/gambar.png");
      break;
    case "gambar-1.svg":
      iconsPath = require("../../assets/superApp/gambar-1.png");
      break;
    case "gambar-2.svg":
      iconsPath = require("../../assets/superApp/gambar-2.png");
      break;
    case "gambar-3.svg":
      iconsPath = require("../../assets/superApp/gambar-3.png");
      break;
    case "gambar-4.svg":
      iconsPath = require("../../assets/superApp/gambar-4.png");
      break;
    case "gambar-5.svg":
      iconsPath = require("../../assets/superApp/gambar-5.png");
      break;
    case "gambar-6.svg":
      iconsPath = require("../../assets/superApp/gambar-6.png");
      break;
    case "gambar-7.svg":
      iconsPath = require("../../assets/superApp/gambar-7.png");
      break;
    case "gambar-8.svg":
      iconsPath = require("../../assets/superApp/gambar-8.png");
      break;
    default:
      null;
  }
  const navigation = useNavigation();

  const [token, setToken] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  // const getId = (ids) => {
  //   const params = { token: token, id: ids, page: 10 };
  //   dispatch(getUnitKerjaTematikId(params));
  // };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
        //shadow ios
        shadowOffset: { width: -2, height: 4 },
        shadowColor: "#171717",
        shadowOpacity: 0.2,
        //shadow android
        elevation: 2,
      }}
      onPress={() => {
        // getId(id);
        navigation.navigate("Dashboard", id);
      }}
    >
      <View
        key={id}
        style={{
          marginTop: 10,
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          // backgroundColor: "grey",
          gap: 10,
        }}
      >
        <View style={styles.cardNo}>
          <Image source={iconsPath} />
        </View>
        <View style={{ width: "80%" }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H3", device),
              fontWeight: FONTWEIGHT.normal,
              marginBottom: 10,
              // textAlign: "center",
            }}
            numberOfLines={2}
          >
            {judul}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const Tematik = () => {
  const navigation = useNavigation();

  const [token, setToken] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getUnitKerjaTematik({ token }));
    }
  }, [token]);

  const { unitKerja, loading } = useSelector((state) => state.kebijakan);

  const unitKerjaTematik = unitKerja.lists;

  const { device } = useSelector((state) => state.apps);

  return (
    <>
      {loading ? <Loading /> : null}
      <View style={{ flex: 1 }}>
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
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
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
                fontWeight: FONTWEIGHT.bold,
                color: COLORS.white,
              }}
            >
              Tematik
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: COLORS.white,
            width: "90%",
            borderRadius: 16,
            marginHorizontal: "5%",
            marginVertical: 20,

            height: "85%",
          }}
        >
          <View style={{ marginHorizontal: 20, marginVertical: 20 }}>
            <Text
              style={{
                fontSize: fontSizeResponsive("H1", device),
                fontWeight: FONTWEIGHT.bold,
              }}
            >
              Peraturan Tematik
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                fontWeight: FONTWEIGHT.normal,
                marginTop: 20,
              }}
            >
              Kumpulan Peraturan Perundang-undangan Bidang Kelautan dan
              Perikanan
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              alignItems: "center",
              height: "80%",
            }}
          >
            <FlatList
              key={"#"}
              data={unitKerjaTematik}
              renderItem={({ item }) => (
                <DataGrid
                  judul={item.nama_unitkerja_eselon1}
                  // tanggal={item.}
                  id={item.kd_unitkerja_eselon1}
                  icon={item.icon}
                  device={device}
                />
              )}
              // numColumns={1}
              keyExtractor={(item) => "#" + item.id}
              style={{ width: "100%", paddingHorizontal: 20 }}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  cardNo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    // marginLeft: 30,
    marginBottom: 10,
  },
});
