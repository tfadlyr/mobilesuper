import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import TabViewBg from "../../../components/TabViewBg";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import { Config } from "../../../constants/config";
import {
  initAdditionalApprover,
  initApprover,
  initCopytos,
  initKM,
  initReceivers,
  initSender,
} from "../../../store/addressbook";
import {
  setAgenda,
  setIsi,
  setIsiAtas,
  setIsiBawah,
  setKepadaExternal,
  setLampiran,
  setSalam,
  setSubject,
  setTanggalMulai,
  setTanggalSelesai,
  setTempat,
  setWaktuMulai,
  setWaktuSelesai,
  setZonaWaktu,
} from "../../../store/payload";
import { initLetter } from "../../../utils/agenda";
import { nde_api } from "../../../utils/api.config";
import { getHTTP, handlerError } from "../../../utils/http";
import { useNavigation } from "@react-navigation/core";
import { setNotifIos } from "../../../store/SuperApps";
import { removePushNotif } from "../../../service/session";

function NeedFollowUpDetail({ route }) {
  let id = route.params.id;
  let sign = route?.params?.sign;
  const [isLoading, setisLoading] = useState(true);
  const [detail, setDetail] = useState();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const getLettersDetail = async () => {
    setisLoading(true);
    try {
      let response = await getHTTP(nde_api.lettersbyid.replace("{$id}", id));
      // let verify = await getHTTP(
      //   nde_api.verifytitleprofile.replace("{$id}", id)
      // );
      initLetter(response?.data);
      response.data.preview = "/api/letters/" + id + "/0_0/preview/";
      response.data.verifytitleprofile = [];
      setDetail(response?.data);
      //set data edit
      setDataEdit(response?.data);
    } catch (error) {
      // console.log(error?.response)
      handlerError(
        error,
        "Peringatan",
        "Detail surat keluar perlu diproses tidak berfungsi"
      );
      navigation.goBack();
    }
    setisLoading(false);
  };
  const setDataEdit = (data) => {
    dispatch(setSubject(data?.subject));
    dispatch(setLampiran(data?.attachment));
    dispatch(initKM([data?.problem]));
    dispatch(initSender(data?.senders));
    if (data?.template?.name == "undangan") {
      dispatch(setIsiAtas(data?.invitation_attribute?.body_top));
      dispatch(setIsiBawah(data?.invitation_attribute?.body_bottom));
      dispatch(
        setTanggalMulai(
          moment(data?.invitation_attribute?.date_start).format("DD/MM/YYYY")
        )
      );
      dispatch(
        setTanggalSelesai(
          moment(data?.invitation_attribute?.date_end).format("DD/MM/YYYY")
        )
      );
      dispatch(setWaktuMulai(data?.invitation_attribute?.time_start));
      dispatch(setWaktuSelesai(data?.invitation_attribute?.time_end));
      dispatch(setZonaWaktu(data?.invitation_attribute?.time_zone));
      dispatch(setAgenda(data?.invitation_attribute?.agenda));
      let temp = data?.invitation_attribute?.place;
      temp = temp.replace(/<br>/g, "\n").split(" ");
      let temp2 = "";
      for (let i = 0; i < temp.length; i++) {
        let test1 = temp[i].search("<a");
        let test2 = temp[i].search("href");
        let test3 = temp[i].search("</a>");
        let test4 = temp[i].search("target=");
        if (test1 == 0 || test2 == 0 || test3 == 0 || test4 == 0) {
        } else {
          if (temp2 == "") {
            temp2 = temp[i];
          } else {
            temp2 = temp2 + " " + temp[i];
          }
        }
      }
      temp = temp2;
      dispatch(setTempat(temp));
    } else if (data?.template?.name == "nota_internal") {
      dispatch(setIsi(data?.body));
    } else if (data?.template?.name == "nota_external") {
      dispatch(setIsi(data?.body));
      data?.attributes.map((e) => {
        //init salam
        if (e.key == "salam") {
          if (e.value != "") {
            data.salam = e.value;
            dispatch(setSalam(e.value));
          }
        }
      });
    }
    let item = [];
    data.tracker.approvers.map((items, index) => {
      if (index != 0) {
        if (items.title != null) {
          item[index - 1] = {
            title: items.title.name,
            code: items.title.objid,
          };
        } else {
          item[index - 1] = {
            fullname: items.profile.fullname,
            code: items.profile.nik,
          };
        }
      }
    });
    dispatch(initApprover(item));
    //prep-kepada
    item = [];
    let item2 = [];
    if (data.template.name == "nota_external") {
      if (data.kepada_addressbook?.length != 0) {
        data.kepada_addressbook?.forEach((e, i) => {
          item[i] = [{ code: "", title: "" }];
          item[i].title = e;
          item[i].code = data.kepada_addressbook_ids[i];
        });
      }
      //kepada external manual
      dispatch(setKepadaExternal(data?.receivers.join("\n")));
    } else {
      item = data.receivers_ids;
      data.receivers.forEach((e, i) => {
        item[i].title = e;
      });
    }
    dispatch(initReceivers(item));
    //prep-tembusan
    item = [];
    item = data?.copytos_ids;
    data?.copytos.forEach((e, i) => {
      item[i].title = e;
    });
    dispatch(initCopytos(item));
    dispatch(
      initAdditionalApprover([
        {
          title: data?.additional_approver,
          code: data?.additional_approver_ids,
        },
      ])
    );
  };
  let routes;
  if (Config.editInpro) {
    routes = [
      { key: "info", title: "Info", icon: "alert-circle-outline" },
      { key: "attachment", title: "Attachment", icon: "attachment" },
      { key: "comment", title: "Komentar", icon: "forum" },
      { key: "edit", title: "Edit", icon: "pencil" },
    ];
  } else {
    routes = [
      { key: "info", title: "Info", icon: "alert-circle-outline" },
      { key: "attachment", title: "Attachment", icon: "attachment" },
      { key: "comment", title: "Komentar", icon: "forum" },
    ];
  }

  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
  useEffect(() => {
    getLettersDetail();
    removePushNotif();
    dispatch(setNotifIos(false));
  }, [id]);
  return (
    <>
      {loadingOverlay}
      <TabViewBg
        data={detail}
        id={id}
        sign={sign}
        preview={detail?.preview}
        tipe="NeedFollowUpDetail"
        position="bottom"
        routes={routes}
      />
    </>
  );
}

export default NeedFollowUpDetail;
