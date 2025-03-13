import { Avatar, Card } from "react-native-paper";
import { Text, StyleSheet, View } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { COLORS, fontSizeResponsive } from "../../config/SuperAppps";
import { useSelector } from "react-redux";

function CardDCounter({ data, navigation }) {
  const avatarIcon = StyleSheet.compose(styles.avatarIcon, {
    backgroundColor: data?.color,
  });
  const { device } = useSelector((state) => state.apps);
  return (
    <Card
      style={[styles.card, { paddingVertical: device === "tablet" ? 10 : 8 }]}
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
              ? "Surat Masuk"
              : data?.type == "not_dispo"
              ? "Surat Belum Disposisi"
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
              : "",
        });
      }}
    >
      <Card.Title
        title={
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Avatar.Icon
              size={device === "tablet" ? 50 : 25}
              icon={data?.icon}
              color={COLORS.white}
              style={avatarIcon}
            />
            <Text
              style={{
                fontWeight: "bold",
                fontSize: fontSizeResponsive("Judul", device),
              }}
            >
              {data?.value}
            </Text>
          </View>
        }
        titleStyle={{ justifyContent: "center" }}
        subtitle={
          data?.type == "draft"
            ? "Nomor Tersedia"
            : data?.type == "onprogress"
            ? "Perlu Diproses"
            : data?.type == "sign"
            ? "Perlu TTD Elektronik"
            : data?.type == "agenda_in"
            ? "Surat Masuk"
            : data?.type == "not_dispo"
            ? "Surat Belum Disposisi"
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
        subtitleNumberOfLines={5}
        subtitleStyle={{
          fontSize: fontSizeResponsive("H6", device),
          paddingTop: device === "tablet" ? 10 : 0,
        }}
      />
    </Card>
  );
}

export default CardDCounter;

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    backgroundColor: GlobalStyles.colors.textWhite,
    width: "49%",
    justifyContent: "center",
  },
  avatarIcon: {
    backgroundColor: GlobalStyles.colors.primary,
    borderRadius: 5,
  },
});
