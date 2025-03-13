import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  COLORS,
  DATETIME,
  FONTWEIGHT,
  FONTSIZE,
  fontSizeResponsive,
  DateFormat,
} from "../../config/SuperAppps";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import { Dropdown } from "../../components/DropDown";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/min/moment-with-locales";
import RenderHTML from "react-native-render-html";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import {
  getDetailLinimasa,
  getDetailPenilaian,
  getViewLinimasa,
  postKomentarDetailPenilaian,
  putAddApprove,
  putCancelApprove,
  putTakeDown,
} from "../../service/api";
import { getTokenValue } from "../../service/session";
import { color } from "react-native-reanimated";
import { ResizeMode, Video } from "expo-av";
import { setComments, setResetDetailLinimasa } from "../../store/Pengetahuan";
import { CommentPenilaian } from "../../components/CommentPenilaian";
import { Loading } from "../../components/Loading";

const CardLampiran = ({ lampiran, onClick, type, id, device }) => {
  const navigation = useNavigation();
  return type === "png" || type === "jpg" || type === "jpeg" ? (
    <TouchableOpacity key={id} onPress={onClick}>
      <Image
        source={{ uri: lampiran }}
        style={{ width: 174, height: 97, borderRadius: 6, marginTop: 10 }}
      />
    </TouchableOpacity>
  ) : type === "mp4" ? (
    <TouchableOpacity
      key={id}
      onPress={onClick}
      style={{
        width: 174,
        height: 97,
        borderRadius: 6,
        marginTop: 10,
        backgroundColor: COLORS.secondaryLighter,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/superApp/mp4.png")}
        style={{ width: 70, height: 70 }}
      />
    </TouchableOpacity>
  ) : type === "doc" || type === "docx" ? (
    <TouchableOpacity
      key={id}
      onPress={() =>
        navigation.navigate("FileViewer", {
          lampiran: lampiran,
          type: type,
        })
      }
      style={{
        width: 174,
        height: 97,
        borderRadius: 6,
        marginTop: 10,
        backgroundColor: COLORS.secondaryLighter,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/superApp/word.png")}
        style={{ width: 70, height: 70 }}
      />
    </TouchableOpacity>
  ) : type === "xls" || type === "xlsx" ? (
    <TouchableOpacity
      key={id}
      onPress={() =>
        navigation.navigate("FileViewer", {
          lampiran: lampiran,
          type: type,
        })
      }
      style={{
        width: 174,
        height: 97,
        borderRadius: 6,
        marginTop: 10,
        backgroundColor: COLORS.secondaryLighter,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/superApp/excel.png")}
        style={{ width: 70, height: 70 }}
      />
    </TouchableOpacity>
  ) : type === "pdf" ? (
    <TouchableOpacity
      key={id}
      onPress={() =>
        navigation.navigate("FileViewer", {
          lampiran: lampiran,
          type: type,
        })
      }
      style={{
        width: 174,
        height: 97,
        borderRadius: 6,
        marginTop: 10,
        backgroundColor: COLORS.secondaryLighter,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/superApp/pdf.png")}
        style={{ width: 70, height: 70 }}
      />
    </TouchableOpacity>
  ) : type === "ppt" || type === "pptx" ? (
    <TouchableOpacity
      key={id}
      onPress={() =>
        navigation.navigate("FileViewer", {
          lampiran: lampiran,
          type: type,
        })
      }
      style={{
        width: 174,
        height: 97,
        borderRadius: 6,
        marginTop: 10,
        backgroundColor: COLORS.secondaryLighter,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/superApp/ppt.png")}
        style={{ width: 70, height: 70 }}
      />
    </TouchableOpacity>
  ) : null;
};

export const DetailPenilaian = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleModalVideo, setVisibleModalVideo] = useState(false);
  const [lampiranById, setLampiranById] = useState(null);
  const navigation = useNavigation();

  const getFileExtension = (lampiran) => {
    let jenis = lampiran.split(".");
    jenis = jenis[jenis.length - 1];
    return jenis;
  };

  const [Nilai, setNilai] = useState("");
  const [tanggal, setTanggal] = useState("");
  var year = new Date().getFullYear();

  const { penilaian, nilai, error, comments, loading } = useSelector(
    (state) => state.pengetahuan
  );
  const { profile } = useSelector((state) => state.superApps);
  const data = penilaian.detail !== null ? penilaian.detail : null;

  useEffect(() => {
    var date = new Date().getDate();
    var month = new Date().getMonth();
    var year = new Date().getFullYear();
    setTanggal(date + "-" + month + 1 + "-" + year);
    if (data !== null) {
      setNilai({
        key: data.category_id,
        value: `${data.score} (${data.category})`,
      });
    }
  }, []);

  const dataNilai = () => {
    const arry = [];
    nilai.map((item) => {
      arry.push({
        key: item.id,
        value: `${item.point_recomendation} (${item.name})`,
      });
    });
    return arry;
  };

  const periode = [
    { id: "q1", title: `JANUARI ${year} - MARET ${year}` },
    { id: "q2", title: `APRIL ${year} - JUNI ${year}` },
    { id: "q3", title: `JULI ${year} - SEPTEMBER ${year}` },
    { id: "q4", title: `OKTOBER ${year} - DESEMBER ${year}` },
  ];

  const getPeriode = (id) => {
    const data = periode.filter((list) => {
      return list.id === id;
    });
    return data[0]?.title;
  };

  const source = {
    html: data?.content,
  };
  const { width } = useWindowDimensions();

  const dispatch = useDispatch();

  const [token, setToken] = useState("");

  const { device } = useSelector((state) => state.apps);
  const video = useRef(null);
  const [status, setStatus] = useState({});
  const [komen, setKomen] = useState("");

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (comments === true) {
      dispatch(getDetailPenilaian({ token: token, id: data.id }));
      dispatch(setComments(false));
      setKomen("");
    }
  }, [comments]);

  console.log(comments);

  const flatListRef = useRef(null);

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="position"
      keyboardVerticalOffset={80}
      style={{ flex: 1 }}
    >
      {loading ? <Loading /> : null}
      <ScrollView>
        <View style={{ flex: 1 }}>
          <Image
            source={{ uri: data?.cover }}
            style={{ width: "100%", height: 260 }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              position: "absolute",
              width: "100%",
              marginTop: 20,
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.white,
                borderRadius: 20,
                width: 28,
                height: 28,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 20,
              }}
            >
              <TouchableOpacity style={{}} onPress={() => navigation.goBack()}>
                <Ionicons
                  name="chevron-back-outline"
                  size={24}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={{
            width: "100%",
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            marginTop: -40,
            paddingVertical: 20,
            paddingHorizontal: "5%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginTop: 20,
              justifyContent: "center",
            }}
          >
            <Image
              source={require("../../assets/superApp/logoKecil.png")}
              style={{ width: 37, height: 37 }}
            />
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H1", device),
              }}
            >
              Formulir Penilaian Pengetahuan
            </Text>
          </View>

          <View key={data?.id} style={{ marginTop: 10 }}>
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                Periode:{" "}
              </Text>
              <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                {getPeriode(data?.quarter)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: 5,
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                PJ:{" "}
              </Text>
              <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                {profile.nama}
              </Text>
            </View>

            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#DBDADE",
                marginVertical: 10,
              }}
            />

            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <Text
                style={{
                  width: device === "tablet" ? 200 : 130,
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Jenis
              </Text>
              <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                :{" "}
                {data?.category === null || data?.category === ""
                  ? "-"
                  : data?.category}
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <Text
                style={{
                  width: device === "tablet" ? 200 : 130,
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Terbuat
              </Text>
              <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                :{" "}
                {data?.published_date === null ||
                data?.published_date === "" ||
                data?.published_date === undefined
                  ? "-"
                  : DateFormat({
                      date: data?.published_date,
                      fromDate: DATETIME.LONG_DATETIME,
                      toDate: DATETIME.LONG_DATE,
                    })}
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <Text
                style={{
                  width: device === "tablet" ? 200 : 130,
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Judul [What]
              </Text>
              <Text
                style={{
                  width: "65%",
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                :{" "}
                {data?.title === null || data?.title === "" ? "-" : data?.title}
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <Text
                style={{
                  width: device === "tablet" ? 200 : 130,
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Tempat Agenda [Where]
              </Text>
              <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                :{" "}
                {data?.place_agenda === null || data?.place_agenda === ""
                  ? "-"
                  : data?.place_agenda}
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <Text
                style={{
                  width: device === "tablet" ? 200 : 130,
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Anggota Agenda [Who]
              </Text>
              <Text
                style={{
                  width: 200,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                :{" "}
                {data?.members_agenda === null || data?.members_agenda === ""
                  ? "-"
                  : data?.members_agenda}
              </Text>
            </View>

            <View style={{ marginTop: 5 }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    width: device === "tablet" ? 200 : 130,
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Rangkuman [Why]
                </Text>
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  :
                </Text>
              </View>
              <Text
                style={{
                  marginTop: 10,
                  marginHorizontal: 10,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {data?.summary === null || data?.summary === ""
                  ? "-"
                  : data?.summary}
              </Text>
            </View>

            <View style={{ marginTop: 5 }}>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    width: device === "tablet" ? 200 : 130,
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Deskripsi [How]
                </Text>
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  :
                </Text>
              </View>
              <View style={{ marginHorizontal: 10 }}>
                {data?.content === null || data?.content === "" ? (
                  <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                    {"-"}
                  </Text>
                ) : (
                  <RenderHTML
                    source={source}
                    contentWidth={width}
                    enableExperimentalMarginCollapsing={true}
                    defaultTextProps={{ allowFontScaling: false }}
                  />
                )}
                {/* <Text style={{ marginTop: 5, marginHorizontal: 10 }}>{data.deskripsi}</Text> */}
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  width: device === "tablet" ? 200 : 130,
                  fontWeight: "bold",
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Lampiran
              </Text>
            </View>
            {data?.attachments.length !== 0 ? (
              <FlatList
                key={"#"}
                data={data?.attachments}
                renderItem={({ item }) => (
                  <View key={item.id}>
                    <CardLampiran
                      lampiran={item.file}
                      id={item.id}
                      type={getFileExtension(item.name)}
                      onClick={() => {
                        setVisibleModalVideo(true);
                        setLampiranById(item);
                      }}
                      device={device}
                    />
                  </View>
                )}
                scrollEnabled={true}
                style={{ marginTop: 10, marginBottom: 20 }}
                // columnWrapperStyle={{ justifyContent: 'space-evenly', }}
                numColumns={2}
                keyExtractor={(item) => "#" + item.id}
              />
            ) : (
              <Text
                style={{
                  width: device === "tablet" ? 200 : 130,
                  marginHorizontal: 10,
                  fontWeight: FONTWEIGHT.bolder,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {"-"}
              </Text>
            )}
            {lampiranById !== null ? (
              <Modal
                animationType="fade"
                transparent={true}
                visible={visibleModalVideo}
                onRequestClose={() => {
                  setVisibleModalVideo(false);
                  setLampiranById(null);
                }}
              >
                <TouchableOpacity
                  style={[
                    Platform.OS === "ios"
                      ? styles.iOSBackdrop
                      : styles.androidBackdrop,
                    styles.backdrop,
                  ]}
                />
                <View
                  style={{
                    alignItems: "center",
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setVisibleModalVideo(false);
                      setLampiranById(null);
                    }}
                    style={{
                      position: "absolute",
                      top: "15%",
                      left: 20,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: COLORS.primary,
                        width: 51,
                        height: 51,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 50,
                      }}
                    >
                      <Ionicons
                        name="close-outline"
                        color={COLORS.white}
                        size={24}
                      />
                    </View>
                  </TouchableOpacity>
                  {getFileExtension(lampiranById.name) === "png" ||
                  getFileExtension(lampiranById.name) === "jpg" ||
                  getFileExtension(lampiranById.name) === "jpeg" ? (
                    <View>
                      <Image
                        source={{ uri: lampiranById.file }}
                        style={{ width: 390, height: 283 }}
                      />
                    </View>
                  ) : getFileExtension(lampiranById.name) === "mp4" ? (
                    <Video
                      ref={video}
                      style={{ width: 390, height: 283 }}
                      source={{ uri: lampiranById.file }}
                      useNativeControls
                      resizeMode={ResizeMode.CONTAIN}
                      isLooping
                      onPlaybackStatusUpdate={(status) =>
                        setStatus(() => status)
                      }
                    />
                  ) : (
                    <></>
                  )}
                </View>
              </Modal>
            ) : null}
          </View>
        </View>

        <View
          style={{
            backgroundColor: COLORS.white,
            paddingHorizontal: 20,
            borderRadius: 8,
            marginBottom: 20,
            marginTop: -30,
          }}
        >
          <View style={{ gap: 20, paddingVertical: 20 }}>
            <View
              style={{
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 40,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Nilai:
                </Text>
              </View>

              <View style={{ width: "65%" }}>
                <Dropdown
                  data={dataNilai()}
                  placeHolder={"Nilai"}
                  setSelected={setNilai}
                  selected={Nilai}
                  borderWidth={1}
                  borderColor={COLORS.ExtraDivinder}
                  borderWidthValue={1}
                  borderwidthDrop={1}
                  borderColorDrop={COLORS.ExtraDivinder}
                  borderColorValue={COLORS.ExtraDivinder}
                />
              </View>
            </View>

            <View
              style={{
                justifyContent: "flex-start",
                alignItems: "center",
                flexDirection: "row",
                marginVertical: 20,
              }}
            >
              <View style={{ width: 100 }}>
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Tanggal Nilai
                </Text>
              </View>
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                :
              </Text>
              <Text
                style={{
                  marginLeft: 20,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {tanggal}
              </Text>
            </View>

            <FlatList
              ref={flatListRef}
              data={data?.comments_penilai}
              renderItem={({ item }) => (
                <CommentPenilaian item={item} device={device} />
              )}
              style={{
                height: 250,
                borderWidth: 1,
                borderRadius: 8,
                borderColor: COLORS.ExtraDivinder,
              }}
              keyExtractor={(item) => (item.nip ? item.nip : item.code)}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              onContentSizeChange={scrollToBottom}
              // inverted
            />

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 15 }}
            >
              <Image
                source={{ uri: data?.logged_in_user_avatar }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                }}
              />

              <View
                style={{
                  borderWidth: 1,
                  width: "80%",
                  borderRadius: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  borderColor: COLORS.grey,
                }}
              >
                <TextInput
                  numberOfLines={1}
                  placeholder="Ketik Komentar Disini"
                  style={{
                    padding: 10,
                    width: "90%",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                  onChangeText={setKomen}
                  defaultValue={komen}
                  placeholderTextColor={COLORS.grey}
                  allowFontScaling={false}
                />
                <TouchableOpacity
                  onPress={() => {
                    const dataPayload = {
                      token: token,
                      payload: {
                        article_id: data.id,
                        parent_id: "",
                        message: komen,
                      },
                    };
                    if (komen !== "") {
                      dispatch(postKomentarDetailPenilaian(dataPayload));
                    }
                  }}
                >
                  <Ionicons name="send-outline" size={24} color={COLORS.grey} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {data?.log_approve?.length === 0 ||
        data?.log_approve[0]?.action !== "score" ||
        (data?.log_approve?.length == 0 && data?.score == 0) ? (
          <TouchableOpacity
            style={{
              width: "90%",
              paddingVertical: 20,
              backgroundColor: COLORS.info,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
              marginHorizontal: "5%",
              marginTop: 10,
            }}
            onPress={() => {
              dispatch(
                putAddApprove({
                  token: token,
                  id: data?.id,
                  body: { category_id: Nilai.key },
                })
              );
              navigation.navigate("PenilaianPenggetahaun");
            }}
          >
            <Text
              style={{
                color: COLORS.white,
              }}
            >
              Approve
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              width: "90%",
              paddingVertical: 20,

              backgroundColor: COLORS.danger,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
              marginHorizontal: "5%",
              marginTop: 10,
            }}
            onPress={() => {
              dispatch(
                putCancelApprove({
                  token: token,
                  id: data?.id,
                  body: { category_id: Nilai.key },
                })
              );
              navigation.navigate("PenilaianPenggetahaun");
            }}
          >
            <Text
              style={{
                color: COLORS.white,
                fontSize: fontSizeResponsive("H2", device),
              }}
            >
              Cancel Approve
            </Text>
          </TouchableOpacity>
        )}
        {/* <TouchableOpacity style={{
                    width: '90%',
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                    marginHorizontal: 20,
                    marginTop: 10,
                    borderColor: COLORS.infoDanger,
                    borderWidth: 1
                }}
                    onPress={() => {
                        dispatch(putTakeDown({ token: token, id: data?.id }))
                        if (error !== '' && error == false) navigation.navigate('PenilaianPenggetahaun')
                        else if (error !== '' && error) alert('gagal takedown')
                    }}
                >
                    <Text style={{ color: COLORS.infoDanger }}>Take Down Artikel</Text>
                </TouchableOpacity> */}

        <TouchableOpacity
          style={{
            width: "90%",
            paddingVertical: 20,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
            marginHorizontal: "5%",
            marginTop: 10,
            backgroundColor: COLORS.infoDanger,
            borderColor: COLORS.infoDanger,
            borderWidth: 1,
          }}
          onPress={() => setVisibleModal(true)}
        >
          <Text
            style={{
              color: COLORS.white,
              fontSize: fontSizeResponsive("H2", device),
            }}
          >
            Take Down Artikel
          </Text>
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={visibleModal}
          onRequestClose={() => {
            setVisibleModal(!visibleModal);
          }}
        >
          <TouchableOpacity
            style={[
              Platform.OS === "ios"
                ? styles.iOSBackdrop
                : styles.androidBackdrop,
              styles.backdrop,
            ]}
          />
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.white,
                width: "90%",
                borderRadius: 10,
                alignContent: "center",
              }}
            >
              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginHorizontal: 20,
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("Judul", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Apa anda yakin?
                  </Text>
                </View>

                <TouchableOpacity
                  style={{}}
                  onPress={() => {
                    setVisibleModal(false);
                  }}
                >
                  <Ionicons
                    name="close-outline"
                    size={24}
                    color={COLORS.lighter}
                  />
                </TouchableOpacity>
              </View>
              {/* custom divider */}
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    height: 1,
                    width: "90%",
                    backgroundColor: "#DBDADE",
                    marginVertical: 10,
                  }}
                />
              </View>

              <ScrollView style={{ marginBottom: 40 }}>
                <TouchableOpacity
                  style={{
                    width: "90%",
                    height: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 8,
                    marginHorizontal: 20,
                    marginTop: 10,
                    backgroundColor: COLORS.danger,
                  }}
                  onPress={() => {
                    dispatch(putTakeDown({ token: token, id: data?.id }));
                    if (error !== "" && error == false)
                      navigation.navigate("PenilaianPenggetahaun");
                    else if (error !== "" && error) alert("gagal takedown");
                  }}
                >
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Take Down Artikel
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={{
            width: "90%",
            paddingVertical: 20,

            borderColor: COLORS.info,
            borderWidth: 1,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
            marginHorizontal: "5%",
            marginVertical: 10,
          }}
          onPress={() => {
            // console.log("data", data.id);
            // getDetail(data?.id);
            dispatch(setResetDetailLinimasa());
            navigation.navigate("DetailLinimasa", {
              // like_list: item.like_list,
              id: data.id,
            });
          }}
        >
          <Text
            style={{
              color: COLORS.info,
              fontSize: fontSizeResponsive("H2", device),
            }}
          >
            Lihat Pengetahuan
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  backIcon: {
    backgroundColor: "white",
    height: 28,
    width: 28,
    borderRadius: 50,
  },
  imageIos: {
    width: "100%",
    height: 260,
    resizeMode: "cover",
  },
  imageAndroid: {
    width: "100%",
    height: 260,
    resizeMode: "cover",
  },
  iOSBackdrop: {
    backgroundColor: "#000000",
    opacity: 0.7,
  },
  androidBackdrop: {
    backgroundColor: "#232f34",
    opacity: 0.7,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
