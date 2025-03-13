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
  fontSizeResponsive,
  getOrientation,
  PADDING,
} from "../../config/SuperAppps";
import { useDispatch, useSelector } from "react-redux";
import { CardListGaleriHome } from "../../components/CardListGaleriHome";
import { getTokenValue } from "../../service/session";
import { setGaleri, setLoading } from "../../store/SuperApps";
import { getGaleri } from "../../service/api";
import { ActivityIndicator } from "react-native";
import ListEmpty from "../../components/ListEmpty";
import { RefreshControl } from "react-native";
import { Loading } from "../../components/Loading";

export const ListGaleri = () => {
  const { galeri, loading } = useSelector((state) => state.superApps);
  const { device } = useSelector((state) => state.apps);
  const navigation = useNavigation();
  const [visibleModal, setVisibleModal] = useState(false);
  const [galeriById, setGaleriById] = useState({});
  const [page, setPage] = useState(1);
  const [token, setToken] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
    dispatch(setGaleri([]));
    setPage(1);
  }, []);

  useEffect(() => {
    dispatch(setLoading(""));
    setFilterData([]);
    if (token !== "") {
      dispatch(getGaleri({ token, page }));
    }
  }, [token, page]);

  const loadMore = () => {
    if (galeri.lists.length !== 0) {
      if (galeri.lists.length % 10 === 0) {
        setPage(page + 1);
      }
    }
  };

  const filter = (event) => {
    setSearch(event);
  };

  useEffect(() => {
    setFilterData(galeri.lists);
  }, [galeri]);

  useEffect(() => {
    const item = galeri.lists;
    if (search !== "") {
      const data = item.filter((item) => {
        return item.title.toLowerCase().includes(search.toLowerCase());
      });
      setFilterData(data);
    } else {
      setFilterData(item);
    }
  }, [search]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        dispatch(setGaleri([]));
        dispatch(getGaleri({ token, page }));
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token, page]);

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
              Galeri
            </Text>
          </View>
        </View>
        <View style={{ width: "90%", marginLeft: 20, marginVertical: 20 }}>
          <Search
            placeholder={"Cari"}
            iconColor={COLORS.primary}
            onSearch={filter}
          />
        </View>
        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <FlatList
            key={"#"}
            data={filterData}
            renderItem={({ item }) => (
              <CardListGaleriHome
                image={item.main_images?.image}
                deskripsi={item.main_images.title}
                onclick={() => {
                  setVisibleModal(true);
                  setGaleriById(item);
                }}
              />
            )}
            li
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
              search === "" && galeri.lists.length !== 0 ? loadMore : null
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      </View>

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
            Platform.OS === "ios" ? styles.iOSBackdrop : styles.androidBackdrop,
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
                source={
                  !galeriById ? {} : { uri: galeriById.main_images?.image }
                }
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
    width: 150,
    borderRadius: 16,
  },
  imageAndroid: {
    height: 193,
    width: 150,
    borderRadius: 16,
  },
  iOSBackdrop: {
    backgroundColor: "#000000",
    opacity: 0.7,
  },
  androidBackdrop: {
    backgroundColor: "#232f34",
    opacity: 0.7,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
