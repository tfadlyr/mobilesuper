import { Fragment, useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Alert,
  TouchableOpacity,
} from "react-native";
import RenderHTML from "react-native-render-html";
import { Button, IconButton } from "react-native-paper";
import { GlobalStyles } from "../../../../constants/styles";
import { useDispatch } from "react-redux";
import { setDataNotif } from "../../../../store/pushnotif";
import * as Clipboard from "expo-clipboard";
import { setClipboard, setFAB } from "../../../../store/snackbar";

import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

import { LinearGradient } from "expo-linear-gradient";
import { COLORS, DATETIME } from "../../../../config/SuperAppps";
import { Image } from "react-native";
import { setPrevAgenda } from "../../../../store/referensi";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { getExtensionIcon, initDownload } from "../../../../utils/agenda";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

//untuk detail agenda yang isi suratnya langsung terbaca tanpa view document
function DetailAgenda({ id, data, style, tipe, title }) {
  const { width } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      if (tipe == "in/internal" || tipe == "ReferenceDetail") {
        dispatch(setFAB(false));
      } else {
        dispatch(setFAB(true));
      }
    }, [])
  );

  useEffect(() => {
    dispatch(setDataNotif({}));
    if (tipe == "in/internal" || tipe == "ReferenceDetail") {
      dispatch(setFAB(false));
    } else {
      dispatch(setFAB(true));
    }
  }, []);

  const copyToClipboard = async (text) => {
    Clipboard.setStringAsync(text);
    dispatch(setClipboard(true));
    setTimeout(() => {
      dispatch(setClipboard(false));
    }, 1500);
  };
  return (
    <ScrollView
      overScrollMode="never"
      keyboardShouldPersistTaps="handled"
      style={[style]}
    >
      <View style={{ padding: 20, gap: 10 }}>
        {title != "Lembar Disposisi" &&
          title != "Teruskan" &&
          title != "Detail Disposisi" && (
            <>
              <Text style={{ fontSize: 15, fontWeight: 600 }}>
                Informasi Surat
              </Text>
              {data?.attachments?.length == 1 && (
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: COLORS.white,
                      borderRadius: 16,
                      padding: 20,
                      width: 90,
                      elevation: 1,
                    }}
                  >
                    <Image
                      source={require("../../../../assets/superApp/pdf.png")}
                      style={{ width: 50, height: 50 }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "center",
                      marginBottom: 20,
                    }}
                  >
                    <Text style={[styles.textContent, { textAlign: "center" }]}>
                      {data?.attachments[0]?.name}
                    </Text>
                    <Text style={styles.subtextContent}>
                      {data?.attachments[0]?.size}
                    </Text>
                  </View>
                  <View style={{ width: "100%" }}>
                    <Button
                      mode="contained"
                      style={[
                        {
                          width: "100%",
                          backgroundColor: GlobalStyles.colors.primary,
                          marginBottom: 16,
                        },
                      ]}
                      onPress={() => {
                        navigation.navigate("ViewAttachment", {
                          selected: data?.attachments[0],
                          title: "Lihat Surat",
                          tipe: tipe,
                          id: data?.id,
                          token: data?.w_token,
                        });
                        dispatch(setFAB(false));
                      }}
                      icon={() => (
                        <Ionicons
                          name="eye-outline"
                          size={20}
                          color={COLORS.white}
                        />
                      )}
                    >
                      Lihat Surat
                    </Button>
                  </View>
                </View>
              )}
              {data?.attachments?.length > 1 &&
                data?.attachments?.map((item, index) => (
                  <Fragment key={index}>
                    {item?.description == "editor-generated" && (
                      <View
                        style={{
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: COLORS.white,
                            borderRadius: 16,
                            padding: 20,
                            width: 90,
                            elevation: 1,
                          }}
                        >
                          <Image
                            source={require("../../../../assets/superApp/pdf.png")}
                            style={{ width: 50, height: 50 }}
                          />
                        </View>
                        <View
                          style={{
                            flexDirection: "column",
                            alignItems: "center",
                            marginBottom: 20,
                          }}
                        >
                          <Text
                            style={[
                              styles.textContent,
                              { textAlign: "center" },
                            ]}
                          >
                            {item?.name}
                          </Text>
                          <Text style={styles.subtextContent}>
                            {item?.size}
                          </Text>
                        </View>
                        <View style={{ width: "100%" }}>
                          <Button
                            mode="contained"
                            style={[
                              {
                                width: "100%",
                                backgroundColor: GlobalStyles.colors.primary,
                                marginBottom: 16,
                              },
                            ]}
                            onPress={() => {
                              navigation.navigate("ViewAttachment", {
                                selected: item,
                                title: "Lihat Surat",
                                tipe: tipe,
                                id: data?.id,
                                token: data?.w_token,
                              });
                              dispatch(setFAB(false));
                            }}
                            icon={() => (
                              <Ionicons
                                name="eye-outline"
                                size={20}
                                color={COLORS.white}
                              />
                            )}
                          >
                            Lihat Surat
                          </Button>
                          {/* <Button
                      onPress={() => initDownload(item)}
                      mode="contained"
                      style={[
                        {
                          width: "100%",
                          backgroundColor: GlobalStyles.colors.blue,
                          marginBottom: 16,
                        },
                      ]}
                      icon={() => (
                        <Ionicons
                          name="download-outline"
                          size={20}
                          color={COLORS.white}
                        />
                      )}
                    >
                      Unduh Surat
                    </Button> */}
                        </View>
                      </View>
                    )}
                  </Fragment>
                ))}
            </>
          )}
        <Text style={{ fontSize: 15, fontWeight: 600 }}>Perihal</Text>

        <View
          style={{
            backgroundColor: COLORS.white,
            padding: 20,
            borderRadius: 16,
          }}
        >
          <Text>{data?.subject}</Text>
        </View>
        <View
          style={{
            backgroundColor: COLORS.white,
            padding: 20,
            borderRadius: 16,
          }}
        >
          {data?.agenda_number && (
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 2,
                borderBottomColor: "#DBDADE",
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  width: "40%",
                  paddingRight: 20,
                }}
              >
                No Agenda
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                {data?.agenda_number}
              </Text>
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 2,
              borderBottomColor: "#DBDADE",
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: 600,
                width: "40%",
                paddingRight: 20,
              }}
            >
              Tanggal Dikirim
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 400,
                width: "60%",
                paddingRight: 20,
              }}
            >
              {data?.letter_date}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 2,
              borderBottomColor: "#DBDADE",
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: 600,
                width: "40%",
                paddingRight: 20,
              }}
            >
              No Surat
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 400,
                width: "60%",
                paddingRight: 20,
              }}
            >
              {data?.ref_number}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 2,
              borderBottomColor: "#DBDADE",
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: 600,
                width: "40%",
                paddingRight: 20,
              }}
            >
              Kode Derajat
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 400,
                width: "60%",
                paddingRight: 20,
              }}
            >
              {data?.type ? data?.type : "-"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 2,
              borderBottomColor: "#DBDADE",
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: 600,
                width: "40%",
                paddingRight: 20,
              }}
            >
              Sifat
            </Text>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 400,
                width: "60%",
                paddingRight: 20,
              }}
            >
              {data?.priority ? data?.priority : data?.prio}
            </Text>
          </View>
          <View style={{ flexDirection: "row", paddingVertical: 10 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: 600,
                width: "40%",
                paddingRight: 20,
              }}
            >
              Referensi
            </Text>
            {data?.references?.length == 0 && (
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  width: "60%",
                  paddingRight: 20,
                }}
              >
                -
              </Text>
            )}
            <View>
              {data?.references?.length != 0 &&
                data?.references?.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      fontSize: 13,
                      fontWeight: 400,
                      width: "80%",
                      paddingRight: 20,
                    }}
                    onPress={() => {
                      if (item.new_url?.split("/")[3] == "0") {
                        Alert.alert("Peringatan!", "Dokumen tidak ditemukan");
                      } else {
                        if (tipe == "in") {
                          dispatch(setPrevAgenda({ id: data?.id, tipe: "m" }));
                        } else if (tipe == "disposition") {
                          dispatch(setPrevAgenda({ id: data?.id, tipe: "d" }));
                        } else if (tipe == "out") {
                          dispatch(setPrevAgenda({ id: data?.id, tipe: "k" }));
                        } else if (tipe == "scanlog") {
                          dispatch(setPrevAgenda({ id: data?.id, tipe: "m" }));
                        } else if (
                          tipe == "TrackingDetail" ||
                          tipe == "NeedFollowUpDetail" ||
                          tipe == "ReferenceDetail"
                        ) {
                          dispatch(
                            setPrevAgenda({ id: item?.notadinas, tipe: "s" })
                          );
                        }
                        dispatch(setFAB(false));
                        navigation.navigate("ReferenceDetail", {
                          id: item?.new_url?.split("/")[3],
                          title: "Detail\nReferensi",
                        });
                      }
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Text>
                        {data?.references.length > 1 ? index + 1 + ". " : ""}
                      </Text>
                      <Text style={[styles.textContent]}>{item.subject}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              {/* </Text> */}
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 15, fontWeight: 600 }}>Penanda Tangan</Text>
        </View>

        <View
          style={{
            backgroundColor: COLORS.white,
            padding: 20,
            borderRadius: 16,
          }}
        >
          <Text style={{ fontSize: 13 }}>
            {data && data?.senders[0].title
              ? data?.senders[0].title
              : data?.senders[0].name}
          </Text>
        </View>
        {data?.template?.name != "nota_external" && (
          <>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 15, fontWeight: 600 }}>Kepada</Text>
            </View>
            <View
              style={{
                backgroundColor: COLORS.white,
                padding: 20,
                borderRadius: 16,
              }}
            >
              {data && (
                <>
                  {data && data?.receivers?.length == 0 && <Text>-</Text>}
                  {data && data?.receivers?.length == 1 && (
                    <Text>{data?.receivers[0]}</Text>
                  )}
                  {data && data?.receivers?.length > 1 && (
                    <View>
                      {data?.receivers.map((item, index) => (
                        <Text key={index}>
                          {index + 1}. {item}
                        </Text>
                      ))}
                    </View>
                  )}
                </>
              )}
              {data?.receivers_display?.length != 0 && (
                <>
                  <View style={{ flexDirection: "row", paddingTop: 10 }}>
                    <Text style={{ fontSize: 15, fontWeight: 600 }}>
                      Tampilan Kepada
                    </Text>
                  </View>
                  {data && data?.receivers_display?.length == 1 && (
                    <View>
                      <RenderHTML
                        contentWidth={width}
                        source={{ html: data?.receivers_display[0] }}
                        defaultTextProps={{ allowFontScaling: false }}
                      />
                    </View>
                  )}

                  {data && data?.receivers_display?.length > 1 && (
                    <View>
                      <RenderHTML
                        contentWidth={width}
                        source={{ html: data?.receivers_display }}
                        defaultTextProps={{ allowFontScaling: false }}
                      />
                    </View>
                  )}
                </>
              )}
            </View>

            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 15, fontWeight: 600 }}>Tembusan</Text>
            </View>

            <View
              style={{
                backgroundColor: COLORS.white,
                padding: 20,
                borderRadius: 16,
              }}
            >
              {data && data.copytos_display?.length == 0 && (
                <>
                  {data && data.copytos?.length == 0 && (
                    <Text style={{ fontSize: 13 }}>-</Text>
                  )}
                  {data && data.copytos?.length == 1 && (
                    <Text style={{ fontSize: 13 }}>{data.copytos[0]}</Text>
                  )}
                  {data && data.copytos?.length > 1 && (
                    <View>
                      {data.copytos.map((item, index) => (
                        <Text key={index} style={{ fontSize: 13 }}>
                          {index + 1}. {item}
                        </Text>
                      ))}
                    </View>
                  )}
                </>
              )}
              {data && data.copytos_display?.length != 0 && (
                <>
                  {data && data.copytos_display?.length == 0 && (
                    <Text style={{ fontSize: 13 }}>-</Text>
                  )}
                  {data && data.copytos_display?.length == 1 && (
                    <RenderHTML
                      style={{ fontSize: 13 }}
                      contentWidth={width}
                      source={{ html: data?.copytos_display[0] }}
                      defaultTextProps={{ allowFontScaling: false }}
                    />
                  )}
                  {data && data.copytos_display?.length > 1 && (
                    <RenderHTML
                      style={{ fontSize: 13 }}
                      contentWidth={width}
                      source={{ html: data?.copytos_display.join("\n") }}
                      defaultTextProps={{ allowFontScaling: false }}
                    />
                  )}
                </>
              )}
            </View>
            {data?.jenis_surat == "Memorandum" && (
              <>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontSize: 15, fontWeight: 600 }}>
                    Internal Satker
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    padding: 20,
                    borderRadius: 16,
                  }}
                >
                  {data && data.internal_satker?.length == 0 && (
                    <Text style={{ fontSize: 13 }}>-</Text>
                  )}
                  {data && data.internal_satker?.length !== 0 && (
                    <Text style={{ fontSize: 13 }}>{data.internal_satker}</Text>
                  )}
                </View>
              </>
            )}
          </>
        )}
        {data?.template?.name == "nota_external" && (
          <>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 15, fontWeight: 600 }}>
                Kepada Internal
              </Text>
            </View>
            <View
              style={{
                backgroundColor: COLORS.white,
                padding: 20,
                borderRadius: 16,
              }}
            >
              {data &&
                data?.receivers_display?.length == 0 &&
                data?.kepada_bank?.length == 0 && (
                  <>
                    {(data && data?.receivers?.length == 0) ||
                      (data?.kepada_addressbook?.length == 0 && (
                        <Text style={{ fontSize: 13 }}>-</Text>
                      ))}
                    {data && data?.kepada_addressbook?.length == 1 && (
                      <Text style={{ fontSize: 13 }}>
                        {data?.kepada_addressbook[0]}
                      </Text>
                    )}
                    {data && data?.kepada_addressbook?.length > 1 && (
                      <>
                        {data?.kepada_addressbook?.map((item, index) => (
                          <Text key={index} style={{ fontSize: 13 }}>
                            {index + 1}. {item}
                          </Text>
                        ))}
                      </>
                    )}
                    {data && data?.receivers?.length == 1 && (
                      <>
                        {data?.template.name != "nota_external" && !loading ? (
                          <Text style={{ fontSize: 13 }}>
                            {data?.receivers[0]}
                          </Text>
                        ) : null}
                      </>
                    )}
                    {data && data?.receivers?.length > 1 && (
                      <>
                        {data?.template.name != "nota_external" && (
                          <View>
                            {data?.receivers.map((item, index) => (
                              <Text key={index} style={{ fontSize: 13 }}>
                                {index + 1}. {item}
                              </Text>
                            ))}
                          </View>
                        )}
                      </>
                    )}
                  </>
                )}
              {data &&
                data.receivers_display?.length != 0 &&
                data.kepada_bank?.length == 0 && (
                  <>
                    {data && data.receivers_display?.length == 1 && (
                      <RenderHTML
                        style={{ fontSize: 13 }}
                        contentWidth={width}
                        source={{ html: data?.receivers_display[0] }}
                        defaultTextProps={{ allowFontScaling: false }}
                      />
                    )}
                    {data &&
                      data.receivers_display?.length > 1 &&
                      data.template.name != "nota_external" &&
                      data.receivers_display.map((item, index) => (
                        <Text key={index} style={{ fontSize: 13 }}>
                          {index + 1}. {item}
                        </Text>
                      ))}
                    {data &&
                      data.receivers_display?.length > 1 &&
                      data.template.name == "nota_external" &&
                      data.receivers_display.map((item, index) => (
                        <Text key={index} style={{ fontSize: 13 }}>
                          {item}
                        </Text>
                      ))}
                  </>
                )}
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 15, fontWeight: 600 }}>
                Kepada Eksternal
              </Text>
            </View>
            <View
              style={{
                backgroundColor: COLORS.white,
                padding: 20,
                borderRadius: 16,
              }}
            >
              {data &&
                data?.receivers_display?.length == 0 &&
                data?.kepada_bank?.length == 0 && (
                  <>
                    {data && data?.receivers?.length == 0 && (
                      <Text style={{ fontSize: 13 }}>-</Text>
                    )}
                    {data && data?.receivers?.length == 1 && (
                      <>
                        {data?.template.name == "nota_external" && (
                          <RenderHTML
                            style={{ fontSize: 13 }}
                            contentWidth={width}
                            source={{ html: data?.receivers[0] }}
                            defaultTextProps={{ allowFontScaling: false }}
                          />
                        )}
                      </>
                    )}
                    {data && data?.receivers?.length > 1 && (
                      <>
                        {data?.template.name == "nota_external" && (
                          <>
                            {data?.receivers?.map((item, index) => (
                              <Text key={index} style={{ fontSize: 13 }}>
                                {index + 1}. {item}
                              </Text>
                            ))}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              {data &&
                data.receivers_display?.length != 0 &&
                data.kepada_bank?.length == 0 && (
                  <>
                    {data.receivers_display?.length == 0 && (
                      <Text style={{ fontSize: 13 }}>-</Text>
                    )}
                    {data && data.receivers_display?.length == 1 && (
                      <RenderHTML
                        style={{ fontSize: 13 }}
                        contentWidth={width}
                        source={{ html: data?.receivers_display[0] }}
                        defaultTextProps={{ allowFontScaling: false }}
                      />
                    )}
                    {data &&
                      data.receivers_display?.length > 1 &&
                      data.template.name != "nota_external" &&
                      data.receivers_display.map((item, index) => (
                        <Text key={index} style={{ fontSize: 13 }}>
                          {index + 1}. {item}
                        </Text>
                      ))}
                    {data &&
                      data.receivers_display?.length > 1 &&
                      data.template.name == "nota_external" &&
                      data.receivers_display.map((item, index) => (
                        <Text key={index} style={{ fontSize: 13 }}>
                          {item}
                        </Text>
                      ))}
                  </>
                )}
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 15, fontWeight: 600 }}>
                Tembusan Internal
              </Text>
            </View>
            <View
              style={{
                backgroundColor: COLORS.white,
                padding: 20,
                borderRadius: 16,
              }}
            >
              {data && data.copytos_display?.length == 0 && (
                <>
                  {data && data.copytos?.length == 0 && (
                    <Text style={{ fontSize: 13 }}>-</Text>
                  )}
                  {data && data.copytos?.length == 1 && (
                    <Text style={{ fontSize: 13 }}>{data.copytos[0]}</Text>
                  )}
                  {data && data.copytos?.length > 1 && (
                    <View>
                      {data.copytos.map((item, index) => (
                        <Text key={index} style={{ fontSize: 13 }}>
                          {index + 1}. {item}
                        </Text>
                      ))}
                    </View>
                  )}
                </>
              )}
              {data && data.copytos_display?.length != 0 && (
                <>
                  {data && data.copytos_display?.length == 0 && (
                    <Text style={{ fontSize: 13 }}>-</Text>
                  )}
                  {data && data.copytos_display?.length == 1 && (
                    <RenderHTML
                      style={{ fontSize: 13 }}
                      contentWidth={width}
                      source={{ html: data?.copytos_display[0] }}
                      defaultTextProps={{ allowFontScaling: false }}
                    />
                  )}
                  {data && data.copytos_display?.length > 1 && (
                    <RenderHTML
                      style={{ fontSize: 13 }}
                      contentWidth={width}
                      source={{ html: data?.copytos_display.join("\n") }}
                      defaultTextProps={{ allowFontScaling: false }}
                    />
                  )}
                </>
              )}
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 15, fontWeight: 600 }}>
                Tembusan Eksternal
              </Text>
            </View>
            <View
              style={{
                backgroundColor: COLORS.white,
                padding: 20,
                borderRadius: 16,
              }}
            >
              {data && data.tembusan_external?.length == 0 && (
                <Text style={{ fontSize: 13 }}>-</Text>
              )}
              {data && data.tembusan_external?.length !== 0 && (
                <Text style={{ fontSize: 13 }}>
                  {data.tembusan_external === "\n"
                    ? "-"
                    : data.tembusan_external}
                </Text>
              )}
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 15, fontWeight: 600 }}>
                Internal Satker
              </Text>
            </View>
            <View
              style={{
                backgroundColor: COLORS.white,
                padding: 20,
                borderRadius: 16,
              }}
            >
              {data && data.internal_satker?.length == 0 && (
                <Text style={{ fontSize: 13 }}>-</Text>
              )}
              {data && data.internal_satker?.length !== 0 && (
                <Text style={{ fontSize: 13 }}>{data.internal_satker}</Text>
              )}
            </View>
            {data.jenis_surat == "Surat Undangan" && (
              <>
                <View style={{ flexDirection: "row" }}>
                  <Text style={{ fontSize: 15, fontWeight: 600 }}>
                    Informasi Tambahan
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    padding: 20,
                    borderRadius: 16,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      borderBottomWidth: 2,
                      borderBottomColor: "#DBDADE",
                      paddingVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        width: "40%",
                        paddingRight: 20,
                      }}
                    >
                      Agenda Kegiatan
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        width: "60%",
                        paddingRight: 20,
                      }}
                    >
                      {data?.agenda?.length == 0 ? "-" : data?.agenda}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      borderBottomWidth: 2,
                      borderBottomColor: "#DBDADE",
                      paddingVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        width: "40%",
                        paddingRight: 20,
                      }}
                    >
                      Tanggal Kegiatan
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        width: "60%",
                        paddingRight: 20,
                      }}
                    >
                      {moment(data?.start_date)
                        .locale("id")
                        .format(DATETIME.LONG_DATE)}{" "}
                      -{" "}
                      {moment(data?.end_date)
                        .locale("id")
                        .format(DATETIME.LONG_DATE)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      borderBottomWidth: 2,
                      borderBottomColor: "#DBDADE",
                      paddingVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        width: "40%",
                        paddingRight: 20,
                      }}
                    >
                      Waktu Kegiatan
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        width: "60%",
                        paddingRight: 20,
                      }}
                    >
                      {data?.start_time}{" "}
                      {data?.end_time == "Selesai" ? data?.timezone : null} -{" "}
                      {data?.end_time}{" "}
                      {data?.end_time != "Selesai" ? data?.timezone : null}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      borderBottomWidth: 2,
                      borderBottomColor: "#DBDADE",
                      paddingVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        width: "40%",
                        paddingRight: 20,
                      }}
                    >
                      Tempat Kegiatan
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        width: "60%",
                        paddingRight: 20,
                      }}
                    >
                      {data?.location == "" ? "-" : data?.location}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      borderBottomColor: "#DBDADE",
                      paddingVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        width: "40%",
                        paddingRight: 20,
                      }}
                    >
                      Catatan
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        width: "60%",
                        paddingRight: 20,
                      }}
                    >
                      {data?.notes == "" ? "-" : data?.notes}
                    </Text>
                  </View>
                </View>
              </>
            )}
            {data?.kegiatan[0]?.start_date &&
              (data.jenis_surat == "Surat Perintah" ||
                data.jenis_surat == "Surat Tugas") && (
                <>
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: 15, fontWeight: 600 }}>
                      Informasi Tambahan
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: COLORS.white,
                      padding: 20,
                      borderRadius: 16,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        paddingVertical: 5,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          width: "40%",
                          paddingRight: 20,
                        }}
                      >
                        Kota Awal
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: 400,
                          width: "60%",
                          paddingRight: 20,
                        }}
                      >
                        {data?.from_city == "" ? "-" : data?.from_city}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        paddingVertical: 5,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          width: "40%",
                          paddingRight: 20,
                        }}
                      >
                        Catatan
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: 400,
                          width: "60%",
                          paddingRight: 20,
                        }}
                      >
                        {data?.notes == "" ? "-" : data?.notes}
                      </Text>
                    </View>
                    {data?.kegiatan?.map((item, index) => (
                      <View
                        key={index}
                        style={{
                          paddingTop: 10,
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", paddingVertical: 5 }}
                        >
                          <Text
                            style={{
                              fontSize: 14,
                              color: "#8f8b99",
                              fontWeight: 600,
                            }}
                          >
                            Tujuan {index + 1}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            paddingVertical: 5,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              width: "40%",
                              paddingRight: 20,
                            }}
                          >
                            Tanggal Kegiatan
                          </Text>
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: 400,
                              width: "60%",
                              paddingRight: 20,
                            }}
                          >
                            {moment(item?.start_date)
                              .locale("id")
                              .format(DATETIME.LONG_DATE)}{" "}
                            -{" "}
                            {moment(item?.end_date)
                              .locale("id")
                              .format(DATETIME.LONG_DATE)}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            paddingVertical: 5,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              width: "40%",
                              paddingRight: 20,
                            }}
                          >
                            Kota
                          </Text>
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: 400,
                              width: "60%",
                              paddingRight: 20,
                            }}
                          >
                            {item?.city == "" ? "-" : item?.city}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            paddingVertical: 5,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              width: "40%",
                              paddingRight: 20,
                            }}
                          >
                            Lokasi
                          </Text>
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: 400,
                              width: "60%",
                              paddingRight: 20,
                            }}
                          >
                            {item?.location == "" ? "-" : item?.location}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            paddingVertical: 5,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              width: "40%",
                              paddingRight: 20,
                            }}
                          >
                            Transportasi
                          </Text>
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: 400,
                              width: "60%",
                              paddingRight: 20,
                            }}
                          >
                            {item?.transportation == ""
                              ? "-"
                              : item?.transportation}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              )}
          </>
        )}
        {data?.attachments?.length > 1 && data?.is_editable == "1" && (
          <>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontSize: 15, fontWeight: 600 }}>
                Daftar Lampiran Sudah Diupload
              </Text>
            </View>
            {/* <View
              style={[styles.containerRow, { justifyContent: "space-between" }]}
            >
              <Text style={styles.titleLabel}>Attachments</Text>
              {data?.attachments?.length != 0 && Platform.OS == "android" && (
              <TouchableOpacity onPress={downloadAll}>
                <Text style={styles.linkText}>Download All</Text>
              </TouchableOpacity>
            )}
            </View> */}
            <View
              style={{
                backgroundColor: COLORS.white,
                padding: 20,
                borderRadius: 16,
              }}
            >
              {data?.attachments?.length <= 1 && <Text>-</Text>}
              {data?.attachments?.length > 1 &&
                data?.attachments?.map((item, index) => (
                  // <View style={styles.containerContent}>
                  <TouchableOpacity
                    key={index}
                    style={styles.containerContent}
                    onPress={() => {
                      initDownload(item);
                    }}
                  >
                    <IconButton
                      icon={getExtensionIcon(item)}
                      size={18}
                      style={styles.iconContent}
                    />
                    <View style={{ width: "85%" }}>
                      <Text style={styles.textContent}>{item?.name}</Text>
                      <Text style={styles.subtextContent}>{item?.size}</Text>
                    </View>
                  </TouchableOpacity>
                  // </View>
                  // <>
                  //   {item.description != "editor-generated" && (
                  //     <View
                  //       key={index}
                  //       style={{
                  //         flexDirection: "column",
                  //         justifyContent: "center",
                  //         alignItems: "center",
                  //       }}
                  //     >
                  //       <View
                  //         style={{
                  //           backgroundColor: COLORS.white,
                  //           borderRadius: 16,
                  //           padding: 20,
                  //           width: 90,
                  //           elevation: 1,
                  //         }}
                  //       >
                  //         {item?.description?.includes("pdf") && (
                  //           <Image
                  //             source={require("../../../../assets/superApp/pdf.png")}
                  //             style={{ width: 50, height: 50 }}
                  //           />
                  //         )}
                  //         {item?.description?.includes("word") && (
                  //           <Image
                  //             source={require("../../../../assets/superApp/word.png")}
                  //             style={{ width: 50, height: 50 }}
                  //           />
                  //         )}
                  //         {item?.description?.includes("presentation") && (
                  //           <Image
                  //             source={require("../../../../assets/superApp/ppt.png")}
                  //             style={{ width: 50, height: 50 }}
                  //           />
                  //         )}
                  //         {item?.description?.includes("compress") && (
                  //           <Image
                  //             source={require("../../../../assets/superApp/rar.png")}
                  //             style={{ width: 50, height: 50 }}
                  //           />
                  //         )}
                  //         {item?.description?.includes("png") && (
                  //           <Image
                  //             source={require("../../../../assets/superApp/png.png")}
                  //             style={{ width: 50, height: 50 }}
                  //           />
                  //         )}
                  //       </View>
                  //       <View
                  //         style={{
                  //           flexDirection: "column",
                  //           alignItems: "center",
                  //           marginBottom: 20,
                  //         }}
                  //       >
                  //         <Text
                  //           style={[styles.textContent, { textAlign: "center" }]}
                  //         >
                  //           {item?.name}
                  //         </Text>
                  //         <Text style={styles.subtextContent}>{item?.size}</Text>
                  //       </View>
                  //       <Button
                  //         mode="contained"
                  //         style={[
                  //           {
                  //             width: "100%",
                  //             backgroundColor: GlobalStyles.colors.primary,
                  //             marginBottom: 16,
                  //           },
                  //         ]}
                  //         onPress={() => {
                  //           initDownload(item);
                  //           // navigation.navigate("ViewAttachment", {
                  //           //   selected: item,
                  //           //   title: "Lihat Surat",
                  //           // });
                  //         }}
                  //         icon={() => (
                  //           <Ionicons
                  //             name="share-social"
                  //             size={20}
                  //             color={COLORS.white}
                  //           />
                  //         )}
                  //       >
                  //         Share
                  //       </Button>
                  //       {/* <Button
                  //   onPress={() => initDownload(item)}
                  //   mode="contained"
                  //   style={[
                  //     {
                  //       width: "100%",
                  //       backgroundColor: GlobalStyles.colors.blue,
                  //       marginBottom: 16,
                  //     },
                  //   ]}
                  //   icon={() => (
                  //     <Ionicons
                  //       name="download-outline"
                  //       size={20}
                  //       color={COLORS.white}
                  //     />
                  //   )}
                  // >
                  //   Unduh Surat
                  // </Button> */}
                  //     </View>
                  //   )}
                  // </>
                ))}
            </View>
          </>
        )}
      </View>
    </ScrollView>
    // <ScrollView
    //   overScrollMode="never"
    //   keyboardShouldPersistTaps="handled"
    //   style={[style, { backgroundColor: GlobalStyles.colors.tertiery10 }]}
    // >
    //   <View style={styles.screen}>
    //     <View style={[styles.containerLabel, { marginBottom: -2 }]}>
    //       <View>
    //         <Text style={styles.titleLabel}>Perihal</Text>
    //         <View style={styles.subtitleCopy}>
    //           {loading ? (
    //             <ShimmerPlaceholder width={300} shimmerStyle={{ borderRadius: 40 }} />
    //           ) : (
    //             <Text style={[styles.subtitleLabel, { width: "88%" }]}>
    //               {data && data.subject}
    //             </Text>
    //           )}
    //           <IconButton
    //             icon="content-copy"
    //             size={20}
    //             onPress={() => {
    //               copyToClipboard(data.subject);
    //             }}
    //           />
    //         </View>
    //       </View>
    //     </View>
    //     {tipe == "TrackingDetail" && data?.state !== "rns" && (
    //       <View style={styles.containerLabel}>
    //         <View>
    //           <Text style={styles.titleLabel}>Posisi</Text>
    //           <Text style={styles.subtitleLabel}>{data && data?.position}</Text>
    //         </View>
    //       </View>
    //     )}
    //     <View style={styles.containerLabel}>
    //       <View>
    //         <Text style={styles.titleLabel}>Tgl Diterima</Text>
    //         {loading ? (
    //           <ShimmerPlaceholder width={50} shimmerStyle={{ borderRadius: 40 }} />
    //         ) : (
    //           <Text style={styles.subtitleLabel}>
    //             {data && data.letter_date}
    //           </Text>
    //         )}
    //       </View>
    //       <View>
    //         <Text style={styles.titleLabel}>Lampiran</Text>
    //         {loading ? (
    //           <ShimmerPlaceholder width={30} shimmerStyle={{ borderRadius: 40 }} />
    //         ) : (
    //           <Text style={styles.subtitleLabel}>
    //             {data && data.attachment ? data.attachment : "-"}
    //           </Text>
    //         )}
    //       </View>
    //       <View>
    //         <Text style={styles.titleLabel}>Kode Masalah</Text>
    //         {loading ? (
    //           <ShimmerPlaceholder width={50} shimmerStyle={{ borderRadius: 40 }} />
    //         ) : (
    //           <Text style={styles.subtitleLabel}>
    //             {data && data.problem_code}
    //           </Text>
    //         )}
    //       </View>
    //     </View>
    //     <View style={[styles.containerLabel, { marginBottom: 0 }]}>
    //       <View>
    //         <Text style={styles.titleLabel}>Nomor Agenda</Text>
    //         {loading ? (
    //           <ShimmerPlaceholder width={100} shimmerStyle={{ borderRadius: 40 }} />
    //         ) : (
    //           <Text style={styles.subtitleLabel}>{noAgenda}</Text>
    //         )}
    //       </View>
    //     </View>
    //     {/* {noAgenda != null && (
    //       <View style={[styles.containerLabel, { marginBottom: 0 }]}>
    //         <View>
    //           <Text style={styles.titleLabel}>Nomor Agenda</Text>
    //           <Text style={styles.subtitleLabel}>{noAgenda}</Text>
    //         </View>
    //       </View>
    //     )} */}
    //     <View style={[styles.containerLabel, { marginBottom: -2 }]}>
    //       <View>
    //         <Text style={[styles.titleLabel, { marginBottom: -10 }]}>
    //           Nomor Surat
    //         </Text>
    //         <View style={[styles.subtitleCopy, { paddingBottom: 0 }]}>
    //           {loading ? (
    //             <ShimmerPlaceholder width={200} shimmerStyle={{ borderRadius: 40 }} />
    //           ) : (
    //             <Text style={styles.subtitleLabel}>
    //               {data && data.ref_number}
    //             </Text>
    //           )}
    //           <IconButton
    //             icon="content-copy"
    //             size={20}
    //             onPress={() => {
    //               copyToClipboard(data.ref_number);
    //             }}
    //           />
    //         </View>
    //       </View>
    //     </View>
    //     <View
    //       style={
    //         data &&
    //           data.receivers_display?.length == 0 &&
    //           data.kepada_bank?.length == 0 &&
    //           data.receivers?.length > 1
    //           ? {
    //             marginBottom: 16,
    //             width: width - 32,
    //           }
    //           : styles.containerLabel
    //       }
    //     >
    //       <View>
    //         {((data?.receivers?.length <= 1 &&
    //           data?.template?.name != "nota_external") ||
    //           (data?.receivers?.length >= 1 &&
    //             data?.template?.name == "nota_external") ||
    //           data?.receivers_display?.length != 0 ||
    //           data?.kepada_bank?.length != 0) && (
    //             <Text style={[styles.titleLabel]}>Kepada</Text>
    //           )}
    //         {data && data.kepada_bank?.length != 0 && (
    //           <Text style={styles.subtitleLabel}>
    //             {data && data.kepada_bank}
    //           </Text>
    //         )}
    //         {loading ? (
    //           <ShimmerPlaceholder width={300} shimmerStyle={{ borderRadius: 40 }} />
    //         ) : (
    //           <></>
    //         )}
    //         {data &&
    //           data.receivers_display?.length == 0 &&
    //           data.kepada_bank?.length == 0 && (
    //             <>
    //               {data && data.receivers?.length == 0 && <Text>-</Text>}
    //               {data && data.receivers?.length == 1 && (
    //                 <>
    //                   {data.template.name != "nota_external" && !loading ? (
    //                     <Text>
    //                       {Config.prefix}
    //                       {data.receivers[0]}
    //                     </Text>
    //                   ) : (
    //                     <></>
    //                   )}
    //                   {data.template.name == "nota_external" && (
    //                     <RenderHTML
    //                       contentWidth={width}
    //                       source={{ html: data?.receivers[0] }}
    //                     />
    //                   )}
    //                 </>
    //               )}
    //               {data && data.receivers?.length > 1 && (
    //                 <>
    //                   {data.template.name == "nota_external" && (
    //                     <RenderHTML
    //                       contentWidth={width}
    //                       source={{ html: data?.receivers.join("</br>") }}
    //                     />
    //                   )}
    //                   {data.template.name != "nota_external" && (
    //                     <List.Accordion
    //                       title="Kepada"
    //                       titleStyle={styles.titleDropdown}
    //                       style={[
    //                         styles.listAccordion,
    //                         openKepada
    //                           ? {
    //                             borderTopLeftRadius: 12,
    //                             borderTopRightRadius: 12,
    //                           }
    //                           : { borderRadius: 12 },
    //                       ]}
    //                       onPress={() => setOpenKepada(!openKepada)}
    //                     >
    //                       <View
    //                         style={[
    //                           styles.listAccordion,
    //                           openKepada
    //                             ? {
    //                               borderBottomLeftRadius: 12,
    //                               borderBottomRightRadius: 12,
    //                             }
    //                             : {},
    //                         ]}
    //                       >
    //                         {data.receivers.map((item, index) => (
    //                           <Text key={index} style={styles.subtitleDropdown}>
    //                             {index + 1}. {Config.prefix} {item}
    //                           </Text>
    //                         ))}
    //                       </View>
    //                     </List.Accordion>
    //                   )}
    //                 </>
    //               )}
    //             </>
    //           )}
    //         {data &&
    //           data.receivers_display?.length != 0 &&
    //           data.kepada_bank?.length == 0 && (
    //             <>
    //               {data.receivers_display?.length == 0 && <Text>-</Text>}
    //               {data && data.receivers_display?.length == 1 && (
    //                 <RenderHTML
    //                   contentWidth={width}
    //                   source={{ html: data?.receivers_display[0] }}
    //                 />
    //               )}
    //               {data &&
    //                 data.receivers_display?.length > 1 &&
    //                 data.template.name != "nota_external" &&
    //                 data.receivers_display.map((item, index) => (
    //                   <Text key={index}>
    //                     {index + 1}. {item}
    //                   </Text>
    //                 ))}
    //               {data &&
    //                 data.receivers_display?.length > 1 &&
    //                 data.template.name == "nota_external" &&
    //                 data.receivers_display.map((item, index) => (
    //                   <Text key={index}>{item}</Text>
    //                 ))}
    //             </>
    //           )}
    //         {data &&
    //           data?.verifytitleprofile?.status == "error" &&
    //           data?.verifytitleprofile?.data?.receiver.length != 0 && (
    //             <Text style={styles.errorText}>
    //               * {data?.verifytitleprofile?.data?.receiver.join(",")} is not
    //               active
    //             </Text>
    //           )}
    //       </View>
    //     </View>
    //     {data?.template?.name == "poh" && (
    //       <View style={styles.containerLabel}>
    //         <View>
    //           <Text style={styles.titleLabel}>Delegasi dari tanggal</Text>
    //           <Text style={styles.subtitleLabel}>
    //             {data &&
    //               moment(data?.poh_attribute.date_start).format("DD MMM yyyy")}
    //           </Text>
    //         </View>
    //         <View>
    //           <Text style={styles.titleLabel}>Delegasi sampai tanggal</Text>
    //           <Text style={styles.subtitleLabel}>
    //             {data &&
    //               moment(data?.poh_attribute.date_end).format("DD MMM yyyy")}
    //           </Text>
    //         </View>
    //       </View>
    //     )}
    //     <View style={styles.containerLabel}>
    //       <View>
    //         <Text style={styles.titleLabel}>Dari</Text>
    //         {data && data.senders.length != 0 && !loading ? (
    //           <Text style={styles.subtitleLabel}>
    //             {data && data?.senders[0].title
    //               ? data.senders[0].title
    //               : data.senders[0].name}
    //           </Text>
    //         ) : (
    //           <ShimmerPlaceholder width={350} shimmerStyle={{ borderRadius: 40 }} />
    //         )}
    //         {/* {data && data.komentar.length > 1 && (
    //           <Text>
    //             {data.komentar[0].poh == true && data.senders[0]?.title != ""
    //               ? "POH " + data.senders[0].title
    //               : data.senders[0].title != ""
    //                 ? data.senders[0].title
    //                 : data.komentar[0].creator}
    //           </Text>
    //         )} */}
    //       </View>
    //     </View>
    //     {showBody != false && data?.state != "sps" && (
    //       <View style={styles.containerLabel}>
    //         <View>
    //           <View
    //             style={[
    //               styles.containerLabel,
    //               { alignItems: "center", marginBottom: 0 },
    //             ]}
    //           >
    //             <Text style={styles.titleLabel}>Isi Surat</Text>
    //             <IconButton
    //               icon="file-download-outline"
    //               onPress={() => {
    //                 printToFile();
    //               }}
    //             />
    //           </View>
    //           {/* ISI SURAT SELAIN BG */}
    //           {/* {data?.body?.length != 0 &&
    //             data?.body != "<p>\r\n  <br />\r\n</p>" &&
    //             (data?.template?.name == "nota_internal" ||
    //               data?.template?.name == "nota_external" ||
    //               data?.template?.name == "undangan" ||
    //               data?.template?.name == "poh") && (
    //               <ScrollView
    //                 style={{ backgroundColor: GlobalStyles.colors.textWhite }}
    //               >
    //                 <View>
    //                   <RenderHTML
    //                     contentWidth={width}
    //                     source={{
    //                       html: data?.body.replace(
    //                         "list-style:",
    //                         "list-style-type:"
    //                       ),
    //                     }}
    //                     tagsStyles={tagsStyles}
    //                     customHTMLElementModels={customHTMLElementModels}
    //                   />
    //                 </View>
    //                 {data?.template?.name == "nota_external" && (
    //                   <Text>{data?.salam}</Text>
    //                 )}
    //                 {data?.template?.name != "nota_external" &&
    //                   data?.body != "<p>\r\n  <br />\r\n</p>" &&
    //                   data?.office_city != "" && (
    //                     <>
    //                       <Text>
    //                         {data?.office_city}, {data?.letter_date}
    //                       </Text>
    //                       <Text></Text>
    //                       <Text></Text>
    //                     </>
    //                   )}
    //                 {data?.body != "<p>\r\n  <br />\r\n</p>" && (
    //                   <Text>{data?.komentar[0]?.creator}</Text>
    //                 )}
    //               </ScrollView>
    //             )} */}
    //           {/* ISI SURAT BG */}
    //           {/* {body && (
    //             // body != "<p>\r\n  <br />\r\n</p>" &&
    //             // data?.template?.name != "nota_internal" &&
    //             // data?.template?.name != "nota_external" &&
    //             // data?.template?.name != "undangan" &&
    //             // data?.template?.name != "poh"&& */}
    //           <View style={{ borderWidth: 1 }}>
    //             {loading ? (
    //               <ShimmerPlaceholder height={400} width={350} />
    //             ) : (

    //               <WebView
    //                 bounces={true}
    //                 originWhitelist={["*"]}
    //                 source={{
    //                   html: body,
    //                 }}
    //                 style={{
    //                   width: width - 34,
    //                   minHeight: 400,
    //                 }}
    //                 // injectedJavaScript={
    //                 //   Platform.OS == "android" ? '' : zoomInOutIos
    //                 // }
    //                 setBuiltInZoomControls={true}
    //                 onShouldStartLoadWithRequest={(event) => {
    //                   if (event.url != "about:blank") {
    //                     if (event.url !== body) {
    //                       Linking.openURL(event.url);
    //                       return false;
    //                     } else return true;
    //                   } else return true;
    //                 }}
    //                 scalesPageToFit={true}
    //                 nestedScrollEnabled
    //               />
    //             )}
    //           </View>
    //           {/* )} */}
    //           {body?.length == 0 && data?.body != "<p>\r\n  <br />\r\n</p>" && (
    //             <View>
    //               <Text>( Kosong )</Text>
    //             </View>
    //           )}
    //         </View>
    //       </View>
    //     )}
    //     <View
    //       style={
    //         data &&
    //           data.copytos_display?.length == 0 &&
    //           data.copytos?.length > 1
    //           ? { paddingTop: 6, width: width - 32 }
    //           : styles.containerLabel
    //       }
    //     >
    //       <View>
    //         {(data?.copytos?.length <= 1 ||
    //           data?.copytos_display?.length != 0) && (
    //             <Text style={styles.titleLabel}>Tembusan</Text>
    //           )}
    //         <View>
    //           {data && data.copytos_display?.length == 0 && (
    //             <>
    //               {data && data.copytos?.length == 0 && <Text>-</Text>}
    //               {data && data.copytos?.length == 1 && (
    //                 <Text>
    //                   {Config.prefix}
    //                   {data.copytos[0]}
    //                 </Text>
    //               )}
    //               {data && data.copytos?.length > 1 && (
    //                 <List.Accordion
    //                   title="Tembusan"
    //                   titleStyle={{ fontSize: GlobalStyles.font.md }}
    //                   style={[
    //                     styles.listAccordion,
    //                     openTembusan
    //                       ? {
    //                         borderTopLeftRadius: 12,
    //                         borderTopRightRadius: 12,
    //                       }
    //                       : { borderRadius: 12 },
    //                   ]}
    //                   onPress={() => setOpenTembusan(!openTembusan)}
    //                 >
    //                   <View
    //                     style={[
    //                       styles.listAccordion,
    //                       openTembusan
    //                         ? {
    //                           borderBottomLeftRadius: 12,
    //                           borderBottomRightRadius: 12,
    //                         }
    //                         : {},
    //                     ]}
    //                   >
    //                     {data.copytos.map((item, index) => (
    //                       <Text key={index}>
    //                         {index + 1}. {Config.prefix} {item}
    //                       </Text>
    //                     ))}
    //                   </View>
    //                 </List.Accordion>
    //               )}
    //             </>
    //           )}
    //           {data && data.copytos_display?.length != 0 && (
    //             <>
    //               {data && data.copytos_display?.length == 0 && <Text>-</Text>}
    //               {data && data.copytos_display?.length == 1 && (
    //                 <RenderHTML
    //                   contentWidth={width}
    //                   source={{ html: data?.copytos_display[0] }}
    //                 />
    //               )}
    //               {data && data.copytos_display?.length > 1 && (
    //                 <RenderHTML
    //                   contentWidth={width}
    //                   source={{ html: data?.copytos_display.join("\n") }}
    //                 />
    //               )}
    //             </>
    //           )}
    //           {data &&
    //             data?.verifytitleprofile?.status == "error" &&
    //             data?.verifytitleprofile?.data?.copyto.length != 0 && (
    //               <Text style={styles.errorText}>
    //                 * {data?.verifytitleprofile?.data?.copyto.join(",")} is not
    //                 active
    //               </Text>
    //             )}
    //         </View>
    //       </View>
    //     </View>
    //     {data?.state == "sps" && (
    //       <View style={styles.containerLabel}>
    //         <View>
    //           <Text style={styles.titleLabel}>Keterangan</Text>
    //           {data?.keterangan?.length == 0 && <Text>-</Text>}
    //           {data?.keterangan?.length > 0 && <Text>{data?.keterangan}</Text>}
    //         </View>
    //       </View>
    //     )}
    //     {(tipe == "NeedFollowUpDetail" || tipe == "TrackingDetail") && (
    //       <View style={styles.containerLabel}>
    //         <View>
    //           <Text style={styles.titleLabel}>Pemeriksa</Text>
    //           <View>
    //             {data && data.tracker.approvers?.length == 0 && <Text>-</Text>}
    //             {data && data.tracker.approvers?.length == 1 && (
    //               <Text>
    //                 {data.tracker.approvers[0].title
    //                   ? data.tracker.approvers[0].title.name
    //                   : data.tracker.approvers[0].profile.fullname}
    //               </Text>
    //             )}
    //             {data &&
    //               data.tracker.approvers?.length > 1 &&
    //               data.tracker.approvers.map((item, index) => (
    //                 <View key={index}>
    //                   {index !== 0 && (
    //                     <>
    //                       {data.position == item.title?.name &&
    //                         data.state != "rns" && (
    //                           <Text style={styles.titleLabel}>
    //                             {index}.{item.title?.name}
    //                           </Text>
    //                         )}
    //                       {data.position == item.profile?.fullname &&
    //                         data.state != "rns" && (
    //                           <Text style={styles.titleLabel}>
    //                             {index}.{item.profile?.fullname}
    //                           </Text>
    //                         )}
    //                       {data.position == item.title?.name &&
    //                         data.state == "rns" && (
    //                           <Text>
    //                             {index}.{item.title?.name}
    //                           </Text>
    //                         )}
    //                       {data.position == item.profile?.fullname &&
    //                         data.state == "rns" && (
    //                           <Text>
    //                             {index}.{item.profile?.fullname}
    //                           </Text>
    //                         )}
    //                       {item.title?.name &&
    //                         data.position !== item.title?.name && (
    //                           <Text>
    //                             {index}.{item.title?.name}
    //                           </Text>
    //                         )}
    //                       {item.profile?.fullname &&
    //                         data.position !== item.profile?.fullname && (
    //                           <Text>
    //                             {index}.{item.profile?.fullname}
    //                           </Text>
    //                         )}
    //                     </>
    //                   )}
    //                 </View>
    //               ))}
    //             {data &&
    //               data?.verifytitleprofile?.status == "error" &&
    //               data?.verifytitleprofile?.data?.approver.length != 0 && (
    //                 <Text style={styles.errorText}>
    //                   * {data?.verifytitleprofile?.data?.approver.join(",")} is
    //                   not active
    //                 </Text>
    //               )}
    //           </View>
    //         </View>
    //       </View>
    //     )}

    //     {tipe == "NeedFollowUpDetail" && data?.state == "inpro" && (
    //       <ActionInprogress id={data?.id} data={data} />
    //     )}

    //     {tipe == "out" && data?.template?.name == "nota_external" && (
    //       <ActionDigisign id={data?.id} />
    //     )}
    //   </View>
    // </ScrollView>
  );
}

export default DetailAgenda;

const styles = StyleSheet.create({
  screen: {
    margin: 16,
    backgroundColor: GlobalStyles.colors.white,
  },
  containerLabel: {
    flexDirection: "row",
    marginBottom: 6,
    justifyContent: "space-between",
  },
  titleLabel: {
    fontWeight: "bold",
    fontSize: GlobalStyles.font.md,
    marginBottom: 4,
  },
  subtitleLabel: {
    fontSize: GlobalStyles.font.md,
  },
  subtitleCopy: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 8,
  },
  titleDropdown: {
    fontSize: GlobalStyles.font.md,
    fontWeight: "bold",
  },
  listAccordion: {
    backgroundColor: GlobalStyles.colors.tertiery20,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  subtitleDropdown: {
    fontSize: 13,
    paddingVertical: 4,
  },
  errorText: {
    color: GlobalStyles.colors.error500,
  },
  textContent: {
    fontSize: 14,
    color: GlobalStyles.colors.blue,
    fontWeight: "bold",
    paddingRight: 8,
    flexWrap: "wrap",
  },
  subtextContent: {
    fontSize: GlobalStyles.font.sm,
    color: GlobalStyles.colors.tertiery50,
    fontWeight: "bold",
    paddingRight: 8,
  },
  containerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
});
