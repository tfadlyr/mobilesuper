import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useEffect } from "react";
import { Alert } from "react-native";
// import FABactions from "../../components/FABactions";
import TabViewBg from "../../../components/TabViewBg";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import { nde_api } from "../../../utils/api.config";
import { getHTTP, handlerError } from "../../../utils/http";

function ScanLogDetail({ route }) {
  let id = route.params.id;
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [detail, setDetail] = useState();
  const [preview, setPreview] = useState();
  const getScanLogDetail = async () => {
    setIsLoading(true);
    try {
      let response = await getHTTP(nde_api.scanlogbyid.replace("{$id}", id));

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
        setDetail(response?.data);
        setPreview(response?.data?.preview);
      }
      setIsLoading(false);
    } catch (error) {
      handlerError(error, "Warning", "Scan Log detail not working");
      navigation.goBack();
      setIsLoading(false);
    }
  };

  let routes = [
    { key: "infoscan", title: "Scan Receipt", icon: "alert-circle-outline" },
    { key: "attachment", title: "Attachment", icon: "attachment" },
  ];

  useEffect(() => {
    getScanLogDetail();
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
        tipe="scanlog"
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

export default ScanLogDetail;
