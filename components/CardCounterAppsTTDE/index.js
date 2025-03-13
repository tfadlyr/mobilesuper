import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  useWindowDimensions,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useDispatch, useSelector } from "react-redux";
import {
  COLORS,
  fontSizeResponsive,
  FONTWEIGHT,
  getOrientation,
} from "../../config/SuperAppps";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { nde_api } from "../../utils/api.config";
import { getHTTP } from "../../utils/http";
import { getTokenValue } from "../../service/session";
import {
  getCounterMain,
  getCounterPKRLMonitoring,
  getDokumenPersetujuan,
} from "../../service/api";
import { Card } from "react-native-paper";

export const CardCounterAppsTTDE = () => {
  const navigation = useNavigation();
  const [activeSlide, setActiveSlide] = useState(0); // State untuk paginasi
  const { profile, typeMenu } = useSelector((state) => state.superApps);
  const { profile: profileKores = {} } = useSelector((state) => state.profile);
  const { device } = useSelector((state) => state.apps);
  const [token, setToken] = useState("");
  const dispatch = useDispatch();

  const { width } = useWindowDimensions(); // Ambil lebar layar

  const CARD_MARGIN = 16;
  const numColumns = 3; // Tetap 3 kolom
  const CARD_WIDTH = (width - CARD_MARGIN * (numColumns * 2)) / numColumns;

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  const isFocus = useIsFocused();

  const roleMonitoring = ["MONITORING_DIGITAL_SIGN"];
  const isRoleMonitoring = profile.roles_access?.some((item) =>
    roleMonitoring.includes(item)
  );

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getCounterMain({ token: token }));
      dispatch(
        getDokumenPersetujuan({ token: token, variant: "On Progress", page: 1 })
      );
      if (isRoleMonitoring) {
        dispatch(getCounterPKRLMonitoring({ token: token }));
      }
    }
  }, [token, isFocus, profile]);

  const { mainCounter, loading, counterPKRL } = useSelector(
    (state) => state.digitalsign
  );
  const { persetujuan } = useSelector((state) => state.cuti);

  const rolePerizinanMenteri = ["PERIZINAN_MENTERI"];
  const roleSK = ["APPROVER.DIGISIGN.SK"];
  const roleIsCreateSK = ["DIGISIGN.SK"];

  const isRoleMenteri = profile.roles_access?.some((item) =>
    rolePerizinanMenteri.includes(item)
  );
  const isRoleSK = profile.roles_access?.some((item) => roleSK.includes(item));
  const isRoleCreateSK = profile.roles_access?.some((item) =>
    roleIsCreateSK.includes(item)
  );
  const isRoleSKFull = isRoleCreateSK || isRoleSK ? true : false;
  const isRolePH = profile.nip === "88888";

  return (
    <View style={styles.container}>
      <Text
        style={[styles.title, { fontSize: fontSizeResponsive("H4", device) }]}
      >
        Need Sign
      </Text>

      {/* <Text>Role Perzinan Menteri {isRoleMenteri ? "true" : "false"}</Text>
      <Text>Role SK Create {isRoleSK ? "true" : "false"}</Text>
      <Text>Role SK {isRoleSK ? "true" : "false"}</Text>
      <Text>Role SK Full {isRoleSKFull ? "true" : "false"}</Text>
      <Text>Role PH {isRolePH ? "true" : "false"}</Text> */}

      {/* PERIZINAN MENTERI & SK */}
      <View
        style={[
          styles.rowContainer,
          { flexDirection: isRoleMenteri && !isRoleSKFull ? "column" : "row" },
        ]}
      >
        <View
          style={[
            styles.smallSectionContainer,
            {
              flex:
                isRoleSKFull && !isRoleMenteri && device === "phone" ? 1 : 0.4,
            },
          ]}
        >
          {isRoleMenteri && (
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                navigation.navigate("MainPerizinanMenteri", {
                  screen: "ESEA",
                  direktorat: "",
                });
              }}
            >
              <Card
                style={[
                  styles.section,
                  { backgroundColor: COLORS.infoDangerLight },
                ]}
              >
                <Text
                  style={[
                    styles.sectionTitle,
                    { fontSize: fontSizeResponsive("H2", device) },
                  ]}
                >
                  E-SEA
                </Text>
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color={COLORS.primary}
                    style={{ marginTop: 10 }}
                  />
                ) : (
                  <Text style={styles.sectionCount}>
                    {isRoleMonitoring
                      ? counterPKRL?.data?.esea?.total_in_progress
                      : mainCounter?.data?.esea_count}
                  </Text>
                )}
                <Text
                  style={[
                    styles.sectionSubtitle,
                    { fontSize: fontSizeResponsive("H4", device) },
                  ]}
                >
                  Dokumen
                </Text>
              </Card>
            </TouchableOpacity>
          )}

          {isRoleSKFull && isRoleMenteri ? (
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                navigation.navigate("MainDigitalSign", { screen: "DokumenSK" });
              }}
            >
              <Card style={styles.section}>
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color={COLORS.primary}
                    style={{ marginTop: 10 }}
                  />
                ) : (
                  <Text style={styles.sectionCount}>
                    {mainCounter?.data?.sk_count}
                  </Text>
                )}
                <Text
                  style={[
                    styles.sectionSubtitle,
                    { fontSize: fontSizeResponsive("H4", device) },
                  ]}
                >
                  Surat Keputusan
                </Text>
              </Card>
            </TouchableOpacity>
          ) : isRoleSKFull && !isRoleMenteri && device === "phone" ? (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("MainDigitalSign", { screen: "DokumenSK" });
              }}
              style={styles.sectionContainerIcon}
            >
              <Card
                style={{
                  padding: 10,
                  backgroundColor: COLORS.white,
                  flexDirection: "row",
                  alignItems: "center",
                  height: device === "phone" ? 80 : 120,
                  display: "flex",
                  flex: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <View>
                    <Text
                      style={[
                        styles.sectionTitleIcon,
                        { fontSize: fontSizeResponsive("H2", device) },
                      ]}
                    >
                      Surat Keputusan
                    </Text>
                    <Text
                      style={[
                        styles.sectionSubtitle,
                        { fontSize: fontSizeResponsive("H4", device) },
                      ]}
                    >
                      Butuh Persetujuan
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.sectionIconBagde,
                      { backgroundColor: COLORS.warningLight },
                    ]}
                  >
                    <FontAwesome5
                      name="file-signature"
                      size={18}
                      color={COLORS.warning}
                    />
                  </View>
                </View>
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color={COLORS.primary}
                    style={{ marginTop: 10 }}
                  />
                ) : (
                  <Text style={styles.sectionCount}>
                    {mainCounter?.data?.sk_count}
                  </Text>
                )}
              </Card>
            </TouchableOpacity>
          ) : null}
        </View>

        {isRoleMenteri && (
          <Card style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.primary}
                  style={{ marginTop: 10 }}
                />
              ) : (
                <Text
                  style={[
                    styles.sectionHeaderTitle,
                    { fontSize: fontSizeResponsive("H2", device) },
                  ]}
                >
                  {isRoleMonitoring === true
                    ? counterPKRL?.data?.pkrl?.total_in_progress
                    : mainCounter?.data?.pkrl_count}{" "}
                  Dokumen
                </Text>
              )}
              <View style={styles.sectionHeaderBagde}>
                <MaterialIcons
                  name="assignment-late"
                  size={24}
                  color={COLORS.danger}
                />
                <Text
                  style={[
                    styles.value,
                    { fontSize: fontSizeResponsive("H6", device) },
                  ]}
                >
                  PKRL
                </Text>
              </View>
            </View>
            <View style={styles.docRow}>
              <TouchableOpacity
                style={styles.docBox}
                onPress={() => {
                  if (isRoleMonitoring !== true) {
                    navigation.navigate("MainPerizinanMenteri", {
                      screen: "PKRL",
                      direktorat:
                        "Direktorat KEBP - Konservasi Ekosistem dan Biota Perairan",
                    });
                  } else {
                    navigation.navigate("MainPerizinanMenteri", {
                      screen: "PKRL",
                      direktorat: "",
                    });
                  }
                }}
              >
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  Direktorat KEBP
                </Text>
                <View style={styles.docCount}>
                  {loading ? (
                    <ActivityIndicator
                      size="small"
                      color={COLORS.primary}
                      style={{ marginTop: 10 }}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.value,
                        { fontSize: fontSizeResponsive("H4", device) },
                      ]}
                    >
                      {isRoleMonitoring
                        ? counterPKRL?.data?.pkrl !== undefined &&
                          counterPKRL?.data?.pkrl[
                            "Direktorat KEBP - Konservasi Ekosistem dan Biota Perairan"
                          ] !== undefined
                          ? counterPKRL?.data?.pkrl[
                              "Direktorat KEBP - Konservasi Ekosistem dan Biota Perairan"
                            ]?.total_in_progress
                          : 0
                        : mainCounter?.data !== undefined &&
                          mainCounter?.data?.[
                            "Direktorat KEBP - Konservasi Ekosistem dan Biota Perairan"
                          ] !== undefined
                        ? mainCounter?.data?.[
                            "Direktorat KEBP - Konservasi Ekosistem dan Biota Perairan"
                          ]?.need_sign
                        : 0}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.docBox}
                onPress={() => {
                  if (isRoleMonitoring !== true) {
                    navigation.navigate("MainPerizinanMenteri", {
                      screen: "PKRL",
                      direktorat: "Direktorat Jaskel - Jasa Kelautan",
                    });
                  } else {
                    navigation.navigate("MainPerizinanMenteri", {
                      screen: "PKRL",
                      direktorat: "",
                    });
                  }
                }}
              >
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  Direktorat Jaskel
                </Text>
                <View style={styles.docCount}>
                  {loading ? (
                    <ActivityIndicator
                      size="small"
                      color={COLORS.primary}
                      style={{ marginTop: 10 }}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.value,
                        { fontSize: fontSizeResponsive("H4", device) },
                      ]}
                    >
                      {isRoleMonitoring
                        ? counterPKRL?.data?.pkrl !== undefined &&
                          counterPKRL?.data?.pkrl[
                            "Direktorat Jaskel - Jasa Kelautan"
                          ] !== undefined
                          ? counterPKRL?.data?.pkrl[
                              "Direktorat Jaskel - Jasa Kelautan"
                            ]?.total_in_progress
                          : 0
                        : mainCounter?.data !== undefined &&
                          mainCounter?.data?.[
                            "Direktorat Jaskel - Jasa Kelautan"
                          ] !== undefined
                        ? mainCounter?.data?.[
                            "Direktorat Jaskel - Jasa Kelautan"
                          ]?.need_sign
                        : 0}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.docRow}>
              <TouchableOpacity
                style={styles.docBox}
                onPress={() => {
                  if (isRoleMonitoring !== true) {
                    navigation.navigate("MainPerizinanMenteri", {
                      screen: "PKRL",
                      direktorat:
                        "Direktorat Pendayagunaan Pesisir dan Pulau-Pulau Kecil",
                    });
                  } else {
                    navigation.navigate("MainPerizinanMenteri", {
                      screen: "PKRL",
                      direktorat: "",
                    });
                  }
                }}
              >
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  Direktorat P4K
                </Text>
                <View style={styles.docCount}>
                  {loading ? (
                    <ActivityIndicator
                      size="small"
                      color={COLORS.primary}
                      style={{ marginTop: 10 }}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.value,
                        { fontSize: fontSizeResponsive("H4", device) },
                      ]}
                    >
                      {isRoleMonitoring
                        ? counterPKRL?.data?.pkrl !== undefined &&
                          counterPKRL?.data?.pkrl[
                            "Direktorat Pendayagunaan Pesisir dan Pulau-Pulau Kecil"
                          ] !== undefined
                          ? counterPKRL?.data?.pkrl[
                              "Direktorat Pendayagunaan Pesisir dan Pulau-Pulau Kecil"
                            ]?.total_in_progress
                          : 0
                        : mainCounter?.data !== undefined &&
                          mainCounter?.data?.[
                            "Direktorat Pendayagunaan Pesisir dan Pulau-Pulau Kecil"
                          ] !== undefined
                        ? mainCounter?.data?.[
                            "Direktorat Pendayagunaan Pesisir dan Pulau-Pulau Kecil"
                          ]?.need_sign
                        : 0}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.docBox}
                onPress={() => {
                  if (roleMonitoring !== true) {
                    navigation.navigate("MainPerizinanMenteri", {
                      screen: "PKRL",
                      direktorat: "Direktorat PRL",
                    });
                  } else {
                    navigation.navigate("MainPerizinanMenteri", {
                      screen: "PKRL",
                      direktorat: "",
                    });
                  }
                }}
              >
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  Direktorat PRL
                </Text>
                <View style={styles.docCount}>
                  {loading ? (
                    <ActivityIndicator
                      size="small"
                      color={COLORS.primary}
                      style={{ marginTop: 10 }}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.value,
                        { fontSize: fontSizeResponsive("H4", device) },
                      ]}
                    >
                      {isRoleMonitoring
                        ? counterPKRL?.data?.pkrl !== undefined &&
                          counterPKRL?.data?.pkrl["Direktorat PRL"] !==
                            undefined
                          ? counterPKRL?.data?.pkrl["Direktorat PRL"]
                              ?.total_in_progress
                          : 0
                        : mainCounter?.data !== undefined &&
                          mainCounter?.data?.["Direktorat PRL"] !== undefined
                        ? mainCounter?.data?.["Direktorat PRL"]?.need_sign
                        : 0}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </Card>
        )}
      </View>

      {/* DOKUMEN LAIN & CUTI */}
      <View style={[styles.rowContainer, { flexDirection: "row" }]}>
        {isRoleSKFull && !isRoleMenteri && device === "tablet" && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("MainDigitalSign", { screen: "DokumenSK" });
            }}
            style={styles.sectionContainerIcon}
          >
            <Card
              style={{
                padding: 10,
                backgroundColor: COLORS.white,
                flexDirection: "row",
                alignItems: "center",
                height: device === "phone" ? 80 : 120,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    width: device === "tablet" ? "90%" : "75%",
                  }}
                >
                  <Text
                    style={[
                      styles.sectionTitleIcon,
                      { fontSize: fontSizeResponsive("H2", device) },
                    ]}
                  >
                    Surat Keputusan
                  </Text>
                  <Text
                    style={[
                      styles.sectionSubtitle,
                      { fontSize: fontSizeResponsive("H4", device) },
                    ]}
                  >
                    Butuh Persetujuan
                  </Text>
                </View>
                <View
                  style={[
                    styles.sectionIconBagde,
                    { backgroundColor: COLORS.warningLight },
                  ]}
                >
                  <FontAwesome5
                    name="file-signature"
                    size={18}
                    color={COLORS.warning}
                  />
                </View>
              </View>
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.primary}
                  style={{ marginTop: 10 }}
                />
              ) : (
                <Text style={styles.sectionCount}>
                  {mainCounter?.data?.sk_count}
                </Text>
              )}
            </Card>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("MainCuti");
          }}
          style={styles.sectionContainerIcon}
        >
          <Card
            style={{
              padding: 10,
              backgroundColor: COLORS.white,
              flexDirection: "row",
              alignItems: "center",
              height: device === "phone" ? 80 : 120,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  width: device === "tablet" ? "90%" : "75%",
                }}
              >
                <Text
                  style={[
                    styles.sectionTitleIcon,
                    { fontSize: fontSizeResponsive("H2", device) },
                  ]}
                >
                  Cuti
                </Text>
                <Text
                  style={[
                    styles.sectionSubtitle,
                    { fontSize: fontSizeResponsive("H4", device) },
                  ]}
                >
                  Butuh Persetujuan
                </Text>
              </View>
              <View
                style={[
                  styles.sectionIconBagde,
                  { backgroundColor: COLORS.infoLight },
                ]}
              >
                <Ionicons name="calendar" size={24} color={COLORS.info} />
              </View>
            </View>
            {loading ? (
              <ActivityIndicator
                size="small"
                color={COLORS.primary}
                style={{ marginTop: 10 }}
              />
            ) : (
              <Text style={styles.sectionCount}>
                {persetujuan?.lists?.badge?.on_progress}
              </Text>
            )}
          </Card>
        </TouchableOpacity>

        {/* DOKUMEN LAIN */}
        <TouchableOpacity
          style={styles.sectionContainerIcon}
          onPress={() => {
            navigation.navigate("MainDigitalSign", { screen: "DokumenLain" });
          }}
        >
          <Card
            style={{
              padding: 10,
              backgroundColor: COLORS.white,
              height: device === "phone" ? 80 : 120,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View
                style={{
                  width: device === "tablet" ? "90%" : "75%",
                }}
              >
                <Text
                  style={[
                    styles.sectionTitleIcon,
                    { fontSize: fontSizeResponsive("H2", device) },
                  ]}
                >
                  Dokumen Lain
                </Text>
                <Text
                  style={[
                    styles.sectionSubtitle,
                    { fontSize: fontSizeResponsive("H4", device) },
                  ]}
                >
                  Dokumen
                </Text>
              </View>
              <View
                style={[
                  styles.sectionIconBagde,
                  { backgroundColor: COLORS.bgLightGrey },
                ]}
              >
                <Ionicons name="document" size={24} color={COLORS.grey} />
              </View>
            </View>
            {loading ? (
              <ActivityIndicator
                size="small"
                color={COLORS.primary}
                style={{ marginTop: 10 }}
              />
            ) : (
              <Text style={styles.sectionCount}>
                {mainCounter?.data?.dokumen_lain_count}
              </Text>
            )}
          </Card>
        </TouchableOpacity>
      </View>

      {/* PRODUK HUKUM */}
      <View style={styles.rowContainer}>
        {isRolePH && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ProdukHukum", { route: "ProdukHukum" });
            }}
            style={styles.sectionContainerIcon}
          >
            <Card style={{ padding: 10, backgroundColor: COLORS.white }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    width: device === "tablet" ? "90%" : "75%",
                  }}
                >
                  <Text
                    style={[
                      styles.sectionTitleIcon,
                      { fontSize: fontSizeResponsive("H2", device) },
                    ]}
                  >
                    Produk Hukum
                  </Text>
                  <Text
                    style={[
                      styles.sectionSubtitle,
                      { fontSize: fontSizeResponsive("H4", device) },
                    ]}
                  >
                    Perlu TTDE
                  </Text>
                </View>
                <View
                  style={[
                    styles.sectionIconBagde,
                    { backgroundColor: COLORS.successLight },
                  ]}
                >
                  <MaterialIcons
                    name="gesture"
                    size={24}
                    color={COLORS.success}
                  />
                </View>
              </View>
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.primary}
                  style={{ marginTop: 10 }}
                />
              ) : (
                <Text style={styles.sectionCount}>
                  {mainCounter?.data?.produk_hukum}
                </Text>
              )}
            </Card>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderRadius: 10,
    padding: 10,
    shadowOffset: { width: -2, height: 4 },
    shadowColor: "#ccc",
    shadowOpacity: 0.2,
    elevation: 1,
    gap: 10,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    color: COLORS.grey,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    flex: 1,
  },
  sectionContainerIcon: {
    backgroundColor: "#fff",
    borderRadius: 10,
    flex: 1,
  },
  smallSectionContainer: {
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    rowGap: 10,
  },
  section: {
    flexDirection: "column",
    justifyContent: "center",
    padding: 8,
    height: "100%",
    backgroundColor: COLORS.white,
  },
  sectionTitle: {
    // fontSize: 14,
    fontWeight: "bold",
    color: "#D9534F",
    flexWrap: "wrap",
  },
  sectionTitleIcon: {
    // fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    flexWrap: "wrap",
  },
  sectionCount: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
  },
  sectionSubtitle: {
    // fontSize: 12,
    color: "#666",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionHeaderTitle: {
    // fontSize: 16,
    fontWeight: "bold",
  },
  sectionHeaderBagde: {
    borderRadius: 50,
    backgroundColor: COLORS.infoDangerLight,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 4,
  },
  sectionIconBagde: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
  },
  docRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 8,
  },
  docBox: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    alignItems: "flex-start",
    padding: 8,
    height: "auto",
  },
  docCount: {
    borderRadius: 50,
    backgroundColor: COLORS.ExtraDivinder,
    paddingHorizontal: 12,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
});
