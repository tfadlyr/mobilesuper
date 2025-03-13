import React, { useEffect, useState } from "react";
import { Alert, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getTokenValue } from "../service/session";
import { View } from "react-native";
import { Dropdown } from "../components/DropDown";
import { COLORS, FONTWEIGHT, fontSizeResponsive } from "../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import {
  setAddressbookListsDivision,
  setAddressbookListsDivisionPara,
  setAddressbookSelected,
} from "../store/AddressbookKKP";
import { TouchableOpacity } from "@gorhom/bottom-sheet";

import { nde_api } from "../utils/api.config";
import { getHTTP, handlerError } from "../utils/http";
import { FlatList } from "react-native";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native";

export const AddressbookPara = ({ route }) => {
  const [token, setToken] = useState("");
  const { profile, unker, selectedAttr } = useSelector(
    (state) => state.profile
  );
  const [inputValue, setinputValue] = useState("");
  const [searchQuery, setsearchQuery] = useState("");
  const [searchList, setsearchList] = useState([]);
  const [selectedDivision, setselectedDivision] = useState();
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
          getParaHirarki(unker?.key);
        }
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

  async function getParaHirarki(id) {
    // setIsLoading(true);
    try {
      if (id != undefined) {
        if (selectedAttr?.code === "") {
          let response = await getHTTP(
            nde_api.parabydivisionid + profile.nik + "/"
          );
          // nde_api.parabydivisionid.replace("{$id}", id)
          dispatch(setAddressbookListsDivisionPara(response?.data));
        } else {
          let response = await getHTTP(
            nde_api.parabydivisionid + selectedAttr?.code + "/"
          );
          // nde_api.parabydivisionid.replace("{$id}", id)
          dispatch(setAddressbookListsDivisionPara(response?.data));
        }
      }
      // setIsLoading(false);
    } catch (error) {
      // setIsLoading(false);
    }
  }

  async function getParaSearch() {
    try {
      if (selectedAttr?.code === "") {
        setsearchQuery(inputValue);
        let response = await getHTTP(
          nde_api.parabydivisionid + profile.nik + "/?query=" + inputValue
        );
        setsearchList(response.data);
      } else {
        setsearchQuery(inputValue);
        let response = await getHTTP(
          nde_api.parabydivisionid +
            selectedAttr?.code +
            "/?query=" +
            inputValue
        );
        setsearchList(response.data);
      }
    } catch (error) {
      handlerError(error, "Peringatan!", "Pencarian Para tidak berfungsi");
    }
  }

  const [kategori, setKategori] = useState();

  const { addressbook } = useSelector((state) => state.addressBookKKP);
  const [listTree, setListTree] = useState([]);

  useEffect(() => {
    setListTree(addressbook.listsDivisionPara);
  }, [addressbook.listsDivisionPara]);

  const deleteItem = (id, state) => {
    let data;
    if (state === "jabatan") {
      if (config.tipeAddress == "korespondensi") {
        data = addressbook.selected.filter(
          (item) => !id.some((dataItem) => dataItem.code === item.code)
        );
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
    <View style={{ marginBottom: 10 }} key={item.id}>
      <TouchableOpacity
        style={{
          // marginHorizontal: 15,
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
          const temp = item.code.startsWith("G")
            ? item.officer.officials.map((title, index) => ({
                title,
                code: item.officer.officials_id[index],
                id: item.officer.officials_id[index],
              }))
            : [];
          const checkNode = addressbook.selected.filter((data) =>
            temp.some((tempItem) => tempItem.id === data.id)
          );
          if (checkNode.length > item.officer.officials_id?.length) {
            if (config.tipeAddress == "korespondensi") {
              deleteItem(checkNode, "jabatan");
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
                  ...temp.filter(
                    (item) =>
                      !addressbook.selected.some(
                        (sel) => sel.code === item.code
                      )
                  ),
                ])
              );
            } else {
              dispatch(setAddressbookSelected([temp]));
            }
          }
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {/* {checkedNodeRadio(item) ? (
            <Ionicons name="ellipse" size={24} color={COLORS.primary} />
          ) : (
            <Ionicons name="ellipse-outline" size={24} />
          )} */}
          <View style={{ flexDirection: "column", width: "100%" }}>
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
      (item) => item.id === node.id
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
                onEndEditing={getParaSearch}
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
              Berdasarkan
            </Text>
            <Dropdown
              data={addressbook?.listsDivision}
              heightValue={"75%"}
              selected={kategori}
              setSelected={setKategori}
              handleClick={(item) => {
                if (config.tipeAddress == "korespondensi") {
                  setselectedDivision(item.key);
                  getParaHirarki(item.key);
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
            <FlatList
              data={listTree}
              renderItem={renderItem}
              style={{ marginBottom: 40, width: "90%" }}
              keyExtractor={(item) => item.code}
            />
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
