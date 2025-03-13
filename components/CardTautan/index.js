import React, { useState } from "react";
import {
  Image,
  Linking,
  Modal,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { View } from "react-native";
import { Text } from "react-native";
import { COLORS, FONTSIZE, fontSizeResponsive, getOrientation } from "../../config/SuperAppps";
import { FlatList } from "react-native";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

export const CardTautan = ({ setModalVisible }) => {
  const { device } = useSelector((state) => state.apps);
  const { width, height } = useWindowDimensions()

  return (
    <View style={styles.card}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              Linking.openURL("https://halo-bupbj.com/");
            }}
          >
            <Image
              source={require("../../assets/superApp/BUPBJ.png")}
              style={{
                width: device === "tablet" ? 100 : 48,
                height: device === "tablet" ? 100 : 48,
              }}
            />
            <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
              Halo-BUPBJ
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              Linking.openURL("https://www.lapor.go.id/");
            }}
          >
            <Image
              source={require("../../assets/superApp/lapor.png")}
              style={{
                width: device === "tablet" ? 100 : 48,
                height: device === "tablet" ? 100 : 48,
              }}
            />
            <Text
              style={{
                textAlign: "center",
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Lapor.go.id
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              Linking.openURL("https://wbs.kkp.go.id/registration");
            }}
          >
            <Image
              source={require("../../assets/superApp/wbs.png")}
              style={{
                width: device === "tablet" ? 100 : 48,
                height: device === "tablet" ? 100 : 48,
              }}
            />
            <Text
              style={{
                textAlign: "center",
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              WBS KKP
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              Linking.openURL("https://sidak.kkp.go.id/login");
            }}
          >
            <Image
              source={require("../../assets/superApp/sidak.png")}
              style={{
                width: device === "tablet" ? 100 : 48,
                height: device === "tablet" ? 100 : 48,
              }}
            />
            <Text
              style={{
                textAlign: "center",
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Sidak
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={() => {
              Linking.openURL("https://jdih.kkp.go.id/");
            }}
          >
            <Image
              source={require("../../assets/superApp/JDIH.png")}
              style={{
                width: device === "tablet" ? 100 : 48,
                height: device === "tablet" ? 100 : 48,
              }}
            />
            <Text
              style={{
                textAlign: "center",
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              JDIH
            </Text>
          </TouchableOpacity>

          {
            device === 'tablet' && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL("https://e-monev.bappenas.go.id/fe/");
                  }}
                >
                  <View>
                    <Image
                      source={require("../../assets/superApp/monev.png")}
                      style={{
                        width: device === "tablet" ? 100 : 48,
                        height: device === "tablet" ? 100 : 48,
                      }}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Emonev{"\n"} Bapennas
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL("https://www.kinerjaku.kkp.go.id/");
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={require("../../assets/superApp/kinerjaku.png")}
                      style={{
                        width: device === "tablet" ? 100 : 48,
                        height: device === "tablet" ? 100 : 48,
                      }}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      Kinerjaku
                    </Text>
                  </View>
                </TouchableOpacity>

                {
                  getOrientation(width, height) === 'landscape' && (
                    <>
                      <TouchableOpacity
                        onPress={() => {
                          Linking.openURL("https://elearning.kkp.go.id/");
                        }}
                      >
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={require("../../assets/superApp/milea.png")}
                            style={{
                              width: device === "tablet" ? 100 : 48,
                              height: device === "tablet" ? 100 : 48,
                            }}
                          />
                        </View>
                        <View>
                          <Text
                            style={{
                              textAlign: "center",
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            E-Milea
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          Linking.openURL("https://kinerja.bkn.go.id/login");
                        }}
                      >
                        <View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={require("../../assets/superApp/kinerjabkn.png")}
                            style={{
                              width: device === "tablet" ? 100 : 48,
                              height: device === "tablet" ? 100 : 48,
                            }}
                          />
                        </View>
                        <View>
                          <Text
                            style={{
                              textAlign: "center",
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            E-Kinerja {"\n"}BKN
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </>
                  )
                }
              </>
            )
          }


        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    borderRadius: 12,
  },
});
