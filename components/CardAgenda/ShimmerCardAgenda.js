import React from "react";
import { Dimensions, Touchable, View } from "react-native";
import { Text } from "react-native";
import { AVATAR, COLORS, FONTSIZE, FONTWEIGHT } from "../../config/SuperAppps";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  getDetailAcara,
  getDetailAgendaAcara,
  getDetailGrup,
  getListSubAgenda,
} from "../../service/api";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

export const ShimmerCardAgenda = () => {
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: COLORS.white,
        borderRadius: 8,
        flexDirection: "row",
        gap: 1,
        marginVertical: 5,
        //shadow ios
        shadowOffset: { width: -2, height: 4 },
        shadowColor: "#171717",
        shadowOpacity: 0.2,
        shadowRadius: 3,
        //shadow android
        elevation: 5,
      }}
    >
      <View
        style={{
          width: "3%",
          backgroundColor: COLORS.primary,
          height: 58,
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
        }}
      />

      <View
        style={{ justifyContent: "center", marginHorizontal: 20, width: 250 }}
      >
        <ShimmerPlaceHolder
          style={{ borderRadius: 4 }}
          width={100}
          height={20}
        />
        <View style={{ flexDirection: "row", marginTop: 5 }}>
          <ShimmerPlaceHolder
            style={{ borderRadius: 4 }}
            width={100}
            height={20}
          />
          <ShimmerPlaceHolder
            style={{ borderRadius: 4 }}
            width={100}
            height={20}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <View>
          <ShimmerPlaceHolder
            style={{
              borderWidth: 2,
              borderRadius: 100,
              borderColor: COLORS.white,
            }}
            width={40}
            height={40}
          />
        </View>
      </View>
    </View>
  );
};
