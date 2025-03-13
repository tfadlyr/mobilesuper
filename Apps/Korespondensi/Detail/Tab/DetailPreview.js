import { StyleSheet, Text, View } from "react-native";

function DetailPreview() {
  return (
    <View style={styles.screen}>
      <Text>Detail Preview</Text>
    </View>
  );
}
export default DetailPreview;
const styles = StyleSheet.create({
  screen: {
    flex:1,
    padding: 16,
    backgroundColor: 'white'
  },
});
