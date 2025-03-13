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

export const CollapseCardSIASNDataUtama = ({ profile, device, data }) => {
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
                    name="id-card-outline"
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
                    SIASN Data Utama
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
                  {profile.nipBaru == null || profile.nipBaru.length == 0
                    ? "-"
                    : profile.nipBaru}
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
                  {profile.nipLama == null || profile.nipLama.length == 0
                    ? "-"
                    : profile.nipLama}
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
                  Nama
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  :
                </Text>
                <View
                  style={{
                    flex: 5,
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                  }}
                >
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {profile.nama == null || profile.nama.length == 0
                      ? "-"
                      : profile.nama}
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
                  {profile.gelarDepan == null || profile.gelarDepan.length == 0
                    ? "-"
                    : profile.gelarDepan}
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
                  {profile.gelarBelakang == null ||
                  profile.gelarBelakang.length == 0
                    ? "-"
                    : profile.gelarBelakang}
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
                  {profile.tempatLahir == null ||
                  profile.tempatLahir.length == 0
                    ? "-"
                    : profile.tempatLahir}
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
                  {profile.tglLahir == null || profile.tglLahir.length == 0
                    ? "-"
                    : profile.tglLahir}
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
                  Agama
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
                  {profile.agama == null || profile.agama.length == 0
                    ? "-"
                    : profile.agama}
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
                  Email
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
                  {profile.email == null || profile.email.length == 0
                    ? "-"
                    : profile.email}
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
                  NIK
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
                  {profile.nik == null || profile.nik.length == 0
                    ? "-"
                    : profile.nik}
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
                  Alamat
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
                  {profile.alamat == null || profile.alamat.length == 0
                    ? "-"
                    : profile.alamat}
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
                  No. HP
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
                  {profile.noHp == null || profile.noHp.length == 0
                    ? "-"
                    : profile.noHp}
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
                  No. Telepon
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
                  {profile.noTelp == null || profile.noTelp.length == 0
                    ? "-"
                    : profile.noTelp}
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
                  Jenis Pegawai
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
                  {profile.jenisPegawaiNama == null ||
                  profile.jenisPegawaiNama.length == 0
                    ? "-"
                    : profile.jenisPegawaiNama}
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
                  Kedudukan
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
                  {profile.kedudukanPnsNama == null ||
                  profile.kedudukanPnsNama.length == 0
                    ? "-"
                    : profile.kedudukanPnsNama}
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
                  Status Pegawai
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
                  {profile.statusPegawai == null ||
                  profile.statusPegawai.length == 0
                    ? "-"
                    : profile.statusPegawai}
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
                  {profile.jenisKelamin == null ||
                  profile.jenisKelamin.length == 0
                    ? "-"
                    : profile.jenisKelamin == "F"
                    ? "Perempuan"
                    : "Laki-laki"}
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
                  No Seri Karpeg
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
                  {profile.noSeriKarpeg == null ||
                  profile.noSeriKarpeg.length == 0
                    ? "-"
                    : profile.noSeriKarpeg}
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
                  Pendidikan Terakhir
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
                  {profile.pendidikanTerakhirNama == null ||
                  profile.pendidikanTerakhirNama.length == 0
                    ? "-"
                    : profile.pendidikanTerakhirNama}
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
                  Tahun Lulus
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
                  {profile.tahunLulus == null || profile.tahunLulus.length == 0
                    ? "-"
                    : profile.tahunLulus}
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
                  Tanggal SK PNS
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
                  {profile.tglSkPns == null || profile.tglSkPns.length == 0
                    ? "-"
                    : profile.tglSkPns}
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
                  Tanggal SK CPNS
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
                  {profile.tglSkCpns == null || profile.tglSkCpns.length == 0
                    ? "-"
                    : profile.tglSkCpns}
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
                  Instansi Induk
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
                  {profile.instansiIndukNama == null ||
                  profile.instansiIndukNama.length == 0
                    ? "-"
                    : profile.instansiIndukNama}
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
                  Satuan Kerja Induk
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
                  {profile.satuanKerjaIndukNama == null ||
                  profile.satuanKerjaIndukNama.length == 0
                    ? "-"
                    : profile.satuanKerjaIndukNama}
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
                  Kanreg Nama
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
                  {profile.kanregNama == null || profile.kanregNama.length == 0
                    ? "-"
                    : profile.kanregNama}
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
                  Instansi Kerja Nama
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
                  {profile.instansiKerjaNama == null ||
                  profile.instansiKerjaNama.length == 0
                    ? "-"
                    : profile.instansiKerjaNama}
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
                  {profile.satuanKerjaKerjaNama == null ||
                  profile.satuanKerjaKerjaNama.length == 0
                    ? "-"
                    : profile.satuanKerjaKerjaNama}
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
                  Unor Nama
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
                  {profile.unorNama == null || profile.unorNama.length == 0
                    ? "-"
                    : profile.unorNama}
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
                  Unor Induk Nama
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
                  {profile.unorIndukNama == null ||
                  profile.unorIndukNama.length == 0
                    ? "-"
                    : profile.unorIndukNama}
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
                  {profile.jenisJabatan == null ||
                  profile.jenisJabatan.length == 0
                    ? "-"
                    : profile.jenisJabatan}
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
                  Jabatan
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
                  {profile.jabatanNama == null ||
                  profile.jabatanNama.length == 0
                    ? "-"
                    : profile.jabatanNama}
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
                  Jabatan Struktural
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
                  {profile.jabatanStrukturalNama == null ||
                  profile.jabatanStrukturalNama.length == 0
                    ? "-"
                    : profile.jabatanStrukturalNama}
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
                  {profile.jabatanFungsionalNama == null ||
                  profile.jabatanFungsionalNama.length == 0
                    ? "-"
                    : profile.jabatanFungsionalNama}
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
                  {profile.jabatanFungsionalUmumNama == null ||
                  profile.jabatanFungsionalUmumNama.length == 0
                    ? "-"
                    : profile.jabatanFungsionalUmumNama}
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
                  Lokasi Kerja
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
                  {profile.lokasiKerja == null ||
                  profile.lokasiKerja.length == 0
                    ? "-"
                    : profile.lokasiKerja}
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
                  Golongan Ruang Awal
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
                  {profile.golRuangAwal == null ||
                  profile.golRuangAwal.length == 0
                    ? "-"
                    : profile.golRuangAwal}
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
                  Golongan Ruang Akhir
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
                  {profile.golRuangAkhir == null ||
                  profile.golRuangAkhir.length == 0
                    ? "-"
                    : profile.golRuangAkhir}
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
                  Masa Kerja
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
                  {profile.masaKerja == null || profile.masaKerja.length == 0
                    ? "-"
                    : profile.masaKerja}
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
                  {profile.eselon == null || profile.eselon.length == 0
                    ? "-"
                    : profile.eselon}
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
                  Eselon Level
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
                  {profile.eselonLevel == null ||
                  profile.eselonLevel.length == 0
                    ? "-"
                    : profile.eselonLevel}
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
                  Gaji Pokok
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
                  ******
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
                  KPKN
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
                  {profile.kpknNama == null || profile.kpknNama.length == 0
                    ? "-"
                    : profile.kpknNama}
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
                  KTUA
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
                  {profile.ktuaNama == null || profile.ktuaNama.length == 0
                    ? "-"
                    : profile.ktuaNama}
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
                  Taspen
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
                  {profile.taspenNama == null || profile.taspenNama.length == 0
                    ? "-"
                    : profile.taspenNama}
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
                  Status Perkawinan
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
                  {profile.statusPerkawinan == null ||
                  profile.statusPerkawinan.length == 0
                    ? "-"
                    : profile.statusPerkawinan}
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
                  Tanggal Surat Keterangan Dokter
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
                  {profile.tglSuratKeteranganDokter == null ||
                  profile.tglSuratKeteranganDokter.length == 0
                    ? "-"
                    : profile.tglSuratKeteranganDokter}
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
                  No Surat Keterangan Dokter
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
                  {profile.noSuratKeteranganDokter == null ||
                  profile.noSuratKeteranganDokter.length == 0
                    ? "-"
                    : profile.noSuratKeteranganDokter}
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
                  Jumlah Anak
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
                  {profile.jumlahAnak == null || profile.jumlahAnak.length == 0
                    ? "-"
                    : profile.jumlahAnak}
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
                  No Surat Keterangan Bebas Narkoba
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
                  {profile.noSuratKeteranganBebasNarkoba == null ||
                  profile.noSuratKeteranganBebasNarkoba.length == 0
                    ? "-"
                    : profile.noSuratKeteranganBebasNarkoba}
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
                  SKCK
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
                  {profile.skck == null || profile.skck.length == 0
                    ? "-"
                    : profile.skck}
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
                  Tanggal SKCK
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
                  {profile.tglSkck == null || profile.tglSkck.length == 0
                    ? "-"
                    : profile.tglSkck}
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
                  Akte Kelahiran
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
                  {profile.akteKelahiran == null ||
                  profile.akteKelahiran.length == 0
                    ? "-"
                    : profile.akteKelahiran}
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
                  No NPWP
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
                  {profile.noNpwp == null || profile.noNpwp.length == 0
                    ? "-"
                    : profile.noNpwp}
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
                  Tanggal NPWP
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
                  {profile.tglNpwp == null || profile.tglNpwp.length == 0
                    ? "-"
                    : profile.tglNpwp}
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
                  No Askes
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
                  {profile.noAskes == null || profile.noAskes.length == 0
                    ? "-"
                    : profile.noAskes}
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
                  BPJS
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
                  {profile.bpjs == null || profile.bpjs.length == 0
                    ? "-"
                    : profile.bpjs}
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
                  Kode Pos
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
                  {profile.kodePos == null || profile.kodePos.length == 0
                    ? "-"
                    : profile.kodePos}
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
                  NO SPMT
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
                  {profile.noSpmt == null || profile.noSpmt.length == 0
                    ? "-"
                    : profile.noSpmt}
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
                  No Taspen
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
                  {profile.noTaspen == null || profile.noTaspen.length == 0
                    ? "-"
                    : profile.noTaspen}
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
                  Bahasa
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
                  {profile.bahasa == null || profile.bahasa.length == 0
                    ? "-"
                    : profile.bahasa}
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
                  KPPN Nama
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
                  {profile.kppnNama == null || profile.kppnNama.length == 0
                    ? "-"
                    : profile.kppnNama}
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
                  Pangkat Akhir
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
                  {profile.pangkatAkhir == null ||
                  profile.pangkatAkhir.length == 0
                    ? "-"
                    : profile.pangkatAkhir}
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
                  Tanggal STTPL
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
                  {profile.tglSttpl == null || profile.tglSttpl.length == 0
                    ? "-"
                    : profile.tglSttpl}
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
                  Nomor STTPL
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
                  {profile.nomorSttpl == null || profile.nomorSttpl.length == 0
                    ? "-"
                    : profile.nomorSttpl}
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
                  No SK CPNS
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
                  {profile.nomorSkCpns == null ||
                  profile.nomorSkCpns.length == 0
                    ? "-"
                    : profile.nomorSkCpns}
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
                  No SK PNS
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
                  {profile.nomorSkPns == null || profile.nomorSkPns.length == 0
                    ? "-"
                    : profile.nomorSkPns}
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
                  {profile.jenjang == null || profile.jenjang.length == 0
                    ? "-"
                    : profile.jenjang}
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
                  {profile.jenjang == null || profile.jenjang.length == 0
                    ? "-"
                    : profile.jenjang}
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
                  Jabatan ASN
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
                  {profile.jabatanAsn == null || profile.jabatanAsn.length == 0
                    ? "-"
                    : profile.jabatanAsn}
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
                  Kartu ASN
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
                  {profile.kartuAsn == null || profile.kartuAsn.length == 0
                    ? "-"
                    : profile.kartuAsn}
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
                  pangkatAwal
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
                  {profile.pangkatAwal == null ||
                  profile.pangkatAwal.length == 0
                    ? "-"
                    : profile.pangkatAwal}
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
                  asnJenjangJabatan
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
                  {profile.asnJenjangJabatan == null ||
                  profile.asnJenjangJabatan.length == 0
                    ? "-"
                    : profile.asnJenjangJabatan}
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
                  levelJabatan
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
                  {profile.levelJabatan == null ||
                  profile.levelJabatan.length == 0
                    ? "-"
                    : profile.levelJabatan}
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
                  tanggal_taspen
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
                  {profile.tanggal_taspen == null ||
                  profile.tanggal_taspen.length == 0
                    ? "-"
                    : profile.tanggal_taspen}
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
                  tabrum2
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
                  {profile.tabrum2 == null || profile.tabrum2.length == 0
                    ? "-"
                    : profile.tabrum2}
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
                  kelas_jabatan
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
                  {profile.kelas_jabatan == null ||
                  profile.kelas_jabatan.length == 0
                    ? "-"
                    : profile.kelas_jabatan}
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
                  karis_karsu
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
                  {profile.karis_karsu == null ||
                  profile.karis_karsu.length == 0
                    ? "-"
                    : profile.karis_karsu}
                </Text>
              </View>
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
