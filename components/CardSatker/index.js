import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSelector } from "react-redux";

export const CardSatker = ({ profile }) => {
  const navigation = useNavigation();
  const { device } = useSelector((state) => state.apps);
  return (
    <View style={[styles.card, {height: device === 'tablet' ? 130 : 100}]}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text
          style={{
            textAlign: "center",
            color: COLORS.primary,
            fontWeight: FONTWEIGHT.bold,
            fontSize: fontSizeResponsive("Judul", device),
          }}
        >
          {profile.satuan_kerja_nama}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    width: "100%",
    borderTopLeftRadius: 12,
    borderBottomRightRadius: 12,
    //shadow ios
    shadowOffset: { width: -2, height: 4 },
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    // shadow android
    elevation: 1,
  },
  profile: {
    color: "black",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
    left: 16,
  },
  cardApps: {
    width: wp(15),
    height: hp(7),
    borderRadius: 8,
  },
});
