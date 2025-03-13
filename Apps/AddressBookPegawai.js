import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getTokenValue } from "../service/session";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { getEmployee } from "../service/api";
import { COLORS, FONTWEIGHT, fontSizeResponsive } from "../config/SuperAppps";
import {
  setAddressbookEmployee,
  setAddressbookSelected,
} from "../store/AddressbookKKP";
import { Ionicons } from "@expo/vector-icons";
import { Search } from "../components/Search";
import { nde_api } from "../utils/api.config";
import { getHTTP } from "../utils/http";

const CardPegawai = ({ data, addressbook, config, device }) => {
  const dispatch = useDispatch();

  const checkedNodeRadio = () => {
    const checkNode = addressbook.selected.filter(
      (item) =>
        (item.nip === data.nip && item.nik === data.nik) ||
        item.code === data.nik
    );
    if (checkNode.length > 0) {
      return true;
    } else {
      return false;
    }
  };

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

  return (
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
            (item) =>
              (item.nip === data.nip && item.nik === data.nik) ||
              item.code === data.nik
          );
          if (checkNode.length > 0) {
            if (config.tipeAddress == "korespondensi") {
              checkNode.map((item) => {
                deleteItem(item.nik, "pegawai");
              });
            } else {
              checkNode.map((item) => {
                deleteItem(item.nip, "pegawai");
              });
            }
          } else {
            if (config.multiselect) {
              dispatch(setAddressbookSelected([...addressbook.selected, data]));
            } else {
              dispatch(setAddressbookSelected([data]));
            }
          }
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {checkedNodeRadio() ? (
            <Ionicons name="ellipse" size={24} color={COLORS.primary} />
          ) : (
            <Ionicons name="ellipse-outline" size={24} />
          )}
          <View style={{ flexDirection: "column" }}>
            <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
              {data.nama ? data.nama : data.name}
            </Text>
            <Text
              style={{
                color: COLORS.lighter,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {data.nip ? data.nip : data.nik}
            </Text>
          </View>
        </View>
        {/* <TouchableOpacity>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity> */}
      </TouchableOpacity>
    </View>
  );
};

export const AddressBookPegawai = ({ route }) => {
  const [token, setToken] = useState("");
  const { config } = route.params;

  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (token !== "") {
      if (config.tipeAddress === "korespondensi" && search.length == 0) {
        (async () => {
          let response = await getHTTP(nde_api.employee);
          dispatch(setAddressbookEmployee(response.data));
        })();
      } else {
        dispatch(getEmployee({ token: token, search: search }));
      }
      // dispatch(getDivisionTree({ token: token, id: kategori.key }))
    }
  }, [token, search]);

  const { addressbook } = useSelector((state) => state.addressBookKKP);

  const [filterData, setFilterData] = useState([]);

  useEffect(() => {
    if (config.tipeAddress != "korespondensi") {
      setFilterData(addressbook.employee);
    }
  }, [addressbook]);

  filter = () => {
    setSearch(inputValue);
  };

  useEffect(() => {
    if (search.length != 0) {
      let data;
      if (config.tipeAddress === "korespondensi") {
        (async () => {
          let response = await getHTTP(
            nde_api.employeeSearch.replace("{$word}", search)
          );
          data = response.data;
          setFilterData(data);
        })();
      } else {
        data = addressbook.employee?.filter((item) => {
          return item.nama.toLowerCase().includes(search.toLowerCase());
        });
        setFilterData(data);
      }
    } else {
      if (config.tipeAddress === "korespondensi") {
        (async () => {
          let response = await getHTTP(nde_api.employee);
          data = response.data;
          setFilterData(data);
        })();
      } else {
        setFilterData(addressbook.employee);
      }
    }
  }, [search]);

  const { device } = useSelector((state) => state.apps);

  return (
    <View style={{ height: "95%", paddingVertical: 10 }}>
      {/* <View style={{ flexDirection: "row", backgroundColor: COLORS.infoLight }}>
        <Text
          style={{
            width: "49%",
            marginHorizontal: 20,
            fontWeight: FONTWEIGHT.bold,
          }}
        >
          Nama
        </Text>
        <Text style={{ fontWeight: FONTWEIGHT.bold }}>NIP</Text>
      </View> */}
      <View
        style={{
          marginHorizontal: 15,
          marginBottom: 20,
          backgroundColor: COLORS.white,
          borderRadius: 8,
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
            onChangeText={(text) => setInputValue(text)}
            onEndEditing={filter}
            clearButtonMode="always"
            allowFontScaling={false}
          />
        </View>
      </View>
      <FlatList
        data={filterData}
        renderItem={({ item }) => (
          <CardPegawai
            data={item}
            addressbook={addressbook}
            config={config}
            device={device}
          />
        )}
        style={{ marginBottom: 40 }}
        keyExtractor={(item) => item.nip}
      />
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
