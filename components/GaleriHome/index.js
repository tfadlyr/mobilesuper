import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { View } from "react-native";
import { ParallaxImage } from "react-native-snap-carousel";
import { COLORS, getOrientation } from "../../config/SuperAppps";
import { Dimensions } from "react-native";
import { Text } from "react-native";
import { useSelector } from "react-redux";

export const GaleriHome = ({ item, index, parallaxProps }) => {
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
      tempHeight = screenWidth;
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
        source={{ uri: item.main_images.image }}
        containerStyle={styles.galeri}
        style={styles.image}
        parallaxFactor={0.4}
        {...parallaxProps}
      />
      <View
        style={{
          backgroundColor: "white",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        <View style={{ margin: 10 }}>
          <Text style={{ fontSize: 15, marginVertical: 10, fontWeight: 600 }}>
            {item.title}
          </Text>
        </View>
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
    backgroundColor: "white",
    // borderRadius: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
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
    resizeMode: "cover",
    aspectRatio: 16 / 8,
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
