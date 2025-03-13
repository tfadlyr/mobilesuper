import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  COLORS,
  fontSizeResponsive,
  FONTWEIGHT,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { Divider } from "react-native-paper";
import { setResetDetailLinimasa } from "../../store/Pengetahuan";

export const CardLiniMasaSatker = ({
  image,
  judul,
  nama,
  jenis,
  index,
  item,
  token,
  device,
}) => {
  const dispatch = useDispatch();
  const getDetail = (id) => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getDetailLinimasa(params));
    dispatch(getViewLinimasa(params));
  };

  const navigation = useNavigation();

  return (
    <View
      key={index}
      style={{ flex: 1, justifyContent: "center", marginHorizontal: 20 }}
    >
      <TouchableOpacity
        style={{ flexDirection: "row", marginVertical: 20 }}
        onPress={() => {
          // getDetail(item.id);
          dispatch(setResetDetailLinimasa());
          navigation.navigate("DetailLinimasa", {
            id: item.id,
          });
        }}
      >
        <Image
          source={{ uri: item.cover }}
          style={{
            width: device === "tablet" ? 200 : 80,
            height: device === "tablet" ? 200 : 80,
          }}
        />
        <View style={{ marginLeft: device === "tablet" ? 20 : 10 }}>
          <View style={{ width: device === "tablet" ? "85%" : "88%" }}>
            <Text
              style={{
                fontSize: fontSizeResponsive("H2", device),
                fontWeight: FONTWEIGHT.bold,
              }}
            >
              {item.title}
            </Text>
          </View>
          <View style={{ justifyContent: "flex-start", marginTop: 10 }}>
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
                color: COLORS.lighter,
                width: "90%",
              }}
            >
              {item.creator.name}
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
            <View
              style={{
                flexDirection: "row",
                gap: 5,
                backgroundColor:
                  item?.category?.toLowerCase() === "video / jurnal"
                    ? COLORS.successLight
                    : item?.category?.toLowerCase() === "infografis"
                    ? COLORS.warningLight
                    : COLORS.infoLight,
                borderRadius: 30,
                height: device === "tablet" ? 60 : 30,
                width: device === "tablet" ? 200 : 120,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {item?.category?.toLowerCase() === "infografis" ? (
                <Ionicons
                  name="document-outline"
                  color={"#F6AD1D"}
                  size={device === "tablet" ? 30 : 24}
                  style={{ marginTop: 2 }}
                />
              ) : item?.category?.toLowerCase() === "kegiatan" ? (
                <Ionicons
                  name="analytics-outline"
                  size={device === "tablet" ? 30 : 24}
                  color={"#1868AB"}
                  style={{ marginTop: 3 }}
                />
              ) : (
                <Ionicons
                  name="videocam-outline"
                  size={device === "tablet" ? 30 : 24}
                  color={"#11C15B"}
                  style={{ marginTop: 2 }}
                />
              )}
              <Text
                style={{
                  color:
                    item.category.toLowerCase() === "infografis"
                      ? COLORS.warning
                      : item.category.toLowerCase() === "kegiatan"
                      ? COLORS.info
                      : COLORS.success,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {item.category}
              </Text>
            </View>

            {/* <Divider bold style={{ transform: [{ rotate: '90deg' }], width: 5 }} /> */}
            {/* custom divider */}
            {/* <View
              style={{ height: "100%", width: 1, backgroundColor: "#DBDADE" }}
            /> */}
          </View>
        </View>
      </TouchableOpacity>
      <Divider bold style={{ width: "90%" }} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    width: "90%",
    height: 76,
    marginLeft: 20,
    opacity: 0.9,
    borderRadius: 12,
  },
  profile: {
    color: "black",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
    left: 16,
  },
  cardApps: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
});
