import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
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

export const CollapseCardMasaKerja = ({ profile, device, data }) => {
  const [collapse, setCollapse] = useState(false);
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
                    name="person-circle-outline"
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
                    Masa kerja
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
                                Masa Kerja{" "}
                                {sk.tanggalAwal ? sk.tanggalAwal : "-"} s.d.{" "}
                                {sk.tanggalAkhir ? sk.tanggalAkhir : "-"}
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
                            Pengalaman
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
                            {sk.pengalaman == null || sk.pengalaman.length == 0
                              ? "-"
                              : sk.pengalaman}
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
                            Tanggal Awal
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
                            {sk.tanggalAwal == null ||
                            sk.tanggalAwal.length == 0
                              ? "-"
                              : sk.tanggalAwal}
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
                            Tanggal Selesai
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
                            {sk.tanggalAkhir == null ||
                            sk.tanggalAkhir.length == 0
                              ? "-"
                              : sk.tanggalAkhir}
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
                            Nomor SK
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
                            {sk.nomorSk == null || sk.nomorSk.length == 0
                              ? "-"
                              : sk.nomorSk}
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
                            Tanggal SK
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
                            {sk.tanggalSk == null || sk.tanggalSk.length == 0
                              ? "-"
                              : sk.tanggalSk}
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
                            Nomor BKN
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
                            {sk.nomorBkn == null || sk.nomorBkn.length == 0
                              ? "-"
                              : sk.nomorBkn}
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
                            Tanggal BKN
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
                            {sk.tanggalBkn == null || sk.tanggalBkn.length == 0
                              ? "-"
                              : sk.tanggalBkn}
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
                            Masa Kerja Tahun
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
                            {sk.tasaKerjaTahun == null ||
                            sk.tasaKerjaTahun.length == 0
                              ? "0"
                              : sk.tasaKerjaTahun}
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
                            Masa Kerja Bulan
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
                            {sk.tasaKerjaBulan == null ||
                            sk.tasaKerjaBulan.length == 0
                              ? "0"
                              : sk.tasaKerjaBulan}
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
                            Dinilai
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
                            {sk.dinilai == null || sk.dinilai.length == 0
                              ? "-"
                              : sk.dinilai}
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
