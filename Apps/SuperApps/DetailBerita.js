import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import { ScrollView } from "react-native";
import {
  COLORS,
  DATETIME,
  FONTSIZE,
  fontSizeResponsive,
  FONTWEIGHT,
} from "../../config/SuperAppps";
import { useSelector } from "react-redux";
import RenderHTML from "react-native-render-html";
import { FontAwesome } from "@expo/vector-icons";
import moment from "moment";
import "moment/locale/id";

moment.locale("id");

export const DetailBerita = () => {
  // const { item } = params;
  const navigation = useNavigation();

  const { berita } = useSelector((state) => state.superApps);

  const detail = berita.detail;
  const source = {
    html: detail.content,
  };
  const { width } = useWindowDimensions();

  const tagsStyles = {
    body: {
      whiteSpace: "normal",
      color: "black",
      fontSize: 18,
    },
    img: {
      width: 300,
      marginVertical: 40,
    },
    p: {
      fontSize: 14,
    },
    h5: {
      fontSize: 18,
    },
  };

  const classesStyles = {
    content: {
      padding: 30,
    },
    "news-title": {
      fontSize: 18,
      textAlign: "center",
      fontWeight: "bold",
    },
    // description: {
    //   backgroundColor: "red",
    // },
    media: {
      fontSize: 16,
    },
  };

  const baseStyles = {};

  const { device } = useSelector((state) => state.apps);

  // console.log(detail);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 20,
                marginTop: 20,
                backgroundColor: "white",
                height: device === "tablet" ? 46 : 28,
                width: device === "tablet" ? 46 : 28,
                borderRadius: 50,
              }}
            >
              <Ionicons
                name="chevron-back"
                size={device === "tablet" ? 40 : 24}
                color={COLORS.primary}
              />
            </View>
          </TouchableOpacity>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: fontSizeResponsive("H1", device),
                fontWeight: FONTWEIGHT.bold,
              }}
            >
              {detail.title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginVertical: 10,
              }}
            >
              <FontAwesome name="calendar" size={24} color="black" />
              <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                {/* {moment(detail.updated_at, "DD MMMM YYYY").format(
                  DATETIME.LONG_DATE
                )} */}
                {detail.created_at}
                {/* {moment(detail.created_at, "DD mmmm yyyy").format(
                  DATETIME.LONG_DATE
                )} */}
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: COLORS.white,
              height: "100%",
              paddingTop: 50,
              padding: 16,
            }}
          >
            <RenderHTML
              source={source}
              contentWidth={width}
              tagsStyles={tagsStyles}
              classesStyles={classesStyles}
              defaultTextProps={{ allowFontScaling: false }}
            />
          </View>
        </View>
      </ScrollView>
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
    width: "100%",
    height: 260,
  },
  imageAndroid: {
    width: "100%",
    height: 260,
  },
});
