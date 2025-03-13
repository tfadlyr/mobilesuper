import { useNavigation } from "@react-navigation/native";
import React, { useMemo, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  COLORS,
  DATETIME,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import moment from "moment/min/moment-with-locales";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { FlatList } from "react-native";
import { CardItemMember } from "../CardItemMember";
import { CardMemberSPPD } from "../CardMemberSPPD";
import { Ionicons } from "@expo/vector-icons";
import { CardListTempatSPPD } from "../CardListTempatSPPD";
import { useDispatch } from "react-redux";
import { getDocumentDetailSPPD } from "../../service/api";

export const CardDokumenListSPPD = ({ item, token, device }) => {
  const navigation = useNavigation();
  const bottomSheetModalRef = useRef(null);
  const bottomSheetModalRefVenue = useRef(null);
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

  const bottomSheetAttachVenue = () => {
    bottomSheetModalRefVenue.current?.present();
  };

  const bottomSheetAttachVenueClose = () => {
    if (bottomSheetModalRefVenue.current)
      bottomSheetModalRefVenue.current?.close();
  };

  const dispatch = useDispatch();

  const getDetail = (id) => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getDocumentDetailSPPD(params));
  };
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          getDetail(item.id);
          navigation.navigate("DetailDokumenSPPD", { data: item.event });
        }}
        style={{
          backgroundColor: COLORS.white,
          justifyContent: "center",
          padding: 20,
          gap: 8,
          borderRadius: 8,
          //shadow ios
          shadowOffset: { width: -2, height: 4 },
          shadowColor: "#171717",
          shadowOpacity: 0.2,
          shadowRadius: 1,
          //shadow android
          elevation: 2,
          marginTop: 10,
        }}
      >
        <Text
          style={{
            fontSize: fontSizeResponsive("Judul", device),
            fontWeight: FONTWEIGHT.bold,
          }}
        >
          {item.event}
        </Text>
        <View
          style={{
            backgroundColor: COLORS.lighter,
            height: 1,
            marginBottom: 5,
          }}
        />
        <View style={{}}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 400,
              color: COLORS.grey,
            }}
          >
            Tanggal Mulai:{" "}
            {moment(item.start_date, "DD-MM-YYYY")
              .locale("id")
              .format(DATETIME.LONG_DATE)}
          </Text>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 400,
              color: COLORS.grey,
              marginTop: 5,
            }}
          >
            Tanggal Selesai:{" "}
            {moment(item.end_date, "DD-MM-YYYY")
              .locale("id")
              .format(DATETIME.LONG_DATE)}
          </Text>
        </View>
        <View>
          <Text
            style={{
              fontSize: fontSizeResponsive("H2", device),
              fontWeight: 400,
            }}
          >
            Tujuan :
          </Text>

          {item.venue.length <= 3 ? (
            item.venue.map((data) => {
              return (
                <View style={{ flexDirection: "row", gap: 5 }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H3", device),
                      fontWeight: 400,
                    }}
                  >
                    -
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H3", device),
                      fontWeight: 400,
                    }}
                  >
                    {data.locations}
                  </Text>
                </View>
              );
            })
          ) : (
            <>
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: 400,
                  }}
                >
                  -
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: 400,
                  }}
                >
                  {item.venue[0].locations}
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: 400,
                  }}
                >
                  -
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: 400,
                  }}
                >
                  {item.venue[1].locations}
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: 400,
                  }}
                >
                  -
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: 400,
                  }}
                >
                  {item.venue[2].locations}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  bottomSheetAttachVenue();
                }}
              >
                <Text
                  style={{
                    color: COLORS.info,
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: FONTWEIGHT.normal,
                    marginTop: 4,
                    marginHorizontal: 4,
                  }}
                >
                  Selengkapnya
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <View>
          <Text
            style={{
              fontSize: fontSizeResponsive("H2", device),
              fontWeight: 400,
            }}
          >
            Peserta :
          </Text>

          {item.participant.length <= 3 ? (
            item.participant.map((data) => {
              return (
                <View style={{ flexDirection: "row", gap: 5 }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H3", device),
                      fontWeight: 400,
                    }}
                  >
                    -
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H3", device),
                      fontWeight: 400,
                    }}
                  >
                    {data.person}
                  </Text>
                </View>
              );
            })
          ) : (
            <View style={{ marginBottom: 6 }}>
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: 400,
                  }}
                >
                  -
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: 400,
                  }}
                >
                  {item.participant[0].person}
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: 5 }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: 400,
                  }}
                >
                  -
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: 400,
                  }}
                >
                  {item.participant[1].person}
                </Text>
              </View>

              <View style={{ flexDirection: "row", gap: 5 }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: 400,
                  }}
                >
                  -
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: 400,
                  }}
                >
                  {item.participant[2].person}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  bottomSheetAttach();
                }}
              >
                <Text
                  style={{
                    color: COLORS.info,
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: 400,
                    marginTop: 4,
                    marginHorizontal: 4,
                  }}
                >
                  Selengkapnya
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
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
          <View style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]} />
        )}
      >
        <BottomSheetView onLayout={handleContentLayout}>
          <View style={{ marginTop: 20, marginBottom: 40 }}>
            <View
              style={{
                marginBottom: 20,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                marginHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: FONTWEIGHT.bold,
                  color: COLORS.normal,
                }}
              >
                Peserta
              </Text>
              <TouchableOpacity
                onPress={() => {
                  bottomSheetAttachClose();
                }}
              >
                <Ionicons
                  name="close-outline"
                  size={24}
                  color={COLORS.lighter}
                />
              </TouchableOpacity>
            </View>
            <View>
              <FlatList
                data={item.participant}
                renderItem={({ item }) => (
                  <View key={item.nip}>
                    <CardMemberSPPD item={item} device={device} />
                  </View>
                )}
                keyExtractor={(item) => item.id}
              />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>

      <BottomSheetModal
        ref={bottomSheetModalRefVenue}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        index={0}
        style={{ borderRadius: 50 }}
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjust"
        backdropComponent={({ style }) => (
          <View style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]} />
        )}
      >
        <BottomSheetView onLayout={handleContentLayout}>
          <View style={{ marginTop: 20, marginBottom: 40 }}>
            <View
              style={{
                marginBottom: 20,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                marginHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: FONTWEIGHT.bold,
                  color: COLORS.lighter,
                }}
              >
                Tempat
              </Text>
              <TouchableOpacity
                onPress={() => {
                  bottomSheetAttachVenueClose();
                }}
              >
                <Ionicons
                  name="close-outline"
                  size={24}
                  color={COLORS.lighter}
                />
              </TouchableOpacity>
            </View>
            <View>
              <FlatList
                data={item.venue}
                renderItem={({ item }) => (
                  <View key={item.nip}>
                    <CardListTempatSPPD item={item} device={device} />
                  </View>
                )}
                keyExtractor={(item) => item.id}
              />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};
