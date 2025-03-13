import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useEffect } from "react";
import { Alert } from "react-native";
// import FABactions from "../../components/FABactions";
import TabViewBg from "../../../components/TabViewBg";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import { initAgenda } from "../../../utils/agenda";
import { nde_api } from "../../../utils/api.config";
import { getHTTP, handlerError } from "../../../utils/http";

function SubmittedDetail({ route }) {
  let id = route.params.id;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [detail, setDetail] = useState();
  const [preview, setPreview] = useState();
  const getAgendaOutDetail = async () => {
    setIsLoading(true);
    try {
      let response = await getHTTP(nde_api.agendaoutbyid.replace("{$id}", id));

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
        initAgenda(response?.data?.obj);
        response.data.obj.agenda_number = response.data.agenda_number;
        response.data.obj.w_token = response.data.w_token;
        setDetail(response?.data?.obj);
        setPreview(response?.data?.preview);
      }
      setIsLoading(false);
    } catch (error) {
      handlerError(error, "Warning", "Submitted detail not working");
      navigation.goBack();
      setIsLoading(false);
    }
  };

  let routes = [
    { key: "info", title: "Info", icon: "alert-circle-outline" },
    // { key: "attachment", title: "Attachment", icon: "attachment" },
    { key: "comment", title: "Komentar", icon: "forum" },
    // { key: "dispo", title: "Disposition", icon: "share" },
    // { key: "forward", title: "Forward", icon: "forward" },
  ];

  const willFocusSubscription = navigation.addListener("focus", () => {
    getAgendaOutDetail();
  });

  useEffect(() => {
    getAgendaOutDetail();
    return willFocusSubscription;
  }, [id]);

  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
  return (
    <>
      {loadingOverlay}
      <TabViewBg
        id={id}
        data={detail}
        preview={preview}
        tipe="out"
        position="bottom"
        routes={routes}
      />
      {/* <FABactions
        id={id}
        noAgenda={detail?.agenda_number}
        data={detail}
        type="out"
      /> */}
    </>
  );
}

export default SubmittedDetail;
