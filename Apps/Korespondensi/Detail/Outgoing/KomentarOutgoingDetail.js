import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { COLORS } from "../../../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native";

export const KomentarOutgoingDetail = () => {
  const [comment, onChangeText] = useState("");
  return (
    <View>
      <View style={{ padding: 20 }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: 400,
            color: COLORS.lighter,
            marginBottom: 15,
          }}
        >
          Komentar (3)
        </Text>

        <ScrollView style={{ height: "81%" }}>
          <View style={{ gap: 20 }}>
            <View style={{ backgroundColor: COLORS.white, borderRadius: 8 }}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor: COLORS.warning,
                      width: 109,
                      height: 33,
                      justifyContent: "center",
                      borderTopLeftRadius: 6,
                      borderBottomRightRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: COLORS.white,
                        textAlign: "center",
                      }}
                    >
                      Return
                    </Text>
                  </View>
                  <Ionicons
                    name="phone-portrait-outline"
                    size={20}
                    color={COLORS.lighter}
                  />
                </View>

                <View style={{ flexDirection: "row", paddingRight: 20 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: COLORS.lighter,
                    }}
                  >
                    22 Januari 2023
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: COLORS.lighter,
                    }}
                  >
                    {" "}
                    |{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: COLORS.lighter,
                    }}
                  >
                    14:30:01
                  </Text>
                </View>
              </View>

              <View style={{ padding: 20 }}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  {/* <Image
                    source={require("../../../../assets/superApp/AvatarN.png")}
                    style={{ width: 26, height: 26 }}
                  /> */}
                  <View style={{ gap: 10 }}>
                    <View style={{ gap: 5 }}>
                      <Text
                        style={{ fontSize: 13, fontWeight: 700, width: 270 }}
                      >
                        KEPALA PUSAT DATA STATISTIK DAN INFORMASI
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: 400,
                          color: COLORS.lighter,
                        }}
                      >
                        NILAN AMALIA PUSPARANI/198505042009122001/KKP
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#F8F8F8",
                        height: 28,
                        justifyContent: "center",
                        paddingLeft: 10,
                        borderRadius: 8,
                      }}
                    >
                      <Text>Kembalikan</Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        color: COLORS.info,
                      }}
                    >
                      Balas
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ backgroundColor: COLORS.white, borderRadius: 8 }}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor: COLORS.success,
                      width: 109,
                      height: 33,
                      justifyContent: "center",
                      borderTopLeftRadius: 6,
                      borderBottomRightRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: COLORS.white,
                        textAlign: "center",
                      }}
                    >
                      Return
                    </Text>
                  </View>
                  <Ionicons
                    name="phone-portrait-outline"
                    size={20}
                    color={COLORS.lighter}
                  />
                </View>

                <View style={{ flexDirection: "row", paddingRight: 20 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: COLORS.lighter,
                    }}
                  >
                    22 Januari 2023
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: COLORS.lighter,
                    }}
                  >
                    {" "}
                    |{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: COLORS.lighter,
                    }}
                  >
                    14:30:01
                  </Text>
                </View>
              </View>

              <View style={{ padding: 20 }}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  {/* <Image
                    source={require("../../../../assets/superApp/AvatarN.png")}
                    style={{ width: 26, height: 26 }}
                  /> */}
                  <View style={{ gap: 10 }}>
                    <View style={{ gap: 5 }}>
                      <Text
                        style={{ fontSize: 13, fontWeight: 700, width: 270 }}
                      >
                        KEPALA PUSAT DATA STATISTIK DAN INFORMASI
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: 400,
                          color: COLORS.lighter,
                        }}
                      >
                        NILAN AMALIA PUSPARANI/198505042009122001/KKP
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#F8F8F8",
                        height: 28,
                        justifyContent: "center",
                        paddingLeft: 10,
                        borderRadius: 8,
                      }}
                    >
                      <Text>Kembalikan</Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        color: COLORS.info,
                      }}
                    >
                      Balas
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ backgroundColor: COLORS.white, borderRadius: 8 }}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor: COLORS.info,
                      width: 109,
                      height: 33,
                      justifyContent: "center",
                      borderTopLeftRadius: 6,
                      borderBottomRightRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: COLORS.white,
                        textAlign: "center",
                      }}
                    >
                      Return
                    </Text>
                  </View>
                  <Ionicons
                    name="phone-portrait-outline"
                    size={20}
                    color={COLORS.lighter}
                  />
                </View>

                <View style={{ flexDirection: "row", paddingRight: 20 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: COLORS.lighter,
                    }}
                  >
                    22 Januari 2023
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: COLORS.lighter,
                    }}
                  >
                    {" "}
                    |{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: COLORS.lighter,
                    }}
                  >
                    14:30:01
                  </Text>
                </View>
              </View>

              <View style={{ padding: 20 }}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  {/* <Image
                    source={require("../../../../assets/superApp/AvatarN.png")}
                    style={{ width: 26, height: 26 }}
                  /> */}
                  <View style={{ gap: 10 }}>
                    <View style={{ gap: 5 }}>
                      <Text
                        style={{ fontSize: 13, fontWeight: 700, width: 270 }}
                      >
                        KEPALA PUSAT DATA STATISTIK DAN INFORMASI
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: 400,
                          color: COLORS.lighter,
                        }}
                      >
                        NILAN AMALIA PUSPARANI/198505042009122001/KKP
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#F8F8F8",
                        height: 28,
                        justifyContent: "center",
                        paddingLeft: 10,
                        borderRadius: 8,
                      }}
                    >
                      <Text>Kembalikan</Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        color: COLORS.info,
                      }}
                    >
                      Balas
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ backgroundColor: COLORS.white, borderRadius: 8 }}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor: COLORS.info,
                      width: 109,
                      height: 33,
                      justifyContent: "center",
                      borderTopLeftRadius: 6,
                      borderBottomRightRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: COLORS.white,
                        textAlign: "center",
                      }}
                    >
                      Return
                    </Text>
                  </View>
                  <Ionicons
                    name="phone-portrait-outline"
                    size={20}
                    color={COLORS.lighter}
                  />
                </View>

                <View style={{ flexDirection: "row", paddingRight: 20 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: COLORS.lighter,
                    }}
                  >
                    22 Januari 2023
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: COLORS.lighter,
                    }}
                  >
                    {" "}
                    |{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: COLORS.lighter,
                    }}
                  >
                    14:30:01
                  </Text>
                </View>
              </View>

              <View style={{ padding: 20 }}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  {/* <Image
                    source={require("../../../../assets/superApp/AvatarN.png")}
                    style={{ width: 26, height: 26 }}
                  /> */}
                  <View style={{ gap: 10 }}>
                    <View style={{ gap: 5 }}>
                      <Text
                        style={{ fontSize: 13, fontWeight: 700, width: 270 }}
                      >
                        KEPALA PUSAT DATA STATISTIK DAN INFORMASI
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: 400,
                          color: COLORS.lighter,
                        }}
                      >
                        NILAN AMALIA PUSPARANI/198505042009122001/KKP
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#F8F8F8",
                        height: 28,
                        justifyContent: "center",
                        paddingLeft: 10,
                        borderRadius: 8,
                      }}
                    >
                      <Text>Kembalikan</Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        color: COLORS.info,
                      }}
                    >
                      Balas
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={{ backgroundColor: COLORS.white, borderRadius: 8 }}>
              <View
                style={{
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor: COLORS.info,
                      width: 109,
                      height: 33,
                      justifyContent: "center",
                      borderTopLeftRadius: 6,
                      borderBottomRightRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: COLORS.white,
                        textAlign: "center",
                      }}
                    >
                      Return
                    </Text>
                  </View>
                  <Ionicons
                    name="phone-portrait-outline"
                    size={20}
                    color={COLORS.lighter}
                  />
                </View>

                <View style={{ flexDirection: "row", paddingRight: 20 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: COLORS.lighter,
                    }}
                  >
                    22 Januari 2023
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: COLORS.lighter,
                    }}
                  >
                    {" "}
                    |{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 400,
                      color: COLORS.lighter,
                    }}
                  >
                    14:30:01
                  </Text>
                </View>
              </View>

              <View style={{ padding: 20 }}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  {/* <Image
                    source={require("../../../../assets/superApp/AvatarN.png")}
                    style={{ width: 26, height: 26 }}
                  /> */}
                  <View style={{ gap: 10 }}>
                    <View style={{ gap: 5 }}>
                      <Text
                        style={{ fontSize: 13, fontWeight: 700, width: 270 }}
                      >
                        KEPALA PUSAT DATA STATISTIK DAN INFORMASI
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: 400,
                          color: COLORS.lighter,
                        }}
                      >
                        NILAN AMALIA PUSPARANI/198505042009122001/KKP
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#F8F8F8",
                        height: 28,
                        justifyContent: "center",
                        paddingLeft: 10,
                        borderRadius: 8,
                      }}
                    >
                      <Text>Kembalikan</Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: 400,
                        color: COLORS.info,
                      }}
                    >
                      Balas
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      <View>
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 5,
          }}
        >
          <View style={{ width: 200 }}>
            <Text>Membalas Ke AULIA RIZA FARHAN/198505042009122001/KKP</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="close" size={24} color={COLORS.lighter} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: COLORS.white,
            borderTopWidth: 2,
            borderRadius: 4,
            borderColor: COLORS.ExtraDivinder,
            flexDirection: "row",
            position: "relative",
          }}
        >
          <TextInput
            onChangeText={onChangeText}
            value={comment}
            multiline
            numberOfLines={4}
            maxLength={40}
            placeholder="Ketik Komentar Disini"
            style={{ padding: 20, height: 50, width: "80%" }}
            allowFontScaling={false}
          />
          <View
            style={{
              alignItems: "flex-end",
              flex: 1,
              marginRight: 10,
              justifyContent: "center",
              paddingRight: 10,
            }}
          >
            <TouchableOpacity>
              <Ionicons name="send" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
