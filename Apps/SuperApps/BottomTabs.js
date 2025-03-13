import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import {} from "react-native";
import { Modal } from "react-native";
import { useSelector } from "react-redux";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const dataRoleDashboard = ["D_KK", "D_KP", "D_BD", "D_PK"];
const dataRoleDashboardKeuangan = ["D_KK"];
const dataRoleDashboardkepegawaian = ["D_KP"];
const dataRoleDashboardbudidaya = ["D_BD"];
const dataRoleDashboardpenangkapan = ["D_PK"];
const dataRoleDashboardBantuanPemerintah = ["D_KP"];

const numColumns = 3;

function MyTabBar({ props, navigation }) {
  const [tabItemIndex, setTabItemIndex] = useState(1);

  const [visibleModal, setVisibleModal] = useState(false);

  const [listMenu, setListMenu] = useState([]);

  const { profile } = useSelector((state) => state.superApps);

  const isRole = profile.roles_access?.some((item) =>
    dataRoleDashboard.includes(item)
  );
  const isRoleKeuangan = profile.roles_access?.some((item) =>
    dataRoleDashboardKeuangan.includes(item)
  );
  const isRoleKepegawaian = profile.roles_access?.some((item) =>
    dataRoleDashboardkepegawaian.includes(item)
  );
  const isRoleBudidaya = profile.roles_access?.some((item) =>
    dataRoleDashboardbudidaya.includes(item)
  );
  const isRolePenangkapan = profile.roles_access?.some((item) =>
    dataRoleDashboardpenangkapan.includes(item)
  );
  const isRoleBantuanPemerintah = profile.roles_access?.some((item) =>
    dataRoleDashboardBantuanPemerintah.includes(item)
  );

  useEffect(() => {
    let menuDash = [];
    if (isRoleKeuangan) {
      menuDash.push(
        <View
          style={{
            alignItems: "center",
            height: 150,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Keuangan");
              // setVisibleModal(false);
            }}
          >
            <View
              style={[
                styles.cardApps,
                {
                  backgroundColor: COLORS.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                },
              ]}
            >
              <Image
                style={{
                  width: device === "tablet" ? 50 : 24,
                  height: device === "tablet" ? 40 : 18,
                }}
                source={require("../../assets/superApp/ikon-keuangan.png")}
              />
            </View>
          </TouchableOpacity>
          <Text
            style={{
              marginTop: 10,
              justifyContent: "center",
              alignItems: "center",
              fontSize: fontSizeResponsive("H4", device),
              width: device === "tablet" ? 200 : 100,
              textAlign: "center",
            }}
          >
            Keuangan dan Kinerja
          </Text>
        </View>
      );
    }

    if (isRoleKepegawaian) {
      menuDash.push(
        <View
          style={{
            alignItems: "center",
            height: 150,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Kepegawaian");
              // setVisibleModal(false);
            }}
          >
            <View
              style={[
                styles.cardApps,
                {
                  backgroundColor: COLORS.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                },
              ]}
            >
              <Image
                style={{
                  width: device === "tablet" ? 50 : 24,
                  height: device === "tablet" ? 50 : 18,
                }}
                source={require("../../assets/superApp/ikon-kepagawaian.png")}
              />
            </View>
          </TouchableOpacity>
          <Text
            style={{
              marginTop: 10,
              justifyContent: "center",
              alignItems: "center",
              fontSize: fontSizeResponsive("H4", device),
              width: device === "tablet" ? 200 : 100,
              textAlign: "center",
            }}
          >
            Kepegawaian
          </Text>
        </View>
      );
    }

    if (isRoleBantuanPemerintah) {
      menuDash.push(
        <View
          style={{
            alignItems: "center",
            height: 150,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("BantuanPemerintah");
              // setVisibleModal(false);
            }}
          >
            <View
              style={[
                styles.cardApps,
                {
                  backgroundColor: COLORS.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                },
              ]}
            >
              <Image
                style={{
                  width: device === "tablet" ? 50 : 24,
                  height: device === "tablet" ? 50 : 18,
                }}
                source={require("../../assets/superApp/ikon-perencanaan.png")}
              />
            </View>
          </TouchableOpacity>
          <Text
            style={{
              marginTop: 10,
              justifyContent: "center",
              alignItems: "center",
              fontSize: fontSizeResponsive("H4", device),
              width: device === "tablet" ? 200 : 100,
              textAlign: "center",
            }}
          >
            Bantuan Pemerintah
          </Text>
        </View>
      );
    }
    if (isRoleBudidaya) {
      menuDash.push(
        <View
          style={{
            alignItems: "center",
            height: 150,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ProduksiBudidaya");
              // setVisibleModal(false);
            }}
          >
            <View
              style={[
                styles.cardApps,
                {
                  backgroundColor: COLORS.primary,
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                },
              ]}
            >
              <Image
                style={{
                  width: device === "tablet" ? 50 : 24,
                  height: device === "tablet" ? 50 : 18,
                }}
                source={require("../../assets/superApp/ikon-budidaya.png")}
              />
            </View>
          </TouchableOpacity>
          <Text
            style={{
              marginTop: 10,
              justifyContent: "center",
              alignItems: "center",
              fontSize: fontSizeResponsive("H4", device),
              width: device === "tablet" ? 200 : 100,
              textAlign: "center",
            }}
          >
            Produksi Budidaya
          </Text>
        </View>
      );
    }
    if (isRolePenangkapan) {
      menuDash.push(
        <View
          style={{
            alignItems: "center",
            height: 150,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: 100,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Penangkapan");
                // setVisibleModal(false);
              }}
            >
              <View
                style={[
                  styles.cardApps,
                  {
                    backgroundColor: COLORS.primary,
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                  },
                ]}
              >
                <Image
                  style={{
                    width: device === "tablet" ? 50 : 24,
                    height: device === "tablet" ? 50 : 18,
                  }}
                  source={require("../../assets/superApp/ikon-penangkapan.png")}
                />
              </View>
            </TouchableOpacity>
            <Text
              style={{
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
                fontSize: fontSizeResponsive("H4", device),
                width: device === "tablet" ? 200 : 100,
                textAlign: "center",
              }}
            >
              Produksi Penangkapan
            </Text>
          </View>
        </View>
      );
    }

    setListMenu(menuDash);
  }, [profile]);

  const numRows = Math.ceil(listMenu.length / 3);

  const renderRow = ({ item }) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    return (
      <View style={[styles.item, { height: device === "tablet" ? 200 : 100 }]}>
        <Text style={styles.itemText}>{item}</Text>
      </View>
    );
  };

  const rows = Array.from({ length: numRows }, (_, rowIndex) =>
    listMenu.slice(rowIndex * 3, rowIndex * 3 + 3)
  );

  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }

    return data;
  };

  const { device } = useSelector((state) => state.apps);
  return (
    <BottomSheetModalProvider>
      <>
        <View
          style={{
            flexDirection: "row",
            height: device === "tablet" ? 100 : 68,
            backgroundColor: COLORS.white,
            justifyContent: "space-around",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        >
          <TouchableOpacity
            key={1}
            onPress={() => {
              setTabItemIndex(1);
              navigation.navigate("Home", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
          >
            {tabItemIndex === 1 ? (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 65,
                  justifyContent: "center",
                  width: 80,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: 3,
                    backgroundColor: COLORS.primary,
                    position: "absolute",
                    top: 0,
                    //shadow ios
                    shadowOffset: { width: -2, height: 5 },
                    shadowColor: COLORS.primary,
                    shadowOpacity: 0.4,
                    //shadow android
                    elevation: 2,
                  }}
                />
                <Ionicons
                  name="home"
                  color={COLORS.primary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Home
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 65,
                  justifyContent: "center",
                  width: 80,
                }}
              >
                <Ionicons
                  name="home"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.tertiary,
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  Home
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            key={2}
            onPress={() => {
              setTabItemIndex(2);
              navigation.navigate("Satker", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
          >
            {tabItemIndex === 2 ? (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 65,
                  justifyContent: "center",
                  width: 80,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: 3,
                    backgroundColor: COLORS.primary,
                    position: "absolute",
                    top: 0,
                    //shadow ios
                    shadowOffset: { width: -2, height: 5 },
                    shadowColor: COLORS.primary,
                    shadowOpacity: 0.4,
                    //shadow android
                    elevation: 2,
                  }}
                />
                <Ionicons
                  name="business-outline"
                  color={COLORS.primary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  Satker
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 65,
                  justifyContent: "center",
                  width: 80,
                }}
              >
                <Ionicons
                  name="business-outline"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.tertiary,
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  Satker
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* <TouchableOpacity
                            key={4}
                            onPress={() => {
                                setTabItemIndex(4)
                                // navigation.navigate('Tp', { unread: false })
                                setVisibleModal(true)
                            }}
                            style={{
                                top: -35,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            <View style={{
                                backgroundColor: COLORS.white,
                                height: 70,
                                width: 70,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 50
                            }}>
                                <View style={{
                                    backgroundColor: COLORS.primary,
                                    width: 51,
                                    height: 51,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 50
                                }}>
                                    <Ionicons name='grid-outline' color={COLORS.white} size={24} />
                                </View>
                            </View>
                        </TouchableOpacity> */}

          {isRole ? (
            <TouchableOpacity
              key={3}
              onPress={() => {
                setTabItemIndex(3);
                // setVisibleModal(true);
                navigation.navigate("MenuDashboard", { unread: false });
                // props.navigation.navigate('Home', { unread: false })
              }}
            >
              {tabItemIndex === 3 ? (
                <View
                  style={{
                    alignItems: "center",
                    height: device === "tablet" ? 100 : 65,
                    justifyContent: "center",
                    width: device === "tablet" ? 130 : 80,
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      height: 3,
                      backgroundColor: COLORS.primary,
                      position: "absolute",
                      top: 0,
                      //shadow ios
                      shadowOffset: { width: -2, height: 5 },
                      shadowColor: COLORS.primary,
                      shadowOpacity: 0.4,
                      //shadow android
                      elevation: 2,
                    }}
                  />
                  <Ionicons
                    name="grid-outline"
                    color={COLORS.primary}
                    size={device === "tablet" ? 40 : 24}
                  />
                  <Text
                    style={{
                      color: COLORS.primary,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Dashboard
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    alignItems: "center",
                    height: device === "tablet" ? 100 : 65,
                    justifyContent: "center",
                    width: device === "tablet" ? 130 : 80,
                  }}
                >
                  <Ionicons
                    name="grid-outline"
                    color={COLORS.tertiary}
                    size={device === "tablet" ? 40 : 24}
                  />
                  <Text
                    style={{
                      color: COLORS.tertiary,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    Dashboard
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            key={5}
            onPress={() => {
              setTabItemIndex(5);
              navigation.navigate("HelpDesk", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
          >
            {tabItemIndex === 5 ? (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 65,
                  justifyContent: "center",
                  width: device === "tablet" ? 98 : 80,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: 3,
                    backgroundColor: COLORS.primary,
                    position: "absolute",
                    top: 0,
                    //shadow ios
                    shadowOffset: { width: -2, height: 5 },
                    shadowColor: COLORS.primary,
                    shadowOpacity: 0.4,
                    //shadow android
                    elevation: 2,
                  }}
                />
                <Ionicons
                  name="reader"
                  color={COLORS.primary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Help Desk
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 65,
                  justifyContent: "center",
                  width: device === "tablet" ? 98 : 80,
                }}
              >
                <Ionicons
                  name="reader"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.tertiary,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Help Desk
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            key={6}
            onPress={() => {
              setTabItemIndex(6);
              navigation.navigate("Profile", { unread: false });
              // props.navigation.navigate('Home', { unread: false })
            }}
          >
            {tabItemIndex === 6 ? (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 65,
                  justifyContent: "center",
                  width: 80,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: 3,
                    backgroundColor: COLORS.primary,
                    position: "absolute",
                    top: 0,
                    //shadow ios
                    shadowOffset: { width: -2, height: 5 },
                    shadowColor: COLORS.primary,
                    shadowOpacity: 0.4,
                    //shadow android
                    elevation: 2,
                  }}
                />
                <Ionicons
                  name="person"
                  color={COLORS.primary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.primary,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Profile
                </Text>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  height: device === "tablet" ? 100 : 65,
                  justifyContent: "center",
                  width: 80,
                }}
              >
                <Ionicons
                  name="person"
                  color={COLORS.tertiary}
                  size={device === "tablet" ? 40 : 24}
                />
                <Text
                  style={{
                    color: COLORS.tertiary,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Profile
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        {/* 
                
                
                <View style={{ flexDirection: 'row', gap: 35, marginVertical: 20, justifyContent: 'flex-end', flex: 1, marginRight: 20 }}>
                
                
                
            </View> */}

        <Modal
          animationType="fade"
          transparent={true}
          visible={visibleModal}
          onRequestClose={() => {
            setVisibleModal(!visibleModal);
          }}
        >
          <TouchableOpacity
            style={[
              Platform.OS === "ios"
                ? styles.iOSBackdrop
                : styles.androidBackdrop,
              styles.backdrop,
            ]}
          />
          <View style={{ alignItems: "center", flex: 1 }}>
            <View
              style={{
                backgroundColor: COLORS.white,
                width: "90%",
                height: hp(43),
                borderRadius: 10,
                marginTop: device === "tablet" ? "40%" : "70%",
              }}
            >
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 10,
                  borderBottomWidth: 2,
                  borderBottomColor: COLORS.grey,
                }}
              >
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Dashboard
                </Text>
                <TouchableOpacity
                  style={{ alignItems: "center", justifyContent: "center" }}
                  onPress={() => {
                    setVisibleModal(false);
                  }}
                >
                  <Ionicons
                    name="close-outline"
                    size={device === "tablet" ? 40 : 24}
                    color={COLORS.lighter}
                  />
                </TouchableOpacity>
              </View>

              <FlatList
                data={formatData(listMenu, numColumns)}
                renderItem={renderRow}
                keyExtractor={(row, index) => `row_${index}`}
                columnWrapperStyle={{
                  gap: 5,
                }}
                numColumns={numColumns}
              />
            </View>
          </View>
          {/* <TouchableOpacity
                        onPress={() => {
                            setVisibleModal(false)
                        }}
                        style={{
                            position: 'absolute',
                            bottom: '9%',
                            left: '40%'
                        }}>
                        <View style={{
                            backgroundColor: COLORS.white,
                            height: 70,
                            width: 70,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 50
                        }}>
                            <View style={{
                                backgroundColor: COLORS.primary,
                                width: 51,
                                height: 51,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 50
                            }}>
                                <Ionicons name='close-outline' color={COLORS.white} size={24} />
                            </View>
                        </View>
                    </TouchableOpacity> */}
        </Modal>
      </>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  iOSBackdrop: {
    backgroundColor: "#000000",
    opacity: 0.3,
  },
  androidBackdrop: {
    backgroundColor: "#232f34",
    opacity: 0.32,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cardApps: {
    width: wp(15),
    height: wp(15),
    borderRadius: 50,
    shadowOffset: { width: -2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    //shadow android
    elevation: 5,
  },
  item: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    margin: 1, // approximate a square
    marginTop: 10,
  },
  itemInvisible: {
    backgroundColor: "transparent",
  },
  itemText: {
    color: "#fff",
  },
});
export default MyTabBar;
