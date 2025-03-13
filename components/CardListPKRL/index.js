import React, { useMemo, useRef } from "react";
import {
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text, Image } from "react-native";
import {
  COLORS,
  DATETIME,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Search } from "../../components/Search";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { useEffect } from "react";
import ListEmpty from "../../components/ListEmpty";
import {
  getDetailDigisign,
  getListRejected,
  getListComposer,
  getListDraft,
  getListInProgress,
  getListSignedDigiSign,
  getDetailDigisignMonitoring,
} from "../../service/api";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getTokenValue } from "../../service/session";
import {
  resetAttachmentDraft,
  setDigitalSignLists,
} from "../../store/DigitalSign";
import { Loading } from "../../components/Loading";
import { RefreshControl } from "react-native";
import { Config } from "../../constants/config";
import moment from "moment";

export const CardListPKRL = ({
  item,
  variant,
  token,
  device,
  isSelected,
  setSelection,
  nip,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const getDetail = (id) => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)
    if (variant !== "monitoring") {
      dispatch(getDetailDigisign(params));
    } else {
      console.log("ini mah monitoring");
      dispatch(getDetailDigisignMonitoring(params));
    }
  };
  const [modal, setModal] = useState(false);

  const handleNavigate = (item) => {
    getDetail(item.id);
    if (
      (variant === "track" ||
        item.state === "in_progress" ||
        item.state === "done") &&
      variant !== "monitoring"
    ) {
      navigation.navigate("DetailPKRL", {
        variant: variant,
        token: token,
      });
    } else if (variant === "monitoring") {
      navigation.navigate("DetailPKRL", {
        variant: variant,
        token: token,
      });
    }
  };

  return (
    <View
      key={item.id}
      style={{
        backgroundColor:
          item?.state === "revision" || item?.state === "ttde"
            ? COLORS.ExtraDivinder
            : COLORS.white,
        borderRadius: 16,
        flex: 1,
        marginTop: 10,
        marginHorizontal: "5%",
        padding: 20,
        //shadow ios
        shadowOffset: { width: -2, height: 4 },
        shadowColor: "#171717",
        shadowOpacity: 0.2,
        // //shadow android
        elevation: 2,
        marginVertical: 10,
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
        }}
        onPress={() => handleNavigate(item)}
        disabled={
          item?.state === "revision" || item?.state === "ttde" ? true : false
        }
      >
        <View
          style={{
            flexDirection: "column",
            flex: 1,
          }}
        >
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Text
              style={{
                fontSize: fontSizeResponsive("Judul", device),
                textAlign: "justify",
                fontWeight: FONTWEIGHT.bold,
                flexWrap: "wrap",
              }}
            >
              {item?.subject}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: COLORS.lighter,
              height: 1,
              marginVertical: 5,
              width: "90%",
            }}
          />
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              flex: 1,
              gap: 5,
            }}
          >
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                textAlign: "auto",
                fontWeight: FONTWEIGHT.normal,
                fontWeight: FONTWEIGHT.bold,
                width: "38%",
              }}
            >
              Nomor Dokumen
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                textAlign: "auto",
                fontWeight: FONTWEIGHT.normal,
                fontWeight: FONTWEIGHT.bold,
              }}
            >
              :
            </Text>
            <Text
              style={{
                fontWeight: FONTWEIGHT.normal,
                width: "60%",
                textAlign: "auto",
                fontSize: fontSizeResponsive("H3", device),
              }}
            >
              {item?.extra_attributes.no_perizinan !== ""
                ? item?.extra_attributes.no_perizinan
                : "-"}
            </Text>
          </View>
          {variant === "inprogress" || variant === "track" ? null : (
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                flex: 1,
                gap: 5,
                marginTop: 5,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H3", device),
                  textAlign: "auto",
                  fontWeight: FONTWEIGHT.normal,
                  fontWeight: FONTWEIGHT.bold,
                  width: "38%",
                }}
              >
                Status
              </Text>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H3", device),
                  textAlign: "auto",
                  fontWeight: FONTWEIGHT.normal,
                  fontWeight: FONTWEIGHT.bold,
                }}
              >
                :
              </Text>
              <View
                style={{
                  backgroundColor:
                    item.state === "done"
                      ? COLORS.successLight
                      : item.state === "in_progress"
                      ? COLORS.warningLight
                      : item.state === "revision"
                      ? COLORS.infoDangerLight
                      : item.state === "ttde"
                      ? COLORS.infoLight
                      : COLORS.bgLightGrey,
                  padding: 10,
                  borderRadius: 15,
                }}
              >
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.normal,
                    textAlign: "auto",
                    fontSize: fontSizeResponsive("H3", device),
                    color:
                      item.state === "done"
                        ? COLORS.success
                        : item.state === "in_progress"
                        ? COLORS.warning
                        : item.state === "revision"
                        ? COLORS.infoDanger
                        : item.state === "ttde"
                        ? COLORS.info
                        : COLORS.grey,
                  }}
                >
                  {item.state === "done"
                    ? "Done"
                    : item.state === "in_progress"
                    ? "In Progress"
                    : item.state === "ttde"
                    ? "Pengambilan Nomor"
                    : item.state}
                </Text>
              </View>
            </View>
          )}

          {variant === "inprogress" ? (
            <View style={{ width: "100%" }}>
              <View style={{}}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    width: 120,
                    textAlign: "auto",
                    paddingRight: 12,
                    fontWeight: FONTWEIGHT.normal,
                    width: "90%",
                    fontWeight: FONTWEIGHT.bold,
                    marginTop: 5,
                  }}
                >
                  Konseptor
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 5,
                    alignItems: "center",
                    marginTop: 5,
                  }}
                >
                  <Image
                    source={{ uri: item.composer.avatar_url }}
                    height={device === "tablet" ? 50 : 30}
                    width={device === "tablet" ? 50 : 30}
                    borderRadius={device === "tablet" ? 50 : 30}
                  />
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.normal,
                      width: "90%",
                      textAlign: "auto",
                      fontSize: fontSizeResponsive("H3", device),
                    }}
                  >
                    {item.composer.is_title
                      ? item.composer.officer.nama
                      : item.composer.nama}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}

          <TouchableOpacity
            style={{ gap: 5, width: "100%" }}
            onPress={() => {
              setModal(true);
            }}
          >
            <View
              style={{
                marginTop: 15,
                backgroundColor: COLORS.primary,
                padding: 10,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 8,
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.normal,
                  textAlign: "auto",
                  fontSize: fontSizeResponsive("H4", device),
                  color: COLORS.white,
                  fontWeight: FONTWEIGHT.bold,
                }}
              >
                Lihat Paraf
              </Text>
            </View>
          </TouchableOpacity>

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
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.white,
                  width: "90%",
                  height: device === "tablet" ? "80%" : "50%",
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
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: fontSizeResponsive("H2", device),
                    }}
                  >
                    List Paraf
                  </Text>
                  <TouchableOpacity
                    style={{}}
                    onPress={() => {
                      setModal(false);
                    }}
                  >
                    <Ionicons
                      name="close-outline"
                      size={device === "tablet" ? 30 : 24}
                      color={COLORS.lighter}
                    />
                  </TouchableOpacity>
                </View>
                <ScrollView>
                  {item.approvers.map((data, index) => {
                    if (index > 0 && index < item?.approvers.length - 1) {
                      return (
                        <View
                          style={{
                            marginHorizontal: 20,
                            marginVertical: 5,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              gap: 5,
                              alignItems: "center",
                            }}
                          >
                            <Image
                              source={{ uri: data.avatar_url }}
                              height={device === "tablet" ? 50 : 30}
                              width={device === "tablet" ? 50 : 30}
                              borderRadius={device === "tablet" ? 50 : 30}
                            />
                            <Text
                              style={{
                                width: "90%",
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              {data.nama}
                            </Text>
                          </View>
                          {item.sequence <= index ? (
                            <>
                              <View
                                style={{
                                  flexDirection: "row",
                                  width: "60%",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                  gap: 5,
                                  marginTop: 5,
                                }}
                              >
                                <View
                                  style={{
                                    backgroundColor: COLORS.infoDanger,
                                    borderRadius: 50,
                                    padding: 5,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Ionicons
                                    name="close"
                                    color={COLORS.white}
                                    size={device === "tablet" ? 25 : 15}
                                  />
                                </View>
                                <View
                                  style={{
                                    backgroundColor: COLORS.infoDangerLight,
                                    paddingVertical: 5,
                                    borderRadius: 20,
                                    paddingHorizontal: 15,
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: COLORS.infoDanger,
                                      fontSize: fontSizeResponsive(
                                        "H4",
                                        device
                                      ),
                                    }}
                                  >
                                    Belum Paraf
                                  </Text>
                                </View>
                              </View>
                              <View
                                style={{
                                  width: "100%",
                                  height: 2,
                                  backgroundColor: COLORS.ExtraDivinder,
                                  marginTop: 5,
                                }}
                              />
                            </>
                          ) : (
                            <>
                              <View
                                style={{
                                  flexDirection: "row",
                                  width: "60%",
                                  justifyContent: "flex-start",
                                  alignItems: "center",
                                  gap: 5,
                                  marginTop: 5,
                                }}
                              >
                                <View
                                  style={{
                                    backgroundColor: COLORS.success,
                                    borderRadius: 50,
                                    padding: 5,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <Ionicons
                                    name="checkmark-outline"
                                    color={COLORS.white}
                                    size={device === "tablet" ? 25 : 15}
                                  />
                                </View>
                                <View
                                  style={{
                                    backgroundColor: COLORS.successLight,
                                    paddingVertical: 5,
                                    borderRadius: 20,
                                    paddingHorizontal: 15,
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: COLORS.success,
                                      fontSize: fontSizeResponsive(
                                        "H4",
                                        device
                                      ),
                                    }}
                                  >
                                    Sudah Paraf
                                  </Text>
                                </View>
                              </View>
                              <View
                                style={{
                                  width: "100%",
                                  height: 2,
                                  backgroundColor: COLORS.ExtraDivinder,
                                  marginTop: 5,
                                }}
                              />
                            </>
                          )}
                        </View>
                      );
                    }
                  })}
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
