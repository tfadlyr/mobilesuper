import { useEffect, useRef, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { Button, IconButton, Searchbar, Text } from "react-native-paper";
import { GlobalStyles } from "../../../constants/styles";
import { nde_api } from "../../../utils/api.config";
import { getHTTP, handlerError, postHTTP } from "../../../utils/http";
import LottieView from "lottie-react-native";
import { Config } from "../../../constants/config";
import { Dropdown } from "react-native-element-dropdown";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";

function DigisignSearchEmail({ route }) {
  const [search, setSearch] = useState("");
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const animation = useRef(null);
  const id = route?.params?.id;

  useEffect(() => {
    // action on update of movies
    if (search.length > 2) {
      getSearch();
    }
  }, [search]);
  async function getSearch() {
    setIsLoading(true);
    try {
      let response;
      response = await getHTTP(
        nde_api.searchEmailSign.replace("{$keyword}", search)
      );
      if (response?.data?.code == 200) {
        setList(response?.data);
        setIsLoading(false);
      } else {
        setList(response?.data);
        Alert.alert("Warning!", response?.data?.msg);
        setIsLoading(false);
      }
    } catch (error) {
      handlerError(error, "Warning!", "Search email not working");
      setIsLoading(false);
    }
  }

  async function sendEmail() {
    setIsLoading(true);
    try {
      let response;
      let data = { email: selected.email, id: id };
      response = await postHTTP(nde_api.sendPenandatangan, data);
      if (response?.data?.code) {
        Alert.alert("Info!", response?.data?.msg);
        setIsLoading(false);
      } else {
        Alert.alert("Warning!", response?.data?.msg);
        setIsLoading(false);
      }
    } catch (error) {
      handlerError(error, "Warning!", "Send email not working");
      setIsLoading(false);
    }
  }
  function clearSearch() {
    setSearch("");
    setList([]);
  }

  const listEmpty = (
    <View style={styles.notFound}>
      <LottieView
        autoPlay
        ref={animation}
        style={[styles.titleNotFound, { width: "100%", height: 200 }]}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={Config.notFound}
      />
      <Text style={styles.titleNotFound}>
        {isLoading
          ? "Loading..."
          : list?.data?.count == 0
            ? "Email not found"
            : list.length == 0
              ? "Please search email to Sign"
              : "Loading..."}
      </Text>
    </View>
  );
  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
  return (
    <>
      {isLoading && loadingOverlay}
      <View style={styles.container}>
        <Text style={{ marginBottom: 8 }}>Search Email</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={list?.data?.count == 0 ? [] : list?.data}
          search
          maxHeight={300}
          labelField="email"
          valueField="email"
          placeholder="Select email"
          searchPlaceholder="Search..."
          value={selected}
          onChangeText={(item) => {
            setSearch(item);
          }}
          onChange={(item) => {
            setSelected(item);
          }}
          renderLeftIcon={() => <IconButton icon="magnify" />}
        />
        <Button
          mode="contained"
          style={{ backgroundColor: GlobalStyles.colors.tertiery }}
          onPress={() => sendEmail()}
        >
          Sign
        </Button>
        {/* <Searchbar
        style={{
          borderRadius: 12,
          backgroundColor: GlobalStyles.colors.textWhite,
        }}
        placeholder="Search Email"
        onChangeText={setSearch}
        value={search}
        onIconPress={getSearch}
        onSubmitEditing={getSearch}
        // clearIcon={clearSearch}
      />
      {list && (
        <FlatList
          data={list?.data?.count == 0 ? [] : list?.data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Text>{item.email}</Text>}
          ListEmptyComponent={listEmpty}
        /> */}
        {/* )} */}
      </View>
    </>
  );
}

export default DigisignSearchEmail;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  notFound: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  titleNotFound: {
    textAlign: "center",
    paddingVertical: 32,
    color: GlobalStyles.colors.primary,
  },
  dropdown: {
    height: 50,
    borderWidth: 0.5,
    borderRadius: 12,
    paddingHorizontal: 8,
    marginBottom: 8,
    backgroundColor: GlobalStyles.colors.textWhite,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
