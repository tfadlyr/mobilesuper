import React, { Fragment, useEffect, useState } from "react";
import { Alert, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getTokenValue } from "../service/session";
import { getDivision, getDivisionTree } from "../service/api";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import { Dropdown } from "../components/DropDown";
import { COLORS, FONTWEIGHT, fontSizeResponsive } from "../config/SuperAppps";
import { ScrollView } from "react-native";
import TreeView from "react-native-final-tree-view";
import { Ionicons } from "@expo/vector-icons";
import {
  setAddressbookListsDivision,
  setAddressbookListsDivisionTree,
  setAddressbookSelected,
} from "../store/AddressbookKKP";
import { TouchableOpacity } from "@gorhom/bottom-sheet";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { nde_api } from "../utils/api.config";
import { getHTTP, handlerError } from "../utils/http";
import { FlatList } from "react-native";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native";

export const AddressBookJabatan = ({ route }) => {
  const [token, setToken] = useState("");
  const [inputValue, setinputValue] = useState("");
  const [searchQuery, setsearchQuery] = useState("");
  const [searchList, setsearchList] = useState([]);
  const [selectedDivision, setselectedDivision] = useState();
  const { profile, unker } = useSelector((state) => state.profile);
  const { config } = route.params;
  const dispatch = useDispatch();
  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      if (config.tipeAddress === "korespondensi") {
        //initial default
        getDiv(profile?.fucfu_id ? profile?.fucfu_id : 1);
        if (profile?.fucfu_id) {
          setKategori(unker);
          setselectedDivision(unker?.key);
          getTitleHirarki(unker?.key);
        }
      } else {
        dispatch(getDivision(token));
        // dispatch(getEmployee(token))
        // dispatch(getDivisionTree({ token: token, id: kategori.key }))
      }
    }
  }, [token, profile, listTree]);

  async function getDiv(id) {
    // setIsLoading(true);
    try {
      if (id != undefined) {
        let response = await getHTTP(
          nde_api.divisionbyunitid.replace("{$id}", id)
        );
        const replaceData = response.data.map(({ id, name }) => ({
          key: id,
          value: name,
        }));
        // setdivisionList(replaceData);
        dispatch(setAddressbookListsDivision(replaceData));
      }
      // setIsLoading(false);
    } catch (error) {
      // setIsLoading(false);
    }
  }

  async function getTitleHirarki(id) {
    // setIsLoading(true);
    try {
      if (id != undefined) {
        let response = await getHTTP(
          nde_api.titlebydivisionid.replace("{$id}", id)
        );
        dispatch(setAddressbookListsDivisionTree(response?.data));
      }
      // setIsLoading(false);
    } catch (error) {
      // setIsLoading(false);
    }
  }

  async function getTitleSearch() {
    try {
      setsearchQuery(inputValue);
      let response = await getHTTP(
        nde_api.titleSearch
          .replace("{$word}", inputValue)
          .replace("{$id}", selectedDivision)
      );
      setsearchList(response.data);
    } catch (error) {
      console.log(error);
      handlerError(error, "Peringatan!", "Pencarian Jabatan tidak berfungsi");
    }
  }

  const [kategori, setKategori] = useState();

  const { addressbook } = useSelector((state) => state.addressBookKKP);
  function getIndicator(isExpanded) {
    if (isExpanded) {
      return (
        <Ionicons
          name="chevron-down-outline"
          size={20}
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        />
      );
    } else {
      return (
        <Ionicons
          name="chevron-forward-outline"
          size={20}
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        />
      );
    }
  }

  const [listTree, setListTree] = useState([]);
  const [selectedlistTree, setSelectedsetListTree] = useState([]);

  useEffect(() => {
    setListTree(addressbook.listsDivisiontree);
  }, [addressbook.listsDivisiontree]);

  const navigation = useNavigation();

  // const filterselect = (node) => {
  //     if (selectedlistTree.length === 0) {
  //         setSelectedsetListTree([...selectedlistTree, node])
  //     } else {
  //         let data = selectedlistTree.filter(item => item.id === node.id)
  //         if (data.length == 0) {
  //             setSelectedsetListTree([...selectedlistTree, node])
  //         }
  //     }

  // }

  const deleteItem = (id, state) => {
    let data;
    if (state === "jabatan") {
      if (config.tipeAddress == "korespondensi") {
        data = addressbook.selected.filter((data) => {
          let code = data.code;
          return code !== id;
        });
      } else {
        data = addressbook.selected.filter((data) => {
          let nip = data.nip || data?.officer?.official.split("/")[1];
          return nip !== id;
        });
      }
      dispatch(setAddressbookSelected(data));
    } else {
      if (config.tipeAddress == "korespondensi") {
        data = addressbook.selected.filter((data) => data.nik !== id);
      } else {
        data = addressbook.selected.filter((data) => data.nip !== id);
      }
      dispatch(setAddressbookSelected(data));
    }
  };

  const { device } = useSelector((state) => state.apps);
  const renderItem = ({ item, index }) => (
    <View style={{ marginBottom: 10 }}>
      <TouchableOpacity
        style={{
          marginHorizontal: 15,
          paddingVertical: 10,
          paddingHorizontal: 10,
          borderRadius: 8,
          backgroundColor: COLORS.white,
          //shadow ios
          shadowOffset: { width: -2, height: 4 },
          shadowColor: "#171717",
          shadowOpacity: 0.2,
          //shadow android
          elevation: 2,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onPress={() => {
          const checkNode = addressbook.selected.filter(
            (data) => data.id === item.id
          );
          if (checkNode.length > 0) {
            if (config.tipeAddress == "korespondensi") {
              checkNode.map((item) => {
                deleteItem(item.code, "jabatan");
              });
            } else {
              checkNode.map((item) => {
                deleteItem(
                  item.nip || item.officer.official.split("/")[1],
                  "jabatan"
                );
              });
            }
          } else {
            if (config.multiselect) {
              dispatch(setAddressbookSelected([...addressbook.selected, item]));
            } else {
              dispatch(setAddressbookSelected([item]));
            }
          }
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {checkedNodeRadio(item) ? (
            <Ionicons name="ellipse" size={24} color={COLORS.primary} />
          ) : (
            <Ionicons name="ellipse-outline" size={24} />
          )}
          <View style={{ flexDirection: "column", width: "90%" }}>
            <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
              {item.title}
            </Text>
            <Text
              style={{
                color: COLORS.lighter,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {item.officer.official}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const checkedNodeRadio = (node) => {
    const checkNode = addressbook.selected.filter(
      (item) => item.code === node.code
    );
    if (checkNode.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <View
      style={{
        // justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "brown",
        maxHeight: "95%",
      }}
    >
      {config.tipeAddress == "korespondensi" && (
        <>
          <View
            style={{
              marginHorizontal: 15,
              marginBottom: 20,
              marginTop: 10,
              backgroundColor: COLORS.white,
              borderRadius: 8,
              width: "95%",
            }}
          >
            <View style={styles.input}>
              <Ionicons
                name="search"
                size={fontSizeResponsive("H3", device)}
                color={COLORS.primary}
              />
              <TextInput
                placeholder={"Cari..."}
                style={{ fontSize: fontSizeResponsive("H4", device), flex: 1 }}
                maxLength={30}
                value={inputValue}
                onChangeText={(text) => setinputValue(text)}
                onEndEditing={getTitleSearch}
                clearButtonMode="always"
                allowFontScaling={false}
              />
            </View>
          </View>
          {searchQuery?.length != 0 && (
            <FlatList
              keyExtractor={(item) => item.id}
              data={searchList}
              renderItem={renderItem}
              // ListEmptyComponent={listEmpty}
              // refreshing={isLoading}
              // onRefresh={refresh}
              // onEndReached={loadMore}
            />
          )}
        </>
      )}
      {searchQuery?.length == 0 && (
        <>
          <View style={{ marginTop: 10, gap: 10, width: "90%" }}>
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Jabatan
            </Text>
            <Dropdown
              data={addressbook?.listsDivision}
              heightValue={"75%"}
              selected={kategori}
              setSelected={setKategori}
              handleClick={(item) => {
                if (config.tipeAddress == "korespondensi") {
                  setselectedDivision(item.key);
                  getTitleHirarki(item.key);
                } else {
                  dispatch(getDivisionTree({ token: token, id: item.key }));
                }
              }}
              borderWidth={1}
              borderColor={COLORS.ExtraDivinder}
              borderwidthDrop={1}
              borderColorDrop={COLORS.ExtraDivinder}
              borderWidthValue={1}
              borderColorValue={COLORS.ExtraDivinder}
              placeHolder={"Berdasarkan"}
              backgroundColor={COLORS.white}
              search={true}
            />
            {kategori !== undefined ? (
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Hirarki
              </Text>
            ) : null}
          </View>

          {kategori !== undefined ? (
            <ScrollView
              style={{
                backgroundColor: COLORS.white,
                marginTop: 10,
                width: "90%",
                borderRadius: 8,
                padding: 10,
                marginBottom: 50,
              }}
            >
              <TreeView
                data={listTree} // defined above
                childrenKey={
                  config.tipeAddress == "korespondensi" ? "nodes" : "children"
                }
                onNodePress={({ node }) => {
                  if (
                    node?.children === undefined &&
                    node?.nodes === undefined
                  ) {
                    const checkNode = addressbook.selected.filter(
                      (item) => item.code === node.code
                    );
                    if (checkNode.length > 0) {
                      if (config.tipeAddress == "korespondensi") {
                        checkNode.map((item) => {
                          deleteItem(item.code, "jabatan");
                        });
                      } else {
                        checkNode.map((item) => {
                          deleteItem(
                            item.nip || item.officer.official.split("/")[1],
                            "jabatan"
                          );
                        });
                      }
                    } else {
                      if (config.multiselect) {
                        dispatch(
                          setAddressbookSelected([
                            ...addressbook.selected,
                            node,
                          ])
                        );
                      } else {
                        dispatch(setAddressbookSelected([node]));
                        navigation.goBack();
                      }
                    }
                  }
                }}
                renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
                  return (
                    <>
                      <View
                        style={{
                          paddingVertical: 6,
                        }}
                      >
                        <View
                          style={{
                            display: "flex",
                            flex: 1,
                            flexDirection: "column",
                            gap: 4,
                            marginLeft: 30 * level,
                            // backgroundColor: "red",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 10,
                              justifyContent: "space-between",
                              backgroundColor: hasChildrenNodes
                                ? "#FDEFD2"
                                : null,
                              borderRadius: hasChildrenNodes ? 4 : null,
                              paddingHorizontal: hasChildrenNodes ? 5 : null,
                            }}
                          >
                            {hasChildrenNodes ? null : (
                              <View
                                style={{
                                  position: "absolute",
                                  top: "25%",
                                  left: device === "tablet" ? "-4%" : "-10%",
                                }}
                              >
                                {checkedNodeRadio(node) ? (
                                  <Ionicons
                                    name="ellipse"
                                    size={24}
                                    color={COLORS.primary}
                                  />
                                ) : (
                                  <Ionicons name="ellipse-outline" size={24} />
                                )}
                              </View>
                            )}
                            <Text
                              style={{
                                fontWeight: FONTWEIGHT.bold,
                                flexShrink: 1,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              {node.title}
                            </Text>

                            {/* {hasChildrenNodes ? null : (
                          <TouchableOpacity>
                            <Ionicons
                              name="information-circle-outline"
                              size={24}
                              color={COLORS.primary}
                            />
                          </TouchableOpacity>
                        )} */}

                            {hasChildrenNodes ? (
                              <Text
                                style={{
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {getIndicator(isExpanded)}
                              </Text>
                            ) : null}
                          </View>

                          {hasChildrenNodes ? null : node.officer.official !==
                            "" ? (
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              {node.officer.official}
                            </Text>
                          ) : null}
                        </View>
                        {/* custom divider */}
                        {level == 0 && isExpanded ? (
                          <View
                            style={{
                              height: 1,
                              width: "100%",
                              backgroundColor: "#DBDADE",
                              marginVertical: 10,
                            }}
                          />
                        ) : level == 0 && !isExpanded ? (
                          <></>
                        ) : (
                          <View
                            style={{
                              height: 1,
                              width: "100%",
                              backgroundColor: "#DBDADE",
                              marginVertical: 10,
                            }}
                          />
                        )}
                      </View>
                    </>
                  );
                }}
              />
            </ScrollView>
          ) : null}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.ExtraDivinder,
    borderRadius: 8,
  },
});
