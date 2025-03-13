import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  COLORS,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import ListEmpty from "../../components/ListEmpty";
import { getTokenValue } from "../../service/session";
import { getListSertifikatEksternal } from "../../service/api";
import { Loading } from "../../components/Loading";
import { CardListSertifikatEksternal } from "../../components/CardListSertifikatEksternal.js";

export const SertifikatEksternal = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [token, setToken] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const { device } = useSelector((state) => state.apps);
  const { profile } = useSelector((state) => state.superApps);

  const scrollRef = useRef(null);
  const [page, setPage] = useState(1);
  const [tipe, setTipe] = useState(
    profile?.nip === "197908162002121003" ? " " : "personal"
  );

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  console.log(tipe);

  useEffect(() => {
    dispatch(
      getListSertifikatEksternal({ token: token, page: page, tipe: tipe })
    );
  }, [token]);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        dispatch(getListSertifikatEksternal({ token: token, page: page }));
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token, page]);

  const loadMore = () => {
    if (eksternal?.lists?.length !== 0) {
      if (eksternal?.lists?.length % 5 === 0) {
        setPage(page + 1);
        if (scrollRef) {
          scrollRef.current.scrollToIndex({ animated: false, index: 0 });
        }
      }
    }
  };

  const { eksternal, loading } = useSelector((state) => state.digitalsign);

  return (
    <View>
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
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Ionicons
              name="chevron-back-outline"
              size={device === "tablet" ? 40 : 24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H1", device),
              fontWeight: FONTWEIGHT.bold,
              color: COLORS.white,
              marginRight: 50,
            }}
          >
            Sertifikat Eksternal
          </Text>
        </View>
      </View>

      <FlatList
        data={eksternal.lists}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <View key={item?.id}>
            <CardListSertifikatEksternal
              item={item}
              token={token}
              device={device}
            />
          </View>
        )}
        onEndReached={loadMore}
        ref={scrollRef}
        ListEmptyComponent={() => <ListEmpty />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ height: "90%" }}
      />
    </View>
  );
};
