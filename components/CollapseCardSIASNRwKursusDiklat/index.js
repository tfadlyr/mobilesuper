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

export const CollapseCardSIASNRwKursusDiklat = ({ profile, device, data }) => {
  const [collapse, setCollapse] = useState(false);
  const [collapseChild1, setCollapseChild1] = useState([]);
  const [collapseChild2, setCollapseChild2] = useState([]);
  useEffect(() => {
    function initKursus() {
      const temp = [];
      profile?.siasn_rw_kursus?.map((e, i) => {
        temp[i] = false;
      });
      setCollapseChild1(temp);
    }
    if (profile?.siasn_rw_kursus != null) initKursus();
    function initDiklat() {
      const temp = [];
      profile?.siasn_rw_diklat?.map((e, i) => {
        temp[i] = false;
      });
      setCollapseChild2(temp);
    }
    if (profile?.siasn_rw_diklat != null) initDiklat();
  }, []);
  function changeCollapseChild1(index) {
    const temp = [...collapseChild1];
    temp[index] = !temp[index];
    setCollapseChild1(temp);
  }
  function changeCollapseChild2(index) {
    const temp = [...collapseChild2];
    temp[index] = !temp[index];
    setCollapseChild2(temp);
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
                    RW Kursus & RW Diklat
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
          <View style={[styles.cardCollapse, shadow.cardShadow]}>
            {profile === null ||
            profile === undefined ||
            typeof profile === "string" ? (
              <View>
                <Text
                  style={{
                    padding: spacing.medium,
                    fontWeight: 600,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Data RW Diklat
                </Text>
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
              <View>
                <Text
                  style={{
                    padding: spacing.medium,
                    fontWeight: 600,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Data RW Diklat
                </Text>
                {profile?.siasn_rw_diklat?.map((sk, i) => (
                  <View key={i}>
                    <Collapse isExpanded={collapseChild2[i]}>
                      <CollapseHeader>
                        <TouchableOpacity
                          onPress={() => changeCollapseChild2(i)}
                        >
                          <View style={styles.card}>
                            <View
                              style={[
                                {
                                  backgroundColor:
                                    collapseChild2[i] === true
                                      ? COLORS.secondaryLighter
                                      : COLORS.white,
                                  padding: spacing.default,
                                  marginBottom:
                                    collapseChild2[i] === true
                                      ? 0
                                      : spacing.default,
                                  borderTopLeftRadius: 8,
                                  borderTopRightRadius: 8,
                                  borderBottomLeftRadius:
                                    collapseChild2[i] === true ? 0 : 8,
                                  borderBottomRightRadius:
                                    collapseChild2[i] === true ? 0 : 8,
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
                                  flex: 1,
                                  flexDirection: "row",
                                  alignItems: "center",
                                  gap: spacing.medium,
                                }}
                              >
                                <Text
                                  style={[
                                    {
                                      fontWeight: FONTWEIGHT.bold,
                                      fontSize: fontSizeResponsive(
                                        "H4",
                                        device
                                      ),
                                    },
                                  ]}
                                >
                                  {sk.latihanStrukturalNama == null ||
                                  sk.latihanStrukturalNama.length == 0
                                    ? "-"
                                    : sk.latihanStrukturalNama}
                                </Text>
                              </View>
                              <View
                                style={{
                                  marginRight: spacing.default,
                                }}
                              >
                                {collapseChild2[i] === true ? (
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
                              Latihan Struktural
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
                              {sk.latihanStrukturalNama == null ||
                              sk.latihanStrukturalNama.length == 0
                                ? "-"
                                : sk.latihanStrukturalNama}
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
                              Nomor
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
                              {sk.nomor == null || sk.nomor.length == 0
                                ? "-"
                                : sk.nomor}
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
                              Tahun
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
                              {sk.tahun == null || sk.tahun.length == 0
                                ? "-"
                                : sk.tahun}
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
                              {sk.tanggalSelesai == null ||
                              sk.tanggalSelesai.length == 0
                                ? "-"
                                : sk.tanggalSelesai}
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
                              Institusi Penyelenggara
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
                              {sk.institusiPenyelenggara == null ||
                              sk.institusiPenyelenggara.length == 0
                                ? "-"
                                : sk.institusiPenyelenggara}
                            </Text>
                          </View>
                        </View>
                      </CollapseBody>
                    </Collapse>
                  </View>
                ))}
              </View>
            )}
            {profile?.siasn_rw_kursus == null ? (
              <View>
                <Text
                  style={{
                    padding: spacing.medium,
                    fontWeight: 600,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Data RW Kursus
                </Text>
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
              <View>
                <Text
                  style={{
                    padding: spacing.medium,
                    fontWeight: 600,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Data RW Kursus
                </Text>
                {profile?.siasn_rw_kursus?.map((sk, i) => (
                  <View key={i}>
                    <Collapse isExpanded={collapseChild1[i]}>
                      <CollapseHeader>
                        <TouchableOpacity
                          onPress={() => changeCollapseChild1(i)}
                        >
                          <View style={styles.card}>
                            <View
                              style={[
                                {
                                  backgroundColor:
                                    collapseChild1[i] === true
                                      ? COLORS.secondaryLighter
                                      : COLORS.white,
                                  padding: spacing.default,
                                  marginBottom:
                                    collapseChild1[i] === true
                                      ? 0
                                      : spacing.default,
                                  borderTopLeftRadius: 8,
                                  borderTopRightRadius: 8,
                                  borderBottomLeftRadius:
                                    collapseChild1[i] === true ? 0 : 8,
                                  borderBottomRightRadius:
                                    collapseChild1[i] === true ? 0 : 8,
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
                                  flex: 1,
                                  flexDirection: "row",
                                  alignItems: "center",
                                  gap: spacing.medium,
                                }}
                              >
                                <Text
                                  style={[
                                    {
                                      fontWeight: FONTWEIGHT.bold,
                                      fontSize: fontSizeResponsive(
                                        "H4",
                                        device
                                      ),
                                    },
                                  ]}
                                >
                                  {sk.namaKursus ? sk.namaKursus : "-"}
                                </Text>
                              </View>
                              <View
                                style={{
                                  marginRight: spacing.default,
                                }}
                              >
                                {collapseChild1[i] === true ? (
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
                              Jenis Kursus
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
                              {sk.jenisKursusNama == null ||
                              sk.jenisKursusNama.length == 0
                                ? "-"
                                : sk.jenisKursusNama}
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
                              Jenis Kursus Sertifikat
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
                              {sk.jenisKursusSertifikatNama == null ||
                              sk.jenisKursusSertifikatNama.length == 0
                                ? "-"
                                : sk.jenisKursusSertifikatNama}
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
                              Institusi Penyelenggara
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
                              {sk.institusiPenyelenggara == null ||
                              sk.institusiPenyelenggara.length == 0
                                ? "-"
                                : sk.institusiPenyelenggara}
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
                              Jumlah Jam
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
                              {sk.jumlahJam == null || sk.jumlahJam.length == 0
                                ? "-"
                                : sk.jumlahJam}
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
                              No. Sertifikat
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
                              {sk.noSertipikat == null ||
                              sk.noSertipikat.length == 0
                                ? "-"
                                : sk.noSertipikat}
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
                              Tahun
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
                              {sk.tahunKursus == null ||
                              sk.tahunKursus.length == 0
                                ? "-"
                                : sk.tahunKursus}
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
                              Tanggal Kursus
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
                              {sk.tanggalKursus == null ||
                              sk.tanggalKursus.length == 0
                                ? "-"
                                : sk.tanggalKursus}
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
                              {sk.tanggalSelesaiKursus == null ||
                              sk.tanggalSelesaiKursus.length == 0
                                ? "-"
                                : sk.tanggalSelesaiKursus}
                            </Text>
                          </View>
                        </View>
                      </CollapseBody>
                    </Collapse>
                  </View>
                ))}
              </View>
            )}
          </View>
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
