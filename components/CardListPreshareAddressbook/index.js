import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { setAddressbookSelected } from "../../store/AddressbookKKP";
import { fontSizeResponsive } from "../../config/SuperAppps";

export const CardListPreshareAddressbook = ({
  item,
  addressbook,
  pilihanAnggotaGrup,
  setStateConfig,
  device,
}) => {
  const dispatch = useDispatch();
  const deleteItem = (id, state) => {
    let data;
    if (state === "jabatan") {
      data = addressbook.selected.filter((data) => data.id !== id);
      setStateConfig({
        title: "Peserta Grup",
        tabs: {
          jabatan: true,
          pegawai: false,
        },
        multiselect: true,
        payload: pilihanAnggotaGrup,
        tipeAddress: "korespondensi",
      });
      dispatch(setAddressbookSelected(data));
    } else {
      data = addressbook.selected.filter((data) => data.nip !== id);
      dispatch(setAddressbookSelected(data));
    }
  };
  return (
    <View>
      {item.title === undefined ? null : (
        <View
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            marginTop: 10,
            marginHorizontal: "5%",
            gap: 10,
          }}
        >
          <Text style={{ fontSize: fontSizeResponsive("H5", device) }}>-</Text>
          <Text
            style={{
              width: device === "tablet" ? "90%" : "80%",
              fontSize: fontSizeResponsive("H5", device),
            }}
          >
            {item.title}
          </Text>
          <TouchableOpacity
            onPress={() => {
              deleteItem(item.id, "jabatan");
            }}
          >
            <Ionicons name="trash-outline" size={24} />
          </TouchableOpacity>
        </View>
      )}
      {item.fullname === undefined ? null : (
        <View
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            marginTop: 10,
            marginHorizontal: "5%",
            gap: 10,
          }}
        >
          <Text style={{ fontSize: fontSizeResponsive("H5", device) }}>-</Text>
          <Text
            style={{
              width: device === "tablet" ? "90%" : "80%",
              fontSize: fontSizeResponsive("H5", device),
            }}
          >
            {item.fullname}
          </Text>
          <TouchableOpacity
            onPress={() => {
              deleteItem(item.nip, "pegawai");
            }}
          >
            <Ionicons name="trash-outline" size={24} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
