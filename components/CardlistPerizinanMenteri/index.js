import React, { useMemo, useRef } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { Text, Image } from "react-native";
import {
  COLORS,
  DATETIME,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Search } from "../../components/Search";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { useEffect } from "react";
import ListEmpty from "../../components/ListEmpty";
import {
  getDetailDigisign,
  getListRejected,
  getListComposer,
  getListDraft,
  getListInProgress,
  getListSignedDigiSign,
  getDetailDigisignMonitoring,
} from "../../service/api";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getTokenValue } from "../../service/session";
import { setDigitalSignLists } from "../../store/DigitalSign";
import { Loading } from "../../components/Loading";
import { RefreshControl } from "react-native";
import { Config } from "../../constants/config";
import moment from "moment";

export const CardListPerizinanMenteri = ({
  item,
  variant,
  token,
  device,
  isSelected,
  setSelection,
  nip,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const getDetail = (id) => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)

    if (variant !== "monitoring") {
      dispatch(getDetailDigisign(params));
    } else {
      dispatch(getDetailDigisignMonitoring(params));
    }
  };
  const BASE_URL = Config.base_url + "bridge";
  return (
    <View
      key={item.id}
      style={{
        backgroundColor: "white",
        borderRadius: 16,
        flex: 1,
        marginTop: 10,
        marginHorizontal: "5%",
        padding: 20,
        //shadow ios
        shadowOffset: { width: -2, height: 4 },
        shadowColor: "#171717",
        shadowOpacity: 0.2,
        // //shadow android
        elevation: 2,
        marginVertical: 10,
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
        }}
        onPress={() => {
          getDetail(item.id);
          navigation.navigate("DetailPerizinanMenteri", {
            variant: variant,
            token: token,
          });
        }}
      >
        {/* {variant === "inprogress" ? (
        <Checkbox
          value={isSelected}
          onValueChange={setSelection}
          color={isSelected === true ? COLORS.lighter : null}
        />
      ) : null} */}
        {variant === "inprogress" && nip !== "197208122001121002" ? (
          <Checkbox
            value={isSelected.includes(item?.id) ? true : false}
            onValueChange={() => {
              if (isSelected.includes(item?.id)) {
                const ids = [...isSelected];
                const newIds = ids.filter((id) => id !== item?.id);
                setSelection(newIds);
              } else {
                setSelection((prev) => [...prev, item?.id]);
              }
            }}
            color={isSelected === true ? COLORS.lighter : null}
          />
        ) : null}
        <View
          style={{
            flexDirection: "column",
            flex: 1,
          }}
        >
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                textAlign: "justify",
                fontWeight: FONTWEIGHT.bold,
                flexWrap: "wrap",
              }}
            >
              Perihal : {item?.subject}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: COLORS.lighter,
              height: 1,
              marginVertical: 5,
              width: "90%",
            }}
          />
          <View style={{ gap: 5, width: "100%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H3", device),
                  width: 120,
                  textAlign: "auto",
                  paddingRight: 12,
                  fontWeight: FONTWEIGHT.normal,
                  width: "40%",
                }}
              >
                ID Dokumen
              </Text>
              <Text
                style={{
                  fontWeight: FONTWEIGHT.normal,
                  width: "55%",
                  textAlign: "auto",
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                :{" "}
                {item?.extra_attributes.id_permohonan !== undefined
                  ? item?.extra_attributes.id_permohonan
                  : "-"}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H3", device),
                  width: 120,
                  textAlign: "auto",
                  paddingRight: 12,
                  fontWeight: FONTWEIGHT.normal,
                  width: "40%",
                }}
              >
                Nomor Surat
              </Text>
              <Text
                style={{
                  fontWeight: FONTWEIGHT.normal,
                  width: "55%",
                  textAlign: "auto",
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                :{" "}
                {item?.extra_attributes.noDokumen !== undefined
                  ? item?.extra_attributes.noDokumen
                  : "-"}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H3", device),
                  width: 120,
                  textAlign: "auto",
                  paddingRight: 12,
                  fontWeight: FONTWEIGHT.normal,
                  width: "40%",
                }}
              >
                Tanggal
              </Text>
              <Text
                style={{
                  fontWeight: FONTWEIGHT.normal,
                  width: "55%",
                  textAlign: "auto",
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                :{" "}
                {item?.extra_attributes.tanggalDokumen !== undefined
                  ? moment(
                      item?.extra_attributes.tanggalDokumen,
                      "YYYY-MM-DD HH:mm:ss"
                    )
                      .locale("id")
                      .format(DATETIME.LONG_DATE)
                  : "-"}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H3", device),
                  width: 120,
                  textAlign: "auto",
                  paddingRight: 12,
                  fontWeight: FONTWEIGHT.normal,
                  width: "40%",
                }}
              >
                Jenis Permohonan
              </Text>
              <Text
                style={{
                  fontWeight: FONTWEIGHT.normal,
                  width: "55%",
                  textAlign: "auto",
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                :{" "}
                {item?.extra_attributes.jenis !== undefined
                  ? item?.extra_attributes.jenis
                  : "-"}
              </Text>
            </View>
            {/* <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H3", device),
                  width: 120,
                  textAlign: "auto",
                  paddingRight: 12,
                  fontWeight: FONTWEIGHT.normal,
                  width: "40%",
                }}
              >
                Penerima
              </Text>
              {item?.composer?.display_title !== undefined ? (
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.normal,
                    width: "55%",
                    textAlign: "auto",

                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  :{" "}
                  {item?.composer?.officer?.nama !== undefined
                    ? item?.receivers[0]?.officer?.nama
                    : "-"}
                </Text>
              ) : (
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.normal,
                    width: "55%",
                    textAlign: "auto",
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  :{" "}
                  {item?.composer?.nama !== undefined
                    ? item?.composer?.nama
                    : "-"}
                </Text>
              )}
            </View> */}
            {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H3", device),
                  width: 120,
                  textAlign: "auto",
                  paddingRight: 12,
                  fontWeight: FONTWEIGHT.normal,
                  width: "40%",
                }}
              >
                Penandatangan
              </Text>
              <Text style={{ fontSize: fontSizeResponsive("H3", device) }}>
                :{" "}
              </Text>
              {item?.approvers.slice(1).map((data) => (
                <Image
                  source={{ uri: data.avatar_url }}
                  style={{ width: 20, height: 20, borderRadius: 50 }}
                />
              ))}
            </View> */}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
