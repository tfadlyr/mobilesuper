import { useNavigation } from "@react-navigation/core";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import TreeView from "react-native-final-tree-view";
import {
  Checkbox,
  Divider,
  FAB,
  IconButton,
  List,
  Searchbar,
  Text,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import { GlobalStyles } from "../../../constants/styles";
import { setKMAddressbook } from "../../../store/addressbook";
import { nde_api } from "../../../utils/api.config";
import { getHTTP } from "../../../utils/http";

function AddressbookKM() {
  let selected = useSelector((state) => state.addressbook.km);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [km, setKM] = useState([]);
  const [kmSearch, setKMSearch] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );

  useEffect(() => {
    if (searchQuery) {
      getKMSearch();
    } else {
      getKMDefault();
    }
  }, []);
  const renderItem = ({ item }) => (
    <View style={{ alignItems: "flex-start" }}>
      <Checkbox.Item
        key={item.code}
        mode="android"
        label={item.topic + "\n" + item.description}
        status={
          selected?.findIndex((data) => data.code == item.code) != -1
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
    data = { selected: selected };
    dispatch(setKMAddressbook(data));
  }
  async function getKMDefault() {
    setIsLoading(true);
    try {
      let response = await getHTTP(nde_api.kmtree);
      setKM(response?.data);
      setKMSearch(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }
  async function getKMSearch() {
    setIsLoading(true);
    try {
      let response = await getHTTP(
        nde_api.kmSearch.replace("{$word}", searchQuery)
      );
      setKM(response?.data);
      setKMSearch(true);
      setIsLoading(false);
    } catch (error) {
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
      <ScrollView>
        <View>
          {loadingOverlay}
          <Searchbar
            placeholder="Cari..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            onIconPress={getKMSearch}
            onSubmitEditing={getKMSearch}
            clearIcon={() => (
              <>
                {searchQuery?.length > 0 && (
                  <IconButton
                    icon="close"
                    onPress={() => {
                      setSearchQuery("");
                      setKMSearch([]);
                      getKMDefault();
                    }}
                  />
                )}
              </>
            )}
          />
          {kmSearch && (
            <FlatList
              data={km}
              renderItem={renderItem}
              keyExtractor={(item) => item.code}
            />
          )}
          {kmSearch && km.length == 0 && (
            <View style={styles.notfound}>
              <Text>Klasifikasi Masalah not found</Text>
            </View>
          )}

          {!kmSearch && (
            <TreeView
              childrenKey="children"
              data={km} // defined above
              renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
                const marginTree = {
                  marginLeft: 25 * level,
                };
                return (
                  <>
                    {hasChildrenNodes && (
                      <List.Item
                        title={() => (
                          <Text style={styles.title}>{node.topic}</Text>
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
                          label={node.topic + "\n" + node.description}
                          status={
                            selected?.findIndex(
                              (data) => data.code == node.code
                            ) != -1
                              ? "checked"
                              : "unchecked"
                          }
                          color={GlobalStyles.colors.tertiery}
                          onPress={() => {
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
          )}
        </View>
      </ScrollView>
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

export default AddressbookKM;
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
    bottom: 0,
    borderRadius: 50,
  },
});
