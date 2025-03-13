import Constants from "expo-constants";
import { useEffect, useState } from "react";
import {
  useWindowDimensions,
  StyleSheet,
  ImageBackground,
  View,
} from "react-native";
import { IconButton, Snackbar } from "react-native-paper";
import { TabView, TabBar } from "react-native-tab-view";
import { useDispatch, useSelector } from "react-redux";
import { Config } from "../constants/config";
import { GlobalStyles } from "../constants/styles";
import AddressbookEmployee from "../Apps/Korespondensi/Addressbook/AddressEmployee";
import AddressbookTitle from "../Apps/Korespondensi/Addressbook/AddressTitle";

import DDelegation from "../Apps/Korespondensi/Dashboard/DDelegation";
import DLetter from "../Apps/Korespondensi/Dashboard/DLetter";
import DSecretary from "../Apps/Korespondensi/Dashboard/DSecretary";
import DTodo from "../Apps/Korespondensi/Dashboard/DTodo";
// import AgendaDetail from "../screen/Detail/Tab/AgendaDetail";
import DetailAgenda from "../Apps/Korespondensi/Detail/Tab/DetailAgenda";
import DetailAttachment from "../Apps/Korespondensi/Detail/Tab/DetailAttachment";
import DetailComment from "../Apps/Korespondensi/Detail/Tab/DetailComment";
import DetailDispo from "../Apps/Korespondensi/Detail/Tab/DetailDispo";
import DetailEdit from "../Apps/Korespondensi/Detail/Tab/DetailEdit";
import DetailLog from "../Apps/Korespondensi/Detail/Tab/DetailLog";
import DetailPreview from "../Apps/Korespondensi/Detail/Tab/DetailPreview";
import DetailScan from "../Apps/Korespondensi/Detail/Tab/DetailScan";
import DispositionForm from "../Apps/Korespondensi/Form/DispositionForm";
import ForwardForm from "../Apps/Korespondensi/Form/ForwardForm";
import { removeAll } from "../store/addressbook";
import { removeAllDispoMulti } from "../store/dispoMulti";
import { COLORS, fontSizeResponsive } from "../config/SuperAppps";
import DetailAgendaInpro from "../Apps/Korespondensi/Detail/Tab/DetailAgendaInpro";
import DispositionLembar from "../Apps/Korespondensi/Form/DispositionLembar";

const project = Constants.expoConfig.extra.id;
function TabViewBg({
  routes,
  id,
  data,
  preview,
  position,
  tipe,
  multiple,
  indexDispo,
  log,
  sign,
}) {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();
  const { device } = useSelector((state) => state.apps);
  const snackbar = useSelector((state) => state.snackbar.clipboard);
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
  }, []);

  let renderScene = ({ route }) => {
    let detail;
    switch (route.key) {
      case "info":
        if (tipe == "disposition" || tipe == "dispomenwamen") {
          detail = (
            <DetailDispo
              id={id}
              noAgenda={data?.agenda_number}
              data={data}
              preview={preview}
              tipe="disposition"
            />
          );
        } else if (tipe == "NeedFollowUpDetail" || tipe == "TrackingDetail") {
          detail = (
            <DetailAgendaInpro
              id={id}
              noAgenda={data?.agenda_number}
              data={data}
              preview={preview}
              tipe={tipe}
              sign={sign}
            />
          );
        } else {
          detail = (
            <DetailAgenda
              id={id}
              noAgenda={data?.agenda_number}
              data={data}
              preview={preview}
              tipe={tipe}
            />
          );
        }
        return detail;
      case "infoscan":
        return <DetailScan noAgenda={data?.agenda_number} data={data} />;
      case "attachment":
        if (tipe == "disposition") {
          detail = <DetailAttachment id={id} data={data?.obj} tipeRef={tipe} />;
        } else {
          detail = <DetailAttachment id={id} data={data} tipeRef={tipe} />;
        }
        return detail;
      case "preview":
        return <DetailPreview data={data} preview={preview} />;
      case "log":
        return <DetailLog id={id} data={log} tipe={tipe} />;
      case "comment":
        return <DetailComment data={data} />;
      case "edit":
        return <DetailEdit data={data} tipe={tipe} />;
      case "dispo":
        if (tipe == "disposition") {
          detail = (
            <DispositionForm
              id={id}
              noAgenda={data?.agenda_number}
              data={data?.obj}
              tipe={tipe}
              title="Detail Disposisi"
            />
          );
        } else if (tipe == "dispomenwamen") {
          detail = (
            <DispositionLembar
              id={id}
              noAgenda={data?.agenda_number}
              data={data?.obj}
              tipe="disposition"
              title="Detail Disposisi"
            />
          );
        } else {
          detail = (
            <DispositionForm
              id={id}
              noAgenda={data?.agenda_number}
              data={data}
              tipe={tipe}
              title="Detail Disposisi"
            />
          );
        }
        return detail;
      case "forward":
        return (
          <ForwardForm
            id={id}
            noAgenda={data?.agenda_number}
            data={data}
            tipe={tipe}
          />
        );
      // return <AgendaDetail data={data} tipe={tipe} />;
      case "dletter":
        return <DLetter />;
      case "dtodo":
        return <DTodo />;
      case "dsecretary":
        return <DSecretary data={route.data} add={route.add} />;
      case "ddelegation":
        return <DDelegation add={route.add} />;
      case "employee":
        return (
          <AddressbookEmployee
            tipeAddress={tipe}
            multipleSelected={multiple}
            indexDispo={indexDispo}
          />
        );
      case "title":
        return (
          <AddressbookTitle
            tipeAddress={tipe}
            multipleSelected={multiple}
            indexDispo={indexDispo}
          />
        );
      case "alamat":
        return (
          <DispositionLembar
            id={id}
            noAgenda={data?.agenda_number}
            data={data}
            tipe="detail"
            title="Detail Disposisi"
          />
        );
      default:
        return;
    }
  };

  let renderIcon = ({ route, focused, color }) => {
    return (
      <IconButton
        icon={route.icon}
        iconColor={focused ? COLORS.primary : COLORS.tertiary}
        size={device === "tablet" ? 30 : 18}
        style={{ margin: -10 }}
      />
    );
  };
  const renderTabBar = (props) => (
    <TabBar
      {...props}
      renderIcon={tipe == "dashboard" ? null : renderIcon}
      indicatorStyle={
        tipe == "dashboard"
          ? { backgroundColor: COLORS.project }
          : { backgroundColor: COLORS.tertiary }
      }
      style={[
        {
          color: GlobalStyles.colors.textBlack,
          backgroundColor: GlobalStyles.colors.textWhite,
        },
        tipe == "dashboard"
          ? { borderTopLeftRadius: 8, borderTopRightRadius: 8 }
          : {},
      ]}
      labelStyle={{
        color: GlobalStyles.colors.textBlack,
        fontSize: fontSizeResponsive("H4", device),
        textAlign: "center",
        width: device === "tablet" ? 300 : "auto",
      }}
      activeColor={COLORS.primary}
      inactiveColor={GlobalStyles.colors.textBlack}
    />
  );
  return (
    <View
      style={[
        styles.screen,
        tipe == "dashboard" ? { paddingHorizontal: 20, paddingTop: 20 } : {},
      ]}
    >
      {/* <ImageBackground
        source={Config.backgroundLayoutBottom}
        style={styles.container}
        imageStyle={styles.backgroundImage}
      ></ImageBackground> */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        tabBarPosition={position}
        swipeEnabled={false}
      />
      {/* <Snackbar visible={snackbar}>Copied to clipboard</Snackbar> */}
    </View>
  );
}
export default TabViewBg;

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: {
    // position: "absolute",
    width: "100%",
    height: 300,
    bottom: 0,
    marginTop: 20,
  },
  backgroundImage: {
    resizeMode: "cover",
    alignSelf: "flex-end",
  },
});
