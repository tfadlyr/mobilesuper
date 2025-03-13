import React from "react";
import { Dimensions, Text, useWindowDimensions, View } from "react-native";
import {
  COLORS,
  FONTWEIGHT,
  PADDING,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import WebView from "react-native-webview";

export const AksiPerubahanView = ({ route }) => {
  const item = route.params;
  const navigation = useNavigation();
  const { device } = useSelector((state) => state.apps);

  console.log(item);

  return (
    <View>
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-outline"
              size={device === "tablet" ? 40 : 24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H1", device),
              fontWeight: FONTWEIGHT.bold,
              color: COLORS.white,
              marginRight: 50,
            }}
          >
            Aksi Perubahan
          </Text>
        </View>
      </View>

      <View
        style={{
          height: useWindowDimensions().height,
          width: useWindowDimensions().width,
          padding: 10,
        }}
      >
        <WebView
          originWhitelist={["*"]}
          source={{
            uri: item,
          }}
          style={{
            flex: 1,
            height: "100%",
            width: "100%",
          }}
          allowFileAccess={true}
          androidLayerType={"software"}
          mixedContentMode={"always"}
          allowUniversalAccessFromFileURLs={true}
          setDisplayZoomControls={true}
          scalesPageToFit={false}
        />
      </View>
    </View>
  );
};
