import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { COLORS, DATETIME, FONTWEIGHT } from "../../config/SuperAppps";
import { Text } from "react-native";
import moment from "moment/min/moment-with-locales";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";

export const CardArsipCuti = ({ item, nip }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const getDetail = (id) => {
    const params = { nip, id };
    // const data = event.listsprogress.find(item => item.id === id)
    // dispatch(getDetailBerita(params));
  };
  return (
    <TouchableOpacity
      onPress={() => {
        getDetail(item.id);
      }}
    >
      {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}> */}
      <View style={{}}>
        <View style={[styles.cardKouta]}>
          <View
            style={{
              width: "60%",
              padding: 15,
              backgroundColor: COLORS.white,
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
            }}
          >
            <View style={{ rowGap: 10 }}>
              <Text style={{ fontSize: 12 }}>Jenis : {item.jenis_cuti}</Text>
              <Text style={{ fontSize: 12 }}>
                Tipe Dokumen: {item.tipe_dokumen}{" "}
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.lighter }}>
                Mulai Berlaku:{" "}
                {moment(item.mulai_cuti, DATETIME.LONG_DATETIME)
                  .locale("id")
                  .format(DATETIME.LONG_DATE)}
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.lighter }}>
                Akhir Beralaku:{" "}
                {moment(item.akhir_cuti, DATETIME.LONG_DATETIME)
                  .locale("id")
                  .format(DATETIME.LONG_DATE)}
              </Text>
              <Text style={{ fontSize: 12 }}>Status: {item.status} </Text>
            </View>
          </View>
          <View
            style={{
              width: "40%",
              borderBottomRightRadius: 8,
              borderTopRightRadius: 8,
              backgroundColor: "grey",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{}}>
              {/* <View style={{ flexDirection: "row", columnGap: 5, alignItems: "center" }}>
                                <Text>Kuota Cuti</Text>
                                <View style={{ backgroundColor: COLORS.white, borderRadius: 5, paddingHorizontal: 12, paddingVertical: 8 }}>
                                    <Text style={{ fontWeight: FONTWEIGHT.bold }}>{item.kuota}</Text>
                                </View>
                            </View> */}
              <View
                style={{
                  flexDirection: "row",
                  columnGap: 5,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: FONTWEIGHT.bold, fontSize: 12 }}>
                  Status
                </Text>
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    borderRadius: 5,
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                  }}
                >
                  <Text style={{ fontWeight: FONTWEIGHT.bold, fontSize: 10 }}>
                    {item.status}
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
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    // marginHorizontal: 5,
    // margin:10,
    marginVertical: 10,
    flexDirection: "row",
  },
});
