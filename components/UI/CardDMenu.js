import { Divider, List } from "react-native-paper";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS, fontSizeResponsive, spacing } from "../../config/SuperAppps";
import { useSelector } from "react-redux";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from "accordion-collapse-react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

function CardDMenu({ data, divisionList, navigation }) {
  const { device } = useSelector((state) => state.apps);
  const [collapse, setCollapse] = useState(false);
  const toggleCollapse = (index) => {
    setCollapse((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  return (
    <View>
      {data?.type !== "agenda_in_eselon1" && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(data?.navName, {
              unread:
                data?.navName == "DispositionUnread" ||
                data?.navName == "IncomingUnread" ||
                data?.navName == "InternalUnread"
                  ? true
                  : false,
              title:
                data?.type == "draft"
                  ? "Nomor Tersedia"
                  : data?.type == "onprogress"
                  ? "Perlu Diproses"
                  : data?.type == "sign"
                  ? "Perlu TTD Elektronik"
                  : data?.type == "agenda_in"
                  ? "Surat Masuk Belum Disposisi"
                  : data?.type == "agenda_in_forward"
                  ? "Surat Masuk Sudah Diteruskan"
                  : data?.type == "agenda_in_dispo"
                  ? "Surat Masuk Sudah Disposisi"
                  : data?.type == "agenda_disposition"
                  ? "Disposisi"
                  : data?.type == "incoming"
                  ? "Surat Masuk"
                  : data?.type == "internal"
                  ? "Internal Satker"
                  : data?.type == "internal"
                  ? "Internal Satker"
                  : data?.type == "disposition"
                  ? "Disposisi"
                  : data?.type == "tracking"
                  ? "Lacak"
                  : data?.type == "submitted"
                  ? "Terkirim"
                  : "",
              tipe: data?.type,
            });
          }}
        >
          <List.Item
            title={
              data?.type == "draft"
                ? "Nomor Tersedia"
                : data?.type == "onprogress"
                ? "Perlu Diproses"
                : data?.type == "sign"
                ? "Perlu TTD Elektronik"
                : data?.type == "agenda_in"
                ? "Surat Masuk Belum Disposisi"
                : data?.type == "agenda_in_forward"
                ? "Surat Masuk Sudah Diteruskan"
                : data?.type == "agenda_in_dispo"
                ? "Surat Masuk Sudah Disposisi"
                : data?.type == "agenda_disposition"
                ? "Disposisi"
                : data?.type == "incoming"
                ? "Surat Masuk"
                : data?.type == "internal" && data?.navName == "InternalUnread"
                ? "Internal Satker"
                : data?.type == "internal" && data?.navName !== "InternalUnread"
                ? "Internal Satker"
                : data?.type == "disposition"
                ? "Disposisi"
                : data?.type == "tracking"
                ? "Lacak"
                : data?.type == "submitted"
                ? "Terkirim"
                : ""
            }
            titleStyle={{ fontSize: fontSizeResponsive("H4", device) }}
            left={() => <List.Icon icon={data?.icon} />}
            right={() => (
              <List.Icon
                icon={
                  data?.type == "agenda_in_eselon1"
                    ? "chevron-down"
                    : "chevron-right"
                }
              />
            )}
          />
        </TouchableOpacity>
      )}
      {data?.type == "agenda_in_eselon1" && (
        <Collapse isExpanded={!!collapse[data?.type]}>
          <CollapseHeader>
            <TouchableOpacity onPress={() => toggleCollapse(data?.type)}>
              <View style={styles.card}>
                <View
                  style={[
                    {
                      backgroundColor:
                        collapse === true
                          ? COLORS.secondaryLighter
                          : COLORS.white,
                      borderRadius: 8,
                      paddingVertical: 8,
                      paddingHorizontal: 1,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    },
                  ]}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <Ionicons name={data?.icon} size={22} />
                    <Text
                      style={[
                        {
                          fontSize: fontSizeResponsive("H4", device),
                        },
                      ]}
                    >
                      Surat Eselon I
                    </Text>
                  </View>
                  <View
                    style={{
                      marginRight: 26,
                    }}
                  >
                    {collapse[data?.type] === true ? (
                      <Ionicons name="chevron-up-outline" size={18} />
                    ) : (
                      <Ionicons name="chevron-down-outline" size={18} />
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </CollapseHeader>
          {}
          <CollapseBody>
            <View style={[styles.cardCollapse]}>
              {divisionList.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    navigation.navigate(data?.navName, {
                      unread:
                        data?.navName == "DispositionUnread" ||
                        data?.navName == "IncomingUnread" ||
                        data?.navName == "InternalUnread"
                          ? true
                          : false,
                      title: "Surat Eselon I - " + item.short_name,
                      tipe: data?.type,
                      division: item.id,
                    });
                  }}
                >
                  <List.Item
                    title={item.short_name}
                    titleStyle={{ fontSize: fontSizeResponsive("H4", device) }}
                    right={() => <List.Icon icon="chevron-right" />}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </CollapseBody>
        </Collapse>
      )}
      <Divider />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
  },
  cardCollapse: {
    backgroundColor: "#fff",
    padding: spacing.default,
    paddingRight: 0,
  },
});

export default CardDMenu;
