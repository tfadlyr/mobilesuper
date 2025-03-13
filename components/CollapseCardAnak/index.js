import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from "accordion-collapse-react-native";
import { TouchableOpacity } from "react-native";
import {
  COLORS,
  FONTWEIGHT,
  fontSizeResponsive,
  spacing,
  shadow,
  DATETIME,
} from "../../config/SuperAppps";
import moment from "moment/min/moment-with-locales";

export const CollapseCardAnak = ({ profile, device, data }) => {
  const [collapse, setCollapse] = useState(false);
  const [collapseChild, setCollapseChild] = useState([]);
  useEffect(() => {
    function init() {
      const temp = [];
      profile?.listAnak?.map((e, i) => {
        temp[i] = false;
      });
      setCollapseChild(temp);
    }
    if (profile != undefined) init();
  }, []);
  function changeCollapseChild(index) {
    const temp = [...collapseChild];
    temp[index] = !temp[index];
    setCollapseChild(temp);
  }
  return (
    <View>
      <Collapse isExpanded={collapse}>
        <CollapseHeader>
          <TouchableOpacity onPress={() => setCollapse(!collapse)}>
            <View style={styles.card}>
              <View
                style={[
                  {
                    backgroundColor:
                      collapse === true
                        ? COLORS.secondaryLighter
                        : COLORS.white,
                    padding: spacing.default,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    borderBottomLeftRadius: collapse === true ? 0 : 8,
                    borderBottomRightRadius: collapse === true ? 0 : 8,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  },
                  shadow.cardShadow,
                ]}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: spacing.medium,
                  }}
                >
                  <Ionicons
                    name="heart-outline"
                    size={device === "tablet" ? 40 : 24}
                  />
                  <Text
                    style={[
                      {
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H4", device),
                      },
                    ]}
                  >
                    Anak
                  </Text>
                </View>
                <View
                  style={{
                    marginRight: spacing.default,
                  }}
                >
                  {collapse === true ? (
                    <Ionicons
                      name="chevron-up-outline"
                      size={device === "tablet" ? 40 : 20}
                    />
                  ) : (
                    <Ionicons
                      name="chevron-down-outline"
                      size={device === "tablet" ? 40 : 20}
                    />
                  )}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </CollapseHeader>
        {}
        <CollapseBody>
          {profile === null ||
          profile === undefined ||
          typeof profile === "string" ? (
            <View
              style={[
                { marginBottom: spacing.medium },
                styles.cardCollapse,
                shadow.cardShadow,
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: spacing.small,
                  marginBottom: spacing.medium,
                }}
              >
                <Text
                  style={[
                    {
                      fontSize: fontSizeResponsive("H4", device),
                    },
                  ]}
                >
                  Tidak Ada Data
                </Text>
              </View>
            </View>
          ) : (
            <View style={[styles.cardCollapse, shadow.cardShadow]}>
              {profile?.listAnak?.map((listAnak, i) => (
                <View key={i}>
                  <Collapse isExpanded={collapseChild[i]}>
                    <CollapseHeader>
                      <TouchableOpacity onPress={() => changeCollapseChild(i)}>
                        <View style={styles.card}>
                          <View
                            style={[
                              {
                                backgroundColor:
                                  collapseChild[i] === true
                                    ? COLORS.secondaryLighter
                                    : COLORS.white,
                                padding: spacing.default,
                                marginBottom:
                                  collapseChild[i] === true
                                    ? 0
                                    : spacing.default,
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                                borderBottomLeftRadius:
                                  collapseChild[i] === true ? 0 : 8,
                                borderBottomRightRadius:
                                  collapseChild[i] === true ? 0 : 8,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                              },
                              shadow.cardShadow,
                            ]}
                          >
                            <View
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                gap: spacing.medium,
                              }}
                            >
                              <Text
                                style={[
                                  {
                                    fontWeight: FONTWEIGHT.bold,
                                    fontSize: fontSizeResponsive("H4", device),
                                  },
                                ]}
                              >
                                Anak ke-{i + 1}
                              </Text>
                            </View>
                            <View
                              style={{
                                marginRight: spacing.default,
                              }}
                            >
                              {collapseChild[i] === true ? (
                                <Ionicons
                                  name="chevron-up-outline"
                                  size={device === "tablet" ? 40 : 20}
                                />
                              ) : (
                                <Ionicons
                                  name="chevron-down-outline"
                                  size={device === "tablet" ? 40 : 20}
                                />
                              )}
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </CollapseHeader>
                    {}
                    <CollapseBody>
                      <View
                        style={[
                          { marginBottom: spacing.medium },
                          styles.cardCollapse,
                          shadow.cardShadow,
                        ]}
                      >
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: spacing.small,
                            marginBottom: spacing.medium,
                          }}
                        >
                          <Text
                            style={[
                              {
                                flex: 4,
                                fontSize: fontSizeResponsive("H4", device),
                              },
                            ]}
                          >
                            Nama
                          </Text>
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            :
                          </Text>
                          <Text
                            style={[
                              {
                                flex: 5,
                                fontSize: fontSizeResponsive("H4", device),
                              },
                            ]}
                          >
                            {listAnak.nama == null || listAnak.nama.length == 0
                              ? "-"
                              : listAnak.nama}
                          </Text>
                        </View>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: spacing.small,
                            marginBottom: spacing.medium,
                          }}
                        >
                          <Text
                            style={[
                              {
                                flex: 4,
                                fontSize: fontSizeResponsive("H4", device),
                              },
                            ]}
                          >
                            Jenis Kelamin
                          </Text>
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            :
                          </Text>
                          <Text
                            style={[
                              {
                                flex: 5,
                                fontSize: fontSizeResponsive("H4", device),
                              },
                            ]}
                          >
                            {listAnak.jenisKelamin == null ||
                            listAnak.jenisKelamin?.length == 0
                              ? "-"
                              : listAnak.jenisKelamin == "M"
                              ? "Laki-laki"
                              : "Perempuan"}
                          </Text>
                        </View>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: spacing.small,
                            marginBottom: spacing.medium,
                          }}
                        >
                          <Text
                            style={[
                              {
                                flex: 4,
                                fontSize: fontSizeResponsive("H4", device),
                              },
                            ]}
                          >
                            Tempat Lahir
                          </Text>
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            :
                          </Text>
                          <Text
                            style={[
                              {
                                flex: 5,
                                fontSize: fontSizeResponsive("H4", device),
                              },
                            ]}
                          >
                            {listAnak.tempatLahir == null ||
                            listAnak.tempatLahir.length == 0
                              ? "-"
                              : listAnak.tempatLahir}
                          </Text>
                        </View>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            gap: spacing.small,
                            marginBottom: spacing.medium,
                          }}
                        >
                          <Text
                            style={[
                              {
                                flex: 4,
                                fontSize: fontSizeResponsive("H4", device),
                              },
                            ]}
                          >
                            Tanggal Lahir
                          </Text>
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            :
                          </Text>
                          <Text
                            style={[
                              {
                                flex: 5,
                                fontSize: fontSizeResponsive("H4", device),
                              },
                            ]}
                          >
                            {listAnak.tglLahir == null ||
                            listAnak.tglLahir?.length == 0
                              ? "-"
                              : moment(
                                  listAnak.tglLahir,
                                  DATETIME.SHORT_DATE
                                ).format(DATETIME.LONG_DATE)}
                          </Text>
                        </View>
                      </View>
                    </CollapseBody>
                  </Collapse>
                </View>
              ))}
            </View>
          )}
        </CollapseBody>
      </Collapse>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    width: "100%",
    paddingHorizontal: spacing.default,
  },
  cardCollapse: {
    backgroundColor: "#fff",
    marginHorizontal: spacing.default,
    padding: spacing.default,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});
