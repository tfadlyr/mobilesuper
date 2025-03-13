import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS, FONTWEIGHT, PADDING } from "../../config/SuperAppps";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getSurveyDetail } from "../../service/api";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";

export const CardListSurveyUser = ({ item, token }) => {
  const dispatch = useDispatch();
  const getDetail = (id) => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getSurveyDetail(params));
  };
  const navigation = useNavigation();
  return (
    <TouchableOpacity
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
      onPress={() => {
        getDetail(item.id);
        navigation.navigate("DetailSurvey");
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 5,
        }}
      >
        <Text style={{ width: "20%", fontWeight: FONTWEIGHT.bold }}>Nama</Text>
        <Text>:</Text>
        <Text style={{ width: "80%" }}>{item?.respondent?.nama}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 5,
        }}
      >
        <Text style={{ width: "20%", fontWeight: FONTWEIGHT.bold }}>NIP</Text>
        <Text>:</Text>
        <Text style={{ width: "80%" }}>{item?.respondent?.nip}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 5,
        }}
      >
        <Text style={{ width: "20%", fontWeight: FONTWEIGHT.bold }}>UNKER</Text>
        <Text>:</Text>
        <Text style={{ width: "80%" }}>
          {item?.respondent?.unker === null ? "-" : item?.respondent?.unker}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 5,
        }}
      >
        <Text style={{ width: "20%", fontWeight: FONTWEIGHT.bold }}>
          SATKER
        </Text>
        <Text>:</Text>
        <Text style={{ width: "80%" }}>
          {item?.respondent?.satker === null ? "-" : item?.respondent?.satker}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
