import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AVATAR,
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Search } from "../../components/Search";
import { useDispatch, useSelector } from "react-redux";
import { setAgendaDetail, setAgendaLists } from "../../store/Event";
import { useNavigation } from "@react-navigation/native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { Portal } from "react-native-portalize";
import ListEmpty from "../../components/ListEmpty";
import {
  deleteSubAgenda,
  getEventAgenda,
  getEventAgendaDetail,
} from "../../service/api";
import { getTokenValue } from "../../service/session";
import { CardListDetailAgenda } from "../../components/CardListDetailAgenda";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { Loading } from "../../components/Loading";
import { RefreshControl } from "react-native";

export const AgendaEvent = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [idEdit, setIdEdit] = useState("");

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

  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const filter = (event) => {
    setSearch(event);
  };
  const [token, setToken] = useState("");
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);

  const resetData = () => {
    agenda.lists = [];
  };

  const { agenda, event, loading } = useSelector((state) => state.event);

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getEventAgenda({ token: token, id: event.detailEvent.id }));
    }
  }, [token]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        dispatch(getEventAgenda({ token: token, id: event.detailEvent.id }));
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token]);

  // useEffect(() => {
  //     setFilterData(agenda.lists)
  // }, [agenda])

  // useEffect(() => {
  //     if (search !== '') {
  //         const data = agenda.lists.filter((item) => {
  //             return item.judul.toLowerCase().includes(search.toLowerCase());
  //         })
  //         setFilterData(data)
  //     } else {
  //         setFilterData(agenda.lists)
  //     }
  // }, [search])

  const { device } = useSelector((state) => state.apps);

  return (
    <>
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
            width: device === "tablet" ? 40 : 28,
            height: device === "tablet" ? 40 : 28,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("HalamanUtama");
              resetData();
            }}
          >
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
              fontWeight: FONTWEIGHT.bold,
              color: COLORS.white,
            }}
          >
            Agenda
          </Text>
        </View>
      </View>

      {loading ? <Loading /> : agenda.lists.length === 0 ? <ListEmpty /> : null}

      {/* <View style={{ width: 358, marginHorizontal: 15, marginVertical: 20 }}>
                <Search placeholder={'Cari Agenda'} onSearch={filter} />
            </View> */}

      {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20 }}>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 30,
                        backgroundColor: COLORS.white,
                        justifyContent: 'center',
                        alignItems: 'center',
                        //shadow ios
                        shadowOffset: { width: -2, height: 4 },
                        shadowColor: '#171717',
                        shadowOpacity: 0.2,
                        //shadow android
                        elevation: 2,
                    }}>
                        <Ionicons name='filter-outline' size={24} />
                    </View>

                    <View style={{
                        width: 40,
                        height: 40,
                        borderRadius: 30,
                        backgroundColor: COLORS.white,
                        justifyContent: 'center',
                        alignItems: 'center',
                        //shadow ios
                        shadowOffset: { width: -2, height: 4 },
                        shadowColor: '#171717',
                        shadowOpacity: 0.2,
                        //shadow android
                        elevation: 2,
                    }}>
                        <Ionicons name='menu-outline' size={24} />
                    </View>
                </View>
            </View> */}
      <View style={{ alignItems: "flex-end", marginHorizontal: 20 }}>
        {/* <TouchableOpacity style={{
                    width: 157,
                    height: 40,
                    backgroundColor: COLORS.primary,
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 20,
                }}
                    onPress={() => {
                        navigation.navigate("TambahSubAgenda")
                    }}
                >
                    <Text style={{ color: COLORS.white }}>Tambah Sub Agenda</Text>
                </TouchableOpacity> */}
      </View>

      <FlatList
        data={agenda.lists}
        renderItem={({ item }) => (
          <CardListDetailAgenda
            token={token}
            item={item}
            bottomSheetAttach={bottomSheetAttach}
            setIdEdit={setIdEdit}
            loading={loading}
            device={device}
          />
        )}
        style={{ marginVertical: 10, height: 440 }}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        // ListEmptyComponent={() => {loading ? loading : <ListEmpty />}}
      />

      <Portal>
        <BottomSheetModalProvider>
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
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: "90%",
                    height: device === "tablet" ? 65 : 50,
                    backgroundColor: COLORS.lightBrown,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                  }}
                  onPress={() => {
                    const params = { token: token, id: idEdit };
                    dispatch(getEventAgendaDetail(params));
                    navigation.navigate("EditSubAgenda");
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Ubah
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    width: "90%",
                    height: device === "tablet" ? 65 : 50,
                    backgroundColor: COLORS.infoDanger,
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                    marginBottom: 30,
                  }}
                  onPress={() => {
                    const data = { token: token, id: idEdit };
                    dispatch(deleteSubAgenda(data));
                    bottomSheetAttachClose();
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    Hapus
                  </Text>
                </TouchableOpacity>
              </View>
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </Portal>
    </>
  );
};
