import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import React, { useRef, useState } from "react";
import { FlatList, TextInput, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { ScrollView } from "react-native";
import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  AVATAR,
  COLORS,
  DATETIME,
  FONTSIZE,
  FONTWEIGHT,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import Carousel, {
  Pagination,
  ParallaxImage,
} from "react-native-snap-carousel";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import { useEffect } from "react";
import { Image } from "react-native";
import { useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setAgendaDetail } from "../../store/GrupKalender";
import {} from "react-native-safe-area-context";
import moment from "moment/min/moment-with-locales";
import { getTokenValue } from "../../service/session";
import { getListSubAgenda } from "../../service/api";
import ListEmpty from "../../components/ListEmpty";
import { CardSubAgendaGrup } from "../../components/CardSubAgendaGrup";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { CardItemMember } from "../../components/CardItemMember";

export const DetailAcaraAgenda = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState("");

  const { acara, agendaAcara, loading } = useSelector(
    (state) => state.grupKalender
  );
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);
  const detail = acara.detail;
  const dispatch = useDispatch();
  const bottomSheetModalRef = useRef(null);
  const initialSnapPoints = useMemo(() => ["95%"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetAttach = () => {
    bottomSheetModalRef.current?.present();
  };

  return (
    <>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <ScrollView>
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
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons
                    name="chevron-back-outline"
                    size={24}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, alignItems: "center", marginRight: 50 }}>
                <Text
                  style={{ fontSize: 15, fontWeight: 600, color: COLORS.white }}
                >
                  Detail Acara
                </Text>
              </View>
            </View>

            <View style={styles.container}>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  width: "90%",
                  borderRadius: 8,
                  marginHorizontal: 20,
                }}
              >
                {loading ? (
                  <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                    <ShimmerPlaceHolder
                      style={{ borderRadius: 4 }}
                      width={100}
                      height={20}
                    />
                  </View>
                ) : (
                  <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                    <Text
                      style={{
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: FONTSIZE.Judul,
                      }}
                    >
                      {detail?.title}
                    </Text>
                  </View>
                )}

                <View
                  style={{
                    marginHorizontal: 20,
                    marginTop: 10,
                    flexDirection: "row",
                    gap: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: FONTSIZE.H2,
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Dibuat Pada :
                  </Text>
                  {loading ? (
                    <ShimmerPlaceHolder
                      style={{ borderRadius: 4 }}
                      width={100}
                      height={20}
                    />
                  ) : (
                    <Text>
                      {moment(detail?.created_at, "HH:mm:ss")
                        .locale("id")
                        .format(DATETIME.LONG_DATE)}
                    </Text>
                  )}
                </View>

                <View>
                  <View
                    style={{
                      marginHorizontal: 20,
                      marginTop: 20,
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "45%" }}>
                      <Text
                        style={{
                          fontSize: FONTSIZE.H2,
                          fontWeight: FONTWEIGHT.bold,
                        }}
                      >
                        Lokasi
                      </Text>
                    </View>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4 }}
                        width={100}
                        height={20}
                      />
                    ) : (
                      <View style={{ justifyContent: "center" }}>
                        <Text>{detail?.location}</Text>
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      height: 1,
                      width: "90%",
                      backgroundColor: COLORS.lighter,
                      opacity: 0.3,
                      marginTop: 10,
                      marginHorizontal: 20,
                    }}
                  />
                </View>

                <View>
                  <View
                    style={{
                      marginHorizontal: 20,
                      marginTop: 20,
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "45%" }}>
                      <Text
                        style={{
                          fontSize: FONTSIZE.H2,
                          fontWeight: FONTWEIGHT.bold,
                        }}
                      >
                        Waktu Mulai
                      </Text>
                    </View>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4 }}
                        width={100}
                        height={20}
                      />
                    ) : (
                      <View style={{ justifyContent: "center" }}>
                        <Text>
                          {moment(detail?.start_date)
                            .locale("id")
                            .format(DATETIME.LONG_DATETIME)}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View
                    style={{
                      height: 1,
                      width: "90%",
                      backgroundColor: COLORS.lighter,
                      opacity: 0.3,
                      marginTop: 10,
                      marginHorizontal: 20,
                    }}
                  />
                </View>

                <View>
                  <View
                    style={{
                      marginHorizontal: 20,
                      marginTop: 20,
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "45%" }}>
                      <Text
                        style={{
                          fontSize: FONTSIZE.H2,
                          fontWeight: FONTWEIGHT.bold,
                        }}
                      >
                        Waktu Selesai
                      </Text>
                    </View>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4 }}
                        width={100}
                        height={20}
                      />
                    ) : (
                      <View style={{ justifyContent: "center" }}>
                        <Text>
                          {moment(detail?.end_date)
                            .locale("id")
                            .format(DATETIME.LONG_DATETIME)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      height: 1,
                      width: "90%",
                      backgroundColor: COLORS.lighter,
                      opacity: 0.3,
                      marginTop: 10,
                      marginHorizontal: 20,
                    }}
                  />
                </View>

                <View>
                  <View
                    style={{
                      marginHorizontal: 20,
                      marginTop: 20,
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "45%" }}>
                      <Text
                        style={{
                          fontSize: FONTSIZE.H2,
                          fontWeight: FONTWEIGHT.bold,
                        }}
                      >
                        PIC
                      </Text>
                    </View>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4 }}
                        width={100}
                        height={20}
                      />
                    ) : (
                      <View style={{ justifyContent: "center" }}>
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={{ uri: detail.pic?.avatar_url }}
                            style={{
                              marginLeft: -8,
                              borderWidth: 2,
                              borderRadius: 50,
                              borderColor: COLORS.white,
                              width: 30,
                              height: 30,
                            }}
                          />
                          <Text>{detail.pic?.nama}</Text>
                        </View>
                      </View>
                    )}
                  </View>
                  <View
                    style={{
                      height: 1,
                      width: "90%",
                      backgroundColor: COLORS.lighter,
                      opacity: 0.3,
                      marginTop: 10,
                      marginHorizontal: 20,
                    }}
                  />
                </View>

                <View>
                  <View
                    style={{
                      marginHorizontal: 20,
                      marginVertical: 20,
                      flexDirection: "row",
                    }}
                  >
                    <View style={{ width: "45%" }}>
                      <Text
                        style={{
                          fontSize: FONTSIZE.H2,
                          fontWeight: FONTWEIGHT.bold,
                        }}
                      >
                        Anggota
                      </Text>
                    </View>
                    {loading ? (
                      <ShimmerPlaceHolder
                        style={{ borderRadius: 4 }}
                        width={100}
                        height={20}
                      />
                    ) : detail?.members?.length < 3 ? (
                      <View style={{ flexDirection: "row" }}>
                        {detail.members?.map((item, index) => {
                          return (
                            <View key={index}>
                              <Image
                                source={{ uri: item.avatar_url }}
                                style={{
                                  marginLeft: -8,
                                  borderWidth: 2,
                                  borderRadius: 50,
                                  borderColor: COLORS.white,
                                  width: 30,
                                  height: 30,
                                }}
                              />
                            </View>
                          );
                        })}
                      </View>
                    ) : (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flex: 1,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Image
                            source={{ uri: detail.members[0]?.avatar_url }}
                            style={{
                              marginLeft: -8,
                              borderWidth: 2,
                              borderRadius: 50,
                              borderColor: COLORS.white,
                              width: 30,
                              height: 30,
                            }}
                          />
                          <Image
                            source={{ uri: detail.members[1]?.avatar_url }}
                            style={{
                              marginLeft: -8,
                              borderWidth: 2,
                              borderRadius: 50,
                              borderColor: COLORS.white,
                              width: 30,
                              height: 30,
                            }}
                          />
                          <Image
                            source={{ uri: detail.members[2]?.avatar_url }}
                            style={{
                              marginLeft: -8,
                              borderWidth: 2,
                              borderRadius: 50,
                              borderColor: COLORS.white,
                              width: 30,
                              height: 30,
                            }}
                          />
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            bottomSheetAttach();
                          }}
                        >
                          <Ionicons name="chevron-forward" size={24} />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>

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
                    <View style={{ marginTop: 20, marginBottom: 40 }}>
                      <View
                        style={{
                          marginBottom: 20,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: FONTSIZE.H2,
                            fontWeight: FONTWEIGHT.bold,
                            color: COLORS.lighter,
                          }}
                        >
                          Anggota
                        </Text>
                      </View>
                      <View>
                        <FlatList
                          data={detail.members}
                          renderItem={({ item }) => (
                            <View key={item.nip}>
                              <CardItemMember item={item} />
                            </View>
                          )}
                          keyExtractor={(item) => item.id}
                        />
                      </View>
                    </View>
                  </BottomSheetView>
                </BottomSheetModal>
              </View>
              <View
                style={{
                  backgroundColor: COLORS.white,
                  width: "90%",
                  borderRadius: 8,
                  marginLeft: 20,
                  marginVertical: 20,
                }}
              >
                <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                  <View
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <Ionicons name="list-outline" size={24} />
                    <Text
                      style={{
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: FONTSIZE.Judul,
                      }}
                    >
                      Sub Agenda
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 1,
                      width: "100%",
                      backgroundColor: COLORS.lighter,
                      opacity: 0.3,
                      marginTop: 10,
                    }}
                  />

                  <FlatList
                    data={agendaAcara.listsSub}
                    renderItem={({ item }) => (
                      <CardSubAgendaGrup item={item} loading={loading} />
                    )}
                    style={{ height: 250 }}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={() => <ListEmpty />}
                  />
                </View>
              </View>
            </View>
            {/* <TouchableOpacity
                            onPress={() => {

                            }}
                            style={{
                                backgroundColor: COLORS.primary,
                                width: '90%',
                                marginHorizontal: 20,
                                marginVertical: 20,
                                padding: 15,
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ color: COLORS.white }}>Hapus</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {

                            }}
                            style={{
                                borderColor: COLORS.primary,
                                width: '90%',
                                marginHorizontal: 20,
                                padding: 15,
                                borderRadius: 8,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderWidth: 1
                            }}
                        >
                            <Text>Edit</Text>
                        </TouchableOpacity> */}
          </ScrollView>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
  },
});
