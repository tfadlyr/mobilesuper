import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { getDetailArsipCuti } from "../../service/api";
import { Text, TouchableOpacity, View } from "react-native";
import { COLORS, DATETIME, fontSizeResponsive } from "../../config/SuperAppps";
import moment from "moment/min/moment-with-locales";
import { Ionicons } from "@expo/vector-icons";

export const CardListDokumenDraft = ({ item, token, device }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const getDetail = (id) => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getDetailArsipCuti(params));
  };

  return (
    <>
      {item.status === "Draft" ? (
        <TouchableOpacity
          onPress={
            (onPress = () => {
              getDetail(item.id);
              navigation.navigate("TambahCutiTahunan", { tipe: "draft" });
            })
          }
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              padding: 10,
              borderRadius: 8,
              gap: 15,
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: fontSizeResponsive("H3", device) }}>
              Tanggal Pengajuan:{" "}
              {moment(item.tanggal_pembuatan, "DD MMMM YYYY HH:mm:ss")
                .locale("id")
                .format(DATETIME.LONG_DATETIME)}
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                color: COLORS.lighter,
              }}
            >
              Jenis: {item.jenis_cuti}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H3", device),
                  color: COLORS.lighter,
                }}
              >
                Tipe Dokumen:{" "}
              </Text>
              <View
                style={{
                  backgroundColor: COLORS.grey,
                  borderRadius: 10,
                  padding: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    color: COLORS.white,
                  }}
                >
                  {item.tipe_dokumen}
                </Text>
              </View>
            </View>
            <View style={{ justifyContent: "space-between" }}>
              <View
                style={{ flexDirection: "row", gap: 4, alignItems: "center" }}
              >
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={COLORS.primary}
                />
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    color: COLORS.lighter,
                  }}
                >
                  Mulai:{" "}
                  {moment(item.mulai_cuti, DATETIME.LONG_DATETIME)
                    .locale("id")
                    .format(DATETIME.LONG_DATETIME)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  gap: 4,
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={COLORS.primary}
                />
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    color: COLORS.lighter,
                  }}
                >
                  Mulai:{" "}
                  {moment(item.akhir_cuti, DATETIME.LONG_DATETIME)
                    .locale("id")
                    .format(DATETIME.LONG_DATETIME)}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ) : null}
    </>
  );
};
