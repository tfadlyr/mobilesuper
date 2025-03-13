import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { GlobalStyles } from "../../../../constants/styles";

function ActionDigisign({ id }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button
        onPress={() => {
          navigation.navigate("DigisignSearchEmail", {
            id: id,
            title: "Sign\nSearch Email",
          });
        }}
        mode="contained"
        style={[{ backgroundColor: GlobalStyles.colors.tertiery }]}
      >
        Sign
      </Button>
    </View>
  );
}

export default ActionDigisign;
const styles = StyleSheet.create({
  container: { marginTop: 8 },
  button: {
    width: "49%",
    marginBottom: 16,
  },
  containerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
