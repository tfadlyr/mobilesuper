import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import {} from "react-native-safe-area-context";
import {
  AVATAR,
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Search } from "../../components/Search";
import { ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getTokenValue } from "../../service/session";
import { getDocumentListSPPD } from "../../service/api";
import { CardDokumenListSPPD } from "../../components/CardDokumenListSPPD";
import ListEmpty from "../../components/ListEmpty";
import { Loading } from "../../components/Loading";
import { RefreshControl } from "react-native";

export const DokumenSPPD = () => {
  const navigation = useNavigation();

  const [token, setToken] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getDocumentListSPPD(token));
    }
  }, [token]);

  const { dokumen, loading } = useSelector((state) => state.sppd);

  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const filter = (event) => {
    setSearch(event);
  };

  useEffect(() => {
    setFilterData(dokumen.lists);
  }, [dokumen]);

  useEffect(() => {
    if (search !== "") {
      const data = dokumen.lists?.filter((item) => {
        return item.event.toLowerCase().includes(search.toLowerCase());
      });
      setFilterData(data);
    } else {
      setFilterData(dokumen.lists);
    }
  }, [search]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        dispatch(getDocumentListSPPD(token));
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token]);

  const { device } = useSelector((state) => state.apps);

  return (
    <>
      {loading ? <Loading /> : null}
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
          <TouchableOpacity
            style={{}}
            onPress={() => navigation.navigate("Home")}
          >
            <Ionicons
              name="chevron-back-outline"
              size={device === "tablet" ? 40 : 24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: "center", marginRight: 50 }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H3", device),
              fontWeight: 600,
              color: COLORS.white,
            }}
          >
            Daftar Dokumen
          </Text>
        </View>
      </View>
      <View style={{ paddingVertical: 20 }}>
        <View style={{ paddingHorizontal: "5%" }}>
          <Search
            placeholder={"Cari"}
            onSearch={filter}
            iconColor={COLORS.primary}
          />
        </View>
        <FlatList
          data={filterData}
          renderItem={({ item }) => (
            <View key={item.id}>
              <CardDokumenListSPPD item={item} token={token} device={device} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => <ListEmpty />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          style={{
            height: device === "tablet" ? "88%" : "83%",
            marginTop: 6,
            paddingHorizontal: "5%",
          }}
        />
      </View>
    </>
  );
};
