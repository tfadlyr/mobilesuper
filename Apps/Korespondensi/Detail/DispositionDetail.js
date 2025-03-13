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
import { useDispatch, useSelector } from "react-redux";
import { setNotifIos } from "../../../store/SuperApps";
import { removePushNotif } from "../../../service/session";

function DispositionDetail({ route }) {
  let id = route.params.id;
  let hideFormDispo = route.params.hideFormDispo;
  const navigation = useNavigation();
  const profile = useSelector((state) => state.profile.profile);
  const [isLoading, setisLoading] = useState(true);
  const [detail, setDetail] = useState();
  const [preview, setPreview] = useState();
  const [log, setLog] = useState();
  const dispatch = useDispatch();
  const getAgendaDispoDetail = async () => {
    setisLoading(true);
    try {
      let response = await getHTTP(
        nde_api.agendadispobyid.replace("{$id}", id)
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
        initAgenda(response.data.obj);
        response.data.obj.agenda_number = response.data.agenda_number;
        response.data.obj.w_token = response.data.w_token;
        setDetail(response?.data);
        setPreview(response?.data?.preview);
        setLog(response.data.log);
        getAgendaDispoRead();
      }
      setisLoading(false);
    } catch (error) {
      handlerError(error, "Peringatan", "Disposisi tidak berfungsi");
      navigation.goBack();
      setisLoading(false);
    }
  };

  const getAgendaDispoRead = async () => {
    try {
      let response = await getHTTP(
        nde_api.agendadisporead.replace("{$id}", id)
      );
    } catch (error) {}
  };

  let routes;
  if (hideFormDispo) {
    routes = [
      { key: "info", title: "Info", icon: "alert-circle-outline" },
      { key: "log", title: "Aktivitas Disposisi", icon: "clipboard-text" },
      // { key: "attachment", title: "Attachment", icon: "attachment" },
    ];
  } else {
    if (
      profile?.is_secretary != "true" &&
      (profile?.title?.length > 0 || profile?.is_user_eselon_4 == "true")
    ) {
      routes = [
        {
          key: "alamat",
          title: "Alamat Disposisi",
          icon: "clipboard-arrow-down-outline",
        },
        { key: "info", title: "Info", icon: "alert-circle-outline" },
        { key: "log", title: "Aktivitas Disposisi", icon: "clipboard-text" },
        // { key: "attachment", title: "Attachment", icon: "attachment" },
        { key: "dispo", title: "Disposisi", icon: "share" },
      ];
    } else {
      routes = [
        { key: "info", title: "Info", icon: "alert-circle-outline" },
        { key: "log", title: "Aktivitas Disposisi", icon: "clipboard-text" },
        // { key: "attachment", title: "Attachment", icon: "attachment" },
      ];
    }
  }
  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
  useEffect(() => {
    getAgendaDispoDetail();
    removePushNotif();
    dispatch(setNotifIos(false));
  }, [id]);

  return (
    <>
      {loadingOverlay}
      <TabViewBg
        id={id}
        data={detail}
        preview={preview}
        log={log}
        tipe={
          profile?.nik == "88888" || profile?.nik === "99999"
            ? "dispomenwamen"
            : "disposition"
        }
        position="bottom"
        routes={routes}
      />
      {/* {!hideFormDispo && (
        <FABactions
          id={id}
          noAgenda={detail?.agenda_number}
          data={detail}
          type="disposition"
        />
      )} */}
    </>
  );
}

export default DispositionDetail;
