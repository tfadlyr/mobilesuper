import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Search } from "../../components/Search";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  COLORS,
  PADDING,
  fontSizeResponsive,
  getOrientation,
} from "../../config/SuperAppps";
import { useDispatch, useSelector } from "react-redux";
import { getTokenValue } from "../../service/session";
import {
  getDetailBerita,
  getGallerySatker,
  getSatkerNews,
} from "../../service/api";
import { CardListBeritaHome } from "../../components/CardListBeritaHome";
import { CardListBeritaSatker } from "../../components/CardListBeritaSatker";
import { setBeritaSatker, setGaleriSatker } from "../../store/Satker";
import { ActivityIndicator } from "react-native";
import ListEmpty from "../../components/ListEmpty";
import { RefreshControl } from "react-native";

export const ListBeritaSatker = () => {
  const { berita, gallery, loading } = useSelector((state) => state.satker);
  const navigation = useNavigation();
  const [token, setToken] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [visibleModal, setVisibleModal] = useState(false);
  const [galeriById, setGaleriById] = useState({});
  const dispatch = useDispatch();
  const [filterData, setFilterData] = useState([]);
  const [combineBanner, setCombineBanner] = useState([]);
  const { device } = useSelector((state) => state.apps);

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
    dispatch(setGaleriSatker([]));
    dispatch(setBeritaSatker([]));
    setPage(1);
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getSatkerNews({ token, page }));
      dispatch(getGallerySatker(token));
    }
  }, [token, page]);

  const loadMore = () => {
    if (berita.lists.length !== 0) {
      if (berita.lists.length % 10 === 0) {
        setPage(page + 1);
      }
    }
    if (gallery.results.length !== 0) {
      if (gallery.results.length % 10 === 0) {
        setPage(page + 1);
      }
    }
  };

  const filter = (event) => {
    setSearch(event);
  };

  // useEffect(() => {
  //   setFilterData(berita.lists);
  // }, [berita]);

  useEffect(() => {
    if (search !== "") {
      const data = combineBanner?.filter((item) => {
        return item.title.toLowerCase().includes(search.toLowerCase());
      });
      setFilterData(data);
    } else {
      setFilterData(combineBanner);
    }
  }, [search]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        dispatch(setBeritaSatker([]));
        dispatch(setGaleriSatker([]));
        dispatch(getSatkerNews({ token, page }));
        dispatch(getGallerySatker(token));
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token, page]);

  useEffect(() => {
    if (gallery?.results?.length !== undefined) {
      const dataBerita = berita.lists.map((item) => ({
        id: item?.id,
        title: item?.title,
        image: item?.image,
        time: item.created_at,
        type: "berita",
      }));

      const dataGaleri = gallery?.results.map((item) => ({
        id: item?.id,
        title: item?.title,
        image: item?.main_images?.image,
        time: item?.created_at,
        type: "galeri",
      }));

      // Gabungkan semua data unik menjadi satu array
      const newCombinedData = [...dataBerita, ...dataGaleri];

      // Filter data unik
      const uniqueDataCombine = newCombinedData.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t?.id === item?.id &&
              t?.title === item?.title &&
              t?.image === item?.image &&
              t?.time === item?.time
          )
      );

      // Dapatkan data yang baru bertambah dengan membandingkan array lama dan baru
      const previousData = combineBanner || [];
      const newEntries = uniqueDataCombine.filter(
        (item) =>
          !previousData.some(
            (prevItem) =>
              prevItem.id === item.id &&
              prevItem.title === item.title &&
              prevItem.image === item.image &&
              prevItem.time === item.time
          )
      );

      // Tambahkan data baru ke akhir array combineBanner
      const updatedCombineBanner = [...previousData, ...newEntries];

      setCombineBanner(updatedCombineBanner);
      setFilterData(updatedCombineBanner);
    }
  }, [berita.lists, gallery.results, page]);

  // console.log(combineBanner);

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: "#f7f7f7", flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            backgroundColor: COLORS.primary,
            height: 80,
            paddingBottom: 20,
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
          <View style={{ flex: 1, alignItems: "center", marginRight: 50 }}>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                fontWeight: 600,
                color: COLORS.white,
              }}
            >
              Berita Terkini
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
        {/* <FlatList
          data={filterData}
          renderItem={({ item, index }) => (
            <View key={index}>
              <CardListBeritaSatker
                image={item.image}
                tanggal={item.updated_at}
                // subtitle={item.subtitle}
                title={item.title}
                id={item.id}
                item={item}
                token={token}
                device={device}
              />
            </View>
          )}
          ListEmptyComponent={() => <ListEmpty />}
          ListFooterComponent={() =>
            loading && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 24,
                }}
              >
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            )
          }
          keyExtractor={(item) => item.id}
          onEndReached={
            search === "" && berita.lists.length !== 0 ? loadMore : null
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        /> */}

        <Modal
          animationType="fade"
          transparent={true}
          visible={visibleModal}
          onRequestClose={() => {
            setVisibleModal(false);
            setGaleriById({});
          }}
        >
          <TouchableOpacity
            style={[
              Platform.OS === "ios"
                ? styles.iOSBackdrop
                : styles.androidBackdrop,
              styles.backdrop,
            ]}
          />
          <View
            style={{
              alignItems: "center",
              flex: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <View>
              <TouchableOpacity
                onPress={() => {
                  setVisibleModal(false);
                  setGaleriById(gallery?.results?.id);
                }}
              >
                <Image
                  source={!galeriById ? {} : { uri: galeriById?.image }}
                  style={{
                    width:
                      device === "tablet" && orientation === "landscape"
                        ? 900
                        : device === "tablet" && orientation === "potrait"
                        ? 800
                        : 390,
                    height:
                      device === "tablet" && orientation === "landscape"
                        ? 900
                        : device === "tablet" && orientation === "potrait"
                        ? 800
                        : 283,
                    resizeMode: "contain",
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <FlatList
            key={"#"}
            data={filterData}
            renderItem={({ item }) => (
              <CardListBeritaSatker
                image={item.image}
                tanggal={item.time}
                // subtitle={item.subtitle}
                title={item.title}
                id={item.id}
                item={item}
                token={token}
                device={device}
                onclick={() => {
                  setVisibleModal(true);
                  setGaleriById(item);
                }}
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
  iOSBackdrop: {
    backgroundColor: "#000000",
    opacity: 0.3,
  },
  androidBackdrop: {
    backgroundColor: "#232f34",
    opacity: 0.32,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
