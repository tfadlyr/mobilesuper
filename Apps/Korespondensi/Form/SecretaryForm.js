import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Avatar, Card, IconButton, Button, Checkbox } from "react-native-paper";
import { useSelector } from "react-redux";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import { nde_api } from "../../../utils/api.config";
import { Dropdown } from "react-native-element-dropdown";
import { GlobalStyles } from "../../../constants/styles";
import { handlerError, headerToken, postHTTP } from "../../../utils/http";
import { useNavigation } from "@react-navigation/native";
import { Config } from "../../../constants/config";

function SecretaryForm() {
  const profile = useSelector((state) => state.profile.profile);
  const mySecre = useSelector((state) => state.profile.mySecre);
  const employee = useSelector((state) => state.addressbook.receivers);
  const [selectedEmployee, setSelectedEmployee] = useState(employee);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isFocusSifat, setIsFocusSifat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSifat, setSelectedSifat] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [errorAvatarTitle, setErrorAvatarTitle] = useState(false);
  let header = {};
  const navigation = useNavigation();
  const dataSifat = [
    { name: "Secretary", code: "s" },
    { name: "Personal Assistant", code: "pa" },
  ];
  const dataHak = [
    { hak: "Biasa", checked: true },
    { hak: "Rhs", checked: true },
    { hak: "Rhs-Prib", checked: false },
  ];
  const [selectedHak, setSelectedHak] = useState(dataHak);
  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
  const refresh = navigation.addListener("focus", () => {
    setSelectedEmployee(employee);
  });

  useEffect(() => {
    getHeader();
    return refresh;
  }, [employee, disabled]);

  async function getHeader() {
    header = await headerToken();
  }

  function handlerEmployee() {
    navigation.navigate("AddressbookEmployee", {
      title: "Addressbook\nEmployee",
      multiple: false,
    });
  }
  function handlerHak(item) {
    //mengubah checked
    const temp = [...selectedHak];
    let index = temp.find((data) => item.hak === data.hak);
    index.checked = !index.checked;
    setSelectedHak(temp);
  }
  async function activate() {
    setIsLoading(true);
    try {
      //prep-data
      let hak = [];
      selectedHak.map((item) => {
        if (item.checked) {
          hak.push(item.hak);
        }
      });
      if (selectedTitle == null || selectedTitle == "") {
        Alert.alert("Peringatan!", "Silakan pilih Jabatan");
      } else if (selectedEmployee.length == 0) {
        Alert.alert("Peringatan!", "Silakan pilih Sekretaris");
      } else if (selectedEmployee[0].fullname == profile?.fullname) {
        Alert.alert(
          "Peringatan!",
          "Anda tidak dapat memilih diri sendiri sebagai sekretaris. Silakan pilih sekretaris lain"
        );
      } else if (selectedSifat == undefined || selectedSifat == "") {
        Alert.alert("Peringatan!", "Silakan pilih Sifat");
      } else if (hak.length == 0) {
        Alert.alert("Peringatan!", "Silakan pilih Hak");
      } else {
        let dataEmployee;
        selectedEmployee.map((item) => {
          dataEmployee = item.fullname;
        });
        //set data
        let data = {
          nama: dataEmployee,
          jabatan: selectedTitle,
          pa: selectedSifat == "pa" ? true : false,
          hak: hak,
        };
        //send data
        const response = await postHTTP(nde_api.secretaryactive, data);
        if (response.data.status == "Error") {
          Alert.alert("Peringatan!", response.data.msg);
        } else {
          Alert.alert("Berhasil!", "Sekretaris berhasil diaktifkan!");
          navigation.goBack();
        }
      }
      setIsLoading(false);
    } catch (error) {
      Alert.alert("Peringatan!", "Aktivasi sekretaris tidak berfungsi");
      setIsLoading(false);
    }
  }

  async function checkSecre(title) {
    try {
      let data = { title: title };
      const response = await postHTTP(nde_api.checksecretary, data);
      if (response.data.status == 0) {
        setDisabled(false);
      } else if (response.data.status == 1) {
        setDisabled(true);
      }
    } catch (error) {
      handlerError(error, "Peringatan!", "Check Secretary not working!");
    }
  }
  return (
    <ScrollView keyboardShouldPersistTaps={"handled"}>
      <KeyboardAvoidingView style={styles.keyboard} behavior="position">
        <View style={styles.screen}>
          {loadingOverlay}
          <View style={{ marginBottom: 8 }}>
            <Text>Pejabat</Text>
          </View>
          <Card style={styles.containerCard}>
            <Card.Title
              style={styles.containerCardTitle}
              title={<Text style={styles.title}>{profile?.fullname}</Text>}
              titleNumberOfLines={5}
              subtitle={profile?.department}
              subtitleNumberOfLines={5}
              left={(props) => (
                <View>
                  {errorAvatarTitle && (
                    <Avatar.Image
                      size={40}
                      source={Config.avatar}
                      theme={{
                        colors: {
                          primary: GlobalStyles.colors.textWhite,
                        },
                      }}
                    />
                  )}
                  {!errorAvatarTitle && (
                    <Avatar.Image
                      {...props}
                      source={{
                        uri: `${
                          profile && nde_api.baseurl + profile?.avatar[0]
                        }`,
                        method: "GET",
                        headers: header,
                      }}
                      onError={() => setErrorAvatarTitle(true)}
                      theme={{
                        colors: {
                          primary: GlobalStyles.colors.textWhite,
                        },
                      }}
                    />
                  )}
                </View>
              )}
            />
          </Card>
          <Text style={[isFocus && { color: "blue" }, { marginBottom: 8 }]}>
            Jabatan
          </Text>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            // inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={profile?.title}
            // search
            maxHeight={300}
            labelField="name"
            valueField="name"
            placeholder={!isFocus ? "Pilih Jabatan" : "..."}
            // searchPlaceholder="Search..."
            value={selectedTitle}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              checkSecre(item.name);
              setSelectedTitle(item.name);
              setIsFocus(false);
            }}
          />
          <View style={{ marginBottom: 8 }}>
            <Text>Sekretaris</Text>
          </View>
          <Card style={styles.containerCard}>
            <Card.Title
              style={styles.containerCardTitle}
              title={
                <>
                  {selectedEmployee.map((item) => (
                    <Text style={styles.title} key={item.nik}>
                      {item?.fullname ? item.fullname : "Nama/NIK"}
                    </Text>
                  ))}
                  {(selectedEmployee == undefined ||
                    selectedEmployee.length == 0) && (
                    <Text style={styles.title}>Nama/NIK</Text>
                  )}
                </>
              }
              titleNumberOfLines={5}
              right={(props) => (
                <IconButton
                  {...props}
                  icon="account-plus"
                  onPress={handlerEmployee}
                />
              )}
            />
          </Card>

          <Text
            style={[isFocusSifat && { color: "blue" }, { marginBottom: 8 }]}
          >
            Sifat
          </Text>
          <Dropdown
            style={[styles.dropdown, isFocusSifat && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            // inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={dataSifat}
            // search
            maxHeight={300}
            labelField="name"
            valueField="code"
            placeholder={!isFocusSifat ? "Pilih Sifat" : "..."}
            // searchPlaceholder="Search..."
            value={selectedSifat}
            onFocus={() => setIsFocusSifat(true)}
            onBlur={() => setIsFocusSifat(false)}
            onChange={(item) => {
              setSelectedSifat(item.code);
              setIsFocusSifat(false);
            }}
          />
          <View style={{ marginBottom: 8 }}>
            <Text>Hak</Text>
          </View>
          <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
            {selectedHak.map((item) => (
              <Checkbox.Item
                key={item.hak}
                mode="android"
                label={item.hak}
                status={item.checked ? "checked" : "unchecked"}
                color={GlobalStyles.colors.tertiery}
                onPress={() => {
                  handlerHak(item);
                }}
                position="leading"
                labelStyle={styles.labelCheckbox}
              />
            ))}
          </View>

          <Button
            mode="contained"
            style={disabled ? styles.buttonDisabled : styles.button}
            onPress={activate}
            disabled={disabled}
          >
            Aktifkan
          </Button>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
export default SecretaryForm;
const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  containerCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: GlobalStyles.colors.textWhite,
  },
  containerCardTitle: {
    padding: 16,
    alignItems: "center",
  },
  keyboard: {
    flex: 1,
    width: "100%",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
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
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  labelCheckbox: {
    fontSize: GlobalStyles.font.md,
  },
  button: {
    backgroundColor: GlobalStyles.colors.active,
  },
  buttonDisabled: {
    backgroundColor: GlobalStyles.colors.disabled,
  },
});
