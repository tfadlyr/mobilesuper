import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
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
import { getBerita, getDetailBerita, getGaleri } from "../../service/api";
import { CardListBeritaHome } from "../../components/CardListBeritaHome";
import { ActivityIndicator } from "react-native";
import { setBerita, setGaleri, setLoading } from "../../store/SuperApps";
import ListEmpty from "../../components/ListEmpty";
import { RefreshControl } from "react-native";
import { Loading } from "../../components/Loading";
import YoutubePlayer from "react-native-youtube-iframe";

export const ListBanner = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [pageGaleri, setPageGaleri] = useState(1);
  const [combineBanner, setCombineBanner] = useState([]);
  const [modalVisibleVideo, setModalVisibleVideo] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [galeriById, setGaleriById] = useState({});
  const { berita, galeri, loading } = useSelector((state) => state.superApps);
  const { device } = useSelector((state) => state.apps);

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
    dispatch(setBerita([]));
    dispatch(setGaleri([]));
    setFilterData([]);
    setPage(1);
  }, []);

  useEffect(() => {
    dispatch(setLoading(""));
    if (token !== "") {
      dispatch(getBerita({ token, page }));
      dispatch(getGaleri({ token, pageGaleri }));
    }
  }, [token, page]);

  const loadMore = () => {
    if (berita?.lists.length !== 0) {
      if (berita.lists.length % 10 === 0) {
        setPage(page + 1);
      }
    }
    if (galeri?.lists.length !== 0) {
      if (galeri.lists.length % 10 === 0) {
        setPageGaleri(pageGaleri + 1);
      }
    }
  };

  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const filter = (event) => {
    setSearch(event);
  };

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
        dispatch(setBerita([]));
        dispatch(setGaleri([]));
        dispatch(getBerita({ token, page }));
        dispatch(getGaleri({ token, pageGaleri }));
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token, page]);

  //   useEffect(() => {
  //     const dataVideo = [
  //       {
  //         title:
  //           "Menteri Trenggono Melakukan Panen Parsial Kedua di BUBK Kebumen",
  //         image: require("../../assets/superApp/hq720.webp"),
  //         time: "",
  //         type: "video",
  //       },
  //     ];
  //     const dataBerita = berita.lists.map((item) => ({
  //       id: item?.id,
  //       title: item?.title,
  //       image: item?.image,
  //       time: item.created_at,
  //       type: "berita",
  //     }));

  //     const uniqueDataCombineBerita = dataBerita.filter(
  //       (item, index, self) =>
  //         index ===
  //         self.findIndex(
  //           (t) =>
  //             t?.id === item?.id &&
  //             t?.title === item?.title &&
  //             t?.image === item?.image &&
  //             t?.created_at === item?.created_at
  //         )
  //     );

  //     const dataGaleri = galeri.lists.map((item) => ({
  //       id: item?.id,
  //       title: item?.title,
  //       image: item?.main_images?.image,
  //       time: item?.created_at,
  //       type: "galeri",
  //     }));

  //     const uniqueDataCombineGaleri = dataGaleri.filter(
  //       (item, index, self) =>
  //         index ===
  //         self.findIndex(
  //           (t) =>
  //             t?.id === item?.id &&
  //             t.title === item.title &&
  //             t?.main_images?.image === item?.main_images?.image &&
  //             t?.created_at === item?.created_at
  //         )
  //     );

  //     setCombineBanner([
  //       ...dataVideo,
  //       ...uniqueDataCombineBerita,
  //       ...uniqueDataCombineGaleri,
  //     ]);
  //     if (filterData.length === 0) {
  //       setFilterData([
  //         ...dataVideo,
  //         ...uniqueDataCombineBerita,
  //         ...uniqueDataCombineGaleri,
  //       ]);
  //     } else {
  //       const perubahan = filterData.filter(
  //         (item, index) => item !== combineBanner[index]
  //       );
  //       console.log(perubahan, "per");
  //     }
  //   }, [berita.lists, galeri.lists, page, pageGaleri]);

  useEffect(() => {
    const dataVideo = [
      {
        title:
          "Menteri Trenggono Melakukan Panen Parsial Kedua di BUBK Kebumen",
        image: require("../../assets/superApp/hq720.webp"),
        time: "",
        type: "video",
      },
    ];

    const dataBerita = berita.lists.map((item) => ({
      id: item?.id,
      title: item?.title,
      image: item?.image,
      time: item.created_at,
      type: "berita",
    }));

    const dataGaleri = galeri.lists.map((item) => ({
      id: item?.id,
      title: item?.title,
      image: item?.main_images?.image,
      time: item?.created_at,
      type: "galeri",
    }));

    // Gabungkan semua data unik menjadi satu array
    const newCombinedData = [...dataVideo, ...dataBerita, ...dataGaleri];

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
  }, [berita.lists, galeri.lists, page, pageGaleri]);

  //   console.log(combineBanner);

  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      //   Alert.alert("video has finished playing!");
    }
  }, []);

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

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
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisibleVideo}
          onRequestClose={() => {
            setModalVisibleVideo(!modalVisibleVideo);
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
            <TouchableOpacity
              onPress={() => {
                setModalVisibleVideo(false);
              }}
              style={{
                position: "absolute",
                top: "15%",
                left: 20,
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.primary,
                  width: 51,
                  height: 51,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 50,
                }}
              >
                <Ionicons name="close-outline" color={COLORS.white} size={24} />
              </View>
            </TouchableOpacity>
            <View
              style={{
                width: device === "tablet" ? 700 : 380,
                height: device === "tablet" ? 500 : 283,
              }}
            >
              <YoutubePlayer
                height={useWindowDimensions().height}
                play={playing}
                videoId={"tV6yMXX2hPs"}
                onChangeState={onStateChange}
              />
            </View>
          </View>
        </Modal>

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
                  setGaleriById(galeri.lists.id);
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
              <CardListBeritaHome
                image={item.image}
                tanggal={item.time}
                // subtitle={item.subtitle}
                title={item.title}
                id={item.id}
                item={item}
                token={token}
                setModalVisibleVideo={setModalVisibleVideo}
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
