import React, { useMemo, useRef } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Text } from "react-native";
import {
  COLORS,
  DATETIME,
  DateFormat,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Search } from "../../components/Search";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { useEffect } from "react";
import ListEmpty from "../../components/ListEmpty";
import {
  getDetailDigisign,
  getListCompleted,
  getListComposer,
  getListDraft,
  getListInProgress,
  getListReady,
  getListRetry,
  getListSignedDigiSign,
  putTandaTangan,
} from "../../service/api";
import Icon from "react-native-vector-icons/MaterialIcons";

import { getTokenValue } from "../../service/session";
import { setDigitalSignLists, setStatus } from "../../store/DigitalSign";
import { Loading } from "../../components/Loading";
import { RefreshControl } from "react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { ModalSubmit } from "../../components/ModalSubmit";
import moment from "moment/moment";

const ListBankom = ({
  item,
  variant,
  token,
  isSelected,
  setSelection,
  device,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const getDetail = (id) => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getDetailDigisign(params));
  };

  return (
    <View
      key={item?.id}
      style={{
        backgroundColor: "white",
        borderRadius: 16,
        width: "90%",
        flex: 1,
        marginTop: 10,
        marginHorizontal: "5%",
        padding: 20,
        //shadow ios
        shadowOffset: { width: -2, height: 4 },
        shadowColor: "#171717",
        shadowOpacity: 0.2,
        //shadow android
        elevation: 2,
        marginVertical: 10,
      }}
    >
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
        onPress={(e) => {
          getDetail(item?.id);
          navigation.navigate("DetailSertifikat", variant);
        }}
      >
        {variant === "ready" ? (
          <Checkbox
            value={isSelected.includes(item?.id) ? true : false}
            onValueChange={() => {
              if (isSelected.includes(item?.id)) {
                const ids = [...isSelected];
                const newIds = ids.filter((id) => id !== item?.id);
                setSelection(newIds);
              } else {
                setSelection((prev) => [...prev, item?.id]);
              }
            }}
            color={isSelected === true ? COLORS.lighter : null}
          />
        ) : null}
        <View
          style={{
            flexDirection: "column",
            width: variant === "ready" ? "90%" : "100%",
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H1", device),
              width: 300,
              textAlign: "justify",
              fontWeight: FONTWEIGHT.bold,
              width: "100%",
            }}
          >
            {item?.subject}
          </Text>
          <View
            style={{
              backgroundColor: COLORS.lighter,
              height: 1,
              marginVertical: 5,
              width: "100%",
            }}
          />
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                width: 110,
                textAlign: "justify",
                paddingRight: 12,
                fontWeight: FONTWEIGHT.normal,
                width: "45%",
              }}
            >
              No. Sertifikat
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                fontWeight: FONTWEIGHT.normal,
                width: 10,
              }}
            >
              :
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                width: device === "tablet" ? 200 : 170,
                textAlign: "justify",
                fontWeight: FONTWEIGHT.normal,
              }}
            >
              {item?.extra_attributes?.noSertif === ""
                ? "-"
                : item?.extra_attributes?.noSertif}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                width: 110,
                textAlign: "justify",
                paddingRight: 12,
                fontWeight: FONTWEIGHT.normal,
                width: "45%",
              }}
            >
              Keterangan
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                fontWeight: FONTWEIGHT.normal,
                width: 10,
              }}
            >
              :
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                width: device === "tablet" ? 200 : 170,
                textAlign: "justify",
                fontWeight: FONTWEIGHT.normal,
              }}
            >
              {item?.extra_attributes?.keterangan === ""
                ? "-"
                : item?.extra_attributes?.keterangan}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                width: 110,
                textAlign: "justify",
                paddingRight: 12,
                fontWeight: FONTWEIGHT.normal,
                width: "45%",
              }}
            >
              Tanggal Mulai
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                fontWeight: FONTWEIGHT.normal,
                width: 10,
              }}
            >
              :
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                width: device === "tablet" ? 200 : 170,
              }}
            >
              {moment(item?.extra_attributes?.tanggalMulaiSertif).format(
                "DD/MM/YYYY"
              )}
            </Text>
            {/* {item?.receivers[0]?.display_title !== undefined ? (
              <Text
                style={{
                  fontWeight: FONTWEIGHT.normal,
                  width: "55%",
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                :{" "}
                {item?.receivers[0]?.officer?.nama !== undefined
                  ? item?.receivers[0]?.officer?.nama
                  : null}
              </Text>
            ) : (
              <Text
                style={{
                  fontWeight: FONTWEIGHT.normal,
                  width: "55%",
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                :{" "}
                {item?.receivers[0]?.nama !== undefined
                  ? item?.receivers[0]?.nama
                  : "-"}
              </Text>
            )} */}
            {/* <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                width: 200,
                textAlign: "justify",
                fontWeight: FONTWEIGHT.normal,
              }}
            >
              {item?.receivers[0]?.nama}
            </Text> */}
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                width: 110,
                textAlign: "justify",
                paddingRight: 12,
                fontWeight: FONTWEIGHT.normal,
                width: "45%",
              }}
            >
              Tanggal Selesai
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                fontWeight: FONTWEIGHT.normal,
                width: 10,
              }}
            >
              :
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                width: device === "tablet" ? 200 : 170,
              }}
            >
              {moment(item?.extra_attributes?.tanggalSelesaiSertif).format(
                "DD/MM/YYYY"
              )}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                width: 110,
                textAlign: "auto",
                paddingRight: 12,
                fontWeight: FONTWEIGHT.normal,
                width: "45%",
              }}
            >
              Penerima Sertifikat
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                fontWeight: FONTWEIGHT.normal,
                width: 10,
              }}
            >
              :
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                width: device === "tablet" ? 200 : 170,
                textAlign: "auto",
                fontWeight: FONTWEIGHT.normal,
                width: "55%",
              }}
            >
              {item?.receivers[0]?.nama === undefined
                ? "-"
                : item?.receivers[0]?.nama}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                width: 110,
                textAlign: "auto",
                paddingRight: 12,
                fontWeight: FONTWEIGHT.normal,
                width: "45%",
              }}
            >
              Operator
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                fontWeight: FONTWEIGHT.normal,
                width: 10,
              }}
            >
              :
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                width: device === "tablet" ? 200 : 170,
                textAlign: "auto",
                fontWeight: FONTWEIGHT.normal,
                width: "55%",
              }}
            >
              {item?.composer?.nama === undefined ? "-" : item?.composer?.nama}
            </Text>
          </View>
          {/* {variant === "signed" ? (
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H3", device),
                  width: 110,
                  textAlign: "auto",
                  paddingRight: 12,
                  fontWeight: FONTWEIGHT.normal,
                  width: "45%",
                }}
              >
                Status
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H3", device),
                  width: 200,
                  textAlign: "auto",
                  fontWeight: FONTWEIGHT.normal,
                  width: "55%",
                }}
              >
                : {item.state === "in_progress" ? "In Progress" : "Done"}
              </Text>
            </View>
          ) : null} */}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export const Bankom = () => {
  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [tipe, setTipe] = useState("bankom");
  const [variant, SetVariant] = useState("composer");
  const [filterData, setFilterData] = useState([]);
  const [isSelected, setSelection] = useState([]);
  const [paraphrase, setParaphrase] = useState("");
  const [page, setPage] = useState(10);

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (!handlePenerimaSertifikat()) {
      dispatch(
        getListComposer({
          token: token,
          tipe: tipe,
          page: page,
          search: search,
        })
      );
    } else {
      filterHandlerCompleted();
    }
  }, [token, tipe]);

  const filterHandlerComposer = () => {
    SetVariant("composer");
    dispatch(
      getListComposer({ token: token, tipe: tipe, page: page, search: search })
    );
  };
  const filterHandlerReady = () => {
    SetVariant("ready");
    dispatch(
      getListReady({ token: token, tipe: tipe, page: page, search: search })
    );
  };
  const filterHandlerCompleted = () => {
    SetVariant("completed");
    dispatch(
      getListCompleted({ token: token, tipe: tipe, page: page, search: search })
    );
  };
  const filterHandlerDraft = () => {
    SetVariant("draft");
    dispatch(getListDraft({ token: token, tipe: tipe }));
  };
  const filterHandlerInprogress = () => {
    SetVariant("inprogress");
    dispatch(
      getListInProgress({
        token: token,
        tipe: tipe,
        page: page,
        search: search,
      })
    );
  };
  const filterHandlerRetry = () => {
    SetVariant("retry");
    dispatch(
      getListRetry({ token: token, tipe: tipe, page: page, search: search })
    );
  };
  const filterHandlerSigned = () => {
    SetVariant("signed");
    dispatch(
      getListSignedDigiSign({
        token: token,
        tipe: tipe,
        page: page,
        search: search,
      })
    );
  };

  useEffect(() => {
    if (variant === "composer") {
      dispatch(
        getListComposer({
          token: token,
          tipe: tipe,
          page: page,
          search: search,
        })
      );
    } else if (variant === "ready") {
      dispatch(
        getListReady({ token: token, tipe: tipe, page: page, search: search })
      );
    } else if (variant === "completed") {
      dispatch(
        getListCompleted({
          token: token,
          tipe: tipe,
          page: page,
          search: search,
        })
      );
    } else if (variant === "inprogress") {
      dispatch(
        getListInProgress({
          token: token,
          tipe: tipe,
          page: page,
          search: search,
        })
      );
    } else if (variant === "retry") {
      dispatch(
        getListRetry({ token: token, tipe: tipe, page: page, search: search })
      );
    } else if (variant === "signed") {
      dispatch(
        getListSignedDigiSign({
          token: token,
          tipe: tipe,
          page: page,
          search: search,
        })
      );
    }
  }, [page, token, tipe, search]);

  const { digitalsign, loading, status } = useSelector(
    (state) => state.digitalsign
  );

  const { profile } = useSelector((state) => state.superApps);

  const handlePenerimaSertifikat = () => {
    if (
      profile?.roles_access.includes("OPERATOR_BSRE") ||
      profile?.nip === "197908162002121003" ||
      profile?.nip === "196804071993032002" ||
      profile?.nip === "101010101"
    ) {
      return false;
    } else {
      return true;
    }
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        if (variant === " composer") {
          dispatch(
            getListComposer({
              token: token,
              tipe: tipe,
              page: page,
              search: search,
            })
          );
        }
        if (variant === "ready") {
          dispatch(getListReady({ token: token, tipe: tipe, page: page }));
        }
        if (variant === "completed") {
          dispatch(
            getListCompleted({
              token: token,
              tipe: tipe,
              page: page,
              search: search,
            })
          );
        }
        if (variant === "draft") {
          dispatch(getListDraft({ token: token, tipe: tipe }));
        }
        if (variant === "signed") {
          dispatch(
            getListSignedDigiSign({ token: token, tipe: tipe, page: page })
          );
        }
        if (variant === "inprogress") {
          dispatch(getListInProgress({ token: token, tipe: tipe, page: page }));
        }
        if (variant === "retry") {
          dispatch(getListRetry({ token: token, tipe: tipe, page: page }));
        }
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token, tipe, search]);

  const bottomSheetModalRef = useRef(null);
  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetAttach = () => {
    bottomSheetModalRef.current?.present();
  };

  const bottomSheetAttachClose = () => {
    if (bottomSheetModalRef.current) bottomSheetModalRef.current?.close();
  };

  const currentDate = new Date();

  const handleSubmit = () => {
    const payload = {
      passphrase: paraphrase,
      id_documents: isSelected,
      signature_date: moment(currentDate, "YYYY-MM-DD HH:mm:ss").format(
        DATETIME.LONG_DATE
      ),
      komentar: "",
    };
    const data = {
      token: token,
      payload: payload,
    };
    dispatch(putTandaTangan(data));
  };

  const { device } = useSelector((state) => state.apps);

  const loadMore = () => {
    if (digitalsign?.lists?.length !== 0) {
      if (digitalsign.lists.length % 5 === 0) {
        setPage((prevPage) => prevPage + 10);
      }
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        {loading ? <Loading /> : null}
        <View style={{ position: "relative", flex: 1 }}>
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
                  width: device === "tablet" ? 40 : 28,
                  height: device === "tablet" ? 40 : 28,
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 20,
                }}
              >
                <TouchableOpacity onPress={() => navigation.goBack()}>
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
                    marginRight: isSelected.length === 0 ? 50 : null,
                  }}
                >
                  Sertifikat TTDE
                </Text>
              </View>
              {isSelected.length !== 0 ? (
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    borderRadius: 20,
                    width: 28,
                    height: 28,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      bottomSheetAttach();
                    }}
                  >
                    <Ionicons
                      name="checkmark-outline"
                      size={18}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: "90%",
                  marginHorizontal: "5%",
                  marginTop: 20,
                }}
              >
                {/* <Search
                  placeholder={"Cari"}
                  onSearch={filter}
                  iconColor={COLORS.primary}
                /> */}
                <View style={styles.input}>
                  <Ionicons
                    name="search"
                    size={fontSizeResponsive("H3", device)}
                    color={COLORS.primary}
                  />
                  <TextInput
                    placeholder={"Cari"}
                    placeholderTextColor={COLORS.tertiary}
                    style={{
                      fontSize: fontSizeResponsive("H2", device),
                      flex: 1,
                    }}
                    maxLength={30}
                    onSubmitEditing={(event) =>
                      setSearch(event.nativeEvent.text)
                    }
                    clearButtonMode="always"
                    allowFontScaling={false}
                  />
                </View>
              </View>
            </View>
            {/* <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              > */}
            {handlePenerimaSertifikat() === false ? (
              <View
                style={{
                  paddingVertical: 10,
                  flexDirection: "row",
                  marginHorizontal: "5%",
                  gap: 7,
                }}
              >
                <TouchableOpacity
                  style={{
                    width: device === "tablet" ? "19%" : null,
                    paddingHorizontal: 6,
                    paddingVertical: 6,
                    borderWidth: 1,
                    backgroundColor:
                      variant === "composer" ? COLORS.primary : COLORS.input,
                    borderRadius: 30,
                    borderColor:
                      variant === "composer" ? null : COLORS.ExtraDivinder,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => filterHandlerComposer()}
                >
                  <Text
                    style={{
                      color:
                        variant === "composer"
                          ? COLORS.white
                          : COLORS.foundation,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    List Saya
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                    style={{
                      width: device === "tablet" ? "19%" : null,
                      paddingHorizontal: 6,
                      paddingVertical: 6,
                      borderWidth: 1,
                      backgroundColor:
                        variant === "draft" ? COLORS.primary : COLORS.input,
                      borderRadius: 30,
                      borderColor:
                        variant === "draft" ? null : COLORS.ExtraDivinder,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={() => filterHandlerDraft()}
                  >
                    <Text
                      style={{
                        color:
                          variant === "draft"
                            ? COLORS.white
                            : COLORS.foundation,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Draft
                    </Text>
                  </TouchableOpacity> */}
                {profile?.nip === "197908162002121003" ||
                profile?.nip === "196804071993032002" ||
                profile?.nip === "101010101" ? (
                  <>
                    <TouchableOpacity
                      style={{
                        width: device === "tablet" ? "19%" : null,
                        paddingHorizontal: 6,
                        paddingVertical: 6,
                        borderWidth: 1,
                        backgroundColor:
                          variant === "ready" ? COLORS.primary : COLORS.input,
                        borderRadius: 30,
                        borderColor:
                          variant === "ready" ? null : COLORS.ExtraDivinder,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => filterHandlerReady()}
                    >
                      <Text
                        style={{
                          color:
                            variant === "ready"
                              ? COLORS.white
                              : COLORS.foundation,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Need Sign
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        width: device === "tablet" ? "19%" : null,
                        paddingHorizontal: 6,
                        paddingVertical: 6,
                        borderWidth: 1,
                        backgroundColor:
                          variant === "retry" ? COLORS.primary : COLORS.input,
                        borderRadius: 30,
                        borderColor:
                          variant === "retry" ? null : COLORS.ExtraDivinder,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => filterHandlerRetry()}
                    >
                      <Text
                        style={{
                          color:
                            variant === "retry"
                              ? COLORS.white
                              : COLORS.foundation,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Retry
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        width: device === "tablet" ? "19%" : null,
                        paddingHorizontal: 6,
                        paddingVertical: 6,
                        borderWidth: 1,
                        backgroundColor:
                          variant === "inprogress"
                            ? COLORS.primary
                            : COLORS.input,
                        borderRadius: 30,
                        borderColor:
                          variant === "inprogress"
                            ? null
                            : COLORS.ExtraDivinder,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => filterHandlerInprogress()}
                    >
                      <Text
                        style={{
                          color:
                            variant === "inprogress"
                              ? COLORS.white
                              : COLORS.foundation,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        In Progress
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : null}
                <TouchableOpacity
                  style={{
                    width: device === "tablet" ? "19%" : null,
                    paddingHorizontal: 6,
                    paddingVertical: 6,
                    borderWidth: 1,
                    backgroundColor:
                      variant === "signed" ? COLORS.primary : COLORS.input,
                    borderRadius: 30,
                    borderColor:
                      variant === "signed" ? null : COLORS.ExtraDivinder,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => filterHandlerSigned()}
                >
                  <Text
                    style={{
                      color:
                        variant === "signed" ? COLORS.white : COLORS.foundation,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Signed
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                style={{
                  width: device === "tablet" ? "19%" : null,
                  paddingHorizontal: 6,
                  paddingVertical: 6,
                  borderWidth: 1,
                  backgroundColor:
                    variant === "completed"
                      ? COLORS.infoDangerLight
                      : COLORS.input,
                  borderRadius: 30,
                  borderColor:
                    variant === "completed"
                      ? COLORS.infoDangerLight
                      : COLORS.ExtraDivinder,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => filterHandlerCompleted()}
              >
                <Text
                  style={{
                    color:
                      variant === "completed"
                        ? COLORS.infoDanger
                        : COLORS.foundation,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Selesai
                </Text>
              </TouchableOpacity> */}
              </View>
            ) : null}
            {/* </ScrollView> */}
            <FlatList
              data={digitalsign.lists}
              keyExtractor={(item) => item?.id}
              renderItem={({ item }) => (
                <View key={item?.id}>
                  <ListBankom
                    item={item}
                    token={token}
                    variant={variant}
                    isSelected={isSelected}
                    setSelection={setSelection}
                    device={device}
                  />
                </View>
              )}
              ListEmptyComponent={() => <ListEmpty />}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
            {/* <TouchableOpacity onPress={() => { navigation.navigate('TambahSertifikat')}}
                            style={{ position: 'absolute', bottom: 40, right: 30, zIndex: 99 }}
                        >
                            <View style={{ backgroundColor: COLORS.primary, borderRadius: 50, width: 44, height: 44, justifyContent: 'center', alignItems: 'center' }}>
                                <Ionicons name='add-outline' size={24} color={COLORS.white} />
                            </View>
                        </TouchableOpacity> */}

            <BottomSheetModal
              ref={bottomSheetModalRef}
              snapPoints={animatedSnapPoints}
              handleHeight={animatedHandleHeight}
              contentHeight={animatedContentHeight}
              index={0}
              style={{ borderRadius: 50 }}
              keyboardBlurBehavior="restore"
              android_keyboardInputMode="adjust"
              backdropComponent={({ style }) => (
                <View
                  style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}
                />
              )}
            >
              <BottomSheetView onLayout={handleContentLayout}>
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        alignItems: "center",
                        flexDirection: "row",
                        marginHorizontal: 20,
                        marginTop: 20,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => bottomSheetAttachClose()}
                      >
                        <Ionicons name="chevron-back-outline" size={24} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H1", device),
                            fontWeight: 500,
                          }}
                        >
                          Tanda Tangan Sertifikat
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <View
                      style={{
                        marginBottom: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                        marginTop: 20,
                      }}
                    >
                      <BottomSheetTextInput
                        editable
                        multiline
                        numberOfLines={4}
                        maxLength={40}
                        placeholder="Masukan Passphrase"
                        style={{
                          borderWidth: 1,
                          width: "90%",
                          height: 40,
                          paddingHorizontal: 10,
                          paddingTop: 10,
                          borderRadius: 6,
                          borderColor: "#D0D5DD",
                        }}
                        onChangeText={setParaphrase}
                        allowFontScaling={false}
                      />
                    </View>

                    {/* <View
                  style={{
                    marginBottom: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                    marginTop: 20,
                  }}
                >
                  <TextInput
                    editable
                    multiline
                    numberOfLines={4}
                    maxLength={40}
                    placeholder="Masukan Komentar"
                    style={{
                      borderWidth: 1,
                      width: "90%",
                      height: 40,
                      paddingHorizontal: 10,
                      paddingTop: 10,
                      borderRadius: 6,
                      borderColor: "#D0D5DD",
                    }}
                  />
                </View> */}

                    <TouchableOpacity
                      style={{
                        width: "90%",
                        backgroundColor: COLORS.danger,
                        height: 50,
                        borderRadius: 6,
                        alignItems: "center",
                        marginHorizontal: 20,
                        justifyContent: "center",
                        marginTop: 10,
                      }}
                      onPress={() => {
                        bottomSheetAttachClose();
                        {
                          setTimeout(() => {
                            handleSubmit();
                          }, 2000);
                        }
                        setSelection([]);
                        SetVariant("signed");
                        setParaphrase("");
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.white,
                          fontSize: fontSizeResponsive("H1", device),
                          fontWeight: 500,
                        }}
                      >
                        Tanda Tangan
                      </Text>
                    </TouchableOpacity>
                  </View>
                </KeyboardAvoidingView>
              </BottomSheetView>
            </BottomSheetModal>

            <ModalSubmit
              status={status}
              setStatus={setStatus}
              messageSuccess={"Data Ditambahkan"}
              navigate={"MainDigitalSign"}
            />
          </>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
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
    backgroundColor: COLORS.white,
  },
});
