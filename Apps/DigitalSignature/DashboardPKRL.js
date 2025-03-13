import { useNavigation, useNavigationState } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  BackHandler,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  COLORS,
  fontSizeResponsive,
  FONTWEIGHT,
  getOrientation,
} from "../../config/SuperAppps";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getTokenValue } from "../../service/session";
import {
  getCounterPKRL,
  getDasboardListPKRL,
  getExportPKRL,
} from "../../service/api";
import { jenisPerizinan, kategoriPerizinan } from "./dataDokPerizinan";
import { BarChart } from "react-native-gifted-charts";
import { CardListPKRL } from "../../components/CardListPKRL";
import { CardListDashboardPKRL } from "../../components/CardListDashboardPKRL";
import ListEmpty from "../../components/ListEmpty";
import { Loading } from "../../components/Loading";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

export const DashboardPKRL = () => {
  const { device } = useSelector((state) => state.apps);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [dashboard, setDashboard] = useState("laporan");
  const [token, setToken] = useState("");
  const [dataChart, setDataChart] = useState([]);
  const [search, setSearch] = useState("");
  const [tipe, setTipe] = useState("dokumen_pkrl");
  const [page, setPage] = useState(10);
  const [modal, setModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [ListTitle, setListTitle] = useState("");
  const currentTab = useNavigationState(
    (state) => state.routes[state.index].name
  );
  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (currentTab === "DashboardPKRL") {
      dispatch(getCounterPKRL({ token: token, dashboard: dashboard }));
      dispatch(getExportPKRL({ token }));
    }
  }, [token, dashboard, currentTab]);

  const { counterPKRL, listDashboard, loading, fileExport } = useSelector(
    (state) => state.digitalsign
  );

  const handleGetAllCountDirektorat = (data) => {
    if (data !== null && data !== undefined) {
      const total_done = data.total_done !== undefined ? data?.total_done : 0;
      const total_in_progress =
        data.total_in_progress !== undefined ? data?.total_in_progress : 0;
      let count = total_done + total_in_progress;
      return count;
    } else {
      return 0;
    }
  };

  useEffect(() => {
    if (counterPKRL?.data !== null) {
      setDataChart(() => {
        let newData = {};
        jenisPerizinan?.map((item) => {
          newData[item.value] = [];
          let alias = 65;
          kategoriPerizinan.map((value) => {
            if (value.group === item.group) {
              newData[item.value].push(
                {
                  label: String.fromCharCode(alias),
                  value: 0,
                  spacing: 10,
                  labelWidth: 60,
                  labelTextStyle: {
                    color: "gray",
                  },
                  frontColor: COLORS.success,
                  alias: value.value,
                  isSigned: true,
                },
                {
                  value: 0,
                  frontColor: "red",
                  alias: value.value,
                }
              );
              alias++;
            } else {
              alias = 65;
            }
          });

          let updatedList = [...newData[item.value]];

          if (counterPKRL?.data?.[item?.value] !== undefined) {
            counterPKRL?.data?.[item?.value]?.data !== undefined &&
              counterPKRL?.data?.[item?.value]?.data.forEach((x) => {
                const checkIndex = updatedList?.findIndex(
                  (y) => y.alias === x.kategori_perizinan
                );

                if (checkIndex > -1) {
                  updatedList[checkIndex] = {
                    ...updatedList[checkIndex],
                    value: updatedList[checkIndex].value + x.done_count,
                  };

                  updatedList[checkIndex + 1] = {
                    ...updatedList[checkIndex + 1],
                    value:
                      updatedList[checkIndex + 1].value + x.in_progress_count,
                  };
                }
              });
          }

          newData[item.value] = updatedList;
        });
        return newData;
      });
    }
  }, [counterPKRL?.data]);

  const handleMaxValue = (tipe) => {
    if (!Array.isArray(dataChart)) {
      let max = Math?.max(...dataChart?.[tipe]?.map((obj) => obj.value));
      if (max === 0) {
        max = 100;
      }
      return max;
    } else {
      return 100;
    }
  };

  const loadMore = () => {
    if (listDashboard?.data?.length !== 0) {
      if (listDashboard?.data?.length % 5 === 0) {
        setPage((prevPage) => prevPage + 10);
      }
    }
  };

  useEffect(() => {
    dispatch(
      getDasboardListPKRL({
        token: token,
        tipe: tipe,
        page: page,
        search: search,
        kategori: ListTitle,
      })
    );
  }, [page]);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("Home"); // Navigasi langsung ke Home
      return true; // Mencegah aksi back default Android
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigation]);

  const renderTitle = () => {
    return (
      <View style={{}}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                height: device === "tablet" ? 24 : 12,
                width: device === "tablet" ? 24 : 12,
                borderRadius: device === "tablet" ? 24 : 6,
                backgroundColor: COLORS.success,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                color: "lightgray",
                fontSize: fontSizeResponsive("H6", device),
              }}
            >
              Done
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                height: device === "tablet" ? 24 : 12,
                width: device === "tablet" ? 24 : 12,
                borderRadius: device === "tablet" ? 24 : 6,
                backgroundColor: "red",
                marginRight: 8,
              }}
            />
            <Text
              style={{
                color: "lightgray",
                fontSize: fontSizeResponsive("H6", device),
              }}
            >
              Need Sign
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const downloadPath =
    FileSystem.documentDirectory + (Platform.OS == "android" ? "" : "");

  const shareReport = async (fileUrl) => {
    const namafile = fileUrl.split("/");
    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        fileUrl,
        downloadPath + namafile[namafile.length - 1],
        { headers: { Authorization: token } }
      );
      try {
        const { uri } = await downloadResumable.downloadAsync();
        saveFile(uri);
      } catch (e) {
        console.error("download error:", e);
      }
    } catch (e) {}
  };

  const saveFile = async (fileUri) => {
    try {
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/vnd.ms-excel",
        dialogTitle: "Share xls",
      });
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  };

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  console.log(dataChart?.["Direktorat Jaskel - Jasa Kelautan"]);

  return (
    <View style={{ position: "relative", flex: 1 }}>
      {loading ? <Loading /> : null}
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: COLORS.primary,
            height: 80,
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 20,
              width: device === "tablet" ? 40 : 28,
              height: device === "tablet" ? 40 : 28,
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 20,
            }}
          >
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <Ionicons
                name="chevron-back-outline"
                size={device === "tablet" ? 40 : 24}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignItems: "center", marginRight: 50 }}>
            <Text
              style={{
                fontSize: fontSizeResponsive("H1", device),
                fontWeight: FONTWEIGHT.bold,
                color: COLORS.white,
              }}
            >
              Perizinan Menteri
            </Text>
          </View>
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 20,
              width: device === "tablet" ? 40 : 28,
              height: device === "tablet" ? 40 : 28,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 20,
              padding: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                shareReport(
                  fileExport.file,
                  "application/vnd.ms-excel",
                  "sample.xls"
                );
              }}
            >
              <Ionicons
                name="share-outline"
                size={device === "tablet" ? 30 : 18}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            marginTop: 20,
            backgroundColor: COLORS.white,
            marginHorizontal: "5%",
            padding: 20,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H2", device),
              fontWeight: 600,
            }}
          >
            Total Dokumen Per Direktorat
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: 10,
              gap: 10,
            }}
          >
            {jenisPerizinan.map((item, index) => (
              <View
                key={index}
                style={{
                  width:
                    device === "tablet" && orientation === "landscape"
                      ? "24%"
                      : device === "tablet" && orientation === "potrait"
                      ? "23.8%"
                      : "48%",
                  height: "50%",
                }}
              >
                <View
                  style={{
                    borderRadius: 8,
                    shadowOffset: { width: -2, height: 4 }, // shadow iOS
                    shadowColor: "#171717",
                    shadowOpacity: 0.2,
                    elevation: 2, // shadow Android
                    justifyContent: "center",
                    padding: 10,
                    minHeight: device === "tablet" ? 150 : 120, // Samakan tinggi minimum
                    backgroundColor:
                      item?.value ===
                      "Direktorat KEBP - Konservasi Ekosistem dan Biota Perairan"
                        ? COLORS.successLight
                        : item?.value === "Direktorat Jaskel - Jasa Kelautan"
                        ? COLORS.infoLight
                        : item?.value ===
                          "Direktorat Pendayagunaan Pesisir dan Pulau-Pulau Kecil"
                        ? COLORS.warningLight
                        : item?.value === "Direktorat PRL"
                        ? "#e0bee6"
                        : null,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        padding: 5,
                        backgroundColor: COLORS.white,
                        // item?.value ===
                        // "Direktorat KEBP - Konservasi Ekosistem dan Biota Perairan"
                        //   ? COLORS.white
                        //   : item?.value ===
                        //     "Direktorat Jaskel - Jasa Kelautan"
                        //   ? COLORS.infoLight
                        //   : item?.value ===
                        //     "Direktorat Pendayagunaan Pesisir dan Pulau-Pulau Kecil"
                        //   ? COLORS.warningLight
                        //   : item?.value === "Direktorat PRL"
                        //   ? "#e0bee6"
                        //   : null,
                        borderRadius: 50,
                        opacity: 0.8,
                      }}
                    >
                      <MaterialCommunityIcons
                        name={"file-document"}
                        size={device === "tablet" ? 40 : 30}
                        color={
                          item?.value ===
                          "Direktorat KEBP - Konservasi Ekosistem dan Biota Perairan"
                            ? COLORS.success
                            : item?.value ===
                              "Direktorat Jaskel - Jasa Kelautan"
                            ? COLORS.info
                            : item?.value ===
                              "Direktorat Pendayagunaan Pesisir dan Pulau-Pulau Kecil"
                            ? COLORS.warning
                            : item?.value === "Direktorat PRL"
                            ? "#794795"
                            : null
                        }
                      />
                    </View>
                    <Text
                      style={{
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: 40,
                      }}
                    >
                      {handleGetAllCountDirektorat(
                        counterPKRL.data !== undefined &&
                          counterPKRL.data !== null
                          ? counterPKRL?.data[item?.value]
                          : null
                      )}
                    </Text>
                  </View>
                  <Text
                    style={{
                      marginTop: 10,
                      fontSize: fontSizeResponsive("H5", device),
                      color: COLORS.grey,
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    {/* {item?.value} */}
                    {item?.value ===
                    "Direktorat KEBP - Konservasi Ekosistem dan Biota Perairan"
                      ? "Direktorat KEBP"
                      : item?.value === "Direktorat Jaskel - Jasa Kelautan"
                      ? "Direktorat Jakel"
                      : item?.value ===
                        "Direktorat Pendayagunaan Pesisir dan Pulau-Pulau Kecil"
                      ? "Direktorat P4K"
                      : item?.value === "Direktorat PRL"
                      ? "Direktorat PRL"
                      : null}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View
          style={{
            flexDirection: device === "tablet" ? "row" : "column",
            gap: device === "tablet" ? 5 : 20,
            marginHorizontal: "5%",
            marginTop: 20,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              ...styles.card,
              width: device === "tablet" ? "33%" : "100%",
            }}
          >
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H5", device),
                  fontWeight: 600,
                }}
              >
                Direktorat KEBP
              </Text>
            </View>

            {renderTitle()}

            <BarChart
              data={
                dataChart[
                  "Direktorat KEBP - Konservasi Ekosistem dan Biota Perairan"
                ]
              }
              lab
              barWidth={24}
              spacing={24}
              roundedTop
              roundedBottom
              hideRules
              // hideAxesAndRules
              // showReferenceLine1
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: "gray" }}
              noOfSections={3}
              autoShiftLabels
              onPress={(e) => {
                dispatch(
                  getDasboardListPKRL({
                    token: token,
                    tipe: tipe,
                    page: page,
                    search: search,
                    kategori: e.alias,
                  })
                ).then(() => {
                  setModal(true); // Tampilkan modal setelah dispatch selesai
                });
                setListTitle(e.alias);
              }}
              maxValue={handleMaxValue(
                "Direktorat KEBP - Konservasi Ekosistem dan Biota Perairan"
              )}
              renderLabel={({ label, alias }) => (
                <Text style={{ color: "red", fontSize: 20 }}>
                  {label}{" "}
                  {/* Gunakan alias jika ada, jika tidak, gunakan label */}
                </Text>
              )}
            />
            <View style={{ marginTop: 20, width: "95%" }}>
              {dataChart?.[
                "Direktorat KEBP - Konservasi Ekosistem dan Biota Perairan"
              ]?.map((item, index) => {
                return (
                  item.isSigned !== undefined && (
                    <View
                      style={{ marginTop: 10, flexDirection: "row", gap: 5 }}
                    >
                      <Text
                        style={{ fontSize: fontSizeResponsive("H6", device) }}
                      >
                        {item.label} :
                      </Text>
                      <Text
                        style={{ fontSize: fontSizeResponsive("H6", device) }}
                      >
                        {item.alias}
                      </Text>
                    </View>
                  )
                );
              })}
            </View>
          </View>
          <View
            style={{
              ...styles.card,
              width: device === "tablet" ? "33%" : "100%",
            }}
          >
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H5", device),
                  fontWeight: 600,
                }}
              >
                Direktorat P4K
              </Text>
            </View>
            {renderTitle()}
            <BarChart
              data={
                dataChart[
                  "Direktorat Pendayagunaan Pesisir dan Pulau-Pulau Kecil"
                ]
              }
              barWidth={24}
              spacing={24}
              roundedTop
              roundedBottom
              hideRules
              // hideAxesAndRules
              // showReferenceLine1
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: "gray" }}
              noOfSections={3}
              maxValue={handleMaxValue(
                "Direktorat Pendayagunaan Pesisir dan Pulau-Pulau Kecil"
              )}
              onPress={(e) => {
                dispatch(
                  getDasboardListPKRL({
                    token: token,
                    tipe: tipe,
                    page: page,
                    search: search,
                    kategori: e.alias,
                  })
                ).then(() => {
                  setModal(true); // Tampilkan modal setelah dispatch selesai
                });
                setListTitle(e.alias);
              }}
            />
            <View style={{ marginTop: 20, width: "95%" }}>
              {dataChart?.[
                "Direktorat Pendayagunaan Pesisir dan Pulau-Pulau Kecil"
              ]?.map((item, index) => {
                return (
                  item.isSigned !== undefined && (
                    <View
                      style={{ marginTop: 10, flexDirection: "row", gap: 5 }}
                    >
                      <Text
                        style={{ fontSize: fontSizeResponsive("H6", device) }}
                      >
                        {item.label} :
                      </Text>
                      <Text
                        style={{ fontSize: fontSizeResponsive("H6", device) }}
                      >
                        {item.alias}
                      </Text>
                    </View>
                  )
                );
              })}
            </View>
          </View>

          <View
            style={{
              ...styles.card,
              width: device === "tablet" ? "33%" : "100%",
            }}
          >
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H5", device),
                  fontWeight: 600,
                }}
              >
                Direktorat PRL
              </Text>
            </View>
            {renderTitle()}
            <BarChart
              data={dataChart["Direktorat PRL"]}
              barWidth={24}
              spacing={24}
              roundedTop
              roundedBottom
              hideRules
              // hideAxesAndRules
              // showReferenceLine1
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: "gray" }}
              noOfSections={3}
              maxValue={handleMaxValue("Direktorat PRL")}
              onPress={(e) => {
                dispatch(
                  getDasboardListPKRL({
                    token: token,
                    tipe: tipe,
                    page: page,
                    search: search,
                    kategori: e.alias,
                  })
                ).then(() => {
                  setModal(true); // Tampilkan modal setelah dispatch selesai
                });
                setListTitle(e.alias);
              }}
            />
            <View style={{ marginTop: 20, width: "95%" }}>
              {dataChart?.["Direktorat PRL"]?.map((item, index) => {
                return (
                  item.isSigned !== undefined && (
                    <View
                      style={{ marginTop: 10, flexDirection: "row", gap: 5 }}
                    >
                      <Text
                        style={{ fontSize: fontSizeResponsive("H6", device) }}
                      >
                        {item.label} :
                      </Text>
                      <Text
                        style={{ fontSize: fontSizeResponsive("H6", device) }}
                      >
                        {item.alias}
                      </Text>
                    </View>
                  )
                );
              })}
            </View>
          </View>
        </View>

        <View
          style={{
            marginHorizontal: "5%",
            marginVertical: 20,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              ...styles.card,
            }}
          >
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H5", device),
                  fontWeight: 600,
                }}
              >
                Direktorat Jaskel
              </Text>
            </View>
            {renderTitle()}
            <BarChart
              data={dataChart["Direktorat Jaskel - Jasa Kelautan"]}
              barWidth={24}
              spacing={24}
              roundedTop
              roundedBottom
              hideRules
              // hideAxesAndRules
              // showReferenceLine1
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: "gray" }}
              noOfSections={3}
              maxValue={handleMaxValue("Direktorat Jaskel - Jasa Kelautan")}
              onPress={(e) => {
                dispatch(
                  getDasboardListPKRL({
                    token: token,
                    tipe: tipe,
                    page: page,
                    search: search,
                    kategori: e.alias,
                  })
                ).then(() => {
                  setModal(true); // Tampilkan modal setelah dispatch selesai
                });
                setListTitle(e.alias);
              }}
            />
            {device !== "tablet" ? (
              <View style={{ marginTop: 20, width: "95%" }}>
                {dataChart?.["Direktorat Jaskel - Jasa Kelautan"]?.map(
                  (item, index) => {
                    return (
                      item.isSigned !== undefined && (
                        <View
                          style={{
                            marginTop: 10,
                            flexDirection: "row",
                            gap: 5,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H6", device),
                            }}
                          >
                            {item.label} :
                          </Text>
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H6", device),
                            }}
                          >
                            {item.alias}
                          </Text>
                        </View>
                      )
                    );
                  }
                )}
              </View>
            ) : (
              <View style={{ flexDirection: "row", gap: 20 }}>
                <View
                  style={{
                    gap: 5,
                    marginTop: 20,
                  }}
                >
                  {dataChart?.["Direktorat Jaskel - Jasa Kelautan"]
                    ?.filter((item) => item.label) // Ambil hanya yang punya label
                    .slice(0, 3) // Render maksimal 3 item pertama
                    .map((item, index) => (
                      <View
                        key={index}
                        style={{ flexDirection: "row", gap: 10 }}
                      >
                        <Text
                          style={{ fontSize: fontSizeResponsive("H6", device) }}
                        >
                          {item.label} :
                        </Text>
                        <Text
                          style={{ fontSize: fontSizeResponsive("H6", device) }}
                        >
                          {item.alias}
                        </Text>
                      </View>
                    ))}
                </View>

                <View
                  style={{
                    gap: 5,
                    marginTop: 20,
                  }}
                >
                  {dataChart?.["Direktorat Jaskel - Jasa Kelautan"]
                    ?.filter((item) => item.label) // Ambil hanya yang punya label
                    .slice(3, 6) // Render maksimal 3 item pertama
                    .map((item, index) => (
                      <View
                        key={index}
                        style={{ flexDirection: "row", gap: 10 }}
                      >
                        <Text
                          style={{ fontSize: fontSizeResponsive("H6", device) }}
                        >
                          {item.label} :
                        </Text>
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H6", device),
                          }}
                        >
                          {item.alias}
                        </Text>
                      </View>
                    ))}
                </View>

                <View
                  style={{
                    gap: 5,
                    marginTop: 20,
                  }}
                >
                  {dataChart?.["Direktorat Jaskel - Jasa Kelautan"]
                    ?.filter((item) => item.label) // Ambil hanya yang punya label
                    .slice(6, 8) // Render maksimal 3 item pertama
                    .map((item, index) => (
                      <View
                        key={index}
                        style={{ flexDirection: "row", gap: 5 }}
                      >
                        <Text
                          style={{ fontSize: fontSizeResponsive("H6", device) }}
                        >
                          {item.label} :
                        </Text>
                        <Text
                          style={{
                            width:
                              device === "tablet" &&
                              orientation === "potrait" &&
                              screenWidth <= 834
                                ? "50%"
                                : device === "tablet" &&
                                  orientation === "potrait" &&
                                  screenWidth > 834
                                ? "63%"
                                : device === "tablet" &&
                                  orientation === "landscpae"
                                ? "90%"
                                : null,
                            fontSize: fontSizeResponsive("H6", device),
                          }}
                        >
                          {item.alias}
                        </Text>
                      </View>
                    ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          setModal(false);
        }}
      >
        <TouchableOpacity
          style={[
            Platform.OS === "ios" ? styles.iOSBackdrop : styles.androidBackdrop,
            styles.backdrop,
          ]}
        />
        <View
          style={{
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              width: "90%",
              borderRadius: 10,
            }}
          >
            <View
              style={{
                marginHorizontal: 20,
                marginTop: 20,
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
                borderBottomWidth: 2,
                borderBottomColor: COLORS.grey,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                  width: "95%",
                }}
              >
                List Dokumen {ListTitle}
              </Text>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  setModal(false);
                }}
              >
                <Ionicons
                  name="close-outline"
                  size={device === "tablet" ? 42 : 24}
                  color={COLORS.lighter}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={listDashboard.data}
              keyExtractor={(item) => item?.id}
              renderItem={({ item }) => (
                <CardListDashboardPKRL
                  item={item}
                  token={token}
                  device={device}
                />
              )}
              ListEmptyComponent={() => <ListEmpty />}
              onEndReached={loadMore}
              onEndReachedThreshold={0.5}
              style={{ height: "50%", marginVertical: 20 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    //shadow ios
    shadowOffset: { width: -2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    //shadow android
    elevation: 2,
  },
  iOSBackdrop: {
    backgroundColor: "#000",
    opacity: 0.5,
  },
  androidBackdrop: {
    backgroundColor: "#000",
    opacity: 0.7,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
