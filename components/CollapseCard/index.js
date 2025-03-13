import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { StyleSheet, TextInput, View, Text, Touchable } from "react-native";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native";
import { Divider } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  COLORS,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";

export const CollapseCard = ({
  teu_badan,
  singkatan_peraturan_cat,
  tempat_penetapan,
  tgl_penetapan,
  tgl_diundangkan,
  subjek,
  sumber_peraturan,
  bahasa,
  bidanghukum,
  dilihat,
  diunduh,
  device,
}) => {
  const [collapse, setCollapse] = useState(false);
  return (
    <View>
      <Collapse>
        <CollapseHeader>
          <TouchableOpacity onPress={() => setCollapse(collapse)}>
            <View
              style={[
                styles.card,
                {
                  borderRadius: collapse === true ? 0 : 16,
                  height: device === "tablet" ? 350 : 270,
                },
              ]}
            >
              <View
                style={{
                  backgroundColor: COLORS.secondaryLighter,
                  paddingHorizontal: 20,
                  paddingVertical: 20,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  Informasi Detail
                </Text>
                <View
                  style={{ flex: 1, alignItems: "flex-end", marginRight: 20 }}
                >
                  {collapse ? (
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
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  T.E.U
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: "right",
                    marginLeft: 100,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {teu_badan}
                </Text>
              </View>
              <Divider bold />
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Singkatan Jenis
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: "right",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {singkatan_peraturan_cat}
                </Text>
              </View>
              <Divider bold />
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Tempat Terbit
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: "right",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {tempat_penetapan}
                </Text>
              </View>
              <Divider bold />
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Tanggal Penetapan
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: "right",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {tgl_penetapan}
                </Text>
              </View>
              <Divider bold />
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Tanggal Pengundangan
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: "right",
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {tgl_diundangkan}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </CollapseHeader>
        <CollapseBody>
          <View style={styles.cardCollapse}>
            <Divider bold />
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                paddingVertical: 10,
                paddingHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Subjek
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                  marginLeft: 100,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {subjek}
              </Text>
            </View>
            <Divider bold />
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                paddingVertical: 10,
                paddingHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Sumber
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {sumber_peraturan}
              </Text>
            </View>
            <Divider bold />
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                paddingVertical: 10,
                paddingHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Bahasa
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {bahasa}
              </Text>
            </View>
            <Divider bold />
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                paddingVertical: 10,
                paddingHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Lokasi
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                -
              </Text>
            </View>
            <Divider bold />
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                paddingVertical: 10,
                paddingHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Bidang Hukum
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {bidanghukum}
              </Text>
            </View>
            <Divider bold />
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                paddingVertical: 10,
                paddingHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Keterangan
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                -
              </Text>
            </View>
            <Divider bold />
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                paddingVertical: 10,
                paddingHorizontal: 20,
              }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                Abstrak
              </Text>
              <Text
                style={{
                  flex: 1,
                  textAlign: "right",
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                -
              </Text>
            </View>

            <View
              style={{
                backgroundColor: COLORS.secondaryLighter,
                flexDirection: "row",
                gap: 20,
                paddingLeft: 20,
                paddingBottom: 20,
                borderBottomRightRadius: 16,
                borderBottomLeftRadius: 16,
              }}
            >
              <View style={{ marginTop: 10 }}>
                <Text
                  style={[
                    styles.text,
                    { fontSize: fontSizeResponsive("H4", device) },
                  ]}
                >
                  Dilihat
                </Text>
                <View
                  style={{
                    marginTop: 5,
                    flexDirection: "row",
                    gap: 5,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="eye-outline"
                    size={device === "tablet" ? 30 : 15}
                    color={"black"}
                  />
                  <Text
                    style={[
                      styles.text,
                      { fontSize: fontSizeResponsive("H4", device) },
                    ]}
                  >
                    {dilihat}
                  </Text>
                </View>
              </View>

              <View style={{ marginTop: 10 }}>
                <Text
                  style={[
                    styles.text,
                    { fontSize: fontSizeResponsive("H4", device) },
                  ]}
                >
                  Diunduh
                </Text>
                <View
                  style={{
                    marginTop: 5,
                    flexDirection: "row",
                    gap: 5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: 'center'
                  }}
                >
                  <Ionicons
                    name="download-outline"
                    size={device === "tablet" ? 30 : 15}
                    color={"black"}
                  />
                  <Text
                    style={[
                      styles.text,
                      { fontSize: fontSizeResponsive("H4", device) },
                    ]}
                  >
                    {diunduh}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </CollapseBody>
      </Collapse>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F7FE",
    gap: 20,
    borderRadius: 100,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
  },
  cardCollapse: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderBottomStartRadius: 16,
    borderBottomEndRadius: 16,
  },
  text: {
    fontWeight: "400",
  },
});
