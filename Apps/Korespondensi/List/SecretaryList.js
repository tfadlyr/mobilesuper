import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import { Button, Chip, IconButton, Searchbar } from "react-native-paper";
import { GlobalStyles } from "../../../constants/styles";
import { nde_api } from "../../../utils/api.config";
import { getHTTP, handlerError } from "../../../utils/http";
import CardSecretary from "../../../components/UI/CardSecretary";
import { useDispatch } from "react-redux";
import { removeAll } from "../../../store/addressbook";
import LottieView from "lottie-react-native";
import { Config } from "../../../constants/config";
import { initData } from "../../../utils/list";
import { logout } from "../../../store/auth";
import { COLORS } from "../../../config/SuperAppps";
import * as Sentry from "@sentry/react-native";

function SecretaryList() {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchFilter, setIsSearchFilter] = useState(false);
  const [isSearchQuery, setIsSearchQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [add, setAdd] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const animation = useRef(null);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [])
  );

  useEffect(() => {
    getProfileTitle();
    filter(1);
  }, [isSearchFilter]);

  async function getSecretary(page) {
    setIsLoading(true);
    try {
      setIsSearchFilter(false);
      let response;
      response = await getHTTP(nde_api.secretary + "?page=" + page);
      let data;
      data = initData(list, response.data);
      setList(data);
      setIsLoading(false);
    } catch (error) {
      setIsSearchFilter(false);
      if (error?.response?.status == 401 || error?.status == 401) {
        Sentry.captureEvent(error?.response);
        dispatch(logout());
      } else {
        handlerError(error, "Peringatan!", "Sekretaris tidak berfungsi");
      }
      setIsLoading(false);
    }
  }
  async function getProfileTitle() {
    setIsLoading(true);
    try {
      //get profile title: untuk cek punya jabatan atau hanya poh, untuk add delegasi dan sekretaris
      const response = await getHTTP(nde_api.profiletitle);
      if (response.data.status) {
        response?.data?.title.forEach((e) => {
          if (e.poh == false) {
            setAdd(true);
          }
        });
      }
      setIsLoading(false);
    } catch (error) {
      Alert.alert("Info!", "User title data not working!");
      setIsLoading(false);
    }
  }

  const listEmpty = (
    <View style={styles.notFound}>
      <LottieView
        autoPlay
        ref={animation}
        style={[styles.titleNotFound, { width: "100%", height: 200 }]}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={Config.notFound}
      />
      <Text style={styles.titleNotFound}>
        {isLoading
          ? "Pencarian..."
          : isSearchFilter
          ? "Sekretaris tidak ditemukan"
          : list?.count == 0
          ? "Tidak ada sekretaris"
          : "Pencarian..."}
      </Text>
    </View>
  );
  const renderItem = ({ item }) => (
    <>
      {item.children.map((data) => (
        <CardSecretary
          key={data.id}
          data={data}
          onPress={() => {
            navigation.navigate("SecretaryDetail", {
              id: data.id,
              title: "Detail Sekretaris",
            });
          }}
        />
      ))}
    </>
  );

  async function filter(page) {
    setIsLoading(true);
    try {
      if (searchQuery.length == 0) {
        getSecretary(1);
      } else {
        setIsSearchQuery(searchQuery);
        let word;
        if (searchQuery.length == 0) {
          word = "";
        } else {
          word = searchQuery;
        }
        let url = nde_api.secretary + "?";
        url = url + "page=" + page + "&search=" + word;
        let response;
        response = await getHTTP(url);
        if (response) {
          let data;
          data = initData(list, response.data);
          setList(data);
          if (!isSearchFilter) {
            setIsSearchFilter(true);
          }
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsSearchFilter(false);
      setIsLoading(false);
    }
  }
  function refresh() {
    setIsLoading(true);
    setList([]);
    getSecretary(1);
    setSearchQuery("");
    setIsSearchQuery("");
    setIsLoading(false);
  }
  const clearSearch = () => (
    <>
      {searchQuery.length > 0 && <IconButton icon="close" onPress={refresh} />}
    </>
  );
  function loadMore() {
    if (list?.next != null) {
      if (isSearchFilter) {
        filter(list?.next);
      } else {
        getSecretary(list?.next);
      }
    }
  }
  return (
    <>
      <View style={{ flex: 1 }}>
        {/* <SearchFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          clearSearch={clearSearch}
          showBottomFilter={showBottomFilter}
          getSearch={filter}
        /> */}
        <Searchbar
          placeholder="Cari..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onIconPress={() => {
            setList([]);
            filter(1);
          }}
          onSubmitEditing={() => {
            setList([]);
            filter(1);
          }}
          clearIcon={clearSearch}
        />
        {isSearchFilter && (
          <View
            style={{
              flexDirection: "row",
              backgroundColor: GlobalStyles.colors.textWhite,
            }}
          >
            <Text style={styles.headerList}>Cari : </Text>
            <View>
              {isSearchQuery && (
                <Chip mode="outlined" onClose={refresh} closeIcon="close">
                  {isSearchQuery}
                </Chip>
              )}
            </View>
          </View>
        )}
        <FlatList
          data={list?.results}
          renderItem={renderItem}
          ListEmptyComponent={listEmpty}
          refreshing={isLoading}
          onRefresh={refresh}
          onEndReached={loadMore}
          style={[
            { paddingHorizontal: 16, marginTop: 8 },
            add ? { marginBottom: 65 } : {},
          ]}
        />

        {add && (
          <View style={styles.footer}>
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                dispatch(removeAll());
                navigation.navigate("SecretaryForm", {
                  title: "Buat Sekretaris",
                });
              }}
            >
              Tambah Sekretaris
            </Button>
          </View>
        )}
      </View>
    </>
  );
}

export default SecretaryList;

const styles = StyleSheet.create({
  notFound: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  titleNotFound: {
    textAlign: "center",
    paddingVertical: 32,
    color: GlobalStyles.colors.primary,
  },
  containerRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: GlobalStyles.colors.textWhite,
  },
  headerList: {
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: "rgba(151, 151, 151, 0.25)",
  },
  button: {
    backgroundColor: COLORS.primary,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    padding: 16,
    paddingBottom: 16,
    backgroundColor: "white",
  },
});
