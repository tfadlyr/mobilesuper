import { Card } from "react-native-paper";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { GlobalStyles } from "../../constants/styles";

function CardTodo({ count, title, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.container}>
        {/* <Card.Content> */}
        <Text style={styles.count}>{count}</Text>
        <Text style={styles.title}>{title}</Text>
        {/* </Card.Content> */}
      </Card>
    </TouchableOpacity>
  );
}

export default CardTodo;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "30%",
    height: 100,
    borderRadius: 16,
    padding: 8,
    backgroundColor: GlobalStyles.colors.textWhite,
  },
  count: {
    fontSize: GlobalStyles.font.hd4,
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    textAlign: "center",
    fontSize: GlobalStyles.font.md,
  },
});
