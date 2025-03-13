import React, { useEffect, useState } from "react";
import { Platform, Text, View, useWindowDimensions } from "react-native";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {} from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import { ScrollView } from "react-native";
import { useRef } from "react";
import { KeyboardAvoidingView } from "react-native";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { useDispatch, useSelector } from "react-redux";
import {
  getDetailNotulensi,
  getlistApprover,
  getlistNotulensi,
} from "../../service/api";
import { getTokenValue } from "../../service/session";
import moment from "moment/min/moment-with-locales";
import RenderHTML from "react-native-render-html";
import { FlatList } from "react-native";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { ResizeMode, Video } from "expo-av";

const CardLampiran = ({ lampiran, onClick, type, id }) => {
  const navigation = useNavigation();
  return type === "png" || type === "jpg" || type === "jpeg" ? (
    <TouchableOpacity key={id} onPress={onClick}>
      <Image
        source={lampiran}
        style={{ width: 97, height: 97, borderRadius: 6, marginTop: 10 }}
      />
    </TouchableOpacity>
  ) : type === "mp4" ? (
    <TouchableOpacity
      key={id}
      onPress={onClick}
      style={{
        width: 97,
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
        width: 97,
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
        width: 97,
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
        width: 97,
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
        width: 97,
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

export const Notulensi = () => {
  const [user, setUser] = useState("member");
  const richText = useRef(null);
  const [richTextHandle, setRichTextHandle] = useState("");

  const { agenda, notulensi, loading } = useSelector((state) => state.event);
  const data = agenda.detail;
  const idagenda = agenda.detail?.id;
  const idnotu = notulensi.lists[0]?.id;
  const notu = notulensi.lists;

  const [token, setToken] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getlistNotulensi({ token, idagenda }));
      dispatch(getDetailNotulensi({ token, idnotu }));
    }
  }, [token]);

  const { width } = useWindowDimensions();

  const source = {
    html: notu[0]?.content,
  };

  const [visibleModal, setVisibleModal] = useState(false);
  const [lampiranById, setLampiranById] = useState(null);

  const getFileExtension = (type) => {
    let jenis = type.split(".");
    jenis = jenis[jenis.length - 1];
    return jenis;
  };

  const video = useRef(null);

  const navigation = useNavigation();
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);

  const { device } = useSelector((state) => state.apps);

  return (
    <>
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
              width: 28,
              height: 28,
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 20,
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                name="chevron-back-outline"
                size={24}
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
              Notulensi
            </Text>
          </View>
        </View>

        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          <View
            style={{
              width: "90%",
              backgroundColor: COLORS.white,
              padding: 16,
              borderRadius: 16,
            }}
          >
            {loading ? (
              <ShimmerPlaceHolder
                style={{ borderRadius: 4 }}
                width={200}
                height={20}
              />
            ) : (
              <View>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("Judul", device),
                    fontWeight: FONTWEIGHT.bold,
                  }}
                >
                  {data.title}
                </Text>
              </View>
            )}

            {loading ? (
              <ShimmerPlaceHolder
                style={{ borderRadius: 4, marginVertical: 10 }}
                width={100}
                height={20}
              />
            ) : data.note === "" ? (
              <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                -
              </Text>
            ) : (
              <Text
                style={{
                  marginVertical: 10,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {data.note}
              </Text>
            )}

            {/* <View style={{
                            flexDirection: 'row',
                            gap: 10,
                            alignItems: 'center',
                            marginTop: 10
                        }}>
                            <Image source={data.avatar} style={{ width: 26, height: 26, borderRadius: 50 }} />
                            <Text style={{ fontSize: 13, color: COLORS.info }}>{data.pic}</Text>
                            {/* custom divider */}
            {/* <View style={{ height: '100%', width: 1, backgroundColor: '#DBDADE', marginVertical: 10 }} />
                            <Text style={{ fontSize: 13 }}>{data.unit}</Text>
                        </View>  */}

            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <Text
                style={{
                  width: device === "tablet" ? 240 : 120,
                  color: COLORS.lighter,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Tanggal Acara
              </Text>
              <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                :
              </Text>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : (
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  {data.date}
                </Text>
              )}
            </View>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <Text
                style={{
                  width: device === "tablet" ? 240 : 120,
                  color: COLORS.lighter,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Waktu Acara
              </Text>
              <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                :
              </Text>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : (
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                    {moment(data.start_time, "HH:mm:ss")
                      .locale("id")
                      .format("HH:mm")}{" "}
                    -{" "}
                  </Text>
                  <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                    {moment(data.end_time, "HH:mm:ss")
                      .locale("id")
                      .format("HH:mm")}
                  </Text>
                </View>
              )}
            </View>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <Text
                style={{
                  width: device === "tablet" ? 240 : 120,
                  color: COLORS.lighter,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Tempat Acara
              </Text>
              <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                :
              </Text>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : (
                <Text
                  style={{
                    width: 186,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {data.location}
                </Text>
              )}
            </View>

            {/* <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                            <Text style={{ width: 150, fontWeight: FONTWEIGHT.bold }}>Peserta</Text>
                            {data.pesertaevent?.map((data, index) =>
                                <View key={data.id} style={{ position: 'relative' }}>
                                    <Image source={data.image} style={{ width: 26, height: 26, marginLeft: index !== 0 ? -7 : 0 }} />
                                </View>
                            )}
                            <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
                                <Ionicons name='chevron-forward-outline' size={24} color={COLORS.lighter} />
                            </TouchableOpacity>
                        </View> */}

            {/* <View style={{ marginTop: 10 }}>
                            <Text>{data.deskripsi}</Text>
                        </View> */}

            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                marginTop: 20,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Notulensi
            </Text>
            {loading ? (
              <ShimmerPlaceHolder
                style={{ borderRadius: 4, marginTop: 20 }}
                width={100}
                height={100}
              />
            ) : notu?.lists?.length === 0 ? (
              <Text>-</Text>
            ) : (
              <FlatList
                key={"*"}
                data={notu}
                renderItem={({ item }) => (
                  <View key={item.id}>
                    <CardLampiran
                      lampiran={item.pdf}
                      type={getFileExtension(item.pdf)}
                      onClick={() => {
                        setVisibleModal(true);
                        setLampiranById(item);
                      }}
                      id={item.id}
                    />
                  </View>
                )}
                scrollEnabled={false}
                style={{ marginTop: 10 }}
                columnWrapperStyle={{
                  justifyContent: "space-between",
                  marginHorizontal: 15,
                  gap: 5,
                }}
                numColumns={3}
                keyExtractor={(item) => "*" + item.id}
              />
            )}

            {lampiranById !== null ? (
              <Modal
                animationType="fade"
                transparent={true}
                visible={visibleModal}
                onRequestClose={() => {
                  setVisibleModal(false);
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
                      setVisibleModal(false);
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
                  {getFileExtension(lampiranById.nama) === "png" ||
                  getFileExtension(lampiranById.nama) === "jpg" ||
                  getFileExtension(lampiranById.nama) === "jpeg" ? (
                    <View>
                      <Image
                        source={lampiranById.gambar}
                        style={{ width: 390, height: 283 }}
                      />
                    </View>
                  ) : getFileExtension(lampiranById.nama) === "mp4" ? (
                    <Video
                      ref={video}
                      style={{ width: 390, height: 283 }}
                      source={lampiranById.gambar}
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

        {/* <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                    <View style={{ width: '90%', backgroundColor: COLORS.white, padding: 16, borderRadius: 16 }}>
                        <Text style={{ fontWeight: FONTWEIGHT.bold }}>Notulensi</Text>
                        {user === 'member' ? (
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                <Text>{notu[0].content}</Text>
                                <RenderHTML
                                    source={source}
                                    contentWidth={width}
                                />
                            </View>
                        ) : user === 'notulensi' || user === 'admin' ? (
                            <KeyboardAvoidingView style={{
                                flex: 1,
                                marginTop: 20,
                                borderWidth: 1,
                                borderRadius: 8,
                                borderColor: COLORS.ExtraDivinder
                            }}>
                                <RichToolbar
                                    editor={richText}
                                    selectedIconTint="#873c1e"
                                    iconTint="#312921"
                                />
                                <RichEditor
                                    ref={richText}
                                    onChange={setRichTextHandle}
                                    placeholder="Tulis Pesan..."
                                    androidHardwareAccelerationDisabled={true}
                                    initialHeight={250}
                                />
                            </KeyboardAvoidingView>
                        ) : (
                            <></>
                        )}
                    </View>
                </View> */}

        {/* <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5, marginTop: 20 }}>
                    <TouchableOpacity style={{
                        width: 171,
                        height: 50,
                        borderRadius: 8,
                        backgroundColor: COLORS.infoDanger,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: COLORS.white }}>Tolak Notulensi</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        width: 171,
                        height: 50,
                        borderRadius: 8,
                        backgroundColor: COLORS.primary,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{ color: COLORS.white }}>Approve Notulensi</Text>
                    </TouchableOpacity>
                </View> */}
      </ScrollView>
    </>
  );
};
