import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CardListSurvey } from "../../components/CardListSurvey";
import {
  COLORS,
  FONTWEIGHT,
  PADDING,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getTokenValue } from "../../service/session";
import { postSurvey } from "../../service/api";
import { ModalSubmit } from "../../components/ModalSubmit";
import { setStatus } from "../../store/Survey";

export const SurveyLayanan = () => {
  const [dataPenggunaan, setDataPenggunaan] = useState({
    "Modul yang sudah digunakan": [],
    "Modul yang paling sering digunakan": [],
    "Modul yang paling disukai": [],
  });
  const [penilaian, setPenilaian] = useState({
    "Portal Collaboration Office dapat diakses dengan baik pada penjelajah (browser) saya":
      [],
    "Akses login Portal Collaboration Office memiliki tingkat keamanan yang baik":
      [],
    "Portal Collaboration Office dapat diakses setiap hari": [],
    "Portal Collaboration Office mudah digunakan": [],
    "Informasi pada Portal Collabaration Office tersaji sesuai dengan kebutuhan":
      [],
  });
  const [validation, setValidation] = useState([]);
  const [token, setToken] = useState();

  const pilihanJawaban = [
    {
      value: 1,
      label: "Sangat tidak setuju",
    },
    {
      value: 2,
      label: "Tidak setuju",
    },
    {
      value: 3,
      label: "Biasa saja/netral",
    },
    {
      value: 4,
      label: "Setuju",
    },
    {
      value: 5,
      label: "Sangat setuju",
    },
  ];

  const pilihanApps = [
    "Korespondensi",
    "E-mail",
    "Kebijakan",
    "KKP Drive",
    "Pengetahuan",
    "Digital Sign",
    "Layanan Mandiri -> Cuti",
    "Layanan Mandiri -> SPPD",
    "Kalender",
    "Agenda Rapat/Event",
    "Task Management",
    "Repositori",
    "Real Time Collaboration -> Chat",
    "Real Time Collaboration -> Video Conference",
    "Help Desk",
  ];

  const keysPenilaian = Object.keys(penilaian).map((item) => item);
  const keysData = Object.keys(dataPenggunaan).map((item) => item);
  const dispatch = useDispatch();

  const onChangeDataHandler = (key, value) => {
    const realKey = key.split(". ")[1].replace(":", "");
    const dataPrev = { ...dataPenggunaan };
    const arrayData = dataPrev[realKey];
    const index = arrayData.indexOf(value);

    if (index > -1) {
      arrayData.splice(index, 1);
    } else {
      arrayData.push(value);
    }

    setDataPenggunaan({
      ...dataPenggunaan,
      [realKey]: arrayData,
    });
  };

  const onChangePenilaianHandler = (key, value) => {
    const realKey = key.split(". ")[1].replace(":", "");
    const actualValue = parseInt(value);
    setPenilaian({
      ...penilaian,
      [realKey]: [actualValue],
    });
  };

  const [menuKonfirmasi, setMenuKonfirmasi] = useState({
    toggle: false,
    id: "",
  });

  const handleCloseMenu = (status = 0) => {
    if (status === 1) {
      if (menuKonfirmasi.id === "submit") {
        const { status, dataValidation } = handleValidation();
        if (status) {
          setValidation(dataValidation);
          dispatch({
            type: FETCH_ERROR,
            payload: "Mohon masukan survey dengan benar",
          });
        } else {
          const payload = {
            response: {
              ...dataPenggunaan,
              ...penilaian,
            },
          };
          dispatch(onAddSurvey(payload));
          resetState();
        }
      } else {
        dispatch({
          type: SHOW_MESSAGE,
          payload: "Data berhasil di reset",
        });
        resetState();
      }
    }
    setMenuKonfirmasi({
      toggle: false,
      id: "",
    });
  };

  const resetState = () => {
    setDataPenggunaan({
      "Modul yang sudah digunakan": [],
      "Modul yang paling sering digunakan": [],
      "Modul yang paling disukai": [],
    });
    setPenilaian({
      "Portal Collaboration Office dapat diakses dengan baik pada penjelajah (browser) saya":
        [],
      "Akses login Portal Collaboration Office memiliki tingkat keamanan yang baik":
        [],
      "Portal Collaboration Office dapat diakses setiap hari": [],
      "Portal Collaboration Office mudah digunakan": [],
      "Informasi pada Portal Collabaration Office tersaji sesuai dengan kebutuhan":
        [],
    });

    setValidation([]);
  };

  useEffect(() => {
    return () => {
      resetState();
    };
  }, []);

  const handleValidation = () => {
    let validation = [];
    Object.keys(dataPenggunaan).map((item, index) => {
      let value = Object.values(dataPenggunaan)[index];
      if (value.length === 0) {
        validation.push(item);
      }
    });
    Object.keys(penilaian).map((item, index) => {
      let value = Object.values(penilaian)[index];
      if (value.length === 0) {
        validation.push(item);
      }
    });
    return {
      status: validation.length === 0 ? false : true,
      dataValidation: validation,
    };
  };

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  const handleSubmit = () => {
    const payload = {
      response: {
        ...dataPenggunaan,
        ...penilaian,
      },
    };
    const data = {
      token: token,
      payload: payload,
    };
    dispatch(postSurvey(data));
  };

  const navigation = useNavigation();
  const { device } = useSelector((state) => state.apps);
  const { status } = useSelector((state) => state.survey);
  const { profile } = useSelector((state) => state.superApps);

  return (
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-outline"
              size={device === "tablet" ? 40 : 24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H1", device),
              fontWeight: FONTWEIGHT.bold,
              color: COLORS.white,
              marginRight: 50,
            }}
          >
            Survei Layanan
          </Text>
        </View>
      </View>

      <View
        style={{
          borderWidth: 2,
          margin: 20,
          borderRadius: 10,
          borderColor: COLORS.ExtraDivinder,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.primary,
            padding: PADDING.Page,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: fontSizeResponsive("Judul", device),
            }}
          >
            Data Pengguna
          </Text>
        </View>

        <FlatList
          data={keysData}
          renderItem={({ item, index }) => (
            <CardListSurvey
              pertanyaan={`${index + 1}. ${item}`}
              pilihan={pilihanApps}
              data={dataPenggunaan}
              tipe={"multi-choices"}
              validation={validation}
              onClick={(key, value) => onChangeDataHandler(key, value)}
              device={device}
              index={index}
            />
          )}
          keyExtractor={(item) => item}
        />
      </View>

      <View
        style={{
          borderWidth: 2,
          margin: 20,
          borderRadius: 10,
          borderColor: COLORS.ExtraDivinder,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.primary,
            padding: PADDING.Page,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: fontSizeResponsive("Judul", device),
            }}
          >
            Penilaian Kualitas dan Layanan
          </Text>
        </View>

        <FlatList
          data={keysPenilaian}
          renderItem={({ item, index }) => (
            <CardListSurvey
              pertanyaan={`${index + 1}. ${item}`}
              pilihan={pilihanJawaban}
              data={penilaian}
              tipe={"one-choice"}
              validation={validation}
              onClick={(key, value) => onChangePenilaianHandler(key, value)}
              device={device}
              index={index}
            />
          )}
          keyExtractor={(item) => item}
        />
      </View>
      {profile?.roles_access.includes("USER_REPORT_SURVEY") ? (
        <TouchableOpacity
          style={{
            width: "90%",
            height: 50,
            marginBottom: 10,
            borderRadius: 6,
            alignItems: "center",
            marginHorizontal: 20,
            justifyContent: "center",
            borderWidth: 1,
            borderColor: COLORS.primary,
          }}
          onPress={() => {
            navigation.navigate("HasilSurvey");
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H1", device),
              fontWeight: 500,
              color: COLORS.primary,
            }}
          >
            Hasil survei
          </Text>
        </TouchableOpacity>
      ) : null}

      {/* <TouchableOpacity
        style={{
          width: "90%",
          backgroundColor: COLORS.danger,
          height: 50,
          marginBottom: 10,
          borderRadius: 6,
          alignItems: "center",
          marginHorizontal: 20,
          justifyContent: "center",
        }}
        onPress={() => {
          resetState();
        }}
      >
        <Text
          style={{
            color: COLORS.white,
            fontSize: fontSizeResponsive("H1", device),
            fontWeight: 500,
          }}
        >
          Reset
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          width: "90%",
          backgroundColor: COLORS.primary,
          height: 50,
          marginBottom: 40,
          borderRadius: 6,
          alignItems: "center",
          marginHorizontal: 20,
          justifyContent: "center",
        }}
        onPress={() => {
          handleSubmit();
        }}
      >
        <Text
          style={{
            color: COLORS.white,
            fontSize: fontSizeResponsive("H1", device),
            fontWeight: 500,
          }}
        >
          Submit
        </Text>
      </TouchableOpacity> */}
      <ModalSubmit
        status={status}
        setStatus={setStatus}
        navigate={"Main"}
        messageSuccess={"Data Ditambahkan"}
      />
    </ScrollView>
  );
};
