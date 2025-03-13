import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FAB, Portal } from "react-native-paper";
import { COLORS } from "../config/SuperAppps";
import { GlobalStyles } from "../constants/styles";
import { useDispatch, useSelector } from "react-redux";
import { removeAll } from "../store/addressbook";
import { removeAllDispoMulti } from "../store/dispoMulti";
import { handlerError, postHTTP } from "../utils/http";
import { Alert } from "react-native";
import { nde_api } from "../utils/api.config";
import { setAddressbookSelected } from "../store/AddressbookKKP";

function FABactions({ id, data, noAgenda, tipe, inForward, hideForward }) {
  const profile = useSelector((state) => state.profile.profile);
  const visibleFab = useSelector((state) => state.snackbar.fab);
  const [state, setState] = useState({ open: false });
  const [visible, setVisible] = useState(true);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const onStateChange = ({ open }) => {
    setState({ open });
  };
  const { open } = state;
  const refresh = navigation.addListener("focus", () => {
    setVisible(visibleFab);
    getAction();
  });
  const [action, setAction] = useState();
  useEffect(() => {
    if (
      tipe != "sender" &&
      tipe != "receivers" &&
      tipe != "copytos" &&
      tipe != "additional_approver" &&
      tipe != "approver" &&
      tipe != "Addressbook"
    ) {
      dispatch(removeAll());
      dispatch(removeAllDispoMulti());
    }
    setVisible(visibleFab);
    if (action == undefined) getAction();
    return refresh;
  }, [action, visibleFab]);

  function confirmForward() {
    Alert.alert("Konfirmasi", "Anda yakin untuk meneruskan surat ini?", [
      {
        text: "Tidak",
        onPress: () => null,
        style: "cancel",
      },
      { text: "YA", onPress: () => forward() },
    ]);
  }
  async function forward() {
    try {
      //prep-data
      let kepada = [];
      let kepada_ids = [];
      let data = {
        request: [
          {
            kepada: kepada,
            kepada_ids: kepada_ids,
            nota_tindakan_free: "",
            nota_tindakan: "Forward",
          },
        ],
      };
      //post api forward
      const response = await postHTTP(
        nde_api.postForward.replace("{$type}", tipe).replace("{$id}", id),
        data
      );
      //alert response
      if (response?.data?.status == "Error") {
        Alert.alert("Peringatan!", response.data.msg);
      } else {
        Alert.alert("Berhasil!", "Anda berhasil meneruskan surat ini!");
        navigation.goBack();
      }
    } catch (error) {
      handlerError(error, "Peringatan!", "Meneruskan tidak berfungsi!");
    }
  }
  function confirmRetract() {
    Alert.alert("Konfirmasi", "Anda yakin untuk batal meneruskan surat ini?", [
      {
        text: "Tidak",
        onPress: () => null,
        style: "cancel",
      },
      { text: "YA", onPress: () => retract() },
    ]);
  }

  async function retract() {
    try {
      //post api forward
      const response = await postHTTP(
        nde_api.postRetract.replace("{$id}", id),
        data
      );
      //alert response
      if (response?.data?.status == "Error") {
        Alert.alert("Peringatan!", response.data.msg);
      } else {
        Alert.alert("Berhasil!", "Anda berhasil batal meneruskan surat ini!");
        navigation.goBack();
      }
    } catch (error) {
      handlerError(error, "Peringatan!", "Batal meneruskan tidak berfungsi!");
    }
  }
  function getAction() {
    //sekretaris dan pegawai biasa tidak bisa disposisi
    //hanya sekretaris yang bisa forward, jika sudah forward tombol forward dihide
    if (tipe == "disposition" && profile?.title?.length != 0) {
      setAction([
        {
          icon: "share",
          color: GlobalStyles.colors.textWhite,
          style: { borderRadius: 50, backgroundColor: COLORS.primary },
          label: "Disposisi",
          onPress: () => {
            dispatch(setAddressbookSelected([]));
            if (profile?.nik == "88888" || profile?.nik == "99999") {
              navigation.navigate("DispositionLembar", {
                title: "Lembar Disposisi",
                id: id,
                data: data,
                noAgenda: noAgenda,
                tipe: tipe,
              });
            } else {
              navigation.navigate("DispositionForm", {
                title: "Lembar Disposisi",
                id: id,
                data: data,
                noAgenda: noAgenda,
                tipe: tipe,
              });
            }
            setVisible(false);
          },
        },
      ]);
    } else if (profile?.is_secretary == "true" && !hideForward && !inForward) {
      setAction([
        {
          icon: "forward",
          color: GlobalStyles.colors.textWhite,
          style: { borderRadius: 50, backgroundColor: COLORS.primary },
          label: "Teruskan",
          onPress: () => {
            confirmForward();
            // navigation.navigate("ForwardForm", {
            //   title: "Teruskan",
            //   id: id,
            //   data: data,
            //   noAgenda: noAgenda,
            //   tipe: tipe,
            // });
          },
        },
      ]);
    } else if (
      profile?.is_secretary == "true" &&
      (profile.nik == "0000000000001" || profile.nik == "00000000000011") &&
      !hideForward &&
      !data.retract &&
      inForward
    ) {
      setAction([
        {
          icon: "arrow-left-bold",
          color: GlobalStyles.colors.textWhite,
          style: {
            borderRadius: 50,
          },
          label: "Teruskan",
          onPress: () => {
            confirmRetract();
          },
        },
      ]);
    } else if (profile?.title?.length != 0) {
      dispatch(setAddressbookSelected([]));
      setAction([
        {
          icon: "share",
          color: GlobalStyles.colors.textWhite,
          style: { borderRadius: 50, backgroundColor: COLORS.primary },
          label: "Disposisi",
          onPress: () => {
            if (profile?.nik == "88888" || profile?.nik == "99999") {
              navigation.navigate("DispositionLembar", {
                title: "Lembar Disposisi",
                id: id,
                data: data,
                noAgenda: noAgenda,
                tipe: tipe,
              });
            } else {
              navigation.navigate("DispositionForm", {
                title: "Lembar Disposisi",
                id: id,
                data: data,
                noAgenda: noAgenda,
                tipe: tipe,
              });
            }
            setVisible(false);
          },
        },
      ]);
    }
  }
  return (
    <Portal>
      {action != undefined && (
        // <FAB.Group
        //   open={open}
        //   visible={visible}
        //   icon={open ? "plus" : "plus"}
        //   actions={action}
        //   onStateChange={onStateChange}
        //   onPress={() => {
        //     if (open) {
        //       // do something if the speed dial is open
        //     }
        //   }}
        //   fabStyle={{
        //     borderRadius: 50,
        //     backgroundColor: COLORS.primary,
        //   }}
        //   color={GlobalStyles.colors.textWhite}
        // />
        <>
          <FAB
            visible={visible}
            icon={action[0]?.icon}
            onPress={action[0]?.onPress}
            style={{
              position: "absolute",
              margin: 16,
              right: 0,
              bottom: 0,
              borderRadius: 50,
              backgroundColor: inForward
                ? GlobalStyles.colors.yellow
                : COLORS.primary,
            }}
            color={GlobalStyles.colors.textWhite}
          />
        </>
      )}
    </Portal>
  );
}
export default FABactions;
