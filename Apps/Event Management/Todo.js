import React, { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Search } from "../../components/Search";
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
import { getTokenValue } from "../../service/session";
import { deleteTodo, getDetailTodo, getlistTodo } from "../../service/api";
import { CardListTodo } from "../../components/CardListTodoEvent";
import { RefreshControl } from "react-native";
import { setDeleteRefresh } from "../../store/Event";

export const Todo = () => {
  const { agenda, todo, event, loading, deleteRefresh } = useSelector(
    (state) => state.event
  );
  const id = agenda.detail?.notulensi?.id;
  const data = todo.lists;

  const [token, setToken] = useState("");
  const [idEdit, setIdEdit] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getlistTodo({ token, id }));
    }
  }, [token]);


  const navigation = useNavigation();

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
  const [user, setUser] = useState("admin");

  const [search, setSearch] = useState("");
  const [filterData, setFilterData] = useState([]);

  const filter = (event) => {
    setSearch(event);
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        dispatch(getlistTodo({ token, id }));
      }
    } catch (error) {
    }

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token]);

  // useEffect(() => {
  //     setFilterData(data.todo)
  // }, [data])

  // useEffect(() => {
  //     if (search !== '') {
  //         const datas = data.todo.filter((item) => {
  //             return item.judul.toLowerCase().includes(search.toLowerCase());
  //         })
  //         setFilterData(datas)
  //     } else {
  //         setFilterData(data.todo)
  //     }
  // }, [search])

  const { device } = useSelector((state) => state.apps);

  useEffect(() => {
    if (deleteRefresh === true) {
      dispatch(getlistTodo({ token, id }));
      dispatch(setDeleteRefresh(false));
    }
  }, [deleteRefresh]);

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
          <TouchableOpacity onPress={() => navigation.navigate("AgendaEvent")}>
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
            ToDo
          </Text>
        </View>
      </View>

      {/* <View style={{ width: '90%', marginTop: 20, marginHorizontal: 20 }}>
                <Search
                    placeholder={"Cari ToDO"}
                // onSearch={filter}
                />
            </View> */}

      {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 20 }}>
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
                        navigation.navigate("TambahTodo")
                    }}
                >
                    <Text style={{ color: COLORS.white }}>Tambah ToDo</Text>
                </TouchableOpacity> */}
      </View>

      <FlatList
        data={data}
        renderItem={({ item }) => (
          <CardListTodo
            token={token}
            item={item}
            role={event.detailEvent?.user_role}
            bottomSheetAttach={bottomSheetAttach}
            setIdEdit={setIdEdit}
            loading={loading}
          />
        )}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 20 }}
        ListEmptyComponent={() => <ListEmpty />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
                    dispatch(getDetailTodo({ token: token, id: idEdit }));
                    navigation.navigate("EditTodo");
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
                    dispatch(deleteTodo({ token: token, id: idEdit }));
                    bottomSheetAttachClose();
                    // setRefreshing(true)
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: fontSizeResponsive("H4", device),
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
