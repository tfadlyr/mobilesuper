import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useEffect } from "react";
import { Alert } from "react-native";
import TabViewBg from "../../../components/TabViewBg";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import { initLetter } from "../../../utils/agenda";
import { nde_api } from "../../../utils/api.config";
import { getHTTP, handlerError } from "../../../utils/http";

function TrackingDetail({ route }) {
  let id = route.params.id;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [detail, setDetail] = useState();
  const getLettersDetail = async () => {
    setIsLoading(true);
    try {
      let response = await getHTTP(nde_api.lettersbyid.replace("{$id}", id));

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
        initLetter(response.data);
        response.data.preview = "/api/letters/" + id + "/0_0/preview/";
        setDetail(response.data);
      }
    } catch (error) {
      handlerError(error, "Warning", "Tracking detail not working");
      navigation.goBack();
    }
    setIsLoading(false);
  };

  let routes = [
    { key: "info", title: "Info", icon: "alert-circle-outline" },
    { key: "attachment", title: "Attachment", icon: "attachment" },
    { key: "comment", title: "Komentar", icon: "forum" },
  ];

  useEffect(() => {
    getLettersDetail();
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
        data={detail}
        id={id}
        preview={detail?.preview}
        tipe="TrackingDetail"
        position="bottom"
        routes={routes}
      />
    </>
  );
}

export default TrackingDetail;
