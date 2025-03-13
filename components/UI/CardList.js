import { Checkbox, Divider, IconButton } from "react-native-paper";
import { View, Text, StyleSheet } from "react-native";
import { GlobalStyles } from "../../constants/styles";
import { nde_api } from "../../utils/api.config";
import { useEffect, useState } from "react";
import { headerToken } from "../../utils/http";
import { useNavigation } from "@react-navigation/native";
import { Config } from "../../constants/config";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { COLORS, DATETIME } from "../../config/SuperAppps";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedList } from "../../store/listBulk";
import moment from "moment";

function CardList({ data, tipe, onPress, typeBulkDelete, is_pass }) {
  const navigation = useNavigation();
  const [title, setTitle] = useState();
  const [errorAvatar, setErrorAvatar] = useState(false);
  const { profile } = useSelector((state) => state.profile);
  const selected = useSelector((state) => state.listbulk.list);
  const dispatch = useDispatch();
  const { device } = useSelector((state) => state.apps);
  let header = {};
  useEffect(() => {
    if (tipe == "agendain") {
      setTitle("My Disposisi\nSurat Masuk");
    } else if (tipe == "agendadispo") {
      setTitle("My Disposisi\nDisposisi");
    } else if (tipe == "agendaout") {
      setTitle("My Disposisi\nTerkirim");
    } else if (tipe == "agendamydispo") {
      setTitle("My Disposisi\nMy Disposisi");
    }
    getHeader();
  }, []);
  async function getHeader() {
    header = await headerToken();
  }

  function selectDetailHandler() {
    if (tipe == "agendain") {
      navigation.navigate("TabViewBg", {
        id: data.id,
        screen: "detailAgenda",
        position: "bottom",
      });
    } else if (tipe == "agendadispo" || tipe == "agendamydispo") {
      navigation.navigate("DispositionDetail", {
        id: data.id,
      });
    } else if (tipe == "agendaout") {
      navigation.navigate("SubmittedDetail", {
        id: data.id,
      });
    }
  }

  return (
    <>
      <View
        style={[
          data.unread
            ? styles.cardUnread
            : data.disposisi
            ? styles.cardReadDispo
            : data.progress == true
            ? styles.cardDisabled
            : styles.cardRead,
          data.is_pejabat == false && tipe !== "agendaininternal"
            ? styles.cardSecre
            : "",
          ,
          { padding: 15 },
        ]}
      >
        {tipe == "agendadispo" && (
          <View style={{ marginBottom: 5 }}>
            <Text
              style={[
                { fontSize: 14 },
                data?.unread ? { fontWeight: "bold" } : {},
              ]}
            >
              {data.asal_surat.title ? data.asal_surat.title : ""}
              {data.asal_surat.title == null ? data.asal_surat : ""}
            </Text>
            <Text style={{ fontSize: 12 }}>
              {data?.nomor_surat} | (
              {moment(data?.tanggal_surat, DATETIME.SHORT_DATE).format(
                DATETIME.SHORT_DATE2
              )}
              )
            </Text>
          </View>
        )}
        <View style={{ flexDirection: "row" }}>
          <View
            style={{
              width: device === "tablet" ? "10%" : "15%",
              alignItems: "center",
            }}
          >
            {errorAvatar && (
              <Image
                source={Config.avatar}
                style={{
                  borderRadius: 50,
                  width: 40,
                  height: 40,
                  borderWidth: 1,
                  borderColor: COLORS.white,
                }}
              />
            )}
            {!errorAvatar && (
              <Image
                source={{
                  uri: `${
                    nde_api.baseurl +
                    "crsbe/" +
                    data.avatar.slice(5, data.avatar.length)
                  }`,
                  method: "GET",
                  headers: header,
                }}
                style={{
                  borderRadius: 50,
                  width: 40,
                  height: 40,
                  borderWidth: 1,
                  borderColor: COLORS.white,
                }}
                onError={() => setErrorAvatar(true)}
              />
            )}
            {(data?.priority == "Sangat Segera" ||
              data?.prio == "Sangat Segera" ||
              data?.priority == "Segera" ||
              data?.prio == "Segera") && (
              <IconButton
                icon="alert"
                size={GlobalStyles.font.xxl}
                iconColor={GlobalStyles.colors.red}
                style={styles.button}
              />
            )}
            {tipe == "needfollowup" && is_pass == "true" && (
              <Checkbox.Item
                mode="android"
                status={
                  selected?.findIndex((item) => item == data.id) != -1
                    ? "checked"
                    : "unchecked"
                }
                color={GlobalStyles.colors.blue}
                onPress={() => {
                  if (!data?.progress) {
                    dispatch(setSelectedList(data));
                  }
                }}
                position="leading"
                disabled={data?.onprogress}
                // labelStyle={styles.labelCheckbox}
              />
            )}
            {tipe == "agendaout" && typeBulkDelete == true && (
              <Checkbox.Item
                mode="android"
                status={
                  selected?.findIndex((item) => item == data.id) != -1
                    ? "checked"
                    : "unchecked"
                }
                color={GlobalStyles.colors.blue}
                onPress={() => {
                  if (!data?.progress) {
                    dispatch(setSelectedList(data));
                  }
                }}
                position="leading"
                disabled={data?.onprogress}
                // labelStyle={styles.labelCheckbox}
              />
            )}
          </View>

          <TouchableOpacity onPress={onPress} disabled={data?.progress}>
            <View style={{ flexDirection: "row", width: "93%" }}>
              <View style={{ width: "70%", gap: 5 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  {data?.unread && (
                    <View
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 4,
                        backgroundColor: COLORS.warning,
                      }}
                    />
                  )}
                  {tipe !== "agendadispo" && (
                    <Text style={{ fontSize: 14 }}>
                      {data.sender.title && (
                        <Text
                          style={data?.unread ? { fontWeight: "bold" } : {}}
                        >
                          {data.sender.title}
                        </Text>
                      )}
                      {data.sender.title == null && (
                        <Text
                          style={data?.unread ? { fontWeight: "bold" } : {}}
                        >
                          {data.sender?.replace("\\/", "/")}
                        </Text>
                      )}
                    </Text>
                  )}
                  {tipe == "agendadispo" && (
                    <Text
                      style={[
                        { fontSize: 14, color: GlobalStyles.colors.gray400 },
                        data?.unread ? { fontWeight: "bold" } : {},
                      ]}
                    >
                      PENGIRIM DISPO:{" "}
                      {data.sender.title ? data.sender.title : ""}
                      {data.sender.title == null ? data.sender : ""}
                    </Text>
                  )}
                </View>
                {(tipe == "agendain" || tipe == "needfollowup") && (
                  <Text style={{ fontSize: 12, color: COLORS.infoDanger }}>
                    Unit Kerja: {data?.unker}
                  </Text>
                )}
                {tipe == "tracking" && data.position && (
                  <Text
                    style={{
                      color: GlobalStyles.colors.tertiery70,
                      fontSize: 12,
                    }}
                  >
                    {data.position}
                  </Text>
                )}
                <Text style={{ fontSize: 13, fontWeight: 400 }}>
                  {data?.subject?.replace("\\/", "/")}
                </Text>
              </View>
              <View
                style={{
                  alignItems: "flex-end",
                  width: "30%",
                  justifyContent: "flex-start",
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: 400 }}>
                  {data.date.substr(0, 6)}
                </Text>
                <Text style={{ fontSize: 13, fontWeight: 400 }}>
                  {data.time.substr(0, 5)}
                </Text>
                {((data.logs_tag && tipe == "agendain") ||
                  (data.disposisi && tipe == "agendadispo")) && (
                  <View style={styles.containerButton}>
                    <IconButton
                      icon="email-send-outline"
                      size={GlobalStyles.font.xxl}
                      iconColor={GlobalStyles.colors.blue}
                      style={styles.button}
                      onPress={() => {
                        navigation.navigate("DetailLog", {
                          id: data.id,
                          tipe: tipe,
                          title: title,
                          subject: data?.subject,
                        });
                      }}
                    />
                  </View>
                )}
                {data.retract &&
                  (profile.nik == "0000000000001" ||
                    profile.nik == "00000000000011") && (
                    <View style={styles.containerButton}>
                      <IconButton
                        icon="email-receive-outline"
                        size={GlobalStyles.font.xxl}
                        iconColor={GlobalStyles.colors.yellow}
                        style={styles.button}
                      />
                    </View>
                  )}
                {data.tracking && (
                  <View style={styles.containerButton}>
                    <IconButton
                      icon="forum-outline"
                      size={GlobalStyles.font.xxl}
                      iconColor={GlobalStyles.colors.blue}
                      style={styles.button}
                      onPress={() => {
                        navigation.navigate("TrackingLogDetail", {
                          id: data.id,
                          tipe: tipe,
                          title: "Log Disposisi",
                          trackinglog: data.tracking,
                        });
                      }}
                    />
                  </View>
                )}

                {(data.type == "incoming" ||
                  data.type == "disposition" ||
                  data.type == "submitted" ||
                  data.type == "outgoing") && (
                  <View
                    style={[
                      data.type == "disposition"
                        ? {
                            backgroundColor: GlobalStyles.colors.yellow,
                          }
                        : data.type == "incoming"
                        ? {
                            backgroundColor: GlobalStyles.colors.tertiery,
                          }
                        : data.type == "submitted"
                        ? {
                            backgroundColor: GlobalStyles.colors.red,
                          }
                        : data.type == "outgoing"
                        ? {
                            backgroundColor: GlobalStyles.colors.yellow,
                          }
                        : {},
                      styles.badgeTipeLetter,
                    ]}
                  >
                    <Text
                      style={{
                        color: GlobalStyles.colors.textWhite,
                        fontSize: 13,
                      }}
                    >
                      {data.type == "incoming"
                        ? "Incoming"
                        : data.type == "disposition"
                        ? "Disposition"
                        : data.type == "submitted"
                        ? "Submitted"
                        : data.type == "outgoing"
                        ? "Need Follow Up"
                        : ""}
                    </Text>
                  </View>
                )}
                {data.status && (
                  <View
                    style={[
                      data.status == "In Progress" || data.status == "Submit"
                        ? {
                            backgroundColor: GlobalStyles.colors.yellow,
                          }
                        : data.status == "Final"
                        ? {
                            backgroundColor: GlobalStyles.colors.green,
                          }
                        : data.status == "Sedang Diproses"
                        ? {
                            backgroundColor: GlobalStyles.colors.grey,
                          }
                        : {
                            backgroundColor: GlobalStyles.colors.red,
                            color: GlobalStyles.colors.textWhite,
                          },
                      styles.badgeStatus,
                    ]}
                  >
                    <Text
                      style={{
                        color: GlobalStyles.colors.textWhite,
                        fontSize: 13,
                      }}
                    >
                      {data.status == "Final"
                        ? "Sudah Ditandatangani"
                        : data.status == "Sedang Diproses"
                        ? "Proses TTDE"
                        : data.status}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <Divider />
    </>
  );
}

export default CardList;

const styles = StyleSheet.create({
  cardUnread: {
    backgroundColor: GlobalStyles.colors.textWhite,
    borderLeftWidth: 3,
    borderLeftColor: GlobalStyles.colors.yellow,
    borderRadius: 0,
  },
  cardRead: {
    backgroundColor: GlobalStyles.colors.greylight,
    borderLeftWidth: 3,
    borderLeftColor: GlobalStyles.colors.grey,
    borderRadius: 0,
  },
  cardReadDispo: {
    backgroundColor: GlobalStyles.colors.greylight,
    borderLeftWidth: 3,
    borderLeftColor: GlobalStyles.colors.blue,
    borderRadius: 0,
  },
  cardSecre: {
    borderLeftWidth: 3,
    borderLeftColor: GlobalStyles.colors.red,
    borderRadius: 0,
  },
  cardDisabled: {
    borderLeftWidth: 3,
    borderLeftColor: GlobalStyles.colors.grey,
    borderRadius: 0,
    backgroundColor: GlobalStyles.colors.disabled,
  },
  containerCard: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
    marginRight: 16,
    marginVertical: 8,
  },
  rightStyle: { width: "15%" },
  rightCard: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  remaining: {
    textAlign: "center",
  },
  date: {
    textAlign: "right",
  },
  containerButton: {
    flexDirection: "row",
    justifyContent: "flex-end",
    margin: 0,
  },
  button: {
    margin: 0,
  },
  footer: {
    flexDirection: "row",
  },
  badgeTipeLetter: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    padding: 8,
  },
  badgeStatus: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeRemaining: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.tertiery,
    borderRadius: 6,
    paddingRight: 8,
  },
});
