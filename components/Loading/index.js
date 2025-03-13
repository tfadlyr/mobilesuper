import React from "react";
import LottieView from "lottie-react-native";
import { Dimensions, StyleSheet, View } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { COLORS } from "../../config/SuperAppps";

export const Loading = () => {
  return (
    <Spinner
      visible={true}
      size="large"
      textStyle={styles.spinnerTextStyle}
      color={COLORS.primary}
    />
  );
};

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#000",
  },
});
