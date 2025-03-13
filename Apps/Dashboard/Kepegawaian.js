import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { ScrollView } from "react-native";
import { Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { TopsDash } from "../../utils/menutab";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setBerita, setPengumuman } from "../../store/Dashboard";
import Carousel, { ParallaxImage } from "react-native-snap-carousel";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import { useRef } from "react";

const { width: screenWidth } = Dimensions.get("window");

export const Kepegawaian = () => {
  const dispatch = useDispatch();
  const { berita, pengumuman } = useSelector((state) => state.dashboard);
  const { device } = useSelector((state) => state.apps);

  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: COLORS.primary,
              height: "10%",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 20,
                width: device === "tablet" ? 46 : 28,
                height: device === "tablet" ? 46 : 28,
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
            <View style={{ flex: 1, alignItems: "center", marginRight: 50 }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H3", device),
                  fontWeight: 600,
                  color: COLORS.white,
                }}
              >
                Kepegawaian
              </Text>
            </View>
          </View>

          
            <TopsDash />

          {/* <ScrollView style={{ flex: 1 }}>

                        <View>
                            <View style={{ marginVertical: 20, marginLeft: 30, flexDirection: 'row' }}>
                                <Text style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H2 }}>Berita Terkini</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('ListBerita')} style={{ flex: 1, alignItems: 'flex-end', marginRight: 20 }}>
                                    <Text style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H3, flex: 1, color: '#1868AB' }}>View all</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View>
                            <View style={styles.containerr}>
                                <Carousel
                                    ref={carouselRef}
                                    sliderWidth={screenWidth}
                                    sliderHeight={screenWidth}
                                    itemWidth={screenWidth - 60}
                                    data={berita.lists.slice(0, 3)}
                                    renderItem={renderBerita}
                                    hasParallaxImages={true}
                                />
                            </View>
                        </View>

                        <View>
                            <View style={{ marginVertical: 20, marginLeft: 30, flexDirection: 'row' }}>
                                <Text style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H2 }}>Pengumuman</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('DetailPengumuman')} style={{ flex: 1, alignItems: 'flex-end', marginRight: 20 }}>
                                    <Text style={{ fontWeight: FONTWEIGHT.bold, fontSize: FONTSIZE.H3, flex: 1, color: '#1868AB' }}>View all</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ width: '87%', backgroundColor: COLORS.white, marginLeft: 30, borderRadius: 16 }}>
                            {pengumuman.lists.slice(0, 5).map((item) =>
                                <View style={{ marginHorizontal: 20 }}>
                                    <View style={{ marginTop: 10 }}>
                                        <Text style={{ fontSize: FONTSIZE.H2, fontWeight: FONTWEIGHT.bold }}>{item.judul}</Text>
                                    </View>
                                    <View style={{ marginVertical: 10 }}>
                                        <Text style={{ color: COLORS.lighter }}>{item.tanggal}</Text>
                                    </View>
                                    <View style={{ height: 1, width: '100%', backgroundColor: COLORS.lighter, opacity: 0.5, marginBottom: 10 }} />
                                </View>
                            )}
                        </View>

                    </ScrollView> */}
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  containerCard: {
    backgroundColor: "#F4F7FE",
    justifyContent: "flex-start",
    flexDirection: "row",
    gap: 36,
    marginLeft: 20,
  },
  containerr: {
    flex: 1,
  },
  item: {
    width: screenWidth - 60,
    height: screenWidth - 60,
  },
  items: {
    width: screenWidth - 60,
    height: screenWidth - 170,
  },
  imageContainer: {
    flex: 1, // Prevent a random Android rendering issue
    backgroundColor: "white",
    // borderRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  images: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "contain",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
});
