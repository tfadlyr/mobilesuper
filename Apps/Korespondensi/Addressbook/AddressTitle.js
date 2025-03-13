import { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  Checkbox,
  Divider,
  FAB,
  IconButton,
  List,
  Searchbar,
} from "react-native-paper";
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
import { nde_api } from "../../../utils/api.config";
import { getHTTP, handlerError } from "../../../utils/http";
import TreeView from "react-native-final-tree-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setDispoReceiver } from "../../../store/dispoMulti";
import { useNavigation } from "@react-navigation/core";

function AddressbookTitle({
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
  const [profileOrganization, setProfileOrganization] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isFocusUnit, setIsFocusUnit] = useState(false);
  const [searchQuery, setSearchQuery] = useState();
  const [searchList, setsearchList] = useState([]);
  const [searchShow, setSearchShow] = useState(false);
  const [selectedUnit, setselectedUnit] = useState();
  const [selectedDivision, setselectedDivision] = useState();
  const [unitList, setunitList] = useState([]);
  const [divisionList, setdivisionList] = useState([]);
  const [titleHirarki, settitleHirarki] = useState([]);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
  const renderItem = ({ item }) => (
    <View
      style={{ alignItems: "flex-start" }}
      key={item.nik ? item.nik : item.code}
    >
      <Checkbox.Item
        mode="android"
        label={item.title + "\n" + item.officer.official}
        status={
          selected?.findIndex((data) => data.code == item.code) != -1 ||
          selected?.findIndex((data) => data.title_code == item.code) != -1
            ? "checked"
            : "unchecked"
        }
        color={GlobalStyles.colors.tertiery}
        onPress={() => {
          setSelectedAddress(item);
        }}
        position="leading"
        labelStyle={styles.labelCheckbox}
      />
    </View>
  );

  useEffect(() => {
    //set fu/cfu divisi dan default unit
    cekAsyncProfileOrg();
    setselectedUnit(profileOrganization?.fucfu_id);
    getDiv(profileOrganization?.fucfu_id);
    setselectedDivision(profileOrganization?.division_id);
    getTitleHirarki(profileOrganization?.division_id);
    // get data
    if (searchQuery) {
      getTitleSearch();
    } else {
      getUnits();
    }
  }, [profileOrganization]);

  function setSelectedAddress(selected) {
    let data;
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
  async function cekAsyncProfileOrg() {
    if (profileOrganization == undefined) {
      let data = await AsyncStorage.getItem("profileOrganization");
      setProfileOrganization(JSON.parse(data));
    }
  }
  async function getUnits() {
    setIsLoading(true);
    try {
      let response = await getHTTP(nde_api.unit);
      setunitList(response.data);
      setSearchShow(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }
  async function getDiv(id) {
    setIsLoading(true);
    try {
      if (id != undefined) {
        let response = await getHTTP(
          nde_api.divisionbyunitid.replace("{$id}", id)
        );
        setdivisionList(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }
  async function getTitleHirarki(id) {
    setIsLoading(true);
    try {
      if (id != undefined) {
        let response = await getHTTP(
          nde_api.titlebydivisionid.replace("{$id}", id)
        );
        settitleHirarki(response?.data);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }
  async function getTitleSearch() {
    setIsLoading(true);
    try {
      let response = await getHTTP(
        nde_api.titleSearch
          .replace("{$word}", searchQuery)
          .replace("{$id}", profileOrganization?.division_id)
      );
      setSearchShow(true);
      setsearchList(response.data);
      setIsLoading(false);
    } catch (error) {
      handlerError(error, "Warning!", "Searching Title not working");
      setIsLoading(false);
    }
  }
  function getIndicator(isExpanded, hasChildrenNodes) {
    if (!hasChildrenNodes) {
      return "";
    } else if (isExpanded) {
      return "chevron-down";
    } else {
      return "chevron-right";
    }
  }
  return (
    <>
      <View style={{ marginBottom: 200 }}>
        {loadingOverlay}
        <Searchbar
          placeholder="Cari..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onIconPress={getTitleSearch}
          onSubmitEditing={getTitleSearch}
          clearIcon={() => (
            <>
              {searchQuery?.length > 0 && (
                <IconButton
                  icon="close"
                  onPress={() => {
                    setSearchQuery("");
                    setsearchList([]);
                    getUnits();
                  }}
                />
              )}
            </>
          )}
        />
        {(searchList.length == 0 || searchList == undefined) && !searchShow && (
          <>
            <Dropdown
              style={[styles.dropdown, isFocusUnit && { borderColor: "blue" }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              // inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={unitList}
              // search
              maxHeight={300}
              labelField="full_name"
              valueField="id"
              placeholder={!isFocusUnit ? "Pilih Unit" : "..."}
              // searchPlaceholder="Search..."
              value={selectedUnit}
              onFocus={() => setIsFocusUnit(true)}
              onBlur={() => setIsFocusUnit(false)}
              onChange={(item) => {
                setselectedUnit(item);
                getDiv(item.id);
                setIsFocusUnit(false);
              }}
            />
            <Divider bold={true} />
            <Dropdown
              style={[styles.dropdown, isFocusUnit && { borderColor: "blue" }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              // inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={divisionList}
              // search
              maxHeight={300}
              labelField="name"
              valueField="id"
              placeholder={!isFocusUnit ? "Pilih Divisi" : "..."}
              // searchPlaceholder="Search..."
              value={selectedDivision}
              onFocus={() => setIsFocusUnit(true)}
              onBlur={() => setIsFocusUnit(false)}
              onChange={(item) => {
                setselectedDivision(item);
                getTitleHirarki(item.id);
                setIsFocusUnit(false);
              }}
            />
            <Divider bold={true} />
            <ScrollView>
              <TreeView
                childrenKey="children"
                data={titleHirarki} // defined above
                renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
                  const marginTree = {
                    marginLeft: 25 * level,
                  };
                  return (
                    <>
                      {hasChildrenNodes && (
                        <List.Item
                          title={() => (
                            <Text style={styles.title}>{node.title}</Text>
                          )}
                          left={(props) => (
                            <List.Icon
                              {...props}
                              icon={getIndicator(isExpanded, hasChildrenNodes)}
                              style={{ width: 20 }}
                            />
                          )}
                          style={marginTree}
                        />
                      )}

                      {!hasChildrenNodes && (
                        <View style={{ flexDirection: "row" }}>
                          <Checkbox.Item
                            mode="android"
                            label={node.title + "\n" + node.officer.official}
                            status={
                              selected?.findIndex(
                                (data) => data.code == node.code
                              ) != -1 ||
                              selected?.findIndex(
                                (data) => data.title_code == node.code
                              ) != -1
                                ? "checked"
                                : "unchecked"
                            }
                            color={GlobalStyles.colors.tertiery}
                            onPress={async () => {
                              setSelectedAddress(node);
                            }}
                            position="leading"
                            labelStyle={styles.labelCheckbox}
                            style={marginTree}
                          />
                        </View>
                      )}
                      <Divider bold style={marginTree} />
                    </>
                  );
                }}
              />
            </ScrollView>
          </>
        )}
        {searchList.length != 0 && searchShow && (
          <FlatList
            data={searchList}
            renderItem={renderItem}
            keyExtractor={(item) => (item.nik ? item.nik : item.code)}
          />
        )}
        {searchList.length == 0 && searchShow && (
          <View style={styles.notfound}>
            <Text>Title not found</Text>
          </View>
        )}
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

export default AddressbookTitle;
const styles = StyleSheet.create({
  labelCheckbox: {
    width: "95%",
    textAlign: "left",
    fontSize: GlobalStyles.font.md,
  },
  subtitle: {
    fontSize: GlobalStyles.font.sm,
  },
  dropdown: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
