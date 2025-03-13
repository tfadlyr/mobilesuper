import TabViewBg from "../../../components/TabViewBg";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useMemo } from "react";
import { useRef } from "react";
import {
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Checkbox, Text } from "react-native-paper";
import { GlobalStyles } from "../../../constants/styles";
import { useDispatch, useSelector } from "react-redux";
import { removeDispoReceiver, setDispoReceiver } from "../../../store/dispoMulti";
import {
  initAdditionalApprover,
  initApprover,
  initCopytos,
  initReceivers,
  initSender,
  setAdditionalApproverAddressbook,
  setApproverAddressbook,
  setCopytosAddressbook,
  setReceiversAddressbook,
  setSenderAddressbook,
} from "../../../store/addressbook";

function Addressbook({ route }) {
  const tipe = route?.params?.tipe;
  const indexDispo = route?.params?.indexDispo;
  const multiple = route?.params?.multiple;
  let selected = [];
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
  const dispatch = useDispatch();
  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["75%", "90%"], []);
  let routes;
  routes = [
    { key: "title", title: "Title", icon: "account-supervisor" },
    { key: "employee", title: "Employee", icon: "account-group" },
  ];
  const renderItem = ({ item, index }) => (
    <View key={index} style={{ alignItems: "flex-start" }}>
      <Checkbox.Item
        mode="android"
        label={item.fullname ? item.fullname : item.title}
        status={
          selected?.findIndex((data) => data.nik == item.code) != -1 ||
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
  function confirmRemoveAll() {
    if (selected?.length == 0) {
      Alert.alert("Info", "EMPTY");
    } else {
      Alert.alert(
        "Confirm",
        "Are you sure to delete all?",
        [
          { text: "Cancel", onPress: () => { } },
          {
            text: "Ok",
            onPress: () => removeAllAddress(),
          },
        ],
        {
          cancelable: true,
        }
      );
    }
  }
  function removeAllAddress() {
    let data;
    if (selected?.length > 0) {
      // set addressbook sesuai tipe
      if (indexDispo != undefined) {
        data = { index: indexDispo };
        dispatch(removeDispoReceiver(data));
      } else {
        if (tipe == "sender") {
          dispatch(initSender([]));
        } else if (tipe == "receivers") {
          dispatch(initReceivers([]));
        } else if (tipe == "copytos") {
          dispatch(initCopytos([]));
        } else if (tipe == "additional_approver") {
          dispatch(initAdditionalApprover([]));
        } else if (tipe == "approver") {
          dispatch(initApprover([]));
        } else {
          dispatch(initReceivers([]));
        }
      }
    }
  }
  return (
    <>
      <TabViewBg
        tipe={route?.params?.tipe}
        position="bottom"
        routes={routes}
        multiple={true}
        indexDispo={route?.params?.indexDispo}
      />

      <BottomSheetModalProvider>
        <TouchableOpacity
          onPress={() => bottomSheetModalRef?.current?.present()}
        >
          <View style={styles.container}>
            <View style={styles.containerRow}>
              <Text>Selected ({selected?.length} list selected)</Text>
              <Text style={styles.textLink}>Delete All</Text>
            </View>
          </View>
        </TouchableOpacity>
        <SafeAreaView>
          <View>
            <BottomSheetModal
              name={route?.params?.tipe}
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              keyboardBehavior={
                Platform?.OS == "android" ? "fillParent" : "interactive"
              }
              keyboardBlurBehavior="restore"
              android_keyboardInputMode="adjust"
            >
              <View style={styles.contentContainer}>
                <View style={styles.containerRow}>
                  <Text>Selected ({selected?.length} list selected)</Text>
                  <TouchableOpacity onPress={confirmRemoveAll}>
                    <Text style={styles.textLink}>Delete All</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={selected}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index}
                  ListEmptyComponent={
                    <View style={styles.notfound}>
                      <Text>EMPTY</Text>
                    </View>
                  }
                  style={{ maxHeight: "75%", marginVertical: 8 }}
                />
                <Button
                  mode="contained"
                  style={[
                    {
                      backgroundColor: GlobalStyles.colors.gray500,
                      marginBottom: 16,
                    },
                  ]}
                  onPress={() => bottomSheetModalRef?.current?.dismiss()}
                >
                  Close
                </Button>
              </View>
            </BottomSheetModal>
          </View>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </>
  );
}

export default Addressbook;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 55,
    width: "100%",
    padding: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: "center",
    backgroundColor: GlobalStyles.colors.textWhite,
    borderBottomWidth: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
  },
  containerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textHeader: {
    color: GlobalStyles.colors.textWhite,
  },
  labelCheckbox: {
    width: "95%",
    textAlign: "left",
  },
  notfound: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
  },
  textLink: {
    borderBottomWidth: 1,
    borderColor: GlobalStyles.colors.blue,
    color: GlobalStyles.colors.blue,
  },
});
