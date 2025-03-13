import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { COLORS, DATETIME, FONTWEIGHT } from "../../config/SuperAppps";
import { Text } from "react-native";
import moment from "moment/min/moment-with-locales";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { getDetailArsipCuti } from "../../service/api";

export const CardListArsipCuti = ({ item, nip }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const getDetail = (id) => {
    const params = { nip, id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getDetailArsipCuti(params));
  };
  return (
    <TouchableOpacity
      onPress={() => {
        getDetail(item.id);
        navigation.navigate("DetailDokumenCuti");
      }}
    >
      {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}> */}
      <View style={{}}>
        <View style={[styles.cardKouta]}>
          <View
            style={{
              width: "100%",
              padding: 15,
              backgroundColor: COLORS.white,
              borderRadius: 8,
            }}
          >
            <View style={{ rowGap: 10 }}>
              <View
                style={{
                  backgroundColor: COLORS.ExtraDivinder,
                  width: "82%",
                  borderRadius: 10,
                }}
              >
                <Text style={{ fontSize: 12 }}>
                  Tanggal Pembuatan :{" "}
                  {moment(item.tanggal_pembuatan, DATETIME.LONG_DATETIME)
                    .locale("id")
                    .format(DATETIME.LONG_DATETIME)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 12 }}>Jenis : {item.jenis_cuti}</Text>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ fontSize: 12 }}>Tipe Dokumen: </Text>
                  <View
                    style={{
                      backgroundColor: COLORS.successLight,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: COLORS.success }}>
                      {item.tipe_dokumen}{" "}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontSize: 12 }}>Status: </Text>
                <View
                  style={{
                    backgroundColor: COLORS.warningLight,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ fontSize: 12, color: COLORS.warning }}>
                    {item.status}{" "}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 5,
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={15}
                    color={COLORS.primary}
                  />
                  <Text style={{ fontSize: 12, color: COLORS.lighter }}>
                    Mulai:{" "}
                    {moment(item.mulai_cuti, DATETIME.LONG_DATETIME)
                      .locale("id")
                      .format(DATETIME.LONG_DATE)}
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={15}
                    color={COLORS.primary}
                  />
                  <Text style={{ fontSize: 12, color: COLORS.lighter }}>
                    Akhir:{" "}
                    {moment(item.akhir_cuti, DATETIME.LONG_DATETIME)
                      .locale("id")
                      .format(DATETIME.LONG_DATE)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardStatus: {
    width: "23%",
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    margin: 10,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  cardKouta: {
    // width: 360,
    // padding: 1,
    borderRadius: 8,
    // marginHorizontal: 5,
    // margin:10,
    marginVertical: 10,
  },
});
