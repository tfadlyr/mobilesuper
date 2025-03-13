import { Pressable, View, StyleSheet, Text } from "react-native";
import { GlobalStyles } from "../../constants/styles";

function Button({ children, onPress, mode, style }) {
  return (
    <View style={style}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={[styles.button, mode === "flat" && styles.flat]}>
          <Text style={[styles.buttonText, mode == "flat" && styles.flatText]}>
            {children}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    padding: 8,
    minHeight:50,
    alignItems: "center",
    justifyContent: "center"
  },
  flat: {
    backgroundColor: "transparent",
  },
  buttonText: {
    color: GlobalStyles.colors.textWhite,
    textAlign: "center",
  },
  flatText: {
    color: GlobalStyles.colors.textBlack,
  },
  pressed: {
    opacity: 0.75,
    backgroundColor: GlobalStyles.colors.primaryVariant,
    borderRadius: 10,
  },
});
