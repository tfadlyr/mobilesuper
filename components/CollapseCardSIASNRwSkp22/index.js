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
} from "../../config/SuperAppps";

export const CollapseCardSIASNRwSkp22 = ({ profile, device, data }) => {
  const [collapse, setCollapse] = useState(false);
  const [collapseChild, setCollapseChild] = useState([]);
  useEffect(() => {
    function init() {
      const temp = [];
      profile?.map((e, i) => {
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
                    name="hourglass"
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
                    SIASN RW SKP 22
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
              {profile.map((sk, i) => (
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
                                Tahun {sk.tahun ? sk.tahun : "-"}
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
                            Hasil Kinerja
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
                            {sk.hasilKinerja == null ||
                            sk.hasilKinerja.length == 0
                              ? "-"
                              : sk.hasilKinerja}
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
                            Nilai
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
                            {sk.hasilKinerjaNilai == null ||
                            sk.hasilKinerjaNilai.length == 0
                              ? "-"
                              : sk.hasilKinerjaNilai}
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
                            Kuadran Kinerja
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
                            {sk.kuadranKinerja == null ||
                            sk.kuadranKinerja.length == 0
                              ? "-"
                              : sk.kuadranKinerja}
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
                            Nilai
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
                            {sk.KuadranKinerjaNilai == null ||
                            sk.KuadranKinerjaNilai.length == 0
                              ? "-"
                              : sk.KuadranKinerjaNilai}
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
                            Perilaku Kerja
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
                            {sk.perilakuKerja == null ||
                            sk.perilakuKerja.length == 0
                              ? "-"
                              : sk.perilakuKerja}
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
                            Nilai
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
                            {sk.PerilakuKerjaNilai == null ||
                            sk.PerilakuKerjaNilai.length == 0
                              ? "-"
                              : sk.PerilakuKerjaNilai}
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
                            Penilai
                          </Text>
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            :
                          </Text>
                          <View style={{ flex: 5 }}>
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              {sk.namaPenilai == null ||
                              sk.namaPenilai.length == 0
                                ? "-"
                                : sk.namaPenilai}{" "}
                            </Text>
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                                alignSelf: "flex-start",
                                borderRadius: 20,
                                paddingHorizontal: 10,
                                backgroundColor: COLORS.lightBrown,
                              }}
                            >
                              {sk.statusPenilai == null ||
                              sk.statusPenilai.length == 0
                                ? "-"
                                : sk.statusPenilai}
                            </Text>
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              {sk.nipNrpPenilai == null ||
                              sk.nipNrpPenilai.length == 0
                                ? "-"
                                : sk.nipNrpPenilai}
                            </Text>
                            <Text
                              style={[
                                {
                                  fontSize: fontSizeResponsive("H4", device),
                                },
                              ]}
                            >
                              {sk.penilaiJabatanNm == null ||
                              sk.penilaiJabatanNm.length == 0
                                ? "-"
                                : sk.penilaiJabatanNm}
                            </Text>
                          </View>
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
