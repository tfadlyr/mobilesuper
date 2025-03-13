import { useState } from "react";
import { useEffect } from "react";
// import FABactions from "../../components/FABactions";
import TabViewBg from "../../../components/TabViewBg";
import LoadingOverlay from "../../../components/UI/LoadingOverlay";
import DetailAgenda from "./Tab/DetailAgenda";

function LetterDetail({ route }) {
  const [id, setId] = useState();
  const [data, setData] = useState();
  const [preview, setPreview] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setId(route?.params?.id);
    setData(route?.params?.data);
    setPreview(route?.params?.preview);
    setIsLoading(false);
  }, [route]);

  let routes = [
    { key: "info", title: "Info", icon: "alert-circle-outline" },
    { key: "attachment", title: "Attachment", icon: "attachment" },
  ];

  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
  return (
    <>
      {loadingOverlay}

      <DetailAgenda data={data} tipe="agendadispo" />
      {/* <TabViewBg
        id={id}
        data={data}
        preview={preview}
        tipe="agendadispo"
        position="bottom"
        routes={routes}
      /> */}
      {/* <FABactions
        id={id}
        noAgenda={detail?.agenda_number}
        data={detail}
        type="in"
      /> */}
    </>
  );
}

export default LetterDetail;
