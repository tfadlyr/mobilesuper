import React from "react";
import { Image, Text, useWindowDimensions } from "react-native";
import { View } from "react-native";
import {
  COLORS,
  fontSizeResponsive,
  getOrientation,
} from "../../config/SuperAppps";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

export const CardVideo = ({ setModalVisibleVideo }) => {
  const { device } = useSelector((state) => state.apps);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);
  return (
    <View
      style={{
        alignItems: "center",
        height:
          device === "tablet" && orientation === "landscape"
            ? 600
            : device === "tablet" && orientation === "potrait"
            ? 450
            : 200,
        marginHorizontal: 25,
        marginBottom: device === "tablet" ? 120 : 80,
      }}
    >
      <Image
        source={require("../../assets/superApp/hq720.webp")}
        style={{
          width: "100%",
          height: "100%",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      />
      <View
        style={{
          backgroundColor: COLORS.white,
          width: "100%",
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <View
          key={4}
          style={{
            top: -20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              height: 50,
              width: 50,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 50,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.primary,
                width: 41,
                height: 41,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 50,
              }}
              onPress={() => setModalVisibleVideo(true)}
            >
              <Ionicons name="play-outline" color={COLORS.white} size={20} />
            </TouchableOpacity>
          </View>
          <Text
            style={{
              textAlign: "center",
              color: COLORS.lighter,
              fontSize: fontSizeResponsive("H4", device),
              marginHorizontal: 10,
            }}
          >
            Menteri Trenggono Melakukan Panen Parsial Kedua di BUBK Kebumen
          </Text>
        </View>
      </View>
    </View>
  );
};
