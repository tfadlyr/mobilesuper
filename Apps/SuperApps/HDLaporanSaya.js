import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { Search } from "../../components/Search";
import { useDispatch, useSelector } from "react-redux";
import { CardListHelpDesk } from "../../components/CardListHelpDesk";
import { getTicket } from "../../service/api";
import { setTiket } from "../../store/HelpDesk";
import { getTokenValue } from "../../service/session";
import ListEmpty from "../../components/ListEmpty";

export const HDLaporanSaya = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { tiket } = useSelector((state) => state.helpDesk);
  const { profile } = useSelector((state) => state.superApps);
  const [token, setToken] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const filter = (event) => {
    setSearch(event);
  };

  useEffect(() => {
    setFilterData(tiket.list);
  }, [tiket]);

  useEffect(() => {
    if (search !== "") {
      const data = tiket.list?.filter((item) => {
        return item.part_name.toLowerCase().includes(search.toLowerCase());
      });
      setFilterData(data);
    } else {
      setFilterData(tiket.list);
    }
  }, [search]);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        dispatch(getTicket({ nip, token }));
      }
    } catch (error) {
    }

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [nip, token]);

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      nip = profile.nip;
      dispatch(getTicket({ nip, token }));
    }
  }, [token]);

  const { device } = useSelector((state) => state.apps);

  return (
    <>
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
            width: 28,
            height: 28,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
          }}
        >
          <TouchableOpacity style={{}} onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-outline"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H3", device),
              fontWeight: 600,
              color: COLORS.white,
              marginRight: 50,
            }}
          >
            Laporan Saya
          </Text>
        </View>
      </View>

      <View
        style={{
          height: "100%",
          width: "100%",
          alignItems: "center",
        }}
      >
        <View style={{ width: "90%", marginTop: "5%" }}>
          <Search
            placeholder={"Cari..."}
            iconColor={COLORS.primary}
            onSearch={filter}
          />
        </View>
        <View style={{ width: "90%" }}>
          <FlatList
            data={filterData}
            keyExtractor={(item) => item?.id}
            renderItem={({ item }) => (
              <View key={item?.id}>
                <CardListHelpDesk item={item} device={device} />
              </View>
            )}
            ListEmptyComponent={() => <ListEmpty />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            style={{ height: "70%" }}
          />
        </View>
      </View>
    </>
  );
};
