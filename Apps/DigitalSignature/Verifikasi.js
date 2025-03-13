import React, { useEffect } from "react";
import { BackHandler, Text, View } from "react-native";
import { COLORS, fontSizeResponsive } from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import WebView from "react-native-webview";

export const Verifikasi = () => {
  const navigation = useNavigation();
  const { device } = useSelector((state) => state.apps);
  useEffect(() => {
    const backAction = () => {
      navigation.navigate("Home"); // Navigasi langsung ke Home
      return true; // Mencegah aksi back default Android
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          backgroundColor: COLORS.primary,
          height: 80,
          paddingBottom: 20,
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
            onPress={() => navigation.navigate("Home")}
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
            Verifikasi
          </Text>
        </View>
      </View>

      <View
        style={{
          height: "100%",
          width: "100%",
          padding: 5,
        }}
      >
        <WebView
          originWhitelist={["*"]}
          source={{
            uri: "https://tte.komdigi.go.id/verifyPDF",
          }}
          style={{ flex: 1 }}
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
