import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {} from "react-native-safe-area-context";
import {
  AVATAR,
  COLORS,
  FONTWEIGHT,
  PADDING,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { Search } from "../../components/Search";
import { useDispatch, useSelector } from "react-redux";
import { setPegawai } from "../../store/Pegawai";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native";
import ListEmpty from "../../components/ListEmpty";
import { Platform } from "react-native";
import { getTokenValue } from "../../service/session";
import { getDetailPegawai, getPegawai } from "../../service/api";
import { CardListPegawai } from "../../components/CardListPegawai";
import { Loading } from "../../components/Loading";
import Spinner from "react-native-loading-spinner-overlay";
import { StatusBar } from "expo-status-bar";

export const ListPegawai = () => {
  const dispatch = useDispatch();
  const [collapse, setCollapse] = useState({
    nip: "",
    toggle: false,
  });
  // useEffect(() => {
  //     dispatch(setPegawai(dataPegawai))
  // }, []);
  const [token, setToken] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
    dispatch(setPegawai([]));
    setPage(0);
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getPegawai({ token, page, search }));
      console.log(page, "page");
    }
  }, [token, search, page]);

  const { pegawai, loading } = useSelector((state) => state.Pegawai);
  const { device } = useSelector((state) => state.apps);

  // const filter = (event) => {
  //     setSearch(event)
  // }

  useEffect(() => {
    setFilterData(pegawai.lists);
  }, [pegawai]);

  useEffect(() => {
    if (search !== "") {
      const data = pegawai.lists.filter((item) => {
        return item.nama.toLowerCase().includes(search.toLowerCase());
      });
      setFilterData(data);
    } else {
      setFilterData(pegawai.lists);
    }
  }, [search]);

  const loadMore = () => {
    if (filterData.length !== 0 && inputValue === "") {
      if (filterData.length % 10 === 0) {
        setPage(page + 1);
        // console.log(page);
      }
    }
  };

  // useEffect(() => {
  //   setFilterData(pegawai.lists);
  // }, [pegawai]);

  useEffect(() => {
    if (search !== "") {
      const data = pegawai.lists?.filter((item) => {
        return item.nama.toLowerCase().includes(search.toLowerCase());
      });
      setFilterData(data);
      if (data.length === 0) {
      }
    } else {
      setFilterData(pegawai.lists);
    }
  }, [search, pegawai]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        dispatch(getPegawai({ token, page, search }));
        console.log(page, "page");
        console.log("Refresh Berhasil");
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token, page]);

  const navigation = useNavigation();

  const [ascending, setAscending] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const asc = () => {
    const sortedAscending = filterData
      .slice()
      .sort((a, b) => a.nama.localeCompare(b.nama));
    setFilterData(sortedAscending);
    setAscending(true);
    setIsFiltered(true);
  };

  const desc = () => {
    const sortedDescending = filterData
      .slice()
      .sort((a, b) => b.nama.localeCompare(a.nama));
    setFilterData(sortedDescending);
    setAscending(false);
    setIsFiltered(true);
  };

  const filter = () => {
    setIsFiltered(false);
    setSearch(inputValue);
  };

  return (
    <>
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
            <TouchableOpacity style={{}} onPress={() => navigation.goBack()}>
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
                fontSize: fontSizeResponsive("H1", device),
                fontWeight: 600,
                color: COLORS.white,
              }}
            >
              Pegawai
            </Text>
          </View>
        </View>

        <View style={{}}>
          <View
            style={{
              flexDirection: "row",
              marginVertical: 20,
              alignItems: "center",
              marginHorizontal: "5%",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                width: "85%",
                borderRadius: 8,
                backgroundColor: COLORS.white,
              }}
            >
              <View style={styles.input}>
                <Ionicons
                  name="search"
                  size={fontSizeResponsive("H3", device)}
                  color={COLORS.primary}
                />
                <TextInput
                  placeholder={"Cari..."}
                  style={{
                    fontSize: fontSizeResponsive("H4", device),
                    flex: 1,
                  }}
                  maxLength={30}
                  value={inputValue}
                  onChangeText={(text) => setInputValue(text)}
                  onEndEditing={filter}
                  clearButtonMode="always"
                  allowFontScaling={false}
                />
              </View>
            </View>
            <TouchableOpacity onPress={!ascending ? asc : desc}>
              <View
                style={{
                  width: device === "tablet" ? 60 : 40,
                  height: device === "tablet" ? 60 : 40,
                  borderRadius: 30,
                  backgroundColor: COLORS.white,
                  justifyContent: "center",
                  alignItems: "center",
                  borderColor: COLORS.secondaryLighter,
                  borderWidth: isFiltered ? 1 : 0,
                }}
              >
                <Ionicons
                  name="filter-outline"
                  size={device === "tablet" ? 40 : 24}
                />
              </View>
            </TouchableOpacity>
          </View>
          <FlatList
            data={filterData}
            renderItem={({ item }) => (
              <CardListPegawai
                item={item}
                collapse={collapse}
                setCollapse={setCollapse}
                navigation={navigation}
                token={token}
                loading={loading}
                device={device}
              />
            )}
            // style={{ flex: 1 }}
            // ListFooterComponent={() =>
            //   loading && (
            //     <View
            //       style={{ justifyContent: "center", alignItems: "center" }}
            //     >
            //       <ActivityIndicator size="large" color={COLORS.primary} />
            //     </View>
            //   )
            // }
            ListFooterComponent={() =>
              loading === true ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 24,
                  }}
                >
                  <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
              ) : null
            }
            keyExtractor={(item) => item.id}
            // scrollEnabled={true}
            onEndReached={filterData.length !== 0 ? loadMore : null}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={() => <ListEmpty />}
            style={{ height: "75%" }}
          />
          {/* {loading && <Loading />} */}
        </View>
      </>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.ExtraDivinder,
    borderRadius: 8,
  },
  card: {
    marginHorizontal: 20,
    borderRadius: 8,
    width: 362,
  },
  cardCollapse: {
    backgroundColor: "#fff",
    width: 362,
  },
});
