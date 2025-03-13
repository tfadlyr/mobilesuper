import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";
import { Alert } from "react-native";
import TabViewBg from "../../../components/TabViewBg";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import { initLetter } from "../../../utils/agenda";
import { nde_api } from "../../../utils/api.config";
import { getHTTP, handlerError } from "../../../utils/http";
import { useSelector } from "react-redux";

function ReferenceDetail({ route }) {
  let id = route.params.id;
  const prevAgenda = useSelector((state) => state.referensi.prevAgenda);
  const navigation = useNavigation();
  const [isLoading, setisLoading] = useState(true);
  const [detail, setDetail] = useState();
  const getLettersDetail = async () => {
    setisLoading(true);
    try {
      if (id != undefined) {
        let response = await getHTTP(
          nde_api.lettersbyid.replace("{$id}", id) +
            "?obj=" +
            prevAgenda.id +
            "&tipe=" +
            prevAgenda.tipe
        );
        if (response?.data?.status == "Error") {
          Alert.alert("Info", response.data.msg, [
            {
              text: "Ok",
              onPress: () => {
                navigation.goBack();
              },
              style: "cancel",
            },
          ]);
        } else {
          initLetter(response?.data);
          response.data.preview = "/api/letters/" + id + "/0_0/preview/";
          setDetail(response?.data);
        }
      } else {
        Alert.alert("Info", "Detail Referensi tidak berfungsi");
        navigation.goBack();
      }
    } catch (error) {
      handlerError(error, "Warning", "Detail Referensi tidak berfungsi");
      navigation.goBack();
    }
    setisLoading(false);
  };

  let routes = [
    { key: "info", title: "Info", icon: "alert-circle-outline" },
    { key: "attachment", title: "Attachment", icon: "attachment" },
  ];

  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
  useEffect(() => {
    getLettersDetail();
  }, [id]);
  return (
    <>
      {loadingOverlay}
      <TabViewBg
        data={detail}
        id={id}
        preview={detail?.preview}
        tipe="ReferenceDetail"
        position="bottom"
        routes={routes}
      />
    </>
  );
}

export default ReferenceDetail;
