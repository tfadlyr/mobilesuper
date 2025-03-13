import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  COLORS,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getTokenValue } from "../../service/session";
import {
  getDataIPASN,
  getFilterUnitKerja,
  getNominatif,
} from "../../service/api";
import { CardListDataIPASN } from "../../components/CardListDataIPASN";
import ListEmpty from "../../components/ListEmpty";
import { Loading } from "../../components/Loading";
import { Dropdown } from "../../components/DropDown";
import { CardListNominatif } from "../../components/CardListNominatif";

export const Nominatif = () => {
  const { device } = useSelector((state) => state.apps);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [token, setToken] = useState("");
  const [page, setPage] = useState(1);
  const [filterUnitKerja, setFilterUnitKerja] = useState("");
  const [firstGolongan, setFirstGolongan] = useState("");
  const [secondGolongan, setSecondGolongan] = useState("");
  const [firstEselon, setFirstEselon] = useState("");
  const [secondEselon, setSecondEselon] = useState("");
  const [statusPegawai, setStatusPegawai] = useState("");
  const [toggleFilter, setTonggleFilter] = useState(false);
  const [tahunTMT, setTahunTMT] = useState({
    key: "",
    value: "",
  });

  console.log(firstGolongan);
  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token) {
      dispatch(
        getFilterUnitKerja({
          token,
        })
      );
    }
  }, [token]);

  const { unitKerja, loading, nominatif } = useSelector(
    (state) => state.kepegawaian
  );

  const loadMore = () => {
    if (nominatif.lists.length % 10 === 0) {
      //   if (DataIPASN.lists.length > page) {
      setPage(page + 1);
      //   }
    }
  };

  const pickUnitKerja = () => {
    let nama = [];
    unitKerja.map((item) => {
      nama.push({
        key: item.id,
        value: item.name,
      });
    });
    return nama;
  };

  const pickYears = () => {
    let years = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 30; i++) {
      const year = currentYear - i;
      years.push({
        key: year,
        value: year.toString(),
      });
    }
    return years;
  };

  const golongan = [
    { key: "I/a", value: "I/A", number: 1 },
    { key: "II/a", value: "II/A", number: 2 },
    { key: "III/a", value: "III/A", number: 3 },
    { key: "IV/a", value: "IV/A", number: 4 },
    { key: "V/a", value: "V/A", number: 5 },
    { key: "I/b", value: "I/B", number: 6 },
    { key: "II/b", value: "II/B", number: 7 },
    { key: "III/", value: "III/B", number: 8 },
    { key: "IV/b", value: "IV/B", number: 9 },
    { key: "V/b", value: "V/B", number: 10 },
    { key: "I/c", value: "I/C", number: 11 },
    { key: "II/c", value: "II/C", number: 12 },
    { key: "III/c", value: "III/C", number: 13 },
    { key: "IV/c", value: "IV/C", number: 14 },
    { key: "V/c", value: "V/C", number: 15 },
    { key: "I/d", value: "I/D", number: 16 },
    { key: "II/d", value: "II/D", number: 17 },
    { key: "III/d", value: "III/D", number: 18 },
    { key: "IV/d", value: "IV/D", number: 19 },
    { key: "V/d", value: "V/D", number: 20 },
  ];

  const eselon = [
    { key: "I.a", value: "Eselon I.a" },
    { key: "I.b", value: "Eselon I.b" },
    { key: "II.a", value: "Eselon II.a" },
    { key: "II.b", value: "Eselon II.b" },
    { key: "III.a", value: "Eselon III.a" },
    { key: "III.b", value: "Eselon III.b" },
    { key: "IV.a", value: "Eselon IV.a" },
    { key: "IV.b", value: "Eselon IV.b" },
    { key: "V", value: "Eselon V" },
  ];

  const status = [
    { key: "PNS", value: "PNS" },
    { key: "PJLP", value: "PJLP" },
    { key: "PPPK", value: "PPPK" },
    { key: "Kontrak", value: "Kontrak" },
  ];

  const pickSecondGologan = () => {
    if (firstGolongan === "") {
      return [];
    } else {
      const listGolEnd = golongan.filter(
        (gol) => gol.number >= firstGolongan.number
      );
      return listGolEnd;
    }
  };
  // console.log(page);

  return (
    <ScrollView>
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
          <TouchableOpacity onPress={() => navigation.navigate("Main")}>
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
              color: "white",
              fontSize: fontSizeResponsive("H1", device),
              fontWeight: FONTWEIGHT.bold,
            }}
          >
            Nominatif Pegawai
          </Text>
        </View>
      </View>

      <View
        style={{
          marginVertical: 20,
          marginHorizontal: 20,
          padding: 10,
          backgroundColor: COLORS.white,
          borderRadius: 8,
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              fontWeight: FONTWEIGHT.bold,
              fontSize: fontSizeResponsive("Judul", device),
              marginBottom: 10,
            }}
          >
            Filter Nominatif
          </Text>
        </View>

        <View>
          <Text
            style={{
              marginBottom: 10,
              fontWeight: FONTWEIGHT.bold,
              color: COLORS.grey,
            }}
          >
            Unit Kerja
          </Text>
          <Dropdown
            data={pickUnitKerja()}
            setSelected={setFilterUnitKerja}
            selected={filterUnitKerja}
            borderWidth={1}
            borderwidthDrop={1}
            borderWidthValue={1}
            borderColor={COLORS.ExtraDivinder}
            borderColorDrop={COLORS.ExtraDivinder}
            borderColorValue={COLORS.ExtraDivinder}
            search={true}
          />
        </View>

        {toggleFilter === true ? (
          <>
            <View>
              <Text
                style={{
                  marginVertical: 10,
                  fontWeight: FONTWEIGHT.bold,
                  color: COLORS.grey,
                }}
              >
                Golongan
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ width: device === "tablet" ? "48.5%" : "45%" }}>
                  <Dropdown
                    data={golongan}
                    setSelected={setFirstGolongan}
                    selected={firstGolongan}
                    borderWidth={1}
                    borderwidthDrop={1}
                    borderWidthValue={1}
                    borderColor={COLORS.ExtraDivinder}
                    borderColorDrop={COLORS.ExtraDivinder}
                    borderColorValue={COLORS.ExtraDivinder}
                    search={true}
                  />
                </View>
                <Text>s/d</Text>
                <View style={{ width: device === "tablet" ? "48.5%" : "45%" }}>
                  <Dropdown
                    data={pickSecondGologan()}
                    setSelected={setSecondGolongan}
                    selected={secondGolongan}
                    borderWidth={1}
                    borderwidthDrop={1}
                    borderWidthValue={1}
                    borderColor={COLORS.ExtraDivinder}
                    borderColorDrop={COLORS.ExtraDivinder}
                    borderColorValue={COLORS.ExtraDivinder}
                    search={true}
                  />
                </View>
              </View>
            </View>
            <View>
              <Text
                style={{
                  marginVertical: 10,
                  fontWeight: FONTWEIGHT.bold,
                  color: COLORS.grey,
                }}
              >
                Eselon
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ width: device === "tablet" ? "48.5%" : "45%" }}>
                  <Dropdown
                    data={eselon}
                    setSelected={setFirstEselon}
                    selected={firstEselon}
                    borderWidth={1}
                    borderwidthDrop={1}
                    borderWidthValue={1}
                    borderColor={COLORS.ExtraDivinder}
                    borderColorDrop={COLORS.ExtraDivinder}
                    borderColorValue={COLORS.ExtraDivinder}
                    search={true}
                  />
                </View>
                <Text>s/d</Text>
                <View style={{ width: device === "tablet" ? "48.5%" : "45%" }}>
                  <Dropdown
                    data={eselon}
                    setSelected={setSecondEselon}
                    selected={secondEselon}
                    borderWidth={1}
                    borderwidthDrop={1}
                    borderWidthValue={1}
                    borderColor={COLORS.ExtraDivinder}
                    borderColorDrop={COLORS.ExtraDivinder}
                    borderColorValue={COLORS.ExtraDivinder}
                    search={true}
                  />
                </View>
              </View>
            </View>

            <View>
              <Text
                style={{
                  marginVertical: 10,
                  fontWeight: FONTWEIGHT.bold,
                  color: COLORS.grey,
                }}
              >
                Status Kepegawaian
              </Text>
              <Dropdown
                data={status}
                setSelected={setStatusPegawai}
                selected={statusPegawai}
                borderWidth={1}
                borderwidthDrop={1}
                borderWidthValue={1}
                borderColor={COLORS.ExtraDivinder}
                borderColorDrop={COLORS.ExtraDivinder}
                borderColorValue={COLORS.ExtraDivinder}
                search={true}
              />
            </View>

            <View>
              <Text
                style={{
                  marginVertical: 10,
                  fontWeight: FONTWEIGHT.bold,
                  color: COLORS.grey,
                }}
              >
                Tahun TMT CPNS
              </Text>
              <Dropdown
                data={pickYears()}
                setSelected={setTahunTMT}
                selected={tahunTMT}
                borderWidth={1}
                borderwidthDrop={1}
                borderWidthValue={1}
                borderColor={COLORS.ExtraDivinder}
                borderColorDrop={COLORS.ExtraDivinder}
                borderColorValue={COLORS.ExtraDivinder}
                search={true}
              />
              <Text style={{ marginTop: 5, color: COLORS.grey }}>
                (dikosongkan bila tidak digunakan)
              </Text>
            </View>
          </>
        ) : null}

        {toggleFilter === false ? (
          <TouchableOpacity
            style={{
              marginTop: 10,
              marginBottom: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
            onPress={() => {
              setTonggleFilter(true);
            }}
          >
            <Ionicons
              name="chevron-down-circle"
              size={24}
              color={COLORS.primary}
            />
            <Text
              style={{ color: COLORS.primary, fontWeight: FONTWEIGHT.bold }}
            >
              Pencarian Lanjutan
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              marginTop: 10,
              marginBottom: 10,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
            onPress={() => {
              setTonggleFilter(false);
            }}
          >
            <Ionicons
              name="chevron-up-circle"
              size={24}
              color={COLORS.primary}
            />
            <Text
              style={{ color: COLORS.primary, fontWeight: FONTWEIGHT.bold }}
            >
              Sembunyikan
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={{
            marginVertical: 10,
            backgroundColor: COLORS.primary,
            padding: 10,
            width: "20%",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
          }}
          onPress={() => {
            navigation.navigate("NominatifList", {
              token,
              filterUnitKerja,
              firstGolongan,
              secondGolongan,
              firstEselon,
              secondEselon,
              statusPegawai,
              tahunTMT,
              page,
            });
          }}
        >
          <Text style={{ color: COLORS.white }}>Lihat</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
