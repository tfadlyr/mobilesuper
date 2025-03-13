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
import { useSelector } from "react-redux";

export const convertChip = (data) => {
  let tingkat = "";
  let color = "";
  if (data <= 100 && data > 90) {
    tingkat = "Sangat Tinggi";
    color = "#CED06C";
  } else if (data <= 90 && data > 80) {
    tingkat = "Tinggi";
    color = "#81c784";
  } else if (data <= 80 && data > 70) {
    tingkat = "Sedang";
    color = "#ffee58";
  } else {
    tingkat = "Rendah";
    color = "#e57373";
  }

  const { device } = useSelector((state) => state.apps);

  return (
    <View
      style={{
        backgroundColor: color,
        borderRadius: 50,
        paddingHorizontal: 10,
        paddingVertical: 5,
      }}
    >
      <Text
        style={{ color: "#000", fontSize: fontSizeResponsive("H4", device) }}
      >
        {tingkat}
      </Text>
    </View>
  );
};

const CollapseEpegIPASN = ({ profile, device }) => {
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
                  Sumber Data EPEG 2024
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
                {profile?.epeg_ipasn_data?.nilai
                  ? profile?.epeg_ipasn_data?.nilai
                  : "0"}
              </Text>
              {/* Badge Indikator */}
              {convertChip(parseInt(profile?.epeg_ipasn_data?.nilai))}
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
                {profile?.epeg_ipasn_data?.kualifikasi
                  ? profile?.epeg_ipasn_data?.kualifikasi
                  : "0"}
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
                {profile?.epeg_ipasn_data?.kompetensi
                  ? profile?.epeg_ipasn_data?.kompetensi
                  : "0"}
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
                {profile?.epeg_ipasn_data?.kinerja
                  ? profile?.epeg_ipasn_data?.kinerja
                  : "0"}
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
                  backgroundColor: COLORS.orange,
                  borderRadius: 50,
                  marginRight: spacing.small,
                }}
              />
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {profile?.epeg_ipasn_data?.disiplin
                  ? profile?.epeg_ipasn_data?.disiplin
                  : "0"}
              </Text>
            </View>
          </View>
          {/* Diklat */}
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
              Diklat
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
                {profile?.epeg_ipasn_data?.diklat20jp
                  ? profile?.epeg_ipasn_data?.diklat20jp
                  : "0"}
              </Text>
            </View>
          </View>
          {/* Fungsional */}
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
              Fungsional
            </Text>
            <View style={{ flexDirection: "row" }}>
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
                {profile?.epeg_ipasn_data?.fungsional
                  ? profile?.epeg_ipasn_data?.fungsional
                  : "0"}
              </Text>
            </View>
          </View>
          {/* Hukdis */}
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
              Hukdis
            </Text>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: device === "tablet" ? 30 : 20,
                  height: device === "tablet" ? 30 : 20,
                  backgroundColor: COLORS.orange,
                  borderRadius: 50,
                  marginRight: spacing.small,
                }}
              />
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {profile?.epeg_ipasn_data?.hukdis
                  ? profile?.epeg_ipasn_data?.hukdis
                  : "0"}
              </Text>
            </View>
          </View>
          {/* PPKP */}
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
              PPKP
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
                {profile?.epeg_ipasn_data?.ppkp
                  ? profile?.epeg_ipasn_data?.ppkp
                  : "0"}
              </Text>
            </View>
          </View>
          {/* Seminar */}
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
              Seminar
            </Text>
            <View style={{ flexDirection: "row" }}>
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
                {profile?.epeg_ipasn_data?.seminar
                  ? profile?.epeg_ipasn_data?.seminar
                  : "0"}
              </Text>
            </View>
          </View>
          {/* Struktural */}
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
              Struktural
            </Text>
            <View style={{ flexDirection: "row" }}>
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
                {profile?.epeg_ipasn_data?.struktural
                  ? profile?.epeg_ipasn_data?.struktural
                  : "0"}
              </Text>
            </View>
          </View>
        </View>
      </CollapseBody>
    </Collapse>
  );
};

export default CollapseEpegIPASN;

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
