import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Search } from "../../components/Search";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { COLORS, PADDING, fontSizeResponsive } from "../../config/SuperAppps";
import { useDispatch, useSelector } from "react-redux";
import { getTokenValue } from "../../service/session";
import { getBerita, getDetailBerita } from "../../service/api";
import { CardListBeritaHome } from "../../components/CardListBeritaHome";
import { ActivityIndicator } from "react-native";
import { setBerita, setLoading } from "../../store/SuperApps";
import ListEmpty from "../../components/ListEmpty";
import { RefreshControl } from "react-native";
import { Loading } from "../../components/Loading";

export const ListBerita = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const { berita, loading } = useSelector((state) => state.superApps);
  const { device } = useSelector((state) => state.apps);

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
    dispatch(setBerita([]));
    setPage(1);
  }, []);

  useEffect(() => {
    dispatch(setLoading(""));
    if (token !== "") {
      dispatch(getBerita({ token, page }));
    }
  }, [token, page]);

  const loadMore = () => {
    if (berita?.lists.length !== 0) {
      if (berita.lists.length % 10 === 0) {
        setPage(page + 1);
      }
    }
  };

  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const filter = (event) => {
    setSearch(event);
  };

  useEffect(() => {
    setFilterData(berita.lists);
  }, [berita]);

  useEffect(() => {
    if (search !== "") {
      const data = berita.lists?.filter((item) => {
        return item.title.toLowerCase().includes(search.toLowerCase());
      });
      setFilterData(data);
    } else {
      setFilterData(berita.lists);
    }
  }, [search]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        dispatch(setBerita([]));
        dispatch(getBerita({ token, page }));
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token, page]);

  return (
    <View style={{ flex: 1 }}>
      {loading ? <Loading /> : null}
      <View style={{ backgroundColor: COLORS.bgLightGrey, flex: 1 }}>
        <View
          style={{
            backgroundColor: COLORS.primary,
            height: "10%",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 20,
                backgroundColor: "white",
                height: device === "tablet" ? 46 : 28,
                width: device === "tablet" ? 46 : 28,
                borderRadius: 50,
              }}
            >
              <Ionicons
                name="chevron-back"
                size={device === "tablet" ? 40 : 24}
                color={COLORS.primary}
              />
            </View>
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 40,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: fontSizeResponsive("H1", device),
                fontWeight: 600,
              }}
            >
              Berita
            </Text>
          </View>
        </View>
        <View style={{ padding: PADDING.Page, alignItems: "center" }}>
          <Search
            placeholder={"Cari"}
            iconColor={COLORS.primary}
            onSearch={filter}
          />
        </View>
        {/* <View style={{ flex: 1, paddingHorizontal: PADDING.Page }}>
          <FlatList
            data={filterData}
            renderItem={({ item, index }) => (
              <View key={index}>
                <CardListBeritaHome
                  image={item.image}
                  tanggal={item.updated_at}
                  // subtitle={item.subtitle}
                  title={item.title}
                  id={item.id}
                  item={item}
                  token={token}
                />
              </View>
            )}
            ListEmptyComponent={() => <ListEmpty />}
            style={{ flex: 1 }}
            // ListFooterComponent={() =>
            //   loading && (
            //     <View
            //       style={{
            //         justifyContent: "center",
            //         alignItems: "center",
            //         padding: 24,
            //       }}
            //     >
            //       <ActivityIndicator size="large" color={COLORS.primary} />
            //     </View>
            //   )
            // }
            keyExtractor={(item) => item.id}
            onEndReached={
              search === "" && berita.lists.length !== 0 ? loadMore : null
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View> */}
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <FlatList
            key={"#"}
            data={filterData}
            renderItem={({ item }) => (
              <CardListBeritaHome
                image={item.image}
                tanggal={item.updated_at}
                // subtitle={item.subtitle}
                title={item.title}
                id={item.id}
                item={item}
                token={token}
              />
            )}
            ListEmptyComponent={() =>
              loading !== "" || (loading === true && <ListEmpty />)
            }
            // ListFooterComponent={() =>
            //   loading && (
            //     <View
            //       style={{
            //         justifyContent: "center",
            //         alignItems: "center",
            //         padding: 24,
            //       }}
            //     >
            //       <ActivityIndicator size="large" color={COLORS.primary} />
            //     </View>
            //   )
            // }
            numColumns={2}
            keyExtractor={(item) => "#" + item.id}
            onEndReached={
              search === "" && berita.lists.length !== 0 ? loadMore : null
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
        {/* <FlatList
          data={filterData}
          renderItem={({ item, index }) => (
            <View key={index}>
              <Item
                image={item.image}
                tanggal={item.updated_at}
                // subtitle={item.subtitle}
                title={item.title}
                id={item.id}
                item={item}
                token={token}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backIcon: {
    backgroundColor: "white",
    height: 28,
    width: 28,
    borderRadius: 50,
  },
  imageIos: {
    height: 193,
    width: 350,
    borderRadius: 16,
  },
  imageAndroid: {
    height: 193,
    width: 369,
    borderRadius: 16,
  },
});
