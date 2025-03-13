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

export const CollapseCardPasangan = ({ profile, device, data }) => {
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
                  <Ionicons name="heart" size={device === "tablet" ? 40 : 24} />
                  <Text
                    style={[
                      {
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: fontSizeResponsive("H4", device),
                      },
                    ]}
                  >
                    Pasangan
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
                  Akta Menikah
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
                  {profile[0]?.dataPernikahan?.aktaMenikah == null ||
                  profile[0]?.dataPernikahan?.aktaMenikah?.length == 0
                    ? "-"
                    : profile[0]?.dataPernikahan?.aktaMenikah}
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
                  Tanggal Menikah
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
                  {profile[0]?.dataPernikahan?.tgglMenikah == null ||
                  profile[0]?.dataPernikahan?.tgglMenikah?.length == 0
                    ? "-"
                    : profile[0]?.dataPernikahan?.tgglMenikah}
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
                <Text
                  style={[
                    {
                      flex: 5,
                      fontSize: fontSizeResponsive("H4", device),
                    },
                  ]}
                >
                  {profile[0]?.orang?.nama == null ||
                  profile[0]?.orang?.nama?.length == 0
                    ? "-"
                    : profile[0]?.orang?.nama}
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
                  {profile[0]?.orang?.jenisKelamin == null ||
                  profile[0]?.orang?.jenisKelamin.length == 0
                    ? "-"
                    : profile[0]?.orang?.jenisKelamin == "M"
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
                  {profile[0]?.orang?.tglLahir == null ||
                  profile[0]?.orang?.tglLahir?.length == 0
                    ? "-"
                    : profile[0]?.orang?.tglLahir}
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
                  {profile[0]?.orang?.tempatLahir == null ||
                  profile[0]?.orang?.tempatLahir?.length == 0
                    ? "-"
                    : profile[0]?.orang?.tempatLahir}
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
