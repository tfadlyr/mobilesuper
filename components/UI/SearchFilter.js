import { StyleSheet, TouchableOpacity, View } from "react-native";
import { IconButton, Searchbar, Text, TextInput } from "react-native-paper";
import { GlobalStyles } from "../../constants/styles";
import { COLORS } from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";

function SearchFilter({
  tipe,
  searchQuery,
  setSearchQuery,
  getSearch,
  showBottomFilter,
  clearSearch,
}) {
  return (
    <View style={styles.containerRow}>
      <View
        style={tipe != "searchGlobal" ? { width: "85%" } : { width: "100%" }}
      >
        <Searchbar
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 12,
          }}
          placeholder="Cari..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onIconPress={getSearch}
          onSubmitEditing={getSearch}
          clearIcon={clearSearch}
          elevation={2}
          allowFontScaling={false}
        />
      </View>
      {tipe != "searchGlobal" && (
        <TouchableOpacity
          onPress={showBottomFilter}
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 8,
            height: 54,
            width: "12%",
            left: 15,
            justifyContent: "center",
            alignItems: "center",
            //shadow ios
            shadowOffset: { width: -2, height: 4 },
            shadowColor: "#171717",
            shadowOpacity: 0.2,
            //shadow android
            elevation: 2,
          }}
        >
          <Ionicons name="filter-outline" size={24} color={COLORS.lighter} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default SearchFilter;

const styles = StyleSheet.create({
  containerRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: GlobalStyles.colors.textWhite,
  },
});
