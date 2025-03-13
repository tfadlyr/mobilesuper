import React from "react";
import { Dimensions, useWindowDimensions } from "react-native";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { ParallaxImage } from "react-native-snap-carousel";
import {
  COLORS,
  fontSizeResponsive,
  getOrientation,
} from "../../config/SuperAppps";
import { Text } from "react-native";
import { useSelector } from "react-redux";

export const bannerKegiatan = ({ item, type = "", parallaxProps }) => {
  const { device } = useSelector((state) => state.apps);
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
        tempHeight = screenWidth;
      } else {
        tempHeight = screenWidth;
      }
    } else {
      tempHeight = 200;
    }

    return tempHeight;
  };

  return (
    <View
      style={{
        width: getWidthCarousel(),
        // height: getHeightCarousel(),
      }}
    >
      <ParallaxImage
        source={type === "portal" ? item.image : { uri: item.image }}
        containerStyle={styles.imageContainer}
        style={styles.images}
        parallaxFactor={0}
        {...parallaxProps}
      />
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.primary,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: 70,
            opacity: 0.5,
          }}
        />
        <Text
          style={{
            color: COLORS.white,
            marginVertical: 20,
            marginHorizontal: 40,
            textAlign: "center",
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {item.description}
        </Text>
      </View>
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
  imageContainer: {
    flex: 1, // Prevent a random Android rendering issue
    borderRadius: 8,
    resizeMode: "cover",
    aspectRatio: 16 / 8,
    backgroundColor: COLORS.white,
  },
  images: {
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
