import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  COLORS,
  fontSizeResponsive,
  FONTWEIGHT,
  getOrientation,
  shadow,
  spacing,
} from "../../config/SuperAppps";
import { TouchableOpacity } from "react-native";
import {
  Collapse,
  CollapseBody,
  CollapseHeader,
} from "accordion-collapse-react-native";
import { useSelector } from "react-redux";
import {
  kategoriPerizinan,
  listParaf,
} from "../../Apps/DigitalSignature/dataDokPerizinan";

export const CollapsePKRLSignIn = ({
  profile,
  device,
  counter,
  filterHandlerInProgress,
  filterDirektorat,
  variant,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("Need Sign");
  const [modal, setModal] = useState(false);

  // Data default yang ingin ditampilkan jika counter.data kosong
  const defaultData = [
    {
      need_sign: 0,
      label: "Direktorat KEBP - Konservasi Ekosistem dan Biota Perairan",
    },
    { need_sign: 0, label: "Direktorat Jaskel - Jasa Kelautan" },
    {
      need_sign: 0,
      label: "Direktorat Pendayagunaan Pesisir dan Pulau-Pulau Kecil",
    },
    { need_sign: 0, label: "Direktorat PRL" },
  ];
  let filteredApiData = defaultData.map((item) => ({
    ...item,
    need_sign: counter?.data?.[item.label]?.need_sign ?? item.need_sign,
  }));

  const jenisPerizinan = [
    {
      label: "Direktorat KEBP - Konservasi Ekosistem dan Biota Perairan",
      alias: "Direktorat KEBP",
      group: 1,
    },
    {
      label: "Direktorat Jaskel - Jasa Kelautan",
      alias: "Direktorat Jaskel",
      group: 2,
    },
    {
      label: "Direktorat Pendayagunaan Pesisir dan Pulau-Pulau Kecil",
      alias: "Direktorat P4K",
      group: 3,
    },
    {
      label: "Direktorat PRL",
      alias: "Direktorat PRL",
      group: 4,
    },
  ];

  const getCountDashboard = (type) => {
    let count = 0;

    if (counter?.data !== undefined) {
      Object.keys(counter?.data).forEach((element) => {
        if (counter?.data[element][type] !== undefined) {
          count = count + counter?.data[element][type];
        }
      });
    }

    return count;
  };

  const handleGetDataByDirektorat = (type) => {
    let dataDashboard = {};
    jenisPerizinan?.map((x) => (dataDashboard[x.label] = 0));

    if (counter?.data !== undefined) {
      const listDirektorat = [];
      const jabatanUser =
        counter?.data !== undefined
          ? counter?.data?.direktorat_user?.toLowerCase()
          : "";
      const kp = listParaf?.filter(
        (x) => x.title.toLowerCase() === jabatanUser
      )[0];

      if (kp) {
        kp?.group?.map((x) => {
          const group = kategoriPerizinan?.filter((y) => y.key === x)[0][
            "group"
          ];
          const jp = jenisPerizinan?.filter((z) => z.group === group)[0];

          if (!listDirektorat?.some((x) => x === jp.label)) {
            listDirektorat?.push(jp.label);
          }
        });
      } else if (
        jabatanUser === "menteri kelautan dan perikanan" ||
        jabatanUser !== undefined
      ) {
        jenisPerizinan?.map((x) => listDirektorat?.push(x.label));
      }

      Object.keys(dataDashboard)?.forEach((element) => {
        if (
          counter?.data[element] !== undefined &&
          counter?.data[element][type] !== undefined &&
          listDirektorat?.some((x) => x === element)
        ) {
          dataDashboard[element] = counter?.data[element][type];
        }
      });
    }

    return dataDashboard;
  };

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  const totalInprogress =
    counter?.data?.pkrl !== undefined
      ? Object?.values?.(counter?.data?.pkrl).reduce(
          (sum, item) => sum + item?.total_in_progress,
          0
        )
      : 0;

  let filteredApiDataMonitoring = defaultData.map((item) => ({
    ...item,
    need_sign:
      counter?.data?.pkrl?.[item.label]?.total_in_progress ?? item.need_sign,
  }));

  return (
    <>
      <TouchableOpacity
        onPress={() => setModal(true)}
        // disabled={variant === "monitoring" ? true : false}
      >
        <View style={styles.card}>
          {device === "tablet" && orientation === "landscape" ? (
            <View
              style={[
                {
                  backgroundColor:
                    isOpen === true ? COLORS.secondaryLighter : COLORS.white,
                  padding: 10,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  borderBottomLeftRadius: isOpen === true ? 0 : 8,
                  borderBottomRightRadius: isOpen === true ? 0 : 8,
                  //   flexDirection: "row",
                  alignItems: "center",
                  //   justifyContent: "space-between",
                },
                shadow.cardShadow,
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center", // Pastikan elemen sejajar secara vertikal
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    padding: 5,
                    backgroundColor: COLORS.infoDangerLight,
                    borderRadius: 50,
                  }}
                >
                  <MaterialCommunityIcons
                    name={"file-alert-outline"}
                    size={device === "tablet" ? 40 : 30}
                    color={COLORS.infoDanger}
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                    marginLeft: 10,
                    justifyContent: "center", // Tambahkan ini untuk memastikan konten vertikal sejajar
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H1", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Need Sign
                  </Text>
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: fontSizeResponsive("H5", device),
                      color: COLORS.grey,
                      fontWeight: FONTWEIGHT.bold,
                      letterSpacing: -1, // Sesuaikan nilai
                    }}
                  >
                    Dokumen Belum Ditandatangani
                  </Text>
                </View>

                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center", // Tambahkan untuk sejajar vertikal
                  }}
                >
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      fontSize: 40,
                    }}
                  >
                    {/* {getCountDashboard("need_sign")} */}
                    {variant !== "monitoring"
                      ? counter?.data?.need_sign
                      : counter?.data?.pkrl?.total_in_progress ?? 0}
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      color: COLORS.grey,
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Dokumen
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View
              style={{
                backgroundColor: isOpen
                  ? COLORS.secondaryLighter
                  : COLORS.bgLightGrey,
                borderRadius: 8,
                //shadow ios
                shadowOffset: { width: -2, height: 4 },
                shadowColor: "#171717",
                shadowOpacity: 0.2,
                //shadow android
                elevation: 2,
                justifyContent: "center",
                padding: 5,
              }}
            >
              <Text
                style={{
                  // marginTop: 10,
                  fontSize: fontSizeResponsive("H4", device),
                  fontWeight: FONTWEIGHT.bold,
                  width: "100%",
                  textAlign: "left",
                }}
              >
                Need Sign
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <View
                  style={{
                    padding: 5,
                    backgroundColor: COLORS.infoDangerLight,
                    borderRadius: 50,
                  }}
                >
                  <MaterialCommunityIcons
                    name={"file-alert-outline"}
                    size={device === "tablet" ? 40 : 30}
                    color={COLORS.infoDanger}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontWeight: FONTWEIGHT.bold,
                      // fontSize: fontSizeResponsive("H1", device),
                      fontSize: 40,
                    }}
                  >
                    {variant !== "monitoring"
                      ? counter?.data?.need_sign
                      : counter?.data?.pkrl?.total_in_progress ?? 0}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  marginTop: 5,
                  fontSize: fontSizeResponsive("H5", device),
                  color: COLORS.grey,
                  fontWeight: FONTWEIGHT.bold,
                  letterSpacing: -1, // Sesuaikan nilai
                }}
              >
                Dokumen Belum Ditandatangani
              </Text>
            </View>
          )}
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
                marginTop: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 5,
                borderBottomWidth: 2,
                borderBottomColor: COLORS.grey,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Filter Direkorat
              </Text>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  setModal(false);
                }}
              >
                <Ionicons
                  name="close-outline"
                  size={device === "tablet" ? 40 : 24}
                  color={COLORS.lighter}
                />
              </TouchableOpacity>
            </View>

            {/* <View style={{ marginVertical: 10 }}>
              {jenisPerizinan?.map((item) => {
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor:
                        filterDirektorat === item.label
                          ? COLORS.ExtraDivinder
                          : null,
                      padding: 5,
                      borderRadius: 5,
                      marginHorizontal: device === "tablet" ? "2%" : "5%",
                    }}
                    onPress={() => {
                      setModal(false);
                      setTimeout(() => {
                        filterHandlerInProgress(item.label);
                      }, 1000);
                    }}
                  >
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H5", device),
                        width: "84%",
                      }}
                    >
                      {item?.label}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        gap: 5,
                        flex: 1,
                      }}
                    >
                      <View
                        style={{
                          height: device === "tablet" ? 20 : 10,
                          width: device === "tablet" ? 20 : 10,
                          borderRadius: 10,
                          backgroundColor: COLORS.infoDanger,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: device === "tablet" ? 30 : 15,
                          fontWeight: FONTWEIGHT.bold,
                        }}
                      >
                        {handleGetDataByDirektorat("need_sign")[item.label] ??
                          0}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View> */}
            {variant !== "monitoring" ? (
              filteredApiData.length !== 0 ? (
                <View style={{ marginVertical: 10 }}>
                  {filteredApiData?.map((item) => {
                    return (
                      <TouchableOpacity
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor:
                            filterDirektorat === item.label
                              ? COLORS.ExtraDivinder
                              : null,
                          padding: 5,
                          borderRadius: 5,
                          marginHorizontal: device === "tablet" ? "2%" : "5%",
                        }}
                        onPress={() => {
                          setModal(false);
                          setTimeout(() => {
                            filterHandlerInProgress(item.label);
                          }, 1000);
                        }}
                      >
                        <Text
                          style={{
                            fontSize: fontSizeResponsive("H5", device),
                            width: "84%",
                          }}
                        >
                          {item?.label}
                        </Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: 5,
                            flex: 1,
                          }}
                        >
                          <View
                            style={{
                              height: device === "tablet" ? 20 : 10,
                              width: device === "tablet" ? 20 : 10,
                              borderRadius: 10,
                              backgroundColor: COLORS.infoDanger,
                            }}
                          />
                          <Text
                            style={{
                              fontSize: device === "tablet" ? 30 : 15,
                              fontWeight: FONTWEIGHT.bold,
                            }}
                          >
                            {item.need_sign}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <ListEmpty />
              )
            ) : filteredApiDataMonitoring.length !== 0 ? (
              <View style={{ marginVertical: 10 }}>
                {filteredApiDataMonitoring?.map((item) => {
                  return (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor:
                          filterDirektorat === item.label
                            ? COLORS.ExtraDivinder
                            : null,
                        padding: 5,
                        borderRadius: 5,
                        marginHorizontal: device === "tablet" ? "2%" : "5%",
                      }}
                      onPress={() => {
                        setModal(false);
                        setTimeout(() => {
                          filterHandlerInProgress(item.label);
                        }, 1000);
                      }}
                    >
                      <Text
                        style={{
                          fontSize: fontSizeResponsive("H5", device),
                          width: "84%",
                        }}
                      >
                        {item?.label}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "flex-start",
                          alignItems: "center",
                          gap: 5,
                          flex: 1,
                        }}
                      >
                        <View
                          style={{
                            height: device === "tablet" ? 20 : 10,
                            width: device === "tablet" ? 20 : 10,
                            borderRadius: 10,
                            backgroundColor: COLORS.infoDanger,
                          }}
                        />
                        <Text
                          style={{
                            fontSize: device === "tablet" ? 30 : 15,
                            fontWeight: FONTWEIGHT.bold,
                          }}
                        >
                          {item.need_sign}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <ListEmpty />
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    width: "100%",
  },
  cardCollapse: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
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
