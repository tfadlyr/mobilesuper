import React from "react";
import { ScrollView, Text } from "react-native";
import { View } from "react-native";
import { useSelector } from "react-redux";
import {
  COLORS,
  FONTWEIGHT,
  PADDING,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import PieChart from "react-native-pie-chart";

export const DetailSurvey = () => {
  const { device } = useSelector((state) => state.apps);
  const { detail } = useSelector((state) => state.survey);
  const navigation = useNavigation();

  const renderPertanyaan = (type) => {
    let arr = [];
    for (const key in detail?.response) {
      if (type === "penggunaan" && key.startsWith("Modul")) {
        arr.push(
          <View>
            <Text style={{ marginTop: 10, fontWeight: FONTWEIGHT.bold }}>
              {key}
            </Text>
            {detail?.response[key].map((item, index) => (
              <Text style={{ marginTop: 5 }}>- {item}</Text>
            ))}
          </View>
        );
      } else if (type === "penilaian" && !key.startsWith("Modul")) {
        arr.push(
          <View>
            <Text style={{ marginTop: 10, fontWeight: FONTWEIGHT.bold }}>
              {key}
            </Text>
            <Text style={{ marginTop: 5 }}>
              -{" "}
              {detail?.response[key][0] === 1
                ? "Sangat Tidak Setuju"
                : detail?.response[key][0] === 2
                ? "Tidak Setuju"
                : detail?.response[key][0] === 3
                ? "Biasa Saja/Netral"
                : detail?.response[key][0] === 4
                ? "Setuju"
                : "Sangat Setuju"}
            </Text>
          </View>
        );
      }
    }
    return arr;
  };

  return (
    <ScrollView>
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
            Detail Survei
          </Text>
        </View>
      </View>

      <View
        style={{
          padding: 10,
          backgroundColor: COLORS.white,
          borderRadius: 8,
          marginTop: 10,
          width: wp(90),
          //shadow ios
          shadowOffset: { width: -2, height: 4 },
          shadowColor: "#171717",
          shadowOpacity: 0.2,
          //shadow android
          elevation: 2,
          alignContent: "center",
          marginHorizontal: 20,
        }}
      >
        <View
          style={{
            width: "42%",
            backgroundColor: COLORS.primary,
            padding: 10,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("Judul", device),
              fontWeight: FONTWEIGHT.bold,
              color: COLORS.white,
            }}
          >
            Data Pengguna
          </Text>
        </View>
        {renderPertanyaan("penggunaan")}
      </View>

      <View
        style={{
          padding: 10,
          backgroundColor: COLORS.white,
          borderRadius: 8,
          marginTop: 10,
          width: wp(90),
          //shadow ios
          shadowOffset: { width: -2, height: 4 },
          shadowColor: "#171717",
          shadowOpacity: 0.2,
          //shadow android
          elevation: 2,
          alignContent: "center",
          marginHorizontal: 20,
        }}
      >
        <View
          style={{
            width: "42%",
            backgroundColor: COLORS.primary,
            padding: 10,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("Judul", device),
              fontWeight: FONTWEIGHT.bold,
              color: COLORS.white,
            }}
          >
            Data Penilaian
          </Text>
        </View>
        {renderPertanyaan("penilaian")}
      </View>
    </ScrollView>
  );
};
