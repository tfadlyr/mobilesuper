import React, { useEffect } from "react";
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AVATAR,
  COLORS,
  DATETIME,
  DateFormat,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
  getOrientation,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { getTokenValue } from "../../service/session";
import { TabView, SceneMap } from "react-native-tab-view";
import { Search } from "../../components/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  getDetailLinimasa,
  getMyPostDetail,
  getMyPostList,
  getViewLinimasa,
} from "../../service/api";
import { FlatList } from "react-native";
import ListEmpty from "../../components/ListEmpty";
import { setRefresh } from "../../store/Pengetahuan";
import { Loading } from "../../components/Loading";
import { ActivityIndicator } from "react-native";
import { RefreshControl } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const CardPostinganSaya = ({ item, token, device }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const getDetail = (id) => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getDetailLinimasa(params));
    dispatch(getViewLinimasa(params));
  };

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  return (
    <View style={{ width: "100%", alignSelf: "center", marginVertical: 10 }}>
      {item.state === "draft" || item.state === "canceled" ? (
        <TouchableOpacity disabled>
          <View
            key={item.id}
            style={{
              backgroundColor: COLORS.secondaryLighter,
              shadowOffset: { width: -2, height: 4 },
              shadowColor: "#171717",
              shadowOpacity: 0.2,
              elevation: 2,
              borderRadius: 8,
              // height: 130,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 10,
                paddingTop: 20,
                paddingBottom: 10,
                marginVertical: 5,
                display: "flex",
              }}
            >
              <View style={{ justifyContent: "center" }}>
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    padding: 2,
                    borderRadius: 6,
                    //shadow ios
                    shadowOffset: { width: -2, height: 4 },
                    shadowColor: "#171717",
                    shadowOpacity: 0.2,
                    //shadow android
                    elevation: 2,
                  }}
                >
                  <Image
                    source={{ uri: item?.cover }}
                    style={{ height: 38, width: 70, borderRadius: 6 }}
                  />
                </View>
              </View>
              <View
                style={{
                  marginHorizontal: 10,
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    // width: 270,
                    fontSize: fontSizeResponsive("H4", device),
                    fontWeight: FONTWEIGHT.bold,
                    textAlign: "justify",
                    marginBottom: 5,
                    maxWidth: wp(55),
                  }}
                  numberOfLines={3} // Limit the number of lines to 1
                  ellipsizeMode="tail" // Display "..." at the end if text overflows
                >
                  {item.title}
                </Text>
                <View
                  style={{
                    marginVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#6B7280",
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Tanggal :
                    {DateFormat({
                      date: item.created_at,
                      fromDate: DATETIME.LONG_DATETIME,
                      toDate: DATETIME.LONG_DATE,
                    })}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "#6B7280",
                        fontSize: fontSizeResponsive("H4", device),
                        marginEnd: 5,
                      }}
                    >
                      Poin :
                    </Text>
                    <View
                      style={{
                        backgroundColor: COLORS.success,
                        borderRadius: 8,
                        paddingVertical: 4,
                        paddingHorizontal: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFFFFF",
                          textAlign: "center",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        {item.score}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H4", device),
                    color: "#6B7280",
                    marginBottom: 5,
                  }}
                >
                  Komentar:{" "}
                  {item?.comment_is_penilai[0]?.message === undefined
                    ? "-"
                    : item?.comment_is_penilai[0]?.message}
                </Text>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        borderRadius: 8,
                        width: 33,
                        height: 26,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name="thumbs-up-outline"
                        size={18}
                        color={COLORS.grey}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H4", device),
                        color: COLORS.primary,
                        marginStart: 5,
                      }}
                    >
                      {item.likes_count}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="chatbox-ellipses-outline"
                      size={18}
                      color={COLORS.grey}
                    />
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H4", device),
                        marginStart: 5,
                      }}
                    >
                      {item.comment_count}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="eye-outline"
                      size={18}
                      color={COLORS.grey}
                    />
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H4", device),
                        marginStart: 5,
                      }}
                    >
                      {item.views_count}
                    </Text>
                  </View>

                  {item?.state === "publish" ? (
                    <View
                      style={{
                        backgroundColor: COLORS.successLight,
                        borderRadius: 20,
                        paddingHorizontal: 16,
                        paddingVertical: 4,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.success,
                          textAlign: "center",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Publish
                      </Text>
                    </View>
                  ) : item?.state === "draft" ? (
                    <View
                      style={{
                        backgroundColor: "#f0f0f0",
                        borderRadius: 20,
                        paddingHorizontal: 16,
                        paddingVertical: 4,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.grey,
                          textAlign: "center",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Draft
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        backgroundColor: COLORS.infoDangerLight,
                        borderRadius: 20,
                        paddingHorizontal: 16,
                        paddingVertical: 4,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.infoDanger,
                          textAlign: "center",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Canceled
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            getDetail(item.id);
            navigation.navigate("DetailLinimasa", item.like_list);
          }}
        >
          <View
            key={item.id}
            style={{
              backgroundColor: COLORS.secondaryLighter,
              shadowOffset: { width: -2, height: 4 },
              shadowColor: "#171717",
              shadowOpacity: 0.2,
              elevation: 2,
              borderRadius: 8,
              // height: 130,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 10,
                paddingTop: 20,
                paddingBottom: 10,
                marginVertical: 5,
                display: "flex",
              }}
            >
              <View style={{ justifyContent: "center" }}>
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    padding: 2,
                    borderRadius: 6,
                    //shadow ios
                    shadowOffset: { width: -2, height: 4 },
                    shadowColor: "#171717",
                    shadowOpacity: 0.2,
                    //shadow android
                    elevation: 2,
                  }}
                >
                  <Image
                    source={{ uri: item?.cover }}
                    style={{ height: 38, width: 70, borderRadius: 6 }}
                  />
                </View>
              </View>
              <View
                style={{
                  marginHorizontal: 10,
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    // width: 270,
                    fontSize: fontSizeResponsive("H4", device),
                    fontWeight: FONTWEIGHT.bold,
                    textAlign: "justify",
                    marginBottom: 5,
                    maxWidth: wp(55),
                  }}
                  numberOfLines={3} // Limit the number of lines to 1
                  ellipsizeMode="tail" // Display "..." at the end if text overflows
                >
                  {item.title}
                </Text>
                <View
                  style={{
                    marginVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#6B7280",
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Tanggal :
                    {DateFormat({
                      date: item.created_at,
                      fromDate: DATETIME.LONG_DATETIME,
                      toDate: DATETIME.LONG_DATE,
                    })}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "#6B7280",
                        fontSize: fontSizeResponsive("H4", device),
                        marginEnd: 5,
                      }}
                    >
                      Poin :
                    </Text>
                    <View
                      style={{
                        backgroundColor: COLORS.success,
                        borderRadius: 8,
                        paddingVertical: 4,
                        paddingHorizontal: 16,
                      }}
                    >
                      <Text
                        style={{
                          color: "#FFFFFF",
                          textAlign: "center",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        {item.score}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text
                  style={{
                    fontSize: fontSizeResponsive("H4", device),
                    color: "#6B7280",
                    marginBottom: 5,
                  }}
                >
                  Komentar:{" "}
                  {item?.comment_is_penilai[0]?.message === undefined
                    ? "-"
                    : item?.comment_is_penilai[0]?.message}
                </Text>
                <View
                  style={{
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        borderRadius: 8,
                        width: 33,
                        height: 26,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name="thumbs-up-outline"
                        size={18}
                        color={COLORS.grey}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H4", device),
                        color: COLORS.primary,
                        marginStart: 5,
                      }}
                    >
                      {item.likes_count}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="chatbox-ellipses-outline"
                      size={18}
                      color={COLORS.grey}
                    />
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H4", device),
                        marginStart: 5,
                      }}
                    >
                      {item.comment_count}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="eye-outline"
                      size={18}
                      color={COLORS.grey}
                    />
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H4", device),
                        marginStart: 5,
                      }}
                    >
                      {item.views_count}
                    </Text>
                  </View>

                  {item?.state === "publish" ? (
                    <View
                      style={{
                        backgroundColor: COLORS.successLight,
                        borderRadius: 20,
                        paddingHorizontal: 16,
                        paddingVertical: 4,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.success,
                          textAlign: "center",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Publish
                      </Text>
                    </View>
                  ) : item?.state === "draft" ? (
                    <View
                      style={{
                        backgroundColor: "#f0f0f0",
                        borderRadius: 20,
                        paddingHorizontal: 16,
                        paddingVertical: 4,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.grey,
                          textAlign: "center",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Draft
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        backgroundColor: COLORS.infoDangerLight,
                        borderRadius: 20,
                        paddingHorizontal: 16,
                        paddingVertical: 4,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.infoDanger,
                          textAlign: "center",
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Canceled
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export const PostinganSaya = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState("");

  const dispatch = useDispatch();

  const [page, setPage] = useState(5);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getMyPostList({ token: token, page: page, search: search }));
    }
  }, [token, page, search]);

  const { postinganSaya, loading } = useSelector((state) => state.pengetahuan);

  // useEffect(() => {
  //   setFilterData(postinganSaya.lists);
  // }, [postinganSaya.lists]);

  // useEffect(() => {
  //   if (search !== "") {
  //     const data = postinganSaya.lists?.filter((item) => {
  //       return item.title.toLowerCase().includes(search.toLowerCase());
  //     });
  //     setFilterData(data);
  //     if (data.length === 0) {
  //     }
  //   } else {
  //     setFilterData(postinganSaya.lists);
  //   }
  // }, [search]);

  const loadMore = () => {
    if (
      postinganSaya?.lists.length % 5 === 0 &&
      postinganSaya?.lists.length !== 0
    ) {
      if (postinganSaya?.lists.length === page) {
        setPage(page + 5);
      }
    }
  };

  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const filter = (event) => {
    setSearch(event);
  };

  useEffect(() => {
    setFilterData(postinganSaya.lists);
  }, [postinganSaya]);

  useEffect(() => {
    if (search !== "") {
      const data = postinganSaya.lists?.filter((item) => {
        return item.title.toLowerCase().includes(search.toLowerCase());
      });
      setFilterData(data);
      if (data.length === 0) {
      }
    } else {
      setFilterData(postinganSaya.lists);
    }
  }, [search, postinganSaya]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        dispatch(getMyPostList({ token: token, page: page }));
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token, page]);

  const [ascending, setAscending] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const asc = () => {
    const sortedAscending = filterData
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title));
    setFilterData(sortedAscending);
    setAscending(true);
    setIsFiltered(true);
  };

  const desc = () => {
    const sortedDescending = filterData
      .slice()
      .sort((a, b) => b.title.localeCompare(a.title));
    setFilterData(sortedDescending);
    setAscending(false);
    setIsFiltered(true);
  };

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

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
          <TouchableOpacity onPress={() => navigation.navigate("Main")}>
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
              fontWeight: 600,
              color: COLORS.white,
            }}
          >
            Postingan Saya
          </Text>
        </View>
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 20,
            width: device === "tablet" ? 40 : 28,
            height: device === "tablet" ? 40 : 28,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("JumlahPostingan")}
          >
            <Ionicons
              name="document-text-outline"
              size={device === "tablet" ? 30 : 24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <View
          style={{
            width: "100%",
            alignSelf: "center",
            marginTop: 10,
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              marginTop: 15,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 15,
              }}
            >
              <View
                style={{
                  width:
                    device === "tablet" && orientation === "landscape"
                      ? "95%"
                      : device === "tablet" && orientation === "potrait"
                      ? "92%"
                      : "85%",
                }}
              >
                <Search
                  placeholder={"Cari..."}
                  iconColor={COLORS.primary}
                  onSearch={filter}
                />
              </View>
              <TouchableOpacity onPress={!ascending ? asc : desc}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 30,
                    backgroundColor: COLORS.white,
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: COLORS.secondaryLighter,
                    // borderWidth: isFiltered ? 1 : 0,
                  }}
                >
                  <Ionicons name="filter-outline" size={24} />
                </View>
              </TouchableOpacity>
            </View>
            {/* <TouchableOpacity
            style={{
              backgroundColor: "#C34647",
              borderRadius: 8,
              height: 54,
              width: "12%",
              justifyContent: "center",
              alignItems: "center",
              //shadow ios
              shadowOffset: { width: -2, height: 4 },
              shadowColor: "#171717",
              shadowOpacity: 0.2,
              //shadow android
              elevation: 2,
            }}
            onPress={() => navigation.navigate("PostinganBaru")}
          >
            <Ionicons name="add-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity> */}
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, flex: 1 }}>
          <FlatList
            data={filterData}
            renderItem={({ item }) => (
              <View key={item.id}>
                <CardPostinganSaya item={item} token={token} device={device} />
              </View>
            )}
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
            ListEmptyComponent={() => <ListEmpty />}
            onEndReached={loadMore}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      </View>
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
});
