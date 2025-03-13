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

export const CollapseCardSIASNRwSkp = ({ profile, device, data }) => {
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
                    name="hourglass-outline"
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
                    SIASN RW SKP
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
                            Nilai Rata-Rata
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
                            {sk.nilairatarata == null ||
                            sk.nilairatarata.length == 0
                              ? "-"
                              : sk.nilairatarata}
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
                            Nilai SKP
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
                            {sk.nilaiSkp == null || sk.nilaiSkp.length == 0
                              ? "-"
                              : sk.nilaiSkp}
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
                            Orientasi Pelayanan
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
                            {sk.orientasiPelayanan == null ||
                            sk.orientasiPelayanan.length == 0
                              ? "-"
                              : sk.orientasiPelayanan}
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
                            Integritas
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
                            {sk.integritas == null || sk.integritas.length == 0
                              ? "-"
                              : sk.integritas}
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
                            Komitmen
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
                            {sk.komitmen == null || sk.komitmen.length == 0
                              ? "-"
                              : sk.komitmen}
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
                            Disiplin
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
                            {sk.disiplin == null || sk.disiplin.length == 0
                              ? "-"
                              : sk.disiplin}
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
                            Kerja Sama
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
                            {sk.kerjasama == null || sk.kerjasama.length == 0
                              ? "-"
                              : sk.kerjasama}
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
                            Nilai Perilaku Kerja
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
                            {sk.nilaiPerilakuKerja == null ||
                            sk.nilaiPerilakuKerja.length == 0
                              ? "-"
                              : sk.nilaiPerilakuKerja}
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
                            Nilai Prestasi Kerja
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
                            {sk.nilaiPrestasiKerja == null ||
                            sk.nilaiPrestasiKerja.length == 0
                              ? "-"
                              : sk.nilaiPrestasiKerja}
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
                            Kepemimpinan
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
                            {sk.kepemimpinan == null ||
                            sk.kepemimpinan.length == 0
                              ? "-"
                              : sk.kepemimpinan}
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
                            Jumlah
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
                            {sk.jumlah == null || sk.jumlah.length == 0
                              ? "-"
                              : sk.jumlah}
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
                            Atasan Penilai Nama
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
                            {sk.atasanPenilaiNama == null ||
                            sk.atasanPenilaiNama.length == 0
                              ? "-"
                              : sk.atasanPenilaiNama}
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
                            Konversi Nilai
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
                            {sk.konversiNilai == null ||
                            sk.konversiNilai.length == 0
                              ? "-"
                              : sk.konversiNilai}
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
                            Nilai Integrasi
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
                            {sk.nilaiIntegrasi == null ||
                            sk.nilaiIntegrasi.length == 0
                              ? "-"
                              : sk.nilaiIntegrasi}
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
                              {sk.penilaiNama == null ||
                              sk.penilaiNama.length == 0
                                ? "-"
                                : sk.penilaiNama}{" "}
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
                              style={[
                                {
                                  fontSize: fontSizeResponsive("H4", device),
                                },
                              ]}
                            >
                              {sk.penilaiNipNrp == null ||
                              sk.penilaiNipNrp.length == 0
                                ? sk.penilaiNonPns
                                : sk.penilaiNipNrp}
                            </Text>
                            <Text
                              style={[
                                {
                                  fontWeight: 500,
                                  fontSize: fontSizeResponsive("H4", device),
                                },
                              ]}
                            >
                              {sk.penilaiJabatan == null ||
                              sk.penilaiJabatan.length == 0
                                ? "-"
                                : sk.penilaiJabatan}
                            </Text>
                            <Text
                              style={[
                                {
                                  fontSize: fontSizeResponsive("H4", device),
                                },
                              ]}
                            >
                              {sk.penilaiUnorNama == null ||
                              sk.penilaiUnorNama.length == 0
                                ? "-"
                                : sk.penilaiUnorNama}
                            </Text>
                            <Text
                              style={[
                                {
                                  fontSize: fontSizeResponsive("H4", device),
                                },
                              ]}
                            >
                              {sk.penilaiGolongan == null ||
                              sk.penilaiGolongan.length == 0
                                ? "-"
                                : "Golongan " + sk.penilaiGolongan}
                            </Text>
                            <Text
                              style={[
                                {
                                  fontSize: fontSizeResponsive("H4", device),
                                },
                              ]}
                            >
                              TMT Golongan:{" "}
                              {sk.penilaiTmtGolongan == null ||
                              sk.penilaiTmtGolongan.length == 0
                                ? "-"
                                : sk.penilaiTmtGolongan}
                            </Text>
                          </View>
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
                            Atasan Penilai
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
                              style={[
                                {
                                  fontSize: fontSizeResponsive("H4", device),
                                },
                              ]}
                            >
                              {sk.atasanPenilaiNama == null ||
                              sk.atasanPenilaiNama.length == 0
                                ? "-"
                                : sk.atasanPenilaiNama}{" "}
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
                              {sk.statusAtasanPenilai == null ||
                              sk.statusAtasanPenilai.length == 0
                                ? "-"
                                : sk.statusAtasanPenilai}
                            </Text>
                            <Text
                              style={[
                                {
                                  fontSize: fontSizeResponsive("H4", device),
                                },
                              ]}
                            >
                              {sk.atasanPenilaiNipNrp == null ||
                              sk.atasanPenilaiNipNrp.length == 0
                                ? sk.atasanPenilaiNonPns
                                : sk.atasanPenilaiNipNrp}
                            </Text>
                            <Text
                              style={[
                                {
                                  fontWeight: 500,
                                  fontSize: fontSizeResponsive("H4", device),
                                },
                              ]}
                            >
                              {sk.atasanPenilaiJabatan == null ||
                              sk.atasanPenilaiJabatan.length == 0
                                ? "-"
                                : sk.atasanPenilaiJabatan}
                            </Text>
                            <Text
                              style={[
                                {
                                  fontSize: fontSizeResponsive("H4", device),
                                },
                              ]}
                            >
                              {sk.atasanPenilaiUnorNama == null ||
                              sk.atasanPenilaiUnorNama.length == 0
                                ? "-"
                                : sk.atasanPenilaiUnorNama}
                            </Text>
                            <Text
                              style={[
                                {
                                  fontSize: fontSizeResponsive("H4", device),
                                },
                              ]}
                            >
                              {sk.atasanPenilaiGolongan == null ||
                              sk.atasanPenilaiGolongan.length == 0
                                ? "-"
                                : "Golongan " + sk.atasanPenilaiGolongan}
                            </Text>
                            <Text
                              style={[
                                {
                                  fontSize: fontSizeResponsive("H4", device),
                                },
                              ]}
                            >
                              TMT Golongan:{" "}
                              {sk.atasanPenilaiTmtGolongan == null ||
                              sk.atasanPenilaiTmtGolongan.length == 0
                                ? "-"
                                : sk.atasanPenilaiTmtGolongan}
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
