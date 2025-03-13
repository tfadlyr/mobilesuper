import moment from "moment";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import {
  Avatar,
  Card,
  IconButton,
  TextInput,
  Button,
} from "react-native-paper";
import { useSelector } from "react-redux";
import { headerToken, postHTTP } from "../../../utils/http";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import { nde_api } from "../../../utils/api.config";
import { Dropdown } from "react-native-element-dropdown";
import { GlobalStyles } from "../../../constants/styles";
import { Config } from "../../../constants/config";

function DelegationForm() {
  const [errorAvatarTitle, setErrorAvatarTitle] = useState(false);
  const profile = useSelector((state) => state.profile.profile);
  const employee = useSelector((state) => state.addressbook.receivers);
  const [selectedEmployee, setSelectedEmployee] = useState(employee);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [reason, setReason] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isStartDateVisible, setStartDateVisibility] = useState(false);
  const [isEndDateVisible, setEndDateVisibility] = useState(false);
  const navigation = useNavigation();
  const refresh = navigation.addListener("focus", () => {
    setSelectedEmployee(employee);
  });

  useEffect(() => {
    getHeader();
    return refresh;
  }, [employee]);
  let header = {};
  async function getHeader() {
    try {
      header = await headerToken();
    } catch (error) {
      Alert.alert("Warning!", "Get Header not working!");
    }
  }
  const showStartDate = () => {
    setStartDateVisibility(true);
  };

  const hideStartDate = () => {
    setStartDateVisibility(false);
  };

  const handleConfirmStart = (date) => {
    setStartDate(date);
    setEndDate(date);
    hideStartDate();
  };
  const showEndDate = () => {
    setEndDateVisibility(!isEndDateVisible);
  };

  const hideEndDate = () => {
    setEndDateVisibility(false);
  };

  const handleConfirmEnd = (date) => {
    setEndDate(date);
    hideEndDate();
  };
  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );

  function goToAddress() {
    navigation.navigate("AddressbookEmployee", {
      title: "Addressbook\nEmployee",
      multiple: false,
    });
  }
  async function activate() {
    setIsLoading(true);
    try {
      let dataEmployee;
      selectedEmployee.map((item) => {
        dataEmployee = item.fullname;
      });
      if (
        selectedTitle?.code == undefined ||
        selectedTitle?.code == undefined
      ) {
        Alert.alert("Peringatan!", "Silakan pilih 'Jabatan'");
      } else if (startDate == null) {
        Alert.alert("Peringatan!", "Silakan pilih 'Tgl Mulai'");
      } else if (endDate == null) {
        Alert.alert("Peringatan!", "Silakan pilih 'Tgl Selesai'");
      } else if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
        Alert.alert(
          "Peringatan!",
          "'Tgl Selesai' harus lebih atau sama dengan 'Tgl Mulai'"
        );
      } else if (dataEmployee == undefined) {
        Alert.alert("Peringatan!", "Silakan pilih 'Pejabat Pengganti'");
      } else if (dataEmployee == profile?.fullname) {
        Alert.alert(
          "Peringatan!",
          "Anda tidak dapat memilih diri sendiri sebagai delegasi. Silakan pilih delegasi lain."
        );
      } else if (reason == null || reason == "") {
        Alert.alert("Peringatan!", "Silakan isi 'Alasan'");
      } else {
        let data = {
          alasan: reason,
          code: selectedTitle.code,
          delegasi: dataEmployee,
          jabatan: selectedTitle.name,
          tanggal_mulai: moment(startDate).format("DD/MM/YYYY"),
          tanggal_selesai: moment(endDate).format("DD/MM/YYYY"),
        };
        //send data
        const response = await postHTTP(nde_api.delegationactive, data);
        if (response.data.status == "Error") {
          Alert.alert("Peringatan!", response.data.msg);
        } else {
          Alert.alert("Berhasil!", "Aktivasi delegasi berhasil!");
          navigation.goBack();
        }
      }
      setIsLoading(false);
    } catch (error) {
      Alert.alert("Peringatan!", "Aktivasi delegasi tidak berfungsi");
      setIsLoading(false);
    }
  }
  return (
    <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps={"handled"}>
      <KeyboardAvoidingView style={styles.keyboard} behavior="position">
        <View style={styles.screen}>
          {loadingOverlay}
          <View style={{ marginBottom: 8 }}>
            <Text>Pendelegasi</Text>
          </View>
          <Card style={styles.containerCard}>
            <Card.Title
              style={styles.containerCardTitle}
              title={<Text style={styles.title}>{profile?.fullname}</Text>}
              titleNumberOfLines={5}
              subtitle={profile?.department}
              subtitleNumberOfLines={5}
              left={(props) => (
                <>
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
                        uri: `${profile && nde_api.baseurl + profile?.avatar}`,
                        method: "GET",
                        headers: header,
                      }}
                      onError={(e) => setErrorAvatarTitle(true)}
                      theme={{
                        colors: {
                          primary: GlobalStyles.colors.textWhite,
                        },
                      }}
                    />
                  )}
                </>
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
            valueField="code"
            placeholder={!isFocus ? "Pilih Jabatan" : "..."}
            // searchPlaceholder="Search..."
            value={selectedTitle}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setSelectedTitle(item);
              setIsFocus(false);
            }}
          />
          <View style={styles.rowBetween}>
            <View>
              <View style={{ marginBottom: 8 }}>
                <Text>Tgl Mulai</Text>
              </View>
              <Button
                mode="outlined"
                textColor="black"
                style={{
                  backgroundColor: GlobalStyles.colors.textWhite,
                  borderWidth: 0.5,
                }}
                onPress={showStartDate}
              >
                {startDate
                  ? moment(startDate).format("DD/MM/YYYY")
                  : "Pilih Tgl Mulai"}
              </Button>
              <DateTimePickerModal
                isVisible={isStartDateVisible}
                mode="date"
                display={Platform.OS == "android" ? "inline" : "spinner"}
                style={{ width: "100%", height: 300 }}
                onConfirm={handleConfirmStart}
                onCancel={hideStartDate}
                minimumDate={new Date()}
              />
            </View>
            <View style={{ marginBottom: 8 }}>
              <View style={{ marginBottom: 8 }}>
                <Text>Tgl Selesai</Text>
              </View>
              <Button
                mode="outlined"
                style={{
                  backgroundColor: GlobalStyles.colors.textWhite,
                  borderWidth: 0.5,
                }}
                textColor="black"
                onPress={showEndDate}
              >
                {endDate
                  ? moment(endDate).format("DD/MM/YYYY")
                  : "Pilih Tgl Selesai"}
              </Button>
              <DateTimePickerModal
                isVisible={isEndDateVisible}
                mode="date"
                display={Platform.OS == "android" ? "inline" : "spinner"}
                style={{ width: "100%", height: 300 }}
                onConfirm={handleConfirmEnd}
                onCancel={hideEndDate}
                minimumDate={startDate ? startDate : new Date()}
              />
            </View>
          </View>

          <View style={{ marginBottom: 8 }}>
            <Text>Pejabat Pengganti</Text>
          </View>
          <Card style={styles.containerCard}>
            <Card.Title
              style={styles.containerCardTitle}
              title={
                <>
                  {selectedEmployee?.map((item) => (
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
              subtitleNumberOfLines={5}
              right={(props) => (
                <IconButton
                  {...props}
                  icon="account-plus"
                  onPress={goToAddress}
                />
              )}
            />
          </Card>

          <View style={{ marginBottom: 8 }}>
            <Text>Alasan</Text>
          </View>
          <TextInput
            theme={{ roundness: 12 }}
            mode="outlined"
            style={{ marginBottom: 8, paddingVertical: 16 }}
            multiline={true}
            value={reason}
            onChangeText={setReason}
            allowFontScaling={false}
          />
          <Button mode="contained" style={styles.button} onPress={activate}>
            Aktifkan
          </Button>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
export default DelegationForm;
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
  button: {
    backgroundColor: GlobalStyles.colors.active,
  },
});
