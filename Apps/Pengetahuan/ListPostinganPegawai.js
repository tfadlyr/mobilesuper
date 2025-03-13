import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import {} from "react-native-safe-area-context";
import {
  AVATAR,
  COLORS,
  DATETIME,
  DateFormat,
  FONTSIZE,
  FONTWEIGHT,
  PADDING,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { FlatList } from "react-native";
import ListEmpty from "../../components/ListEmpty";
import { StatusBar } from "expo-status-bar";
import { Loading } from "../../components/Loading";

const CardListPostingan = ({ item, device }) => {
  return (
    <View
      style={{
        alignSelf: "center",
        width: "100%",
        paddingVertical: PADDING.Page,
        paddingHorizontal: "5%",
      }}
    >
      <View
        style={{
          // height: 120,
          paddingHorizontal: 20,
          borderColor: COLORS.lighter,
          alignItems: "center",
          borderRadius: 8,
          flexDirection: "row",
          //shadow ios
          shadowOffset: { width: -2, height: 4 },
          shadowColor: "#171717",
          shadowOpacity: 0.2,
          //shadow android
          elevation: 2,
          backgroundColor: COLORS.white,
        }}
      >
        <View style={{ marginVertical: 20 }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 600,
            }}
          >
            {item?.title}
          </Text>
          <View
            style={{
              display: "flex",
              // justifyContent: "space-between",
              marginVertical: 10,
              gap: 12,
            }}
          >
            <View style={{ width: "80%" }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                  fontWeight: 400,
                  color: COLORS.grey,
                }}
              >
                Tanggal :{" "}
                {DateFormat({
                  date: item.created_at,
                  fromDate: DATETIME.LONG_DATETIME,
                  toDate: DATETIME.LONG_DATE,
                })}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                  fontWeight: 400,
                  color: COLORS.grey,
                }}
              >
                {"Nilai Saat ini : " + item?.score}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export const ListPostinganPegawai = (param) => {
  const navigation = useNavigation();

  const { postinganPegawai, loading } = useSelector(
    (state) => state.pengetahuan
  );

  const nama = param?.route?.params;

  const resetData = () => {
    postinganPegawai.lists = [];
  };

  const { device } = useSelector((state) => state.apps);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          backgroundColor: COLORS.primary,
          height: 80,
          paddingBottom: 20,
          marginBottom: 20,
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
          <TouchableOpacity
            style={{}}
            onPress={() => {
              navigation.goBack();
              resetData();
            }}
          >
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
              fontWeight: 600,
              color: COLORS.white,
            }}
          >
            Postingan {nama}
          </Text>
        </View>
      </View>
      {loading ? (
        <Loading />
      ) : postinganPegawai.lists.length === 0 ? (
        <ListEmpty />
      ) : null}
      <View style={{ marginBottom: 130 }}>
        <FlatList
          data={postinganPegawai?.lists}
          renderItem={({ item }) => (
            <View key={item.id}>
              <CardListPostingan item={item} device={device} />
            </View>
          )}
          style={{ marginBottom: 80 }}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => <ListEmpty />}
        />
      </View>
    </View>
  );
};
