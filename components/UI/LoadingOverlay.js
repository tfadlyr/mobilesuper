import { StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/styles";

import Spinner from "react-native-loading-spinner-overlay";

function LoadingOverlay({ visible }) {
  return (
    <Spinner
      visible={visible}
      size="large"
      textStyle={styles.spinnerTextStyle}
      color={GlobalStyles.colors.blue}
    />
  );
}

export default LoadingOverlay;

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: "#000",
  },
});
