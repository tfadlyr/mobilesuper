import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Button } from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import { COLORS } from "../config/SuperAppps";
import { Image } from "react-native";

export const Onboarding = () => {
  const navigation = useNavigation();
  return (
    <Swiper
      style={styles.wrapper}
      showsButtons={false}
      loop={false}
      autoplay={true}
    >
      <View style={styles.slide1}>
        {/* <Image source={require('../assets/superApp/logokkp.png')} style={{ width: 200, height: 200 }} /> */}
      </View>
      <View style={styles.slide2}>
        {/* <Image source={require('../assets/superApp/logokkp.png')} style={{ width: 200, height: 200 }} /> */}
      </View>
      <View style={styles.slide3}>
        {/* <Image source={require('../assets/superApp/logokkp.png')} style={{ width: 200, height: 200 }} /> */}
        {/* <View style={{ position: 'absolute', zIndex: 1, marginTop: 60 }}>
                    <Image source={require('../assets/superApp/logokkp.png')} style={{ width: 200, height: 200, zIndex: 100 }} />
                </View>
                <View style={{ marginTop: 60 }}>
                    <Image source={require('../assets/superApp/onboard.png')} style={{ width: 280, height: 280, }} />
                </View> */}
        <View style={{ position: "absolute", bottom: 150 }}>
          <Button
            title={"Next"}
            style={styles.buttonNext}
            textColor={COLORS.white}
            onClick={() => navigation.navigate("Login")}
          />
        </View>
      </View>
    </Swiper>
  );
};
const styles = StyleSheet.create({
  wrapper: {},
  slide1: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    flex: 1,
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    position: "relative",
  },
  text: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  buttonNext: {
    backgroundColor: COLORS.primary,
  },
});
