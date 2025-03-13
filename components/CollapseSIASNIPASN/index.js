import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  COLORS,
  fontSizeResponsive,
  FONTWEIGHT,
  shadow,
  spacing,
} from "../../config/SuperAppps";
import { TouchableOpacity } from "react-native";
import {
  Collapse,
  CollapseBody,
  CollapseHeader,
} from "accordion-collapse-react-native";
import { convertChip } from "../CollapseEpegIPASN";

const CollapseSIASNIPASN = ({ profile, device }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapse isExpanded={isOpen}>
      <CollapseHeader>
        <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
          <View style={styles.card}>
            <View
              style={[
                {
                  backgroundColor:
                    isOpen === true ? COLORS.secondaryLighter : COLORS.white,
                  padding: spacing.default,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  borderBottomLeftRadius: isOpen === true ? 0 : 8,
                  borderBottomRightRadius: isOpen === true ? 0 : 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
                shadow.cardShadow,
              ]}
            >
              <View style={{ flexDirection: "column", gap: 5 }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H1", device),
                    fontWeight: FONTWEIGHT.bold,
                  }}
                >
                  IP ASN
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H4", device),
                    fontWeight: FONTWEIGHT.normal,
                  }}
                >
                  Sumber Data SIASN 2024
                </Text>
              </View>

              <View
                style={{
                  marginRight: spacing.default,
                }}
              >
                {isOpen === true ? (
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
            shadow.cardShadow,
            styles.cardCollapse,
            {
              flexDirection: "column",
              gap: 8,
            },
          ]}
        >
          {/* Nilai */}
          <View
            style={{
              marginBottom: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: device === "tablet" ? 60 : 30,
                fontWeight: FONTWEIGHT.bold,
              }}
            >
              Nilai
            </Text>
            {/* Niai dan Badge */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Text
                style={{
                  fontSize: device === "tablet" ? 60 : 30,
                  fontWeight: FONTWEIGHT.bold,
                }}
              >
                {profile?.ipasn_nilai ? profile?.ipasn_nilai : "0"}
              </Text>
              {/* Badge Indikator */}
              {convertChip(parseInt(profile?.ipasn_nilai))}
            </View>
          </View>

          {/* Kualifikasi */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
                width: device === "tablet" ? "88%" : "78%",
              }}
            >
              Kualifikasi
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: device === "tablet" ? 30 : 20,
                  height: device === "tablet" ? 30 : 20,
                  backgroundColor: "#FF9900",
                  borderRadius: 50,
                  marginRight: spacing.small,
                }}
              />
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {profile.ipasn_kualifikasi ? profile.ipasn_kualifikasi : "0"}
              </Text>
            </View>
          </View>
          {/* Kompetensi */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
                width: device === "tablet" ? "88%" : "78%",
              }}
            >
              Kompetensi
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: device === "tablet" ? 30 : 20,
                  height: device === "tablet" ? 30 : 20,
                  backgroundColor: COLORS.success,
                  borderRadius: 50,
                  marginRight: spacing.small,
                }}
              />
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {profile.ipasn_kompetensi ? profile.ipasn_kompetensi : "0"}
              </Text>
            </View>
          </View>
          {/* Kinerja */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
                width: device === "tablet" ? "88%" : "78%",
              }}
            >
              Kinerja
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: device === "tablet" ? 30 : 20,
                  height: device === "tablet" ? 30 : 20,
                  backgroundColor: "#CED06C",
                  borderRadius: 50,
                  marginRight: spacing.small,
                }}
              />
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {profile.ipasn_kinerja ? profile.ipasn_kinerja : "0"}
              </Text>
            </View>
          </View>
          {/* Disiplin */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                width: device === "tablet" ? "88%" : "78%",
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Disiplin
            </Text>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: device === "tablet" ? 30 : 20,
                  height: device === "tablet" ? 30 : 20,
                  backgroundColor: COLORS.success,
                  borderRadius: 50,
                  marginRight: spacing.small,
                }}
              />
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {profile.ipasn_disiplin ? profile.ipasn_disiplin : "0"}
              </Text>
            </View>
          </View>
        </View>
      </CollapseBody>
    </Collapse>
  );
};

export default CollapseSIASNIPASN;

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
