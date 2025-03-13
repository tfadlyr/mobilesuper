import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useDispatch } from "react-redux";
import { getDetailBerita, getDetailSatkerNews } from "../../service/api";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { Text } from "react-native";
import { Platform } from "react-native";
import { StyleSheet } from "react-native";
import { COLORS, DATETIME, fontSizeResponsive } from "../../config/SuperAppps";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import moment from "moment";

export const CardListBeritaSatker = ({
  image,
  tanggal,
  title,
  item,
  index,
  id,
  token,
  device,
  onclick,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const getDetail = (id) => {
    const params = { token: token, id: id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getDetailSatkerNews(params));
  };
  return (
    <View style={{ flex: 0.5 }}>
      <View
        style={{
          backgroundColor: "#fff",
          shadowOpacity: 0.3,
          shadowRadius: 3,
          shadowOffset: {
            height: 0,
            width: 0,
          },
          borderRadius: 16,
          marginHorizontal: 8,
          marginBottom: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (item.type === "berita") {
              getDetail(id);
              navigation.navigate("DetailBeritaSatker");
            } else {
              onclick();
            }
          }}
        >
          <View>
            <Image
              source={{ uri: image }}
              style={{
                height: device === "tablet" ? 300 : 193,
                borderRadius: 16,
              }}
            />
          </View>
          <View style={{ marginVertical: 10, marginHorizontal: 5 }}>
            {item.type === "berita" ? (
              <Text
                style={{
                  color: COLORS.grey,
                  fontSize: fontSizeResponsive("H5", device),
                  fontWeight: 400,
                }}
              >
                {/* {moment(tanggal, "DD mmmm yyyy").format(DATETIME.LONG_DATE)} */}
                {tanggal}
              </Text>
            ) : null}
            <Text
              numberOfLines={3}
              style={{
                marginVertical: 5,
                fontSize: fontSizeResponsive("H5", device),
                fontWeight: 400,
              }}
            >
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  backIcon: {
    backgroundColor: "white",
    height: 28,
    width: 28,
    borderRadius: 50,
  },
  imageIos: {
    height: 193,
    width: "100%",
    borderRadius: 16,
  },
  imageAndroid: {
    height: 193,
    width: "100%",
    borderRadius: 16,
  },
});
