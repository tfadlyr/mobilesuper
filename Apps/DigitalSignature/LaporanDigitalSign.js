import React, { useMemo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import {
  COLORS,
  DATETIME,
  FONTWEIGHT,
  PADDING,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BarChart as BarChartKit } from "react-native-chart-kit";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDivisionFilter,
  getLaporanAksiPerubahan,
  getSubDivisionFilter,
  getSubjectList,
  getSummaryCount,
  getSummaryList,
} from "../../service/api";
import { useEffect } from "react";
import { getTokenValue } from "../../service/session";
import moment from "moment/min/moment-with-locales";
import { Loading } from "../../components/Loading";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Dropdown } from "../../components/DropDown";
import ProgressCircle from "react-native-progress-circle";
import PieChart from "react-native-pie-chart";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import { BarChart } from "react-native-gifted-charts";

const CardLaporanList = ({ item, token, device }) => {
  return (
    <View style={styles.cardList}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <View>
          <Text
            style={{
              fontSize: fontSizeResponsive("H3", device),
              fontWeight: 400,
            }}
          >
            {typeof item.tanggalSertif === "string"
              ? item.tanggalSertif
              : moment(item.tanggalSertif)
                  .locale("id")
                  .format(DATETIME.LONG_DATE)}
          </Text>
          <Text
            style={{
              fontSize: fontSizeResponsive("H3", device),
              fontWeight: 600,
            }}
          >
            {item.noSertif}
          </Text>
        </View>
        <Text
          style={{
            textAlign: "right",
            fontSize: fontSizeResponsive("H3", device),
            fontWeight: 400,
          }}
        >
          {item.jenis_sertifikat}
        </Text>
      </View>
      <Text
        style={{ fontSize: fontSizeResponsive("H1", device), fontWeight: 600 }}
      >
        {item.subject}
      </Text>
      <Text
        style={{ fontSize: fontSizeResponsive("H2", device), fontWeight: 400 }}
      >
        {item.pelatihan}
      </Text>
      <View style={{ marginTop: 10 }}>
        <Text
          style={{
            fontSize: fontSizeResponsive("H3", device),
            fontWeight: 400,
            color: COLORS.lighter,
          }}
        >
          Penerima :
        </Text>
        <Text
          style={{
            fontSize: fontSizeResponsive("H3", device),
            fontWeight: 500,
          }}
        >
          {item.composer}
        </Text>
      </View>
    </View>
  );
};

export const LaporanDigitalSign = () => {
  const navigation = useNavigation();

  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const bottomSheetModalFilterRef = useRef(null);
  const [filterUnker, setFilterUnker] = useState();
  const [filterSatker, setFilterSatker] = useState();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (filterUnker && filterUnker.key) {
      dispatch(getSubDivisionFilter({ token: token, id: filterUnker.key }));
    }
  }, [filterUnker]);

  useEffect(() => {
    if (token !== "") {
      dispatch(getSummaryCount(token));
      dispatch(
        getSummaryList({
          token: token,
          sertifikat: "",
          pelatihan: "",
          judul: "",
        })
      );
      dispatch(
        getLaporanAksiPerubahan({
          token: token,
          unker: filterUnker?.key,
          satker: filterSatker?.key,
        })
      );
      dispatch(getDivisionFilter({ token: token }));
    }
  }, [token, filterSatker, filterUnker]);

  const { summary, loading, subjectLists } = useSelector(
    (state) => state.digitalsign
  );
  const { laporan, filterSatkerUnker } = useSelector(
    (state) => state.aksiperubahan
  );

  let charA = 0;
  const klasikal = summary?.count?.pelatihan_klasikal_counts;
  let tmpKlasikal = [];
  let tmpKetKlasikal = [];

  for (const key in klasikal) {
    if (klasikal.hasOwnProperty(key)) {
      tmpKlasikal.push({
        actualKey: key,
        name: String.fromCharCode(charA),
        jumlah: klasikal[key],
      });
      tmpKetKlasikal.push({
        id: String.fromCharCode(charA),
        name: key,
      });
      charA++;
    }
  }

  const nonKlasikal = summary?.count?.pelatihan_non_klasikal_counts;
  let tmpNonKlasikal = [];
  let tmpKetNonKlasikal = [];

  for (const key in nonKlasikal) {
    if (nonKlasikal.hasOwnProperty(key) && key !== "e-learning") {
      tmpNonKlasikal.push({
        actualKey: key,
        name: String.fromCharCode(charA),
        jumlah: nonKlasikal[key],
      });
      tmpKetNonKlasikal.push({
        id: String.fromCharCode(charA),
        name: key,
      });
      charA++;
    }
  }

  const [listYear, setListYear] = useState();
  const [listBatch, setListBatch] = useState();
  const [dataTingkatan, setDataTingkatan] = useState([]);
  const [dataGraphAksiPerubahan, setDataGraphAksiPerubahan] = useState(null);
  const [tonggleYear, setToggleYear] = useState(false);
  const [tonggleAngkatan, setToggleAngkatan] = useState(false);
  const [tonggleAngkatanDasar, setToggleAngkatanDasar] = useState(false);
  const [keyPelatihanNasional, setKeyPelatihanNasional] = useState("");
  const [jenisSertifikat, setJenisSertifikat] = useState([]);
  const [jenisPelatihan, setJenisPelatihan] = useState([]);
  const [judulPelatihan, setJudulPelatihan] = useState([]);

  const [filter, setFilter] = useState({
    "LATIHAN DASAR ": {
      angkatan: {
        key: "",
        value: "",
      },
      tahun: {
        key: "",
        value: "",
      },
    },
    "PELATIHAN KEPEMIMPINAN PENGAWAS ": {
      tahun: {
        key: "",
        value: "",
      },
    },
    "PELATIHAN KEPEMIMPINAN ADMINISTRATOR ": {
      tahun: {
        key: "",
        value: "",
      },
    },
    "PELATIHAN KEPEMIMPINAN NASIONAL ": {
      tingkat: {
        key: "",
        value: "",
      },
      tahun: {
        key: "",
        value: "",
      },
      angkatan: {
        key: "",
        value: "",
      },
    },
  });

  const handleSelectedFilter = (jenis, key, value) => {
    if (key === "tahun") {
      setFilter({
        ...filter,
        [jenis]: {
          ...filter[jenis],
          tahun: value,
        },
      });
    } else if (key === "tingkat") {
      setFilter({
        ...filter,
        [jenis]: {
          ...filter[jenis],
          tingkat: value,
        },
      });
    } else if (key === "angkatan") {
      setFilter({
        ...filter,
        [jenis]: {
          ...filter[jenis],
          angkatan: value,
        },
      });
    }
  };

  function filterPelatihanByTingkatan(tingkatan) {
    let filteredData = {};
    let dataTahun = [];

    for (const key in listYear) {
      if (key.toLowerCase().includes(tingkatan)) {
        filteredData = key;
        dataTahun.push(listYear[key][0]);
      }
    }
    setFilter({
      ...filter,
      ["PELATIHAN KEPEMIMPINAN NASIONAL "]: {
        ...filter["PELATIHAN KEPEMIMPINAN NASIONAL "],
        tahun: dataTahun[0],
      },
    });
    setKeyPelatihanNasional(filteredData);
  }

  useEffect(() => {
    if (laporan !== null) {
      let tmpAksiPerubahan = [...laporan];
      let tmpc = {
        "LATIHAN DASAR ": [],
        "PELATIHAN KEPEMIMPINAN PENGAWAS ": [],
        "PELATIHAN KEPEMIMPINAN ADMINISTRATOR ": [],
        "PELATIHAN KEPEMIMPINAN NASIONAL ": [],
      };
      let year = {};
      let batch = {};
      let tmpt = [];

      tmpAksiPerubahan.map((item, index) => {
        let listBatch = item.list_batch;
        let name = item.name;

        year[name] = [];
        batch[name] = {};

        Object.keys(listBatch).forEach((itemTahun) => {
          year[name].push({
            key: itemTahun.toString(),
            value: itemTahun.toString(),
          });
          batch[name][itemTahun] = [];
          listBatch[itemTahun].map((val) => {
            batch[name][itemTahun].push({
              key: val.toString(),
              value: val.toString(),
            });
          });
        });

        if (name.includes("PELATIHAN KEPEMIMPINAN NASIONAL")) {
          let tingkat = name.split("PELATIHAN KEPEMIMPINAN NASIONAL ")[1];
          tmpt.push({
            key: tingkat,
            value: tingkat,
          });
        }

        if (filter["PELATIHAN KEPEMIMPINAN NASIONAL "].tingkat?.key === "") {
          setFilter({
            ...filter,
            ["PELATIHAN KEPEMIMPINAN NASIONAL "]: {
              ...filter["PELATIHAN KEPEMIMPINAN NASIONAL "],
              tingkat: tmpt[0],
            },
            ["LATIHAN DASAR "]: {
              ...filter["LATIHAN DASAR "],
              tahun: {
                key:
                  year["LATIHAN DASAR "] === undefined
                    ? "-"
                    : year["LATIHAN DASAR "][0].key,
                value:
                  year["LATIHAN DASAR "] === undefined
                    ? "-"
                    : year["LATIHAN DASAR "][0].value,
              },
            },
            ["PELATIHAN KEPEMIMPINAN PENGAWAS "]: {
              ...filter["PELATIHAN KEPEMIMPINAN PENGAWAS "],
              tahun: {
                key:
                  year["PELATIHAN KEPEMIMPINAN PENGAWAS "] === undefined
                    ? "-"
                    : year["PELATIHAN KEPEMIMPINAN PENGAWAS "][0].key,
                value:
                  year["PELATIHAN KEPEMIMPINAN PENGAWAS "] === undefined
                    ? "-"
                    : year["PELATIHAN KEPEMIMPINAN PENGAWAS "][0].value,
              },
            },
            ["PELATIHAN KEPEMIMPINAN ADMINISTRATOR "]: {
              ...filter["PELATIHAN KEPEMIMPINAN ADMINISTRATOR "],
              tahun: {
                key:
                  year["PELATIHAN KEPEMIMPINAN ADMINISTRATOR "] === undefined
                    ? "-"
                    : year["PELATIHAN KEPEMIMPINAN ADMINISTRATOR "][0].key,
                value:
                  year["PELATIHAN KEPEMIMPINAN ADMINISTRATOR "] === undefined
                    ? "-"
                    : year["PELATIHAN KEPEMIMPINAN ADMINISTRATOR "][0].value,
              },
            },
          });
        }

        item.data.map((val) => {
          if (name.includes("LATIHAN DASAR ")) {
            if (
              val?.year?.toString() === filter[name]?.tahun?.key?.toString() &&
              val?.batch?.toString() === filter[name]?.angkatan?.key?.toString()
            ) {
              tmpc[name].push(val.member, val.implement, val.total_action);
            }
          }

          if (name.includes("PELATIHAN KEPEMIMPINAN PENGAWAS ")) {
            if (
              val?.year?.toString() === filter[name]?.tahun?.key?.toString()
            ) {
              tmpc[name].push({
                Peserta: val.member,
                Implementasi: val.implement,
                Aksi: val.total_action,
                name: `Angkatan ${val.batch}`,
                batch: val.batch,
              });
              tmpc[name].sort((a, b) => a.batch - b.batch);
            }
          }

          if (
            name.includes(
              "PELATIHAN KEPEMIMPINAN NASIONAL " +
                filter["PELATIHAN KEPEMIMPINAN NASIONAL "].tingkat?.key
            )
          ) {
            if (
              val.year.toString() ===
                filter[
                  "PELATIHAN KEPEMIMPINAN NASIONAL "
                ].tahun?.key?.toString() &&
              val.batch.toString() ===
                filter[
                  "PELATIHAN KEPEMIMPINAN NASIONAL "
                ].angkatan?.key?.toString()
            ) {
              tmpc["PELATIHAN KEPEMIMPINAN NASIONAL "].push(
                val.member,
                val.implement,
                val.total_action
              );
            }
          }

          if (name.includes("PELATIHAN KEPEMIMPINAN ADMINISTRATOR ")) {
            if (
              val?.year?.toString() === filter[name]?.tahun?.key?.toString()
            ) {
              tmpc[name].push({
                Peserta: val.member,
                Implementasi: val.implement,
                Aksi: val.total_action,
                name: `Angkatan ${val.batch}`,
                batch: val.batch,
              });
              tmpc[name].sort((a, b) => a.batch - b.batch);
            }
          }
        });
      });
      setListYear(year);
      setListBatch(batch);
      setDataTingkatan(tmpt);
      // console.log("---------", tmpc);
      // console.log(batch);
      // console.log("year", year);
      // console.log("filter", filter);
      // console.log("------------");
      setDataGraphAksiPerubahan(tmpc);
    }
  }, [laporan, filter, filterSatker, filterUnker]);

  const { device } = useSelector((state) => state.apps);

  const widthAndHeight = 250;
  const sliceColorELearning = ["#ff8f28", "#b745ff"];
  const sliceColor = ["#ff8f28", "#b745ff", "#38B2AC"];

  const numberWithCommas = (x) => {
    return x?.toString()?.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
  };

  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetAttachFilter = (item) => {
    bottomSheetModalFilterRef.current?.present();
  };

  const bottomSheetAttachFilterClose = () => {
    if (bottomSheetModalFilterRef.current)
      bottomSheetModalFilterRef.current?.close();
  };

  const unker = () => {
    let judulUnker = [];
    filterSatkerUnker.unker.map((item) => {
      judulUnker.push({
        key: item.id,
        value: item.name,
      });
    });
    return judulUnker;
  };

  const satker = () => {
    let judulSatker = [];
    filterSatkerUnker.satker.map((item) => {
      judulSatker.push({
        key: item.id,
        value: item.name,
      });
    });
    return judulSatker;
  };

  const pelatihan = (type) => {
    let maxValue = 100;
    let pelatihan = [];
    if (
      dataGraphAksiPerubahan[type] !== undefined &&
      dataGraphAksiPerubahan[type].length !== 0
    ) {
      maxValue = 0;

      dataGraphAksiPerubahan[type].forEach((item) => {
        maxValue = Math.max(
          maxValue,
          item.Aksi,
          item.Implementasi,
          item.Peserta
        );
        pelatihan.push(
          {
            value: item.Aksi,
            label: item.name,
            spacing: 2,
            labelWidth: 75,
            labelTextStyle: { color: "gray" },
            frontColor: "#ff8f28",
          },
          {
            value: item.Implementasi,
            frontColor: "#b745ff",
            spacing: 2,
          },
          {
            value: item.Peserta,
            frontColor: "#38B2AC",
          }
        );
      });
    }
    return {
      data: pelatihan,
      maxValue: maxValue,
    };
  };

  const optionJenisSertfikat = [
    {
      key: "klasikal",
      value: "Klasikal",
    },
    {
      key: "non_klasikal",
      value: "Non Klasikal",
    },
  ];

  const optionKlasikal = [
    {
      key: 1,
      value: "Pelatihan Struktural Kepemimpinan",
    },
    {
      key: 2,
      value: "Pelatihan Manajerial",
    },
    {
      key: 3,
      value: "Pelatihan Teknis",
    },
    {
      key: 4,
      value: "Pelatihan Fungsional",
    },
    {
      key: 5,
      value: "Pelatihan Sosial Kultural",
    },
    {
      key: 6,
      value: "Seminar/Konferensi/Sarasehan",
    },
    {
      key: 7,
      value: "Workshop atau Lokakarya",
    },
    {
      key: 8,
      value: "Kursus",
    },
    {
      key: 9,
      value: "Penataran",
    },
    {
      key: 10,
      value: "Bimbingan Teknis",
    },
    {
      key: 11,
      value: "Sosialisasi",
    },
  ];

  const optionNonKlasikal = [
    {
      key: 1,
      value: "Coaching",
    },
    {
      key: 2,
      value: "Mentoring",
    },
    // {
    //     key: 3,
    //     value: 'e-learning'
    // },
    {
      key: 4,
      value: "Pelatihan Jarak Jauh",
    },
    {
      key: 5,
      value: "Detasering (Secondment)",
    },
    {
      key: 6,
      value: "Pembelajaran Alam Terkbuka (Outbond)",
    },
    {
      key: 7,
      value: "Patok Banding (Benchmarking)",
    },
    {
      key: 8,
      value: "Pertukaran antara PNS dengan Pegawai Swasta/BUMN/BUMD",
    },
    {
      key: 9,
      value: "Belajar Mandiri (Self Development)",
    },
    {
      key: 10,
      value: "Komunitas Belajar (Community of Practices)",
    },
    {
      key: 11,
      value: "Bimbingan di Tempat Kerja",
    },
    {
      key: 12,
      value: "Magang/Praktik Kerja",
    },
  ];

  useEffect(() => {
    if (token !== "") {
      dispatch(
        getSubjectList({ token: token, pelatihan: jenisPelatihan.value })
      );
    }
  }, [jenisPelatihan]);

  const listPelatihan = () => {
    let judulPelatihan = [];
    subjectLists.map((item) => {
      judulPelatihan.push({
        key: item,
        value: item,
      });
    });
    return judulPelatihan;
  };

  console.log(summary.lists);

  if (dataGraphAksiPerubahan === null) {
    return <Loading />;
  } else {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {loading ? <Loading /> : null}
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
                  fontWeight: 600,
                  color: COLORS.white,
                }}
              >
                Laporan
              </Text>
            </View>
          </View>
          <ScrollView>
            <View
              style={{
                // padding: PADDING.Page,
                width: "100%",
                paddingVertical: 20,
                paddingHorizontal: "5%",
              }}
            >
              <View
                style={[
                  styles.card,
                  { marginBottom: 10, alignItems: "center" },
                ]}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: 600,
                  }}
                >
                  Sertifikat Internal
                </Text>
              </View>
              <View>
                <View style={{ ...styles.card, alignItems: "center" }}>
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={[
                        device === "tablet"
                          ? styles.circleTablet
                          : styles.circle,
                        {
                          backgroundColor: COLORS.successLight,
                        },
                      ]}
                    >
                      <Ionicons
                        name="clipboard-outline"
                        size={device === "tablet" ? 50 : 24}
                        color={COLORS.success}
                      />
                    </View>
                    <View
                      style={{
                        justifyContent: "center",
                        marginLeft: 15,
                        gap: 5,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H1", device),
                          fontWeight: 700,
                        }}
                      >
                        {summary?.count.total_count}
                      </Text>
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H3", device),
                          fontWeight: 400,
                        }}
                      >
                        Total Pelatihan
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                    width: "100%",
                  }}
                >
                  <View style={styles.cardsmall}>
                    <View style={{ flexDirection: "row" }}>
                      <View
                        style={[
                          device === "tablet"
                            ? styles.circleTablet
                            : styles.circle,
                          {
                            backgroundColor: COLORS.infoLight,
                          },
                        ]}
                      >
                        <Ionicons
                          name="clipboard-outline"
                          size={device === "tablet" ? 50 : 24}
                          color={COLORS.info}
                        />
                      </View>
                      <View
                        style={{
                          justifyContent: "center",
                          marginLeft: 15,
                          gap: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H1", device),
                            fontWeight: 700,
                          }}
                        >
                          {summary?.count.jenis_sertifikat?.klasikal}
                        </Text>
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H3", device),
                            fontWeight: 400,
                            width: device === "tablet" ? "100%" : "60%",
                          }}
                        >
                          Total Klasikal
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.cardsmall}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <View
                        style={[
                          device === "tablet"
                            ? styles.circleTablet
                            : styles.circle,
                          {
                            backgroundColor: COLORS.warningLight,
                          },
                        ]}
                      >
                        <Ionicons
                          name="clipboard-outline"
                          size={device === "tablet" ? 50 : 24}
                          color={COLORS.warning}
                        />
                      </View>
                      <View
                        style={{
                          justifyContent: "center",
                          marginLeft: 15,
                          gap: 5,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H1", device),
                            fontWeight: 700,
                          }}
                        >
                          {summary?.count.jenis_sertifikat?.non_klasikal}
                        </Text>
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H3", device),
                            fontWeight: 400,
                            width: device === "tablet" ? "100%" : "55%",
                          }}
                        >
                          Total Non Klasikal
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View
                style={[styles.card, { marginTop: 10, alignItems: "center" }]}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: 600,
                  }}
                >
                  Sertifikat Eksternal
                </Text>
              </View>

              <View
                style={{ ...styles.card, alignItems: "center", marginTop: 10 }}
              >
                <View style={{ flexDirection: "row" }}>
                  <View
                    style={[
                      device === "tablet" ? styles.circleTablet : styles.circle,
                      {
                        backgroundColor: COLORS.successLight,
                      },
                    ]}
                  >
                    <Ionicons
                      name="clipboard-outline"
                      size={device === "tablet" ? 50 : 24}
                      color={COLORS.success}
                    />
                  </View>
                  <View
                    style={{
                      justifyContent: "center",
                      marginLeft: 15,
                      gap: 5,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H1", device),
                        fontWeight: 700,
                      }}
                    >
                      {numberWithCommas(
                        summary?.count.total_pelatihan_external
                      )}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Total Pelatihan
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ ...styles.card, marginTop: 20 }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: 600,
                  }}
                >
                  Jumlah pelatihan Klasikal
                </Text>
                <BarChartKit
                  data={{
                    labels: [
                      "A",
                      "B",
                      "C",
                      "D",
                      "E",
                      "F",
                      "G",
                      "H",
                      "I",
                      "J",
                      "K",
                    ],
                    datasets: [
                      {
                        data: [
                          [tmpKlasikal[0]?.jumlah],
                          [tmpKlasikal[1]?.jumlah],
                          [tmpKlasikal[2]?.jumlah],
                          [tmpKlasikal[3]?.jumlah],
                          [tmpKlasikal[4]?.jumlah],
                          [tmpKlasikal[5]?.jumlah],
                          [tmpKlasikal[6]?.jumlah],
                          [tmpKlasikal[7]?.jumlah],
                          [tmpKlasikal[8]?.jumlah],
                          [tmpKlasikal[9]?.jumlah],
                          [tmpKlasikal[10]?.jumlah],
                        ],
                      },
                    ],
                  }}
                  hide
                  legend
                  width={wp(85)}
                  height={300}
                  chartConfig={{
                    backgroundGradientFrom: COLORS.white,
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientTo: COLORS.white,
                    backgroundGradientToOpacity: 1,
                    color: () => COLORS.lighter,
                    barPercentage: 0.2,
                    propsForBackgroundLines: {
                      x1: 60,
                    },
                    fillShadowGradientFromOffset: 1,
                    fillShadowGradientFrom: COLORS.info,
                    fillShadowGradientFromOpacity: 1,
                  }}
                  style={{ marginHorizontal: -20, marginTop: 20 }}
                  withInnerLines={false}
                />

                <View style={{ gap: 5 }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H2", device),
                      fontWeight: 500,
                    }}
                  >
                    Keterangan:
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      A
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Pelatihan Struktural Kepemimpinan
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      B
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Pelatihan Manajerial
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      C
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Pelatihan Teknis
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      D
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Pelatihan Fungsional
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      E
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Pelatihan Sosial Kultural
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      F
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Seminar/Konferensi/Sarasehan
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      G
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Workshop atau Lokarya
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      H
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Kursus
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      I
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Penataran
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      J
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Bimbingan Teknis
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      K
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Sosialisasi
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ ...styles.card, marginTop: 20 }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: 600,
                  }}
                >
                  Jumlah pelatihan Non Klasikal
                </Text>
                <BarChartKit
                  data={{
                    labels: [
                      "A",
                      "B",
                      "C",
                      "D",
                      "E",
                      "F",
                      "G",
                      "H",
                      "I",
                      "J",
                      "K",
                      "L",
                      "M",
                    ],
                    datasets: [
                      {
                        data: [
                          [tmpNonKlasikal[0]?.jumlah],
                          [tmpNonKlasikal[1]?.jumlah],
                          [tmpNonKlasikal[2]?.jumlah],
                          [tmpNonKlasikal[3]?.jumlah],
                          [tmpNonKlasikal[4]?.jumlah],
                          [tmpNonKlasikal[5]?.jumlah],
                          [tmpNonKlasikal[6]?.jumlah],
                          [tmpNonKlasikal[7]?.jumlah],
                          [tmpNonKlasikal[8]?.jumlah],
                          [tmpNonKlasikal[9]?.jumlah],
                          [tmpNonKlasikal[10]?.jumlah],
                        ],
                      },
                    ],
                  }}
                  hide
                  legend
                  width={wp(85)}
                  height={300}
                  chartConfig={{
                    backgroundGradientFrom: COLORS.white,
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientTo: COLORS.white,
                    backgroundGradientToOpacity: 1,
                    color: () => COLORS.lighter,
                    barPercentage: 0.2,
                    propsForBackgroundLines: {
                      x1: 60,
                    },
                    fillShadowGradientFromOffset: 1,
                    fillShadowGradientFrom: COLORS.warning,
                    fillShadowGradientFromOpacity: 1,
                  }}
                  style={{ marginHorizontal: -15, marginTop: 20 }}
                  withInnerLines={false}
                />
                <View style={{ gap: 5 }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H2", device),
                      fontWeight: 500,
                    }}
                  >
                    Keterangan:
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      A
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Coaching
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      B
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Mentoring
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      C
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Pelatihan Jarak Jauh{" "}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      D
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Detasering (Secondment)
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      E
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Pembelajaran Alam Terbuka (Outbond)
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      F
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Patok Banding (Benchmarking)
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      G
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Pertukanan antara PNS dengan Pegawai
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      H
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Swasta/BUMN/BUMD
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      I
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Belajar Mandiri (Self Learning)
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      J
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Komunitas Belajar (Community of Practices)
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      K
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Bimbingan di Tempat Kerja
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                        width: 15,
                      }}
                    >
                      L
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      ={" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H3", device),
                        fontWeight: 400,
                      }}
                    >
                      Magang/Praktik
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ ...styles.card, marginTop: 20 }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: 600,
                  }}
                >
                  Jumlah Peserta E-Learning
                </Text>

                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <PieChart
                    widthAndHeight={widthAndHeight}
                    series={[
                      summary?.count?.lms_enrolled,
                      summary?.count?.lms_completed,
                    ]}
                    sliceColor={sliceColorELearning}
                    coverRadius={0.75}
                    coverFill={"#FFF"}
                    style={{ alignSelf: "center", marginVertical: 20 }}
                  />
                </View>
                <View
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#ff8f28",
                        height: 30,
                        width: 30,
                        borderRadius: 50,
                      }}
                    />
                    <Text>
                      Enrolled {numberWithCommas(summary?.count?.lms_enrolled)}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#b745ff",
                        height: 30,
                        width: 30,
                        borderRadius: 50,
                      }}
                    />
                    <Text>
                      Completed{" "}
                      {numberWithCommas(summary?.count?.lms_completed)}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ ...styles.card, marginTop: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H2", device),
                      fontWeight: 600,
                    }}
                  >
                    Filter
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      bottomSheetAttachFilter();
                    }}
                  >
                    <Ionicons
                      name="filter-outline"
                      size={25}
                      color={COLORS.grey}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ ...styles.card, marginTop: 20 }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: 600,
                  }}
                >
                  Jumlah Pelatihan Kepemimpinan Pengawas
                </Text>

                <View style={{ marginVertical: 10 }}>
                  <Dropdown
                    data={
                      listYear === undefined ||
                      listYear["PELATIHAN KEPEMIMPINAN PENGAWAS "] === undefined
                        ? []
                        : listYear["PELATIHAN KEPEMIMPINAN PENGAWAS "]
                    }
                    setSelected={(item) => {
                      handleSelectedFilter(
                        "PELATIHAN KEPEMIMPINAN PENGAWAS ",
                        "tahun",
                        item
                      );
                    }}
                    selected={filter["PELATIHAN KEPEMIMPINAN PENGAWAS "].tahun}
                    borderWidth={1}
                    borderwidthDrop={1}
                    borderWidthValue={1}
                    borderColor={COLORS.ExtraDivinder}
                    borderColorDrop={COLORS.ExtraDivinder}
                    borderColorValue={COLORS.ExtraDivinder}
                  />
                </View>

                {/* <View style={{ height: 350 }}>
                  <CartesianChart
                    data={
                      dataGraphAksiPerubahan["PELATIHAN KEPEMIMPINAN PENGAWAS "]
                        ?.length === 0
                        ? [
                            {
                              name: "",
                              Implementasi: 0,
                              Peserta: 0,
                              Aksi: 0,
                            },
                          ]
                        : dataGraphAksiPerubahan[
                            "PELATIHAN KEPEMIMPINAN PENGAWAS "
                          ]
                    }
                    xKey="name"
                    yKeys={["Implementasi", "Aksi", "Peserta"]}
                    domainPadding={{
                      left: 50,
                      right: 50,
                      top: 10,
                    }}
                    axisOptions={{
                      font: font,
                      formatXLabel: (value) => {
                        return value === undefined ? "" : value?.toString();
                      },
                      formatYLabel: (value) => {
                        return value === undefined ? "" : value?.toString();
                      },
                    }}
                  >
                    {({ points, chartBounds }) => (
                      <BarGroup
                        chartBounds={chartBounds}
                        betweenGroupPadding={0.3}
                        withinGroupPadding={0.1}
                        roundedCorners={{
                          topLeft: 5,
                          topRight: 5,
                        }}
                      >
                        <BarGroup.Bar points={points.Peserta} color="#ff8f28" />
                        <BarGroup.Bar
                          points={points.Implementasi}
                          color="#b745ff"
                        />
                        <BarGroup.Bar points={points.Aksi} color="#38B2AC" />
                      </BarGroup>
                    )}
                  </CartesianChart>
                </View> */}
                {/* {renderTitle()} */}
                <BarChart
                  data={pelatihan("PELATIHAN KEPEMIMPINAN PENGAWAS ")?.data}
                  barWidth={20}
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
                  maxValue={
                    pelatihan("PELATIHAN KEPEMIMPINAN PENGAWAS ")?.maxValue
                  }
                />
                <View
                  style={{
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    gap: 10,
                    marginTop: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#ff8f28",
                        height: 30,
                        width: 30,
                        borderRadius: 50,
                      }}
                    />
                    <Text>Peserta</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#38B2AC",
                        height: 30,
                        width: 30,
                        borderRadius: 50,
                      }}
                    />
                    <Text>Aksi</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#b745ff",
                        height: 30,
                        width: 30,
                        borderRadius: 50,
                      }}
                    />
                    <Text>Implementasi</Text>
                  </View>
                </View>
              </View>

              <View style={{ ...styles.card, marginTop: 20 }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: 600,
                  }}
                >
                  Jumlah Pelatihan Kepemimpinan Administrator
                </Text>

                <View style={{ marginVertical: 10 }}>
                  <Dropdown
                    data={
                      listYear === undefined
                        ? []
                        : listYear["PELATIHAN KEPEMIMPINAN ADMINISTRATOR "]
                    }
                    setSelected={(item) => {
                      handleSelectedFilter(
                        "PELATIHAN KEPEMIMPINAN ADMINISTRATOR ",
                        "tahun",
                        item
                      );
                    }}
                    selected={
                      filter["PELATIHAN KEPEMIMPINAN ADMINISTRATOR "]?.tahun
                    }
                    borderWidth={1}
                    borderwidthDrop={1}
                    borderWidthValue={1}
                    borderColor={COLORS.ExtraDivinder}
                    borderColorDrop={COLORS.ExtraDivinder}
                    borderColorValue={COLORS.ExtraDivinder}
                  />
                </View>

                {/* <View style={{ height: 350 }}>
                  <CartesianChart
                    data={
                      dataGraphAksiPerubahan[
                        "PELATIHAN KEPEMIMPINAN ADMINISTRATOR "
                      ]?.length === 0
                        ? [
                            {
                              name: "",
                              Implementasi: 0,
                              Peserta: 0,
                              Aksi: 0,
                            },
                          ]
                        : dataGraphAksiPerubahan[
                            "PELATIHAN KEPEMIMPINAN ADMINISTRATOR "
                          ]
                    }
                    xKey="name"
                    yKeys={["Implementasi", "Aksi", "Peserta"]}
                    domainPadding={{
                      left: 50,
                      right: 50,
                      top: 10,
                    }}
                    domain={{ y: [0, 5] }}
                    axisOptions={{
                      font: font,
                      formatXLabel: (value) => {
                        return value === undefined ? "" : value?.toString();
                      },
                      formatYLabel: (value) => {
                        return value === undefined ? "" : value?.toString();
                      },
                      tickCount: {
                        x: 4,
                        y: 5,
                      },
                    }}
                  >
                    {({ points, chartBounds, canvasSize }) => (
                      <BarGroup
                        chartBounds={chartBounds}
                        betweenGroupPadding={0.3}
                        withinGroupPadding={0.1}
                        roundedCorners={{
                          topLeft: 5,
                          topRight: 5,
                        }}
                      >
                        <BarGroup.Bar points={points.Peserta} color="#ff8f28" />
                        <BarGroup.Bar
                          points={points.Implementasi}
                          color="#b745ff"
                        />
                        <BarGroup.Bar points={points.Aksi} color="#38B2AC" />
                      </BarGroup>
                    )}
                  </CartesianChart>
                </View> */}
                <BarChart
                  data={
                    pelatihan("PELATIHAN KEPEMIMPINAN ADMINISTRATOR ")?.data
                  }
                  barWidth={20}
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
                  maxValue={
                    pelatihan("PELATIHAN KEPEMIMPINAN ADMINISTRATOR ")?.maxValue
                  }
                />
                <View
                  style={{
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    gap: 10,
                    marginTop: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#ff8f28",
                        height: 30,
                        width: 30,
                        borderRadius: 50,
                      }}
                    />
                    <Text>Peserta</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#38B2AC",
                        height: 30,
                        width: 30,
                        borderRadius: 50,
                      }}
                    />
                    <Text>Aksi</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#b745ff",
                        height: 30,
                        width: 30,
                        borderRadius: 50,
                      }}
                    />
                    <Text>Implementasi</Text>
                  </View>
                </View>
              </View>

              <View style={{ ...styles.card, marginTop: 20 }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: 600,
                  }}
                >
                  Jumlah Pelatihan Kepemimpinan Nasional
                </Text>

                <View style={{ marginVertical: 10 }}>
                  <Dropdown
                    data={dataTingkatan}
                    setSelected={(item) => {
                      handleSelectedFilter(
                        "PELATIHAN KEPEMIMPINAN NASIONAL ",
                        "tingkat",
                        item
                      );
                      setToggleYear(true);
                      filterPelatihanByTingkatan(item.value.toLowerCase());
                    }}
                    selected={
                      filter["PELATIHAN KEPEMIMPINAN NASIONAL "]?.tingkat
                    }
                    borderWidth={1}
                    borderwidthDrop={1}
                    borderWidthValue={1}
                    borderColor={COLORS.ExtraDivinder}
                    borderColorDrop={COLORS.ExtraDivinder}
                    borderColorValue={COLORS.ExtraDivinder}
                  />
                </View>
                {tonggleYear ? (
                  <View style={{ marginBottom: 10 }}>
                    <Dropdown
                      data={
                        listYear === undefined ||
                        listYear[keyPelatihanNasional] === undefined
                          ? []
                          : listYear[keyPelatihanNasional]
                      }
                      setSelected={(item) => {
                        handleSelectedFilter(
                          "PELATIHAN KEPEMIMPINAN NASIONAL ",
                          "tahun",
                          item
                        );
                        setToggleAngkatan(true);
                      }}
                      placeHolder={"Pilih Tahun"}
                      borderWidth={1}
                      borderwidthDrop={1}
                      borderWidthValue={1}
                      borderColor={COLORS.ExtraDivinder}
                      borderColorDrop={COLORS.ExtraDivinder}
                      borderColorValue={COLORS.ExtraDivinder}
                    />
                  </View>
                ) : null}

                {tonggleAngkatan ? (
                  <Dropdown
                    data={
                      listBatch === undefined
                        ? []
                        : listBatch[keyPelatihanNasional][
                            filter["PELATIHAN KEPEMIMPINAN NASIONAL "]?.tahun
                              ?.key
                          ]
                    }
                    setSelected={(item) => {
                      handleSelectedFilter(
                        "PELATIHAN KEPEMIMPINAN NASIONAL ",
                        "angkatan",
                        item
                      );
                    }}
                    placeHolder={"Pilih Angkatan"}
                    borderWidth={1}
                    borderwidthDrop={1}
                    borderWidthValue={1}
                    borderColor={COLORS.ExtraDivinder}
                    borderColorDrop={COLORS.ExtraDivinder}
                    borderColorValue={COLORS.ExtraDivinder}
                  />
                ) : null}
                <PieChart
                  widthAndHeight={widthAndHeight}
                  series={
                    dataGraphAksiPerubahan[
                      "PELATIHAN KEPEMIMPINAN NASIONAL "
                    ] === undefined ||
                    dataGraphAksiPerubahan["PELATIHAN KEPEMIMPINAN NASIONAL "]
                      ?.length === 0
                      ? [1, 1, 1]
                      : dataGraphAksiPerubahan[
                          "PELATIHAN KEPEMIMPINAN NASIONAL "
                        ]
                  }
                  sliceColor={sliceColor}
                  coverRadius={0.75}
                  coverFill={"#FFF"}
                  style={{ alignSelf: "center", marginVertical: 20 }}
                />

                <View
                  style={{
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#ff8f28",
                        height: 30,
                        width: 30,
                        borderRadius: 50,
                      }}
                    />
                    <Text>
                      Peserta{" "}
                      <Text style={{ fontWeight: FONTWEIGHT.bold }}>
                        {dataGraphAksiPerubahan[
                          "PELATIHAN KEPEMIMPINAN NASIONAL "
                        ] === undefined ||
                        dataGraphAksiPerubahan[
                          "PELATIHAN KEPEMIMPINAN NASIONAL "
                        ]?.length === 0
                          ? 0
                          : numberWithCommas(
                              dataGraphAksiPerubahan[
                                "PELATIHAN KEPEMIMPINAN NASIONAL "
                              ][0]
                            )}
                      </Text>
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#38B2AC",
                        height: 30,
                        width: 30,
                        borderRadius: 50,
                      }}
                    />
                    <Text>
                      Aksi{" "}
                      <Text style={{ fontWeight: FONTWEIGHT.bold }}>
                        {dataGraphAksiPerubahan[
                          "PELATIHAN KEPEMIMPINAN NASIONAL "
                        ] === undefined ||
                        dataGraphAksiPerubahan[
                          "PELATIHAN KEPEMIMPINAN NASIONAL "
                        ]?.length === 0
                          ? 0
                          : numberWithCommas(
                              dataGraphAksiPerubahan[
                                "PELATIHAN KEPEMIMPINAN NASIONAL "
                              ][2]
                            )}
                      </Text>
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#b745ff",
                        height: 30,
                        width: 30,
                        borderRadius: 50,
                      }}
                    />
                    <Text>
                      Implementasi{" "}
                      <Text style={{ fontWeight: FONTWEIGHT.bold }}>
                        {dataGraphAksiPerubahan[
                          "PELATIHAN KEPEMIMPINAN NASIONAL "
                        ] === undefined ||
                        dataGraphAksiPerubahan[
                          "PELATIHAN KEPEMIMPINAN NASIONAL "
                        ]?.length === 0
                          ? 0
                          : numberWithCommas(
                              dataGraphAksiPerubahan[
                                "PELATIHAN KEPEMIMPINAN NASIONAL "
                              ][1]
                            )}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ ...styles.card, marginTop: 20 }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H2", device),
                    fontWeight: 600,
                  }}
                >
                  Jumlah Latihan Dasar
                </Text>

                <View style={{ marginVertical: 10 }}>
                  <Dropdown
                    data={
                      listYear === undefined ||
                      listYear["LATIHAN DASAR "] === undefined
                        ? []
                        : listYear["LATIHAN DASAR "]
                    }
                    setSelected={(item) => {
                      handleSelectedFilter("LATIHAN DASAR ", "tahun", item);
                      setToggleAngkatanDasar(true);
                    }}
                    selected={filter["LATIHAN DASAR "]?.tahun}
                    borderWidth={1}
                    borderwidthDrop={1}
                    borderWidthValue={1}
                    borderColor={COLORS.ExtraDivinder}
                    borderColorDrop={COLORS.ExtraDivinder}
                    borderColorValue={COLORS.ExtraDivinder}
                  />
                </View>

                {tonggleAngkatanDasar ? (
                  <View>
                    <Dropdown
                      data={
                        listBatch === undefined
                          ? []
                          : listBatch["LATIHAN DASAR "][
                              filter["LATIHAN DASAR "].tahun.key
                            ]
                      }
                      setSelected={(item) => {
                        handleSelectedFilter(
                          "LATIHAN DASAR ",
                          "angkatan",
                          item
                        );
                      }}
                      placeHolder={"Pilih Angkatan"}
                      borderWidth={1}
                      borderwidthDrop={1}
                      borderWidthValue={1}
                      borderColor={COLORS.ExtraDivinder}
                      borderColorDrop={COLORS.ExtraDivinder}
                      borderColorValue={COLORS.ExtraDivinder}
                    />
                  </View>
                ) : null}
                <PieChart
                  widthAndHeight={widthAndHeight}
                  series={
                    dataGraphAksiPerubahan === undefined ||
                    dataGraphAksiPerubahan["LATIHAN DASAR "].length === 0
                      ? [1, 1, 1]
                      : dataGraphAksiPerubahan["LATIHAN DASAR "]
                  }
                  sliceColor={sliceColor}
                  coverRadius={0.75}
                  coverFill={"#FFF"}
                  style={{ alignSelf: "center", marginVertical: 20 }}
                />

                <View
                  style={{
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#ff8f28",
                        height: 30,
                        width: 30,
                        borderRadius: 50,
                      }}
                    />
                    <Text>
                      Peserta{" "}
                      <Text style={{ fontWeight: FONTWEIGHT.bold }}>
                        {dataGraphAksiPerubahan === undefined ||
                        dataGraphAksiPerubahan["LATIHAN DASAR "].length === 0
                          ? 0
                          : dataGraphAksiPerubahan["LATIHAN DASAR "][0]}
                      </Text>
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#38B2AC",
                        height: 30,
                        width: 30,
                        borderRadius: 50,
                      }}
                    />
                    <Text>
                      Aksi{" "}
                      <Text style={{ fontWeight: FONTWEIGHT.bold }}>
                        {dataGraphAksiPerubahan === undefined ||
                        dataGraphAksiPerubahan["LATIHAN DASAR "].length === 0
                          ? 0
                          : dataGraphAksiPerubahan["LATIHAN DASAR "][2]}
                      </Text>
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#b745ff",
                        height: 30,
                        width: 30,
                        borderRadius: 50,
                      }}
                    />
                    <Text>
                      Implementasi{" "}
                      <Text style={{ fontWeight: FONTWEIGHT.bold }}>
                        {dataGraphAksiPerubahan === undefined ||
                        dataGraphAksiPerubahan["LATIHAN DASAR "].length === 0
                          ? 0
                          : dataGraphAksiPerubahan["LATIHAN DASAR "][1]}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>

              <View style={{ ...styles.card, marginTop: 20, height: 800 }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H1", device),
                    fontWeight: 600,
                    marginBottom: 15,
                  }}
                >
                  List Laporan
                </Text>
                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      marginBottom: 10,
                      fontWeight: FONTWEIGHT.bold,
                      color: COLORS.grey,
                      fontSize: fontSizeResponsive("H2", device),
                    }}
                  >
                    Jenis Pelatihan
                  </Text>
                  <Dropdown
                    data={optionJenisSertfikat}
                    selected={jenisSertifikat}
                    setSelected={setJenisSertifikat}
                    borderWidth={1}
                    borderwidthDrop={1}
                    borderWidthValue={1}
                    borderColor={COLORS.ExtraDivinder}
                    borderColorDrop={COLORS.ExtraDivinder}
                    borderColorValue={COLORS.ExtraDivinder}
                  />
                </View>

                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      marginBottom: 10,
                      fontWeight: FONTWEIGHT.bold,
                      color: COLORS.grey,
                      fontSize: fontSizeResponsive("H2", device),
                    }}
                  >
                    Pelatihan
                  </Text>
                  {jenisSertifikat.length === 0 ? (
                    <Text
                      style={{
                        color: COLORS.grey,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      <Text style={{ color: COLORS.danger }}>*</Text> Daftar
                      pelatihan akan muncul setelah memilih jenis pelatihan
                    </Text>
                  ) : (
                    <Dropdown
                      data={
                        jenisSertifikat.value === "Klasikal"
                          ? optionKlasikal
                          : optionNonKlasikal
                      }
                      selected={jenisPelatihan}
                      setSelected={setJenisPelatihan}
                      borderWidth={1}
                      borderwidthDrop={1}
                      borderWidthValue={1}
                      borderColor={COLORS.ExtraDivinder}
                      borderColorDrop={COLORS.ExtraDivinder}
                      borderColorValue={COLORS.ExtraDivinder}
                    />
                  )}
                </View>

                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      marginBottom: 10,
                      fontWeight: FONTWEIGHT.bold,
                      color: COLORS.grey,
                      fontSize: fontSizeResponsive("H2", device),
                    }}
                  >
                    Judul Pelatihan
                  </Text>
                  {jenisPelatihan.length === 0 ? (
                    <Text
                      style={{
                        color: COLORS.grey,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      <Text style={{ color: COLORS.danger }}>*</Text> Daftar
                      judul pelatihan akan muncul setelah memilih pelatihan
                    </Text>
                  ) : (
                    <Dropdown
                      data={listPelatihan()}
                      selected={judulPelatihan}
                      setSelected={setJudulPelatihan}
                      borderWidth={1}
                      borderwidthDrop={1}
                      borderWidthValue={1}
                      borderColor={COLORS.ExtraDivinder}
                      borderColorDrop={COLORS.ExtraDivinder}
                      borderColorValue={COLORS.ExtraDivinder}
                      heightValue={100}
                    />
                  )}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    justifyContent: "flex-end",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      backgroundColor: COLORS.infoDanger,
                      borderRadius: 8,
                    }}
                    onPress={() => {
                      setJenisSertifikat([]);
                      setJenisPelatihan([]);
                      setJudulPelatihan([]);
                    }}
                  >
                    <Text style={{ color: COLORS.white }}>Hapus</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      backgroundColor: COLORS.primary,
                      borderRadius: 8,
                    }}
                    onPress={() => {
                      dispatch(
                        getSummaryList({
                          token: token,
                          sertifikat: jenisSertifikat?.key,
                          pelatihan: jenisPelatihan?.value,
                          judul: judulPelatihan?.value,
                        })
                      );
                    }}
                  >
                    <Text style={{ color: COLORS.white }}>Terapkan</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={summary?.lists}
                  renderItem={({ item }) => (
                    <View key={item.id}>
                      <CardLaporanList
                        item={item}
                        token={token}
                        device={device}
                      />
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={true}
                  nestedScrollEnabled={true}
                />
              </View>
            </View>
          </ScrollView>
        </View>

        <BottomSheetModalProvider>
          <BottomSheetModal
            ref={bottomSheetModalFilterRef}
            snapPoints={animatedSnapPoints}
            handleHeight={animatedHandleHeight}
            contentHeight={animatedContentHeight}
            index={0}
            style={{ borderRadius: 50 }}
            keyboardBlurBehavior="restore"
            android_keyboardInputMode="adjust"
            backdropComponent={({ style }) => (
              <View
                style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}
              />
            )}
          >
            <BottomSheetView onLayout={handleContentLayout}>
              <View style={{ marginVertical: 20 }}>
                <View
                  style={{
                    marginHorizontal: 20,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 10,
                    borderBottomWidth: 2,
                    borderBottomColor: COLORS.grey,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Filter Satuan dan Unit Kerja
                  </Text>
                  <TouchableOpacity
                    style={{}}
                    onPress={() => {
                      bottomSheetAttachFilterClose();
                    }}
                  >
                    <Ionicons
                      name="close-outline"
                      size={24}
                      color={COLORS.lighter}
                    />
                  </TouchableOpacity>
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                  <Text
                    style={{
                      marginHorizontal: 10,
                      marginBottom: 10,
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Unit Kerja
                  </Text>
                  <Dropdown
                    search={true}
                    data={unker()}
                    placeHolder={"Pilih Unit Kerja"}
                    backgroundColor={COLORS.white}
                    selected={filterUnker}
                    setSelected={(item) => setFilterUnker(item)}
                    borderWidth={1}
                    borderWidthValue={1}
                    borderwidthDrop={1}
                    borderColor={COLORS.ExtraDivinder}
                    borderColorValue={COLORS.ExtraDivinder}
                    borderColorDrop={COLORS.ExtraDivinder}
                  />
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                  <Text
                    style={{
                      marginHorizontal: 10,
                      marginBottom: 10,
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Satuan Kerja
                  </Text>
                  {filterUnker && filterUnker.key ? (
                    <Dropdown
                      data={satker()}
                      search={true}
                      placeHolder={"Pilih Satuan Kerja"}
                      backgroundColor={COLORS.white}
                      selected={filterSatker}
                      setSelected={(item) => setFilterSatker(item)}
                      borderWidth={1}
                      borderWidthValue={1}
                      borderwidthDrop={1}
                      borderColor={COLORS.ExtraDivinder}
                      borderColorValue={COLORS.ExtraDivinder}
                      borderColorDrop={COLORS.ExtraDivinder}
                      heightValue={300}
                    />
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        marginHorizontal: 10,
                        marginBottom: 10,
                        gap: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.infoDanger,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        *
                      </Text>
                      <Text
                        style={{
                          color: COLORS.lighter,
                          fontSize: fontSizeResponsive("H4", device),
                        }}
                      >
                        Daftar satuan kerja akan muncul setelah memilih unit
                        kerja
                      </Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => {
                    setFilterSatker([]);
                    setFilterUnker([]);
                  }}
                  style={{
                    backgroundColor: COLORS.infoDanger,
                    padding: 10,
                    borderRadius: 8,
                    marginHorizontal: 20,
                    marginTop: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H4", device),
                      color: COLORS.white,
                    }}
                  >
                    Reset
                  </Text>
                </TouchableOpacity>
              </View>
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    );
  }
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
  cardsmall: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    //shadow ios
    shadowOffset: { width: -2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    //shadow android
    elevation: 2,
    width: "49%",
  },
  cardList: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    //shadow ios
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    //shadow android
    elevation: 2,
  },
  circle: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  circleTablet: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
});
