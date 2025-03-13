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
import moment from "moment";
import { FontAwesome } from "@expo/vector-icons";

export const DetailBeritaSatker = () => {
  // const { item } = params;
  const navigation = useNavigation();

  const { berita } = useSelector((state) => state.satker);

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

  console.log(detail);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View
              style={[
                styles.backIcon,
                {
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 25,
                  marginLeft: 20,
                },
              ]}
            >
              <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
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
                {/* {moment(detail.created_at, "DD mmmm yyyy").format(
                  DATETIME.LONG_DATE
                )} */}
                {detail.created_at}
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
