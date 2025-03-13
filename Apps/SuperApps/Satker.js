import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { CardSatker } from "../../components/CardSatker";
import { StyleSheet } from "react-native";
import Carousel, {
  Pagination,
  ParallaxImage,
} from "react-native-snap-carousel";
import { useRef } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { Banner, Divider } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CardUltah } from "../../components/CardUltah";
import {
  AVATAR,
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  PADDING,
  fontSizeResponsive,
  getOrientation,
} from "../../config/SuperAppps";
import { useDispatch, useSelector } from "react-redux";
import {} from "react-native-safe-area-context";
import { getTokenValue } from "../../service/session";
import {
  getBennerSatker,
  getDetailLinimasa,
  getGallerySatker,
  getPesan,
  getSatkerLinimasa,
  getSatkerNews,
  getUltah,
  getViewLinimasa,
} from "../../service/api";
import { Loading } from "../../components/Loading";
import { setBeritaSatker } from "../../store/Satker";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import RenderHTML from "react-native-render-html";
import { Config } from "../../constants/config";
import { setResetDetailLinimasa } from "../../store/Pengetahuan";
import { BannerKegiatanSatker } from "../../components/BannerKegiatanSatker";
import { BannerGallerySatker } from "../../components/BannerGallerySatker";
import { BannerBeritaSatker } from "../../components/BeritaSatker";
import { CardLiniMasaSatker } from "../../components/CardLinimasaSatker";

// const BannerSetjen = [
//   {
//     image: require("../../assets/superApp/setjen_1.jpg"),
//     title: "Pelantikan CPNS menjadi PNS di Lingkup Sekretariat Jenderal",
//     additional_title:
//       "Kementerian Kelautan dan Perikanan melantik 10 Kepala Pelabuhan Perikanan pada Jumat ",
//   },
//   {
//     image: require("../../assets/superApp/setjen_2.jpg"),
//     title: "Sekjen KKP, Antam Novambar melantik Dewan Pengawas BLU LPMUKP",
//     additional_title:
//       "Sekretaris Jenderal KKP, Antam Novambar melantik Dewan Pengawas untuk Badan Layanan Umum Lembaga Pengelola Modal Usaha Kelautan dan Perikanan (BLU LPMUKP) di Kantor Pusat KKP",
//   },
//   {
//     image: require("../../assets/superApp/setjen_3.jpg"),
//     title:
//       "Sosialisasi Zona Integritas dan Penandatanganan Pakta Integritas Petugas Pelayanan Terpadu Satu Pintu Kementerian Kelautan dan Perikanan (PTSP KKP)",
//     additional_title:
//       "Pada hari Selasa (20/8) telah dilaksanakan Sosialisasi Zona Integritas dan Penandatanganan Pakta Integritas Petugas Pelayanan Terpadu Satu Pintu Kementerian Kelautan dan Perikanan (PTSP KKP)",
//   },
// ];

export const Satker = () => {
  const carouselRefHome = useRef(null);
  const carouselRefBerita = useRef(null);
  const carouselRefGaleri = useRef(null);

  const [entries, setEntries] = useState([]);
  const [combineBanner, setCombineBanner] = useState([]);
  const [selected, setSelected] = useState("");

  const [token, setToken] = useState("");
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();

  const { width } = useWindowDimensions();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getBennerSatker(token));
      dispatch(getGallerySatker(token));
      dispatch(getSatkerNews({ token, page }));
      dispatch(getPesan(token));
      dispatch(getUltah(token));
      dispatch(getSatkerLinimasa(token));
    }
  }, [token]);

  // useEffect(() => {
  //     setEntries(ENTRIES);
  //     setBerita(Berita);
  // }, []);

  const { benner, gallery, berita, pesan, ultah, linimasa, loading } =
    useSelector((state) => state.satker);
  const { profile } = useSelector((state) => state.superApps);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const getWidthCarousel = () => {
    let tempWidth = 0;
    let orientation = getOrientation(screenWidth, screenHeight);

    if (device === "tablet") {
      if (orientation === "landscape") {
        tempWidth = screenWidth - 50;
      } else {
        tempWidth = screenWidth - 50;
      }
    } else {
      tempWidth = screenWidth - 30;
    }

    return tempWidth;
  };

  const getHeightCarousel = () => {
    let tempHeight = 0;
    let orientation = getOrientation(screenWidth, screenHeight);

    if (device === "tablet") {
      if (orientation === "landscape") {
        tempHeight = screenWidth - 400;
      } else {
        tempHeight = screenWidth - 250;
      }
    } else {
      tempHeight = screenWidth - 50;
    }

    return tempHeight;
  };

  const navigation = useNavigation();
  const { device } = useSelector((state) => state.apps);
  // console.log(pesan);
  const tagsStyles = {
    body: {
      whiteSpace: "normal",
      color: "black",
      fontSize: 18,
    },
    img: {
      width: 300,
      marginVertical: 40,
    },
    p: {
      display: "none",
    },
    h4: {
      fontSize: 18,
      marginBottom: 0, // Mengurangi jarak bawah
      marginTop: 10, // Mengurangi jarak atas
    },
    ul: {
      marginBottom: 0,
    },
    li: {
      // backgroundColor: "orange",
      // marginTop: 5,
    },
    ol: {
      fontSize: 15,
      marginTop: 10,
    },
  };

  const classesStyles = {
    content: {
      padding: 10,
    },
    "news-title": {
      fontSize: 18,
      textAlign: "center",
      fontWeight: "bold",
    },
    // description: {
    //   backgroundColor: "red",
    // },
    media: {
      fontSize: 16,
    },
  };

  const baseStyles = {
    fontSize: 16, // Set font size sesuai kebutuhan
  };

  useEffect(() => {
    const dataBerita = berita?.lists?.map((item) => ({
      id: item?.id,
      title: item?.title,
      image: item?.image,
      time: item?.created_at,
      type: "berita",
    }));

    const uniqueDataCombineBerita = dataBerita?.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t?.id === item?.id &&
            t?.title === item?.title &&
            t?.image === item?.image &&
            t?.created_at === item?.created_at
        )
    );

    if (gallery.results !== undefined) {
      const dataGaleri = gallery?.results?.map((item) => ({
        id: item?.id,
        title: item?.title,
        image: item?.main_images?.image,
        time: item?.created_at,
        type: "galeri",
      }));

      const uniqueDataCombineGaleri = dataGaleri?.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t?.id === item?.id &&
              t?.title === item?.title &&
              t?.main_images?.image === item?.main_images?.image &&
              t?.created_at === item?.created_at
          )
      );
      setCombineBanner([
        ...uniqueDataCombineBerita,
        ...uniqueDataCombineGaleri,
      ]);
    }

    // console.log(uniqueDataCombineBerita);
  }, [berita?.lists, gallery?.results]);

  return (
    <View style={{ flex: 1 }}>
      {loading ? <Loading /> : null}
      <ScrollView style={{ flexGrow: 1 }} nestedScrollEnabled={true}>
        <View
          style={{
            minHeight: device === "tablet" ? 350 : 250,
            position: "relative",
          }}
        >
          <View
            style={{
              width: "100%",
              height: device === "tablet" ? 280 : 180,
              position: "absolute",
              top: 0,
              borderBottomLeftRadius: 14,
              borderBottomRightRadius: 14,
            }}
          >
            <Image
              source={require("../../assets/superApp/headerdark.png")}
              style={{
                width: "100%",
                height: "100%",
                borderBottomLeftRadius: 14,
                borderBottomRightRadius: 14,
              }}
            />
          </View>

          <View
            style={{
              justifyContent: "flex-end",
              flex: 1,
              flexDirection: "row",
              gap: 16,
              padding: 20,
            }}
          >
            <View style={{ width: 300 }}>
              <Text
                style={{
                  color: COLORS.white,
                  textAlign: "right",
                  fontWeight: FONTWEIGHT.bolder,
                  marginBottom: 10,
                  fontSize: fontSizeResponsive("H2", device),
                  height: profile.nip === "100062" ? 15 : null,
                }}
              >
                {profile.nama}
              </Text>
              <Text
                style={{
                  color: COLORS.white,
                  textAlign: "right",
                  fontSize: fontSizeResponsive("H3", device),
                }}
              >
                {profile.nip}
              </Text>
            </View>
            <View>
              <Image
                source={{
                  uri: Config.base_url + "bridge/" + profile.avatar_signed,
                }}
                style={{
                  width: device === "tablet" ? 100 : 50,
                  height: device === "tablet" ? 100 : 50,
                  borderRadius: 8,
                }}
              />
            </View>
          </View>

          <View
            style={{
              width: "100%",
              position: "absolute",
              zIndex: 9,
              top: device === "tablet" ? "55%" : "50%",
              paddingHorizontal: 20,
            }}
          >
            <View style={{ alignItems: "center", display: "flex" }}>
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <CardSatker profile={profile} />
              </View>
            </View>
          </View>
        </View>

        {benner.length === 0 ? null : (
          <View style={[styles.containerr, { marginVertical: 20 }]}>
            <Carousel
              ref={carouselRefHome}
              sliderWidth={screenWidth}
              sliderHeight={screenWidth}
              itemWidth={getWidthCarousel()}
              data={benner}
              renderItem={({ item }, parallaxProps) => (
                <BannerKegiatanSatker
                  parallaxProps={parallaxProps}
                  item={item}
                />
              )}
              hasParallaxImages={true}
            />
          </View>
        )}

        {/* <View style={[styles.containerr, { marginTop: 20 }]}>
          <View style={{ marginLeft: 30 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: fontSizeResponsive("H2", device),
              }}
            >
              Galeri
            </Text>
          </View>

          <Carousel
            ref={carouselRefGaleri}
            sliderWidth={screenWidth}
            sliderHeight={screenWidth}
            itemWidth={getWidthCarousel()}
            data={gallery?.results?.slice(0, 5)}
            renderItem={({ item }, parallaxProps) => (
              <BannerGallerySatker parallaxProps={parallaxProps} item={item} />
            )}
            hasParallaxImages={true}
          />
        </View> */}

        {/* <View
          style={{ marginLeft: 30, flexDirection: "row", marginVertical: 20 }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: fontSizeResponsive("H2", device),
            }}
          >
            Berita Terkini
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("ListBeritaSatker")}
            style={{ flex: 1, alignItems: "flex-end", marginRight: 20 }}
          >
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H3", device),
                flex: 1,
                color: "#1868AB",
              }}
            >
              Selengkapnya
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <View style={[styles.containerr, { marginVertical: 20 }]}>
            <Carousel
              ref={carouselRefBerita}
              sliderWidth={screenWidth}
              sliderHeight={screenWidth}
              itemWidth={getWidthCarousel()}
              data={berita.lists}
              renderItem={({ item }, parallaxProps) => (
                <BannerBeritaSatker parallaxProps={parallaxProps} item={item} />
              )}
              hasParallaxImages={true}
            />
          </View>
        </View> */}

        {combineBanner.length === 0 ? null : (
          <>
            <View
              style={{ marginLeft: 30, flexDirection: "row", marginTop: 10 }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: fontSizeResponsive("H2", device),
                }}
              >
                Berita Terkini
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("ListBeritaSatker")}
                style={{ flex: 1, alignItems: "flex-end", marginRight: 20 }}
              >
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H3", device),
                    flex: 1,
                    color: "#1868AB",
                  }}
                >
                  Selengkapnya
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <View style={[styles.containerr, { marginVertical: 20 }]}>
                <Carousel
                  ref={carouselRefBerita}
                  sliderWidth={screenWidth}
                  sliderHeight={screenWidth}
                  itemWidth={getWidthCarousel()}
                  data={combineBanner.slice(0, 5)}
                  renderItem={({ item }, parallaxProps) => (
                    <BannerBeritaSatker
                      parallaxProps={parallaxProps}
                      item={item}
                      token={token}
                      tanggal={item?.time}
                    />
                  )}
                  hasParallaxImages={true}
                />
              </View>
            </View>
          </>
        )}

        <View
          style={[
            styles.containerr,
            {
              marginVertical: 20,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          {/* <Carousel
            ref={carouselRef}
            sliderWidth={screenWidth}
            sliderHeight={screenWidth}
            itemWidth={screenWidth - 60}
            data={[pesan[pesan.length - 1]]}
            renderItem={renderItem2}
            hasParallaxImages={true}
            onSnapToItem={setSlide2}
          /> */}
          {/* <Pagination
            dotsLength={pesan?.length}
            dotColor={"black"}
            inactiveDotColor={COLORS.grey}
            dotStyle={styles.paginationDot}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            activeDotIndex={slide2}
            carouselRef={carouselRef}
            tappableDots={!!carouselRef}
          /> */}

          <View
            style={{
              flexDirection: "row",
              gap: 10,
              backgroundColor: COLORS.white,
              padding: PADDING.Page,
              borderRadius: 8,
              marginHorizontal: device === "tablet" ? 30 : 30,
            }}
          >
            <Image
              source={{ uri: pesan[pesan.length - 1]?.image }}
              style={{
                width: device === "tablet" ? 300 : 100,
                height: device === "tablet" ? 400 : 150,
                borderWidth: 1,
              }}
            />
            <ScrollView
              style={{
                width: device === "tablet" ? 300 : 100,
                height: device === "tablet" ? 400 : 150,
              }}
              nestedScrollEnabled={true}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H1", device),
                  fontWeight: FONTWEIGHT.bold,
                  color: COLORS.info,
                }}
              >
                {pesan[pesan?.length - 1]?.nama}
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                  marginTop: 10,
                }}
              >
                {pesan[pesan?.length - 1]?.position}
              </Text>
              <RenderHTML
                source={{ html: pesan[pesan.length - 1]?.content }}
                contentWidth={width}
                tagsStyles={tagsStyles}
                classesStyles={classesStyles}
                defaultTextProps={{ allowFontScaling: false }}
              />
            </ScrollView>
          </View>
        </View>
        {/* <Calendar
                    onDayPress={day => {
                        setSelected(day.dateString);
                    }}
                    markedDates={{
                        [selected]: { selected: true, disableTouchEvent: true, selectedDotColor: COLORS.primary }
                    }}
                    style={{ width: '85%', marginLeft: 28, borderRadius: 5, marginTop: 20, }}
                    theme={{
                        arrowColor: COLORS.primary,
                        selectedDayBackgroundColor: COLORS.primary,
                        todayTextColor: COLORS.primary,
                    }}
                /> */}

        {profile?.nip === "100062" ? null : (
          <View
            style={[
              styles.cardListSatker,
              {
                flex: 1,
                justifyContent: "center",
                paddingVertical: 20,
                marginHorizontal: device === "tablet" ? 30 : 30,
              },
            ]}
          >
            <Text
              style={{
                marginLeft: 20,
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("Judul", device),
                marginTop: 10,
              }}
            >
              Linimasa Pengetahuan
            </Text>
            <View style={{ marginTop: 10 }}>
              <FlatList
                scrollEnabled={false}
                data={linimasa}
                renderItem={({ item, index }) => (
                  <CardLiniMasaSatker
                    item={item}
                    index={index}
                    token={token}
                    device={device}
                  />
                )}
                keyExtractor={(item) => item.id}
              />
            </View>
          </View>
        )}

        <View
          style={{
            marginVertical: 20,
            marginHorizontal: 30,
          }}
        >
          <CardUltah ultah={ultah} device={device} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  galeri: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: "white",
    borderRadius: 8,
  },
  containerr: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: "white",
    borderRadius: 8,
    // borderTopLeftRadius: 8,
    // borderTopRightRadius: 8
    resizeMode: "cover",
    aspectRatio: 16 / 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
    aspectRatio: 16 / 8,
  },
  images: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
    aspectRatio: 16 / 8,
  },
  cardListSatker: {
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    // width: "86%",
    // marginLeft: 25,
    opacity: 0.9,
    borderRadius: 5,
    marginVertical: 10,
    // marginHorizontal: 20,
  },
  vertical: {
    rotation: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
});
