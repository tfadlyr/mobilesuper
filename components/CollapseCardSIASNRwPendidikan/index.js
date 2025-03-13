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

export const CollapseCardSIASNRwPendidikan = ({ profile, device, data }) => {
  const [collapse, setCollapse] = useState(false);
  const [collapseChild, setCollapseChild] = useState([]);
  useEffect(() => {
    function init() {
      const temp = [];
      profile.map((e, i) => {
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
                  {/* <Ionicons name="star" size={device === "tablet" ? 40 : 24} /> */}
                  <Text
                    style={[
                      {
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H4", device),
                      },
                    ]}
                  >
                    SIASN RW Pendidikan
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
                                Tanggal Kelulusan :{" "}
                                {sk.tahunLulus ? sk.tahunLulus : "-"}
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
                            NIP Baru
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
                            {sk.nipBaru == null || sk.nipBaru.length == 0
                              ? "-"
                              : sk.nipBaru}
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
                            NIP Lama
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
                            {sk.nipLama == null || sk.nipLama.length == 0
                              ? "-"
                              : sk.nipLama}
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
                            Pendidikan
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
                            {sk.pendidikanNama == null ||
                            sk.pendidikanNama.length == 0
                              ? "-"
                              : sk.pendidikanNama}
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
                            TK Pendidikan
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
                            {sk.tkPendidikanNama == null ||
                            sk.tkPendidikanNama.length == 0
                              ? "-"
                              : sk.tkPendidikanNama}
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
                            Tanggal Kelulusan
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
                            {sk.tglLulus == null || sk.tglLulus.length == 0
                              ? "-"
                              : sk.tglLulus}
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
                            Nomor Ijazah
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
                            {sk.nomorIjasah == null ||
                            sk.nomorIjasah.length == 0
                              ? "-"
                              : sk.nomorIjasah}
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
                            Nama Sekolah
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
                            {sk.namaSekolah == null ||
                            sk.namaSekolah.length == 0
                              ? "-"
                              : sk.namaSekolah}
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
                            Gelar Depan
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
                            {sk.gelarDepan == null || sk.gelarDepan.length == 0
                              ? "-"
                              : sk.gelarDepan}
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
                            Gelar Belakang
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
                            {sk.gelarBelakang == null ||
                            sk.gelarBelakang.length == 0
                              ? "-"
                              : sk.gelarBelakang}
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
