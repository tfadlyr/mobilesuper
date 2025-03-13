import React from "react";
import { Dimensions, Touchable, View } from "react-native";
import { Text } from "react-native";
import {
  AVATAR,
  COLORS,
  FONTSIZE,
  fontSizeResponsive,
  FONTWEIGHT,
} from "../../config/SuperAppps";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment/min/moment-with-locales";
import { useDispatch, useSelector } from "react-redux";
import {
  getDetailAcara,
  getDetailAgendaAcara,
  getDetailGrup,
  getListSubAgenda,
} from "../../service/api";

export const CardAgenda = ({
  item,
  stringToColor,
  token,
  kegiatan,
  idKategori,
}) => {
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const getDetail = (id) => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)
    if (kegiatan === "acara kalender") {
      dispatch(getDetailAcara(params));
      dispatch(getDetailGrup({ token: token, id: idKategori }));
    } else {
      dispatch(getDetailAgendaAcara(params));
      dispatch(getListSubAgenda(params));
    }
  };
  const { device } = useSelector((state) => state.apps);
  return (
    <TouchableOpacity
      key={item.id}
      onPress={() => {
        getDetail(item.id);

        if (kegiatan === "acara kalender") {
          navigation.navigate("DetailAcara", { idKategori: idKategori });
        } else {
          navigation.navigate("DetailAcaraAgenda");
        }
      }}
    >
      <View
        style={{
          // width: device === "tablet" ? "50%" : "100%",
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
            backgroundColor: stringToColor(item.pic.title.name),
            height: 58,
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
          }}
        />

        <View
          style={{
            justifyContent: "space-between",
            marginHorizontal: 20,
            width: '90%',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <View>

          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item.name || item.title}
          </Text>
          <View style={{ flexDirection: "row", marginTop: 5 }}>
            <Text
              style={{
                color: COLORS.lighter,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {moment(item.start_date)
                .locale("id")
                .locale("id")
                .format("YYYY-MM-DD")}{" "}
              -{" "}
            </Text>
            <Text
              style={{
                color: COLORS.lighter,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {moment(item.end_date)
                .locale("id")
                .locale("id")
                .format("YYYY-MM-DD")}
            </Text>
          </View>
          </View>


          <View>
            <Image
              source={{ uri: item.pic.avatar_url }}
              style={{
                marginLeft: -8,
                borderWidth: 2,
                borderRadius: 50,
                borderColor: COLORS.white,
                width: device === "tablet" ? 50 : 40,
                height: device === "tablet" ? 50 : 40,
              }}
            />
          </View>
        </View>
        {/* <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
         
        </View> */}
      </View>
    </TouchableOpacity>
  );
};
