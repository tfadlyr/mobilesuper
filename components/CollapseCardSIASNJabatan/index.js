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

export const CollapseCardSIASNJabatan = ({ profile, device, data }) => {
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
                  <Ionicons name="star" size={device === "tablet" ? 40 : 24} />
                  <Text
                    style={[
                      {
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H4", device),
                      },
                    ]}
                  >
                    SIASN Jabatan
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
                                Tanggal SK : {sk.tanggalSk ? sk.tanggalSk : "-"}
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
                            Jenis Jabatan
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
                            {sk.jenisJabatan == null ||
                            sk.jenisJabatan.length == 0
                              ? "-"
                              : sk.jenisJabatan}
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
                            Instansi Kerja
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
                            {sk.instansiKerjaNama == null ||
                            sk.instansiKerjaNama.length == 0
                              ? "-"
                              : sk.instansiKerjaNama}
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
                            Satuan Kerja
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
                            {sk.satuanKerjaNama == null ||
                            sk.satuanKerjaNama.length == 0
                              ? "-"
                              : sk.satuanKerjaNama}
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
                            Unor
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
                            {sk.unorNama == null || sk.unorNama.length == 0
                              ? "-"
                              : sk.unorNama}
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
                            Unor Induk
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
                            {sk.unorIndukNama == null ||
                            sk.unorIndukNama.length == 0
                              ? "-"
                              : sk.unorIndukNama}
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
                            Eselon
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
                            {sk.eselon == null || sk.eselon.length == 0
                              ? "-"
                              : sk.eselon}
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
                            Jabatan Fungsional
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
                            {sk.jabatanFungsionalNama == null ||
                            sk.jabatanFungsionalNama.length == 0
                              ? "-"
                              : sk.jabatanFungsionalNama}
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
                            Jabatan Fungsional Umum
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
                            {sk.jabatanFungsionalUmumNama == null ||
                            sk.jabatanFungsionalUmumNama.length == 0
                              ? "-"
                              : sk.jabatanFungsionalUmumNama}
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
                            TMT Jabatan
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
                            {sk.tmtJabatan == null || sk.tmtJabatan.length == 0
                              ? "-"
                              : sk.tmtJabatan}
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
                            Nama Unor
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
                            {sk.namaUnor == null || sk.namaUnor.length == 0
                              ? "-"
                              : sk.namaUnor}
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
                            Nama Jabatan
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
                            {sk.namaJabatan == null ||
                            sk.namaJabatan.length == 0
                              ? "-"
                              : sk.namaJabatan}
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
                            jenisPenugasanId
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
                            {sk.jenisPenugasanId == null ||
                            sk.jenisPenugasanId.length == 0
                              ? "-"
                              : sk.jenisPenugasanId}
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
                            jenisMutasiId
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
                            {sk.jenisMutasiId == null ||
                            sk.jenisMutasiId.length == 0
                              ? "-"
                              : sk.jenisMutasiId}
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
                            subJabatanId
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
                            {sk.subJabatanId == null ||
                            sk.subJabatanId.length == 0
                              ? "-"
                              : sk.subJabatanId}
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
                            tmtMutasi
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
                            {sk.tmtMutasi == null || sk.tmtMutasi.length == 0
                              ? "-"
                              : sk.tmtMutasi}
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
