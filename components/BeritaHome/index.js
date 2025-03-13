import React from "react";
import { TouchableOpacity, useWindowDimensions, View } from "react-native";
import { ParallaxImage } from "react-native-snap-carousel";
import {
  COLORS,
  DATETIME,
  fontSizeResponsive,
  FONTWEIGHT,
  getOrientation,
} from "../../config/SuperAppps";
import { Text } from "react-native";
import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { getDetailBerita } from "../../service/api";
import moment from "moment";

export const BeritaHome = ({
  item,
  index,
  parallaxProps,
  token,
  setModalVisibleVideo,
  tanggal,
}) => {
  const { device } = useSelector((state) => state.apps);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const getDetail = (id) => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getDetailBerita(params));
  };

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
        tempHeight = screenWidth;
      } else {
        tempHeight = screenWidth;
      }
    } else {
      tempHeight = screenWidth;
    }

    return tempHeight;
  };

  return (
    <TouchableOpacity
      onPress={() => {
        if (item.type === "berita") {
          getDetail(item.id);
          navigation.navigate("DetailBerita");
        } else if (item.type === "video") {
          setModalVisibleVideo(true);
        }
      }}
      style={{
        width: getWidthCarousel(),
        // height: getHeightCarousel(),
      }}
    >
      <ParallaxImage
        source={item.type === "video" ? item.image : { uri: item.image }}
        containerStyle={styles.imageContainer}
        style={styles.image}
        parallaxFactor={0.4}
        {...parallaxProps}
      />
      <View
        style={{
          backgroundColor: "#fff",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <View style={{ margin: 10 }}>
          {item.type === "berita" ? (
            <Text
              style={{
                color: COLORS.grey,
                marginVertical: 5,
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
                marginVertical: 5,
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
      </View>
    </TouchableOpacity>
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
  imageContainer: {
    flex: 1, // Prevent a random Android rendering issue
    backgroundColor: "white",
    // borderRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    // resizeMode: "cover",
    aspectRatio: 16 / 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
    aspectRatio: 16 / 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  galeri: {
    flex: 1, // Prevent a random Android rendering issue
    backgroundColor: "white",
    borderRadius: 8,
  },
  iOSBackdrop: {
    backgroundColor: "#000000",
    opacity: 0.3,
  },
  androidBackdrop: {
    backgroundColor: "#232f34",
    opacity: 0.32,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardVisiMisi: {
    backgroundColor: COLORS.primary,
    width: 77,
    height: 30,
    marginHorizontal: 15,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
});
