import { ImageBackground, StyleSheet } from "react-native";
import { Config } from "../../constants/config";

function ImageBottomBg() {
  return (
    <ImageBackground
      source={Config.backgroundLayoutBottom}
      style={styles.container}
      imageStyle={styles.backgroundImage}
    ></ImageBackground>
  );
}

export default ImageBottomBg;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: 350,
    bottom:0
  },
  backgroundImage: {
    resizeMode: "cover",
    alignSelf: "flex-end",
  },
})