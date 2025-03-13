import { useNavigation } from "@react-navigation/core";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Checkbox, FAB, IconButton, Searchbar, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import { GlobalStyles } from "../../../constants/styles";
import {
  setAdditionalApproverAddressbook,
  setApproverAddressbook,
  setCopytosAddressbook,
  setReceiversAddressbook,
  setSenderAddressbook,
} from "../../../store/addressbook";
import { setDispoReceiver } from "../../../store/dispoMulti";
import { nde_api } from "../../../utils/api.config";
import { getHTTP } from "../../../utils/http";

function AddressbookEmployee({
  route,
  multipleSelected,
  indexDispo,
  tipeAddress,
}) {
  const multiple = multipleSelected
    ? multipleSelected
    : route?.params?.multiple;
  const tipe = tipeAddress ? tipeAddress : route?.params?.tipe;
  let selected;
  //init data dari penyimpanan sesuai tipe addressbook
  if (indexDispo != undefined) {
    selected = useSelector(
      (state) => state.dispoMulti.data[indexDispo].kepadaDispo
    );
  } else if (tipe == "sender") {
    selected = useSelector((state) => state.addressbook.sender);
  } else if (tipe == "receivers") {
    selected = useSelector((state) => state.addressbook.receivers);
  } else if (tipe == "copytos") {
    selected = useSelector((state) => state.addressbook.copytos);
  } else if (tipe == "additional_approver") {
    selected = useSelector((state) => state.addressbook.additional_approver);
  } else if (tipe == "approver") {
    selected = useSelector((state) => state.addressbook.approver);
  } else {
    selected = useSelector((state) => state.addressbook.receivers);
  }
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState();
  const [list, setList] = useState([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );

  useEffect(() => {
    //get addressbbook
    if (searchQuery) {
      getEmployeeSearch();
    } else {
      getEmployeeDefault();
    }
  }, [tipe]);
  const renderItem = ({ item }) => (
    <View style={{ alignItems: "flex-start" }}>
      <Checkbox.Item
        key={item.nik}
        mode="android"
        label={item.fullname}
        status={
          selected?.findIndex((data) => data.nik == item.nik) != -1 ||
          selected?.findIndex((data) => data.code == item.nik) != -1
            ? "checked"
            : "unchecked"
        }
        color={GlobalStyles.colors.tertiery}
        onPress={async () => {
          setSelectedAddress(item);
        }}
        position="leading"
        labelStyle={styles.labelCheckbox}
      />
    </View>
  );
  function setSelectedAddress(selected) {
    let data;
    // set addressbook sesuai tipe
    if (indexDispo != undefined) {
      data = { index: indexDispo, selected: selected };
      dispatch(setDispoReceiver(data));
    } else {
      data = { multiple: multiple, selected: selected };
      if (tipe == "sender") {
        dispatch(setSenderAddressbook(data));
      } else if (tipe == "receivers") {
        dispatch(setReceiversAddressbook(data));
      } else if (tipe == "copytos") {
        dispatch(setCopytosAddressbook(data));
      } else if (tipe == "additional_approver") {
        dispatch(setAdditionalApproverAddressbook(data));
      } else if (tipe == "approver") {
        dispatch(setApproverAddressbook(data));
      } else {
        dispatch(setReceiversAddressbook(data));
      }
    }
  }
  async function getEmployeeDefault() {
    setIsLoading(true);
    try {
      let response = await getHTTP(nde_api.employee);
      setList(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }
  async function getEmployeeSearch() {
    setIsLoading(true);
    try {
      let response = await getHTTP(
        nde_api.employeeSearch.replace("{$word}", searchQuery)
      );
      setList(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }
  return (
    <>
      <View style={{ marginBottom: 80 }}>
        {loadingOverlay}
        <Searchbar
          placeholder="Cari..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onIconPress={getEmployeeSearch}
          onSubmitEditing={getEmployeeSearch}
          clearIcon={() => (
            <>
              {searchQuery?.length > 0 && (
                <IconButton
                  icon="close"
                  onPress={() => {
                    setSearchQuery("");
                    getEmployeeDefault();
                  }}
                />
              )}
            </>
          )}
        />
        {list.length != 0 && (
          <FlatList
            data={list}
            renderItem={renderItem}
            keyExtractor={(item) => item.nik}
          />
        )}
        {list.length == 0 && (
          <View style={styles.notfound}>
            <Text>Employee not found</Text>
          </View>
        )}

        {/* <Portal> */}
        {/* </Portal> */}
      </View>

      <FAB
        icon="check"
        style={styles.fab}
        onPress={() => {
          navigation.goBack();
        }}
      />
    </>
  );
}

export default AddressbookEmployee;
const styles = StyleSheet.create({
  labelCheckbox: {
    width: "95%",
    textAlign: "left",
  },
  notfound: {
    flexDirection: "row",
    padding: 16,
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 30,
    borderRadius: 50,
  },
});
