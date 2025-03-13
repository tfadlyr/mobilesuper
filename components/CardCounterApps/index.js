import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  useWindowDimensions,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useSelector } from "react-redux";
import {
  COLORS,
  fontSizeResponsive,
  FONTWEIGHT,
  getOrientation,
} from "../../config/SuperAppps";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { nde_api } from "../../utils/api.config";
import { getHTTP, handlerError } from "../../utils/http";
import * as Sentry from "@sentry/react-native";

const Cardlist = ({ item, loading, CARD_WIDTH, device, orientation }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(
          item.type === "agenda_in"
            ? "IncomingUnread"
            : item.type === "sign"
            ? "NeedSignList"
            : item.type == "onprogress"
            ? "NeedFollowUpList"
            : item.type == "not_dispo"
            ? "IncomingList"
            : null,
          {
            unread: item.type == "not_dispo" ? false : true,
            title:
              item.type === "agenda_in"
                ? "Surat Masuk"
                : item.type === "sign"
                ? "Perlu TTD Elektronik"
                : item.type == "onprogress"
                ? "Perlu Diproses"
                : item.type == "not_dispo"
                ? "Surat Belum Disposisi"
                : null,
            // tipe: item.type == "not_dispo" ? "agenda_in_dispo" : "",
          }
        );
      }}
      style={[
        styles.card,
        {
          width: CARD_WIDTH,
          backgroundColor:
            item.type === "agenda_in"
              ? COLORS.infoLight
              : item.type === "sign"
              ? "#d2e9e8"
              : item.type === "onprogress"
              ? COLORS.successLight
              : item.type === "not_dispo"
              ? "#fdd7c7"
              : null,
        },
      ]}
    >
      <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
        <Text
          style={[
            styles.title,
            {
              fontSize: device === "tablet" ? 20 : 10,
              width:
                device === "tablet" && orientation === "landscape"
                  ? "85%"
                  : device === "tablet" && orientation === "potrait"
                  ? "75%"
                  : "70%",
            },
          ]}
        >
          {item.type === "agenda_in"
            ? "Surat Masuk"
            : item.type === "sign"
            ? "Perlu TTDE"
            : item.type === "onprogress"
            ? "Perlu Diproses"
            : item.type == "not_dispo"
            ? "Surat Belum Disposisi"
            : null}
        </Text>

        {item.type === "agenda_in" ? (
          <MaterialIcons
            name="move-to-inbox"
            size={device === "tablet" ? 40 : 24}
            color={COLORS.info}
            style={{ opacity: 0.2 }}
          />
        ) : item.type === "sign" ? (
          <MaterialCommunityIcons
            name="email-edit-outline"
            size={device === "tablet" ? 40 : 24}
            color={COLORS.info}
            style={{ opacity: 0.2 }}
          />
        ) : item.type === "onprogress" ? (
          <MaterialCommunityIcons
            name="email-edit"
            size={device === "tablet" ? 40 : 24}
            color={COLORS.info}
            style={{ opacity: 0.2 }}
          />
        ) : item.type === "not_dispo" ? (
          <MaterialIcons
            name="move-to-inbox"
            size={device === "tablet" ? 40 : 24}
            color={COLORS.info}
            style={{ opacity: 0.2 }}
          />
        ) : null}
      </View>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={COLORS.primary}
          style={{ marginTop: 10 }}
        />
      ) : (
        <View
          style={{
            borderRadius: 10,
            backgroundColor:
              item.type === "agenda_in"
                ? COLORS.info
                : item.type === "sign"
                ? "#4CB9B4"
                : item.type === "onprogress"
                ? COLORS.success
                : item.type === "not_dispo"
                ? "#ffb9a6"
                : null,
            width: device === "tablet" ? "100%" : "90%",
            padding: 5,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 5,
            flexDirection: "row",
            gap: device == "tablet" ? 8 : 5,
            flexWrap: "wrap",
          }}
        >
          <View
            style={{
              width: device === "tablet" ? 10 : 5,
              height: device === "tablet" ? 10 : 5,
              borderRadius: 50,
              backgroundColor: COLORS.white,
            }}
          />
          <Text
            style={[
              styles.value,
              { fontSize: fontSizeResponsive("H4", device) },
            ]}
          >
            {item.value}
          </Text>
          <Text
            style={[
              styles.value,
              { fontSize: fontSizeResponsive("H4", device) },
            ]}
          >
            New
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export const CardCounterApps = () => {
  const navigation = useNavigation();
  const [activeSlide, setActiveSlide] = useState(0); // State untuk paginasi
  const { profile } = useSelector((state) => state.profile);
  const { device } = useSelector((state) => state.apps);
  const [counter, setCounter] = useState([
    { count: 1, type: "onprogress", value: 0 },
    { count: 2, type: "agenda_in", value: 0 },
    { count: 6, type: "sign", value: 0 },
    {
      count: 7,
      type: "not_dispo",
      value: 0,
    },
  ]);
  const [loading, setLoading] = useState(true);

  const { width } = useWindowDimensions(); // Ambil lebar layar

  const CARD_MARGIN =
    profile?.title?.length > 0 && device === "tablet" ? 16 : 20;
  const numColumns = profile?.title?.length > 0 && device === "tablet" ? 4 : 2; // Tetap 3 kolom
  const padding = device === "tablet" ? 120 : 80;
  const CARD_WIDTH = (width - padding) / numColumns;

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  const isFocus = useIsFocused();

  useEffect(() => {
    const getIsCounter = async () => {
      try {
        const response = await getHTTP(nde_api.dashboard);
        if (response?.data?.length > 0) {
          setCounter(response.data);
        } else {
          console.log("Data kosong");
        }
      } catch (error) {
        if (!error?.response?.status && !error?.status) {
          console.warn("Unknown error", error);
        } else if (error?.status === 401 || error?.response?.status === 401) {
          Sentry.captureEvent(error?.response);
        } else {
          handlerError(error, "Peringatan!", "Counter tidak berfungsi!");
          console.error(error);
        }
      } finally {
        setLoading(false); // Pastikan loading state diubah meskipun terjadi error
      }
    };

    getIsCounter();
  }, [isFocus]);

  const orderFull = ["agenda_in", "sign", "onprogress", "not_dispo"];
  const order = ["agenda_in", "onprogress"];

  const filteredData =
    profile?.title?.length > 0
      ? counter
          .filter((item) => orderFull.includes(item.type)) // Filter hanya data yang diperlukan
          .sort((a, b) => orderFull.indexOf(a.type) - orderFull.indexOf(b.type))
      : counter
          .filter((item) => order.includes(item.type)) // Filter hanya data yang diperlukan
          .sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type)); // Urutkan sesuai array 'order'

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: fontSizeResponsive("H4", device),
          fontWeight: FONTWEIGHT.bold,
          color: COLORS.grey,
        }}
      >
        Korespondensi
      </Text>

      <FlatList
        key={profile?.title?.length > 0 ? "three-columns" : "two-columns"}
        data={filteredData}
        renderItem={({ item }) => (
          <Cardlist
            item={item}
            loading={loading}
            CARD_WIDTH={CARD_WIDTH}
            device={device}
            orientation={orientation}
          />
        )}
        keyExtractor={(item, index) =>
          item.type ? item.type.toString() : `fallback-${index}`
        }
        numColumns={profile?.title?.length > 0 && device === "tablet" ? 4 : 2} // Menampilkan 3 card dalam satu baris
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderRadius: 12,
    padding: 10,
    shadowOffset: { width: -2, height: 4 },
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    elevation: 1,
    height: "100%",
  },
  listContainer: {
    alignItems: "center",
  },
  card: {
    padding: 10,
    margin: 8,
    borderRadius: 10,
    justifyContent: "space-between",
    elevation: 4, // Shadow untuk Android
    shadowColor: "#000", // Shadow untuk iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontWeight: "bold",
    color: "#374151",
  },
  value: {
    fontWeight: "bold",
    color: COLORS.white,
  },
});

export default CardCounterApps;
