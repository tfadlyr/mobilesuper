import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import WebView from "react-native-webview";
import {
  COLORS,
  fontSizeResponsive,
  FONTWEIGHT,
  PADDING,
} from "../../config/SuperAppps";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export const IPASN = () => {
  const navigation = useNavigation();
  const { device } = useSelector((state) => state.apps);
  return (
    <>
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
        <View style={{ flex: 1, alignItems: "center", marginRight: 40 }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H1", device),
              fontWeight: FONTWEIGHT.bold,
              color: COLORS.white,
            }}
          >
            Dashboard IPASN
          </Text>
        </View>
      </View>

      <View style={{ height: "90%", width: "100%", padding: PADDING.Page }}>
        <WebView
          originWhitelist={["*"]}
          source={{
            uri: "https://portal.kubekkp.coofis.com/assets/dashboardExt/DKepegawaianIPASN/DKepegawaianIPASN.html",
          }}
          style={{ flex: 1 }}
          allowFileAccess={true}
          textZoom={100}
          androidLayerType={"hardware"}
          mixedContentMode={"always"}
          allowUniversalAccessFromFileURLs={true}
          scalesPageToFit={false}
        />
        <Text style={{ color: COLORS.primary, marginBottom: 20 }}>
          *) Gunakan 2 jari untuk menyesuaikan zoom
        </Text>
      </View>
    </>
  );
};
