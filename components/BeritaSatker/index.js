import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { ParallaxImage } from "react-native-snap-carousel";
import { useDispatch, useSelector } from "react-redux";
import {
  COLORS,
  DATETIME,
  fontSizeResponsive,
  getOrientation,
} from "../../config/SuperAppps";
import moment from "moment";
import { getDetailSatkerNews } from "../../service/api";
import { useNavigation } from "@react-navigation/native";

export const BannerBeritaSatker = ({
  item,
  index,
  parallaxProps,
  token,
  tanggal,
}) => {
  const { device } = useSelector((state) => state.apps);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const getWidthCarousel = () => {
    let tempWidth = 0;
    let orientation = getOrientation(screenWidth, screenHeight);
  };
  const getDetail = (id) => {
    const params = { token: token, id: id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getDetailSatkerNews(params));
  };
  return (
    <TouchableOpacity
      style={{
        width: getWidthCarousel(),
        // height: getHeightCarousel(),
        backgroundColor: COLORS.white,
        borderRadius: 8,
      }}
      onPress={() => {
        if (item.type === "berita") {
          getDetail(item.id);
          navigation.navigate("DetailBeritaSatker");
        }
      }}
    >
      <ParallaxImage
        source={{ uri: item.image }}
        containerStyle={styles.imageContainer}
        style={styles.image}
        parallaxFactor={0.4}
        {...parallaxProps}
      />
      <View style={{ margin: 10 }}>
        {item.type === "berita" ? (
          <Text
            style={{
              color: COLORS.grey,
              fontSize: fontSizeResponsive("H5", device),
              fontWeight: 400,
            }}
          >
            {/* {moment(item.time, "DD mmmm yyyy").format(DATETIME.LONG_DATE)} */}
            {tanggal}
          </Text>
        ) : item.type === "galeri" ? (
          <Text
            style={{
              color: COLORS.grey,
              fontSize: fontSizeResponsive("H5", device),
              fontWeight: 400,
            }}
          >
            {moment(item.time, "DD MMMM YYYY HH:mm:ss").format(
              DATETIME.LONG_DATE
            )}
            {/* {tanggal} */}
          </Text>
        ) : null}
        <Text style={{ fontSize: 15, marginVertical: 10, fontWeight: 600 }}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
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
