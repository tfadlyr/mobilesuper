import React, { useRef } from "react";
import { Dimensions, Image, ScrollView } from "react-native";
import { Text, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { COLORS, FONTWEIGHT, fontSizeResponsive } from "../config/SuperAppps";
import { useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import Carousel from "react-native-snap-carousel";
import {
  bannerKegiatan as BannerKegiatan,
  bannerKegiatan,
} from "../components/BannerKegiatan";
import Banner1 from "../assets/superApp/Card-Background-Red.png";

export const PortalIos = () => {
  const { device } = useSelector((state) => state.apps);
  const carouselRef = useRef(null);
  const { width: screenWidth } = Dimensions.get("window");
  const banner = [
    {
      image: Banner1,
      description: "KKP Siapkan Skema Kemitraan Usaha Pemindangan (24/7)",
    },
    {
      image: Banner1,
      description: "KKP Siapkan Skema Kemitraan Usaha Pemindangan (24/7)",
    },
    {
      image: Banner1,
      description: "KKP Siapkan Skema Kemitraan Usaha Pemindangan (24/7)",
    },
  ];
  return (
    <ScrollView>
      <View
        style={{
          width: "100%",
          height: hp(25),
          position: "absolute",
          top: 0,
          borderBottomLeftRadius: 14,
          borderBottomRightRadius: 14,
        }}
      >
        <Image
          source={require("../assets/superApp/headerdark.png")}
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
          marginHorizontal: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginVertical: 50,
        }}
      >
        <View>
          <Text style={{ fontSize: 20, color: COLORS.white, width: 200 }}>
            Selamat Datang di KKP Portal!
          </Text>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {/* <Image
            source={require("../assets/superApp/Avatar.png")}
            style={{
              width: device === "tablet" ? 100 : 50,
              height: device === "tablet" ? 100 : 50,
              borderRadius: 8,
            }}
          /> */}
          <Text style={{ marginVertical: 10, color: COLORS.white }}>
            AZIS FAISAL
          </Text>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            <AntDesign name="logout" size={24} color={COLORS.white} />
            <Text style={{ color: COLORS.white }}>Keluar</Text>
          </View>
        </View>
      </View>

      <View>
        <Carousel
          ref={carouselRef}
          sliderWidth={screenWidth}
          sliderHeight={screenWidth}
          itemWidth={screenWidth - 60}
          data={banner}
          renderItem={({ item }, parallaxProps) => (
            <BannerKegiatan
              parallaxProps={parallaxProps}
              item={item}
              type="portal"
            />
          )}
          hasParallaxImages={true}
        />
        {/* <Carousel
          ref={carouselRef}
          sliderWidth={screenWidth}
          sliderHeight={screenWidth}
          itemWidth={screenWidth - 60}
          data={banner}
          renderItem={bannerKegiatan}
          hasParallaxImages={true}
        /> */}
      </View>
    </ScrollView>
  );
};
