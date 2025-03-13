import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { COLORS, fontSizeResponsive } from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { Dropdown } from "../../components/DropDown";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getTokenValue } from "../../service/session";
import {
  getExportFileEmployee,
  getExportFileQuarter,
  getSummaryAccumulation,
  getSummaryBadUser,
  getSummaryGraph,
  getSummaryReview,
  getSummaryTotalPost,
} from "../../service/api";
import { StackedBarChart, ProgressChart } from "react-native-chart-kit";
import PieChart from "react-native-pie-chart";
import { StatusBar } from "expo-status-bar";
import * as Progress from "react-native-progress";
import ProgressCircle from "react-native-progress-circle";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
const { StorageAccessFramework } = FileSystem;

export const LaporanPengetahuan = () => {
  const navigation = useNavigation();

  const listYear = [
    { key: "2023", value: "2023" },
    { key: "2024", value: "2024" },
    { key: "2025", value: "2025" },
  ];

  const dataKuartal = [
    { key: "1", value: "TW 1" },
    { key: "2", value: "TW 2" },
    { key: "3", value: "TW 3" },
    { key: "4", value: "TW 4" },
  ];

  const [year, setYear] = useState({
    key: new Date().getFullYear(),
    value: new Date().getFullYear(),
  });

  const [quarter, setQuarter] = useState({ key: "1", value: "TW 1" });

  const [token, setToken] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      const param = { token: token, year: year.value, quarter: quarter.key };

      const paramBad = {
        token: token,
        year: year.value,
        quarter:
          quarter.key === "1"
            ? "q1"
            : quarter.key === "2"
              ? "q2"
              : quarter.key === "3"
                ? "q3"
                : "q4",
      };
      dispatch(getSummaryTotalPost(param));
      dispatch(getSummaryBadUser(paramBad));
      dispatch(getSummaryGraph(param));
      dispatch(getSummaryAccumulation(param));
      dispatch(getSummaryReview(param));
      dispatch(getExportFileQuarter(token));
    }
  }, [token, year, quarter]);

  useEffect(() => {
    const param = {
      token: token,
      year: year.value,
      quarter: quarter.key,
    };
    if (token !== "") {
      dispatch(getExportFileQuarter(param));
      dispatch(getExportFileEmployee(param));
    }
  }, [token, year, quarter, download]);

  const { summary, exportLaporan, download } = useSelector(
    (state) => state.pengetahuan
  );

  const downloadPath =
    FileSystem.documentDirectory + (Platform.OS == "android" ? "" : "");

  const downloadFile = async (fileUrl, fileType, type) => {
    const namafile =
      type === "employe"
        ? exportLaporan?.employee?.file.split("/")
        : exportLaporan?.quarter?.file.split("/");
    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        fileUrl,
        downloadPath + namafile[namafile.length - 1],
        { headers: { Authorization: token } }
      );
      try {
        // if (Platform.OS === "android") {
        //   const { uri } = await downloadResumable.downloadAsync();
        //   saveAndroidFile(uri, namafile[namafile?.length - 1], fileType);
        // } else {
        const { uri } = await downloadResumable.downloadAsync();
        saveIosFile(uri);
        // }
      } catch (e) {
        // setIsLoading(false);
        console.error("download error:", e);
      }
    } catch (e) { }
  };
  const saveAndroidFile = async (fileUri, fileName, fileType) => {
    try {
      const fileString = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const permissions =
        await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        return;
      }

      try {
        await StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          fileName,
          fileType
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, fileString, {
              encoding: FileSystem.EncodingType.Base64,
            });
            Alert.alert("Success!", "Download Successfully.");
          })
          .catch((e) => {
            Alert.alert(
              "Failed!",
              "Download Unsuccessful. Please choose another folder to download file."
            );
          });
      } catch (e) {
        throw new Error(e);
      }
    } catch (err) { }
  };
  const saveIosFile = async (fileUri) => {
    try {
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/vnd.openxmlformats-",
        dialogTitle: "Share Excel",
      });
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  };

  const totalPost = summary?.total_post.total_post_per_quarter;
  const badUser = summary?.bad_user;
  const graph = summary?.graph;
  const accumulation = summary?.accumulation;
  const review = summary?.review;

  const widthAndHeight = 200;
  const dataPie = [
    Object.keys(accumulation).length !== 0 ? accumulation?.Kegiatan?.total : 0,
    Object.keys(accumulation).length !== 0
      ? accumulation["Video_/_Jurnal"]?.total
      : 0,
    Object.keys(accumulation).length !== 0
      ? accumulation?.Infografis?.total
      : 0,
    Object.keys(accumulation).length !== 0
      ? accumulation?.Tidak_Sesuai?.total
      : 0,
  ];

  const handleDataPie = [1];

  const sliceColor = [
    COLORS.info,
    COLORS.success,
    COLORS.warning,
    COLORS.infoDanger,
  ];

  const sliceColorHandle = [COLORS.grey];

  const { device } = useSelector((state) => state.apps);

  // console.log(review?.total_article_unreview?.Kegiatan);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar />
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            backgroundColor: COLORS.primary,
            height: 80,
            paddingBottom: 20,
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
            <TouchableOpacity
              style={{}}
              onPress={() => navigation.navigate("Main")}
            >
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
                fontWeight: 600,
                color: COLORS.white,
              }}
            >
              Laporan
            </Text>
          </View>
        </View>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 20,
            marginVertical: 20,
            width: "100%",
            paddingHorizontal: 20
          }}
        >
          <View style={styles.dropdown}>
            <Dropdown
              data={listYear}
              placeHolder={"Pilih Tahun"}
              backgroundColor={COLORS.white}
              selected={year}
              setSelected={setYear}
              style={styles.dropdown}
            />
          </View>

          <View style={styles.dropdown}>
            <Dropdown
              data={dataKuartal}
              placeHolder={"Pilih Triwulan"}
              backgroundColor={COLORS.white}
              selected={quarter}
              setSelected={setQuarter}
              style={styles.dropdown}
            />
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              backgroundColor: COLORS.white,
              padding: 20,
              borderRadius: 16,
              //shadow ios
              shadowOffset: { width: -2, height: 4 },
              shadowColor: "#171717",
              shadowOpacity: 0.2,
              //shadow android
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
                fontWeight: 600,
              }}
            >
              Jumlah Postingan pada Triwulan Ke-{quarter.key} Tahun {year.value}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 20,
                }}
              >
                <View
                  style={{
                    backgroundColor: COLORS.warningLight,
                    width: device === "tablet" ? 56 : 42,
                    height: device === "tablet" ? 56 : 42,
                    borderRadius: device === "tablet" ? 28 : 21,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <Ionicons
                    name="clipboard-outline"
                    size={24}
                    color={COLORS.warning}
                  />
                </View>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("Judul", device),
                    fontWeight: 600,
                    marginBottom: 5,
                  }}
                >
                  {totalPost?.post_publish}
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: 400,
                    textAlign: "center",
                  }}
                >
                  Post Masuk
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 20,
                }}
              >
                <View
                  style={{
                    backgroundColor: COLORS.successLight,
                    width: device === "tablet" ? 56 : 42,
                    height: device === "tablet" ? 56 : 42,
                    borderRadius: device === "tablet" ? 28 : 21,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <Ionicons
                    name="clipboard-outline"
                    size={24}
                    color={COLORS.success}
                  />
                </View>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("Judul", device),
                    fontWeight: 600,
                    marginBottom: 5,
                  }}
                >
                  {totalPost?.post_reviewed}
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: 400,
                    textAlign: "center",
                  }}
                >
                  Post Sudah Dinilai
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 20,
                }}
              >
                <View
                  style={{
                    backgroundColor: COLORS.infoDangerLight,
                    width: device === "tablet" ? 56 : 42,
                    height: device === "tablet" ? 56 : 42,
                    borderRadius: device === "tablet" ? 28 : 21,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <Ionicons
                    name="clipboard-outline"
                    size={24}
                    color={COLORS.infoDanger}
                  />
                </View>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("Judul", device),
                    fontWeight: 600,
                    marginBottom: 5,
                  }}
                >
                  {totalPost?.post_waiting}
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: 400,
                    textAlign: "center",
                  }}
                >
                  Post Belum Dinilai
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginVertical: 20,
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            <View
              style={{
                flex: 1,
                height: '100%',
                backgroundColor: COLORS.white,
                padding: 20,
                borderRadius: 16,
                //shadow ios
                shadowOffset: { width: -2, height: 4 },
                shadowColor: "#171717",
                shadowOpacity: 0.2,
                //shadow android
                elevation: 2,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    backgroundColor: "#F0F0F0",
                    width: device === "tablet" ? 33 : 26,
                    height: device === "tablet" ? 33 : 26,
                    borderRadius: device === "tablet" ? 20 : 13,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color={COLORS.infoDanger}
                  />
                </View>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H1", device),
                    fontWeight: 600,
                    color: COLORS.primary,
                  }}
                >
                  {badUser?.user_count}
                </Text>
              </View>
              <Text
                style={{
                  fontWeight: 400,
                  marginTop: 10,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Jumlah pegawai belum memenuhi nilai minimum triwulan Ke-
                {quarter.key} Tahun
                {" " + year.value}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                height: '100%',
                backgroundColor: COLORS.white,
                padding: 20,
                borderRadius: 16,
                //shadow ios
                shadowOffset: { width: -2, height: 4 },
                shadowColor: "#171717",
                shadowOpacity: 0.2,
                //shadow android
                elevation: 2,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    backgroundColor: "#F0F0F0",
                    width: device === "tablet" ? 33 : 26,
                    height: device === "tablet" ? 33 : 26,
                    borderRadius: device === "tablet" ? 20 : 13,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <Ionicons
                    name="document-outline"
                    size={18}
                    color={COLORS.grey}
                  />
                </View>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H1", device),
                    fontWeight: 600,
                  }}
                >
                  Report
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: 400,
                  }}
                >
                  Pegawai
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    // openFileEmployee();
                    downloadFile(
                      exportLaporan?.employee?.file,
                      "application/vnd.ms-excel",
                      "employe"
                    );
                  }}
                >
                  <View
                    style={{
                      width: device === "tablet" ? 36 : 24,
                      height: device === "tablet" ? 36 : 24,
                      borderRadius: device === "tablet" ? 6 : 4,
                      backgroundColor: COLORS.primary,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name="download-outline"
                      size={device === "tablet" ? 27 : 18}
                      color={COLORS.white}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: 400,
                  }}
                >
                  Triwulan
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    downloadFile(
                      exportLaporan?.quarter?.file,
                      "application/vnd.ms-excel",
                      "triwulan"
                    );
                  }}
                >
                  <View
                    style={{
                      width: device === "tablet" ? 36 : 24,
                      height: device === "tablet" ? 36 : 24,
                      borderRadius: device === "tablet" ? 6 : 4,
                      backgroundColor: COLORS.primary,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name="download-outline"
                      size={device === "tablet" ? 27 : 18}
                      color={COLORS.white}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View
            style={{
              width: "100%",
              alignSelf: "center",
              backgroundColor: COLORS.white,
              borderRadius: 16,
              padding: 20,
              marginBottom: 10,
              //shadow ios
              shadowOffset: { width: -2, height: 4 },
              shadowColor: "#171717",
              shadowOpacity: 0.2,
              //shadow android
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: fontSizeResponsive("H2", device),
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              Capaian Mingguan Triwulan {quarter.key} Tahun{" " + year.value}
            </Text>
            <View
              style={{
                justifyContent: device === "tablet" ? "center" : "flex-start",
                alignItems: device === "tablet" ? "center" : "flex-start",
              }}
            >
              {Object.keys(summary.graph).length !== 0 &&
                Object.keys(summary.total_post).length !== 0 &&
                Object.keys(summary.bad_user).length !== 0 ? (
                <StackedBarChart
                  data={{
                    labels: [
                      graph?.month_list[0],
                      graph?.month_list[1],
                      graph?.month_list[2],
                      graph?.month_list[3],
                      graph?.month_list[4],
                      graph?.month_list[5],
                      graph?.month_list[6],
                      graph?.month_list[7],
                      graph?.month_list[8],
                      graph?.month_list[9],
                      graph?.month_list[10],
                      graph?.month_list[11],
                    ],
                    legend: ["Posting Masuk", "Jumlah Posting belum dinilai"],
                    data: [
                      [
                        graph?.article_unreviewed_count[0],
                        graph?.article_unreviewed_count[0] +
                        graph?.article_reviewed_count[0],
                      ],
                      [
                        graph?.article_unreviewed_count[1],
                        graph?.article_unreviewed_count[1] +
                        graph?.article_reviewed_count[1],
                      ],
                      [
                        graph?.article_unreviewed_count[2],
                        graph?.article_unreviewed_count[2] +
                        graph?.article_reviewed_count[2],
                      ],
                      [
                        graph?.article_unreviewed_count[3],
                        graph?.article_unreviewed_count[3] +
                        graph?.article_reviewed_count[3],
                      ],
                      [
                        graph?.article_unreviewed_count[4],
                        graph?.article_unreviewed_count[4] +
                        graph?.article_reviewed_count[4],
                      ],
                      [
                        graph?.article_unreviewed_count[5],
                        graph?.article_unreviewed_count[5] +
                        graph?.article_reviewed_count[5],
                      ],
                      [
                        graph?.article_unreviewed_count[6],
                        graph?.article_unreviewed_count[6] +
                        graph?.article_reviewed_count[6],
                      ],
                      [
                        graph?.article_unreviewed_count[7],
                        graph?.article_unreviewed_count[7] +
                        graph?.article_reviewed_count[7],
                      ],
                      [
                        graph?.article_unreviewed_count[8],
                        graph?.article_unreviewed_count[8] +
                        graph?.article_reviewed_count[8],
                      ],
                      [
                        graph?.article_unreviewed_count[9],
                        graph?.article_unreviewed_count[9] +
                        graph?.article_reviewed_count[9],
                      ],
                      [
                        graph?.article_unreviewed_count[10],
                        graph?.article_unreviewed_count[10] +
                        graph?.article_reviewed_count[10],
                      ],
                      [
                        graph?.article_unreviewed_count[11],
                        graph?.article_unreviewed_count[11] +
                        graph?.article_reviewed_count[11],
                      ],
                    ],
                    barColors: [COLORS.primary, COLORS.warning],
                  }}
                  hideLegend
                  yAxisLabel=""
                  yAxisSuffix=""
                  yAxisInterval={2}
                  width={340}
                  // width={Dimensions.get("window").width}
                  height={350}
                  chartConfig={{
                    backgroundGradientFrom: "#F0F0F0",
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientTo: COLORS.white,
                    backgroundGradientToOpacity: 1,
                    color: () => "black",
                    barPercentage: 0.2,
                    propsForBackgroundLines: {
                      x1: 60,
                    },
                    propsForVerticalLabels: {
                      rotation: 90,
                      // rotate: -90,
                      // letterSpacing: 3,
                      dy: 10,
                      // dx: 20,
                    },
                  }}
                  withHorizontalLabels={false}
                  style={{ marginHorizontal: -55 }}
                />
              ) : (
                <StackedBarChart
                  data={{
                    labels: [
                      ["..."],
                      ["..."],
                      ["..."],
                      ["..."],
                      ["..."],
                      ["..."],
                      ["..."],
                      ["..."],
                      ["..."],
                      ["..."],
                      ["..."],
                      ["..."],
                    ],
                    legend: ["Posting Masuk", "Jumlah Posting belum dinilai"],
                    data: [],
                    barColors: [COLORS.primary, COLORS.warning],
                  }}
                  hideLegend
                  yAxisLabel=""
                  yAxisSuffix=""
                  yAxisInterval={2}
                  width={380}
                  // width={Dimensions.get("window").width}
                  height={350}
                  chartConfig={{
                    backgroundGradientFrom: "#F0F0F0",
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientTo: COLORS.white,
                    backgroundGradientToOpacity: 1,
                    color: () => "black",
                    barPercentage: 0.2,
                    propsForBackgroundLines: {
                      x1: 60,
                    },
                    propsForVerticalLabels: {
                      rotation: 90,
                      // rotate: -90,
                      // letterSpacing: 3,
                      dy: 10,
                      // dx: 20,
                    },
                  }}
                  withHorizontalLabels={false}
                  style={{ marginHorizontal: -55 }}
                />
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
                marginHorizontal: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: COLORS.warning,
                  }}
                />
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: 400,
                  }}
                >
                  Posting Masuk
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: COLORS.primary,
                  }}
                />
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    fontWeight: 400,
                  }}
                >
                  Jumlah Posting belum dinilai
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                height: 2,
                backgroundColor: COLORS.grey,
                marginVertical: 20,
              }}
            />
            <View style={{ alignItems: "center", marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H2", device),
                  fontWeight: 400,
                  width: "50%",
                  textAlign: "center",
                }}
              >
                Jumlah yang belum dinilai triwulan {quarter.key} Tahun
                {" " + year.value}
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("Judul", device),
                  fontWeight: 600,
                  color: COLORS.primary,
                  marginVertical: 10,
                }}
              >
                {totalPost?.post_waiting}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("PenilaianPenggetahaun");
                }}
                style={{
                  backgroundColor: COLORS.primary,
                  width: "100%",
                  paddingVertical: 10,
                  borderRadius: device === "tablet" ? 12 : 8,
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H1", device),
                    fontWeight: 500,
                    textAlign: "center",
                    color: COLORS.white,
                  }}
                >
                  Nilai Sekarang
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              width: "100%",
              alignSelf: "center",
              backgroundColor: COLORS.white,
              borderRadius: 16,
              padding: 20,
              marginVertical: 10,
              //shadow ios
              shadowOffset: { width: -2, height: 4 },
              shadowColor: "#171717",
              shadowOpacity: 0.2,
              //shadow android
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: fontSizeResponsive("H2", device),
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              Postingan Masuk Triwulan Ke-{quarter.key}
              {" " + year.value}
            </Text>
            {dataPie.reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              0
            ) !== 0 ? (
              <PieChart
                widthAndHeight={widthAndHeight}
                series={dataPie}
                sliceColor={sliceColor}
                coverRadius={0.75}
                coverFill={"#FFF"}
                style={{ alignSelf: "center", marginVertical: 20 }}
              />
            ) : (
              <PieChart
                widthAndHeight={widthAndHeight}
                series={handleDataPie}
                sliceColor={sliceColorHandle}
                coverRadius={0.75}
                coverFill={"#FFF"}
                style={{ alignSelf: "center", marginVertical: 20 }}
              />
            )}

            <View style={{ marginBottom: 20, alignItems: "center" }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("Judul", device),
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                {Object.keys(accumulation).length !== 0
                  ? accumulation?.total_article_all
                  : 0}
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H3", device),
                  fontWeight: 400,
                  width: "50%",
                  textAlign: "center",
                }}
              >
                Jumlah seluruh postingan masuk di triwulan Ke-{quarter.key} Tahun
                {" " + year.value}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: COLORS.white,
                // backgroundColor: "brown",
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: COLORS.grey,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 16,
                  justifyContent: "center",
                }}
              >
                <View style={{ flexDirection: "column", flex: 1 }}>
                  <View style={{ marginBottom: 20, alignItems: "flex-start" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "start",
                        alignItems: "center",
                        marginBottom: 10,
                        gap: 8,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: COLORS.infoLight,
                          width: 34,
                          height: 34,
                          borderRadius: 6,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons
                          name="pulse-outline"
                          size={22}
                          color={COLORS.info}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H2", device),
                          fontWeight: 600,
                        }}
                      >
                        Kegiatan
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("Judul", device),
                        fontWeight: 600,
                        marginBottom: 10,
                      }}
                    >
                      {Object.keys(accumulation).length !== 0 &&
                        accumulation?.Kegiatan?.total !== undefined
                        ? accumulation?.Kegiatan?.total
                        : "-"}
                    </Text>
                    <Progress.Bar
                      progress={
                        Object.keys(accumulation).length !== 0 &&
                          accumulation?.Kegiatan?.percent !== undefined
                          ? accumulation?.Kegiatan?.percent / 100
                          : 0
                      }
                      width={110}
                      color={COLORS.info}
                    />
                  </View>

                  <View style={{ marginBottom: 10 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        marginBottom: 10,
                        gap: 8,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: COLORS.successLight,
                          width: 34,
                          height: 34,
                          borderRadius: 6,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons
                          name="videocam-outline"
                          size={22}
                          color={COLORS.success}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H2", device),
                          fontWeight: 600,
                        }}
                      >
                        Video/Jurnal
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("Judul", device),
                        fontWeight: 600,
                        marginBottom: 10,
                      }}
                    >
                      {Object.keys(accumulation).length !== 0 &&
                        accumulation["Video_/_Jurnal"]?.total !== undefined
                        ? accumulation["Video_/_Jurnal"]?.total
                        : "-"}
                    </Text>
                    <Progress.Bar
                      progress={
                        Object.keys(accumulation).length !== 0 &&
                          accumulation["Video_/_Jurnal"]?.percent !== undefined
                          ? accumulation["Video_/_Jurnal"]?.percent / 100
                          : 0
                      }
                      width={110}
                      color={COLORS.success}
                    />
                  </View>
                </View>

                <View style={{ flexDirection: "column", flex: 1 }}>
                  <View style={{ marginBottom: 20, alignItems: "flex-start" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "start",
                        alignItems: "center",
                        marginBottom: 10,
                        gap: 8
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: COLORS.warningLight,
                          width: 34,
                          height: 34,
                          borderRadius: 6,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons
                          name="clipboard-outline"
                          size={22}
                          color={COLORS.warning}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H2", device),
                          fontWeight: 600,
                        }}
                      >
                        Infografis
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("Judul", device),
                        fontWeight: 600,
                        marginBottom: 10,
                      }}
                    >
                      {Object.keys(accumulation).length !== 0 &&
                        accumulation?.Infografis?.total !== undefined
                        ? accumulation?.Infografis?.total
                        : "-"}
                    </Text>
                    <Progress.Bar
                      progress={
                        Object.keys(accumulation).length !== 0 &&
                          accumulation?.Infografis?.percent !== undefined
                          ? accumulation?.Infografis?.percent / 100
                          : 0
                      }
                      width={110}
                      color={COLORS.warning}
                    />
                  </View>

                  <View style={{ marginBottom: 10 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "start",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 10,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: COLORS.infoDangerLight,
                          width: 34,
                          height: 34,
                          borderRadius: 6,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons
                          name="search-outline"
                          size={22}
                          color={COLORS.infoDanger}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H2", device),
                          fontWeight: 600,
                        }}
                      >
                        Tidak Sesuai
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("Judul", device),
                        fontWeight: 600,
                        marginBottom: 10,
                      }}
                    >
                      {Object.keys(accumulation).length !== 0 &&
                        accumulation?.Tidak_Sesuai?.total !== undefined
                        ? accumulation?.Tidak_Sesuai?.total
                        : "-"}
                    </Text>
                    <Progress.Bar
                      progress={
                        Object.keys(accumulation).length !== 0 &&
                          accumulation?.Tidak_Sesuai?.percent !== undefined
                          ? accumulation?.Tidak_Sesuai?.percent / 100
                          : 0
                      }
                      width={110}
                      color={COLORS.infoDanger}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View
            style={{
              width: "100%",
              alignSelf: "center",
              backgroundColor: COLORS.white,
              borderRadius: 16,
              padding: 20,
              marginVertical: 10,
              marginBottom: 20,
              //shadow ios
              shadowOffset: { width: -2, height: 4 },
              shadowColor: "#171717",
              shadowOpacity: 0.2,
              //shadow android
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: fontSizeResponsive("H2", device),
                fontWeight: 600,
                marginBottom: 5,
              }}
            >
              Post Sudah Dinilai
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                fontWeight: 400,
                marginBottom: 10,
                color: COLORS.grey,
              }}
            >
              Dari Keseluruhan Post Triwulan Kedua Tahun 2023
            </Text>
            <View style={{ alignSelf: "center", marginVertical: 20 }}>
              <ProgressCircle
                percent={
                  Object.keys(review).length !== 0
                    ? review?.percent_article_reviewed
                    : 0
                }
                radius={100}
                borderWidth={15}
                color={COLORS.success}
                shadowColor="#999"
                bgColor="#fff"
              >
                <Text style={{ fontSize: fontSizeResponsive("Judul", device) }}>
                  {Object.keys(review).length !== 0 &&
                    review?.percent_article_reviewed !== undefined
                    ? review?.percent_article_reviewed
                    : 0}
                  %
                </Text>
              </ProgressCircle>
            </View>
            <View style={{ marginVertical: 10, alignItems: "center" }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("Judul", device),
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                {Object.keys(review).length !== 0 &&
                  review?.total_article_reviewed !== undefined
                  ? review?.total_article_reviewed
                  : 0}
              </Text>
            </View>
            <Text
              style={{
                fontSize: fontSizeResponsive("H2", device),
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              {"*) Yang belum dinilai :"}
            </Text>
            <View
              style={{ flexDirection: "row", gap: 50, justifyContent: "center" }}
            >
              <View style={{ flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 10,
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: COLORS.infoLight,
                      width: 34,
                      height: 34,
                      borderRadius: 6,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name="pulse-outline"
                      size={22}
                      color={COLORS.info}
                    />
                  </View>
                  <View style={{ flexDirection: "column" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H2", device),
                        fontWeight: 600,
                      }}
                    >
                      Kegiatan
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        color: COLORS.grey,
                      }}
                    >
                      {review?.total_article_unreview?.Kegiatan !== undefined
                        ? review?.total_article_unreview?.Kegiatan
                        : "-"}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: COLORS.successLight,
                      width: 34,
                      height: 34,
                      borderRadius: 6,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name="videocam-outline"
                      size={22}
                      color={COLORS.success}
                    />
                  </View>
                  <View style={{ flexDirection: "column" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H2", device),
                        fontWeight: 600,
                      }}
                    >
                      Video/Jurnal
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        color: COLORS.grey,
                      }}
                    >
                      {Object.keys(review).length !== 0 &&
                        review?.total_article_unreview["Video_/_Jurnal"] !==
                        undefined
                        ? review?.total_article_unreview["Video_/_Jurnal"]
                        : "-"}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: COLORS.warningLight,
                      width: 34,
                      height: 34,
                      borderRadius: 6,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name="clipboard-outline"
                      size={22}
                      color={COLORS.warning}
                    />
                  </View>
                  <View style={{ flexDirection: "column" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H2", device),
                        fontWeight: 600,
                      }}
                    >
                      Infografis
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        color: COLORS.grey,
                      }}
                    >
                      {review?.total_article_unreview?.Infografis !== undefined
                        ? review?.total_article_unreview?.Infografis
                        : "-"}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: COLORS.infoDangerLight,
                      width: 34,
                      height: 34,
                      borderRadius: 6,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Ionicons
                      name="search-outline"
                      size={22}
                      color={COLORS.infoDanger}
                    />
                  </View>
                  <View style={{ flexDirection: "column" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H2", device),
                        fontWeight: 600,
                      }}
                    >
                      Tidak Sesuai
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        color: COLORS.grey,
                      }}
                    >
                      {review?.total_article_unreview?.Tidak_Sesuai !== undefined
                        ? review?.total_article_unreview?.Tidak_Sesuai
                        : "-"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    flex: 1,
    //shadow ios
    shadowOffset: { width: -2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    //shadow android
    elevation: 2,
  },
});
