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

export const CollapseCardOrangTua = ({ profile, device, data }) => {
  const [collapse, setCollapse] = useState(false);
  const [collapseChild, setCollapseChild] = useState([]);
  useEffect(() => {
    function init() {
      const temp = [false, false];
      setCollapseChild(temp);
    }
    init();
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
                    name="people-circle-outline"
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
                    Orang Tua
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
              <View>
                <Collapse isExpanded={collapseChild[0]}>
                  <CollapseHeader>
                    <TouchableOpacity onPress={() => changeCollapseChild(0)}>
                      <View style={styles.card}>
                        <View
                          style={[
                            {
                              backgroundColor:
                                collapseChild[0] === true
                                  ? COLORS.secondaryLighter
                                  : COLORS.white,
                              padding: spacing.default,
                              marginBottom:
                                collapseChild[0] === true ? 0 : spacing.default,
                              borderTopLeftRadius: 8,
                              borderTopRightRadius: 8,
                              borderBottomLeftRadius:
                                collapseChild[0] === true ? 0 : 8,
                              borderBottomRightRadius:
                                collapseChild[0] === true ? 0 : 8,
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
                              Ayah
                            </Text>
                          </View>
                          <View
                            style={{
                              marginRight: spacing.default,
                            }}
                          >
                            {collapseChild[0] === true ? (
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
                    {profile?.ayah == null ? (
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
                            {profile?.ayah?.nama == null ||
                            profile?.ayah?.nama.length == 0
                              ? "-"
                              : profile?.ayah?.nama}
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
                            {profile?.ayah?.tempatLahir == null ||
                            profile?.ayah?.tempatLahir.length == 0
                              ? "-"
                              : profile?.ayah?.tempatLahir}
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
                            {profile?.ayah?.tglLahir == null ||
                            profile?.ayah?.tglLahir?.length == 0
                              ? "-"
                              : profile?.ayah?.tglLahir}
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
                            Akta Meninggal
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
                            {profile?.ayah?.aktaMeninggal == null ||
                            profile?.ayah?.aktaMeninggal.length == 0
                              ? "-"
                              : profile?.ayah?.aktaMeninggal}
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
                            Tanggal Meninggal
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
                            {profile?.ayah?.tglMeninggal == null ||
                            profile?.ayah?.tglMeninggal?.length == 0
                              ? "-"
                              : moment(
                                  profile?.ayah?.tglMeninggal,
                                  DATETIME.SHORT_DATE
                                ).format(DATETIME.LONG_DATE)}
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
                            {profile?.ayah?.jenisKelamin == null ||
                            profile?.ayah?.jenisKelamin?.length == 0
                              ? "-"
                              : profile?.ayah?.jenisKelamin == "M"
                              ? "Laki-laki"
                              : "Perempuan"}
                          </Text>
                        </View>
                      </View>
                    )}
                  </CollapseBody>
                </Collapse>
                <Collapse isExpanded={collapseChild[1]}>
                  <CollapseHeader>
                    <TouchableOpacity onPress={() => changeCollapseChild(1)}>
                      <View style={styles.card}>
                        <View
                          style={[
                            {
                              backgroundColor:
                                collapseChild[1] === true
                                  ? COLORS.secondaryLighter
                                  : COLORS.white,
                              padding: spacing.default,
                              marginBottom:
                                collapseChild[1] === true ? 0 : spacing.default,
                              borderTopLeftRadius: 8,
                              borderTopRightRadius: 8,
                              borderBottomLeftRadius:
                                collapseChild[1] === true ? 0 : 8,
                              borderBottomRightRadius:
                                collapseChild[1] === true ? 0 : 8,
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
                              Ibu
                            </Text>
                          </View>
                          <View
                            style={{
                              marginRight: spacing.default,
                            }}
                          >
                            {collapseChild[1] === true ? (
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
                    {profile?.ibu == null ? (
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
                            {profile?.ibu?.nama == null ||
                            profile?.ibu?.nama.length == 0
                              ? "-"
                              : profile?.ibu?.nama}
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
                            {profile?.ibu?.tempatLahir == null ||
                            profile?.ibu?.tempatLahir.length == 0
                              ? "-"
                              : profile?.ibu?.tempatLahir}
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
                            {profile?.ibu?.tglLahir == null ||
                            profile?.ibu?.tglLahir?.length == 0
                              ? "-"
                              : profile?.ibu?.tglLahir}
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
                            Akta Meninggal
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
                            {profile?.ibu?.aktaMeninggal == null ||
                            profile?.ibu?.aktaMeninggal.length == 0
                              ? "-"
                              : profile?.ibu?.aktaMeninggal}
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
                            Tanggal Meninggal
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
                            {profile?.ibu?.tglMeninggal == null ||
                            profile?.ibu?.tglMeninggal?.length == 0
                              ? "-"
                              : moment(
                                  profile?.ibu?.tglMeninggal,
                                  DATETIME.SHORT_DATE
                                ).format(DATETIME.LONG_DATE)}
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
                            {profile?.ibu?.jenisKelamin == null ||
                            profile?.ibu?.jenisKelamin?.length == 0
                              ? "-"
                              : profile?.ibu?.jenisKelamin == "M"
                              ? "Laki-laki"
                              : "Perempuan"}
                          </Text>
                        </View>
                      </View>
                    )}
                  </CollapseBody>
                </Collapse>
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
