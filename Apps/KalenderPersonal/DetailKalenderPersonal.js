import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import {
  COLORS,
  DATETIME,
  DateFormat,
  FONTSIZE,
  FONTWEIGHT,
  extraKeyKorespondensi,
  fontSizeResponsive,
  getOrientation,
} from "../../config/SuperAppps";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment/moment";
import { openURL } from "expo-linking";

export const DetailKalenderPersonal = () => {
  const { personal, loading } = useSelector((state) => state.kalenderPersonal);
  const navigation = useNavigation();
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);
  const detail = personal.detail;

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  const { device } = useSelector((state) => state.apps);

  // console.log(JSON.stringify(detail));

  return (
    <ScrollView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: COLORS.primary,
          height: 80,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 20,
            width: device === "tablet" ? 40 : 28,
            height: device === "tablet" ? 40 : 28,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
          }}
        >
          <TouchableOpacity style={{}} onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-outline"
              size={device === "tablet" ? 40 : 24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: "center", marginRight: 50 }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("Judul", device),
              fontWeight: 600,
              color: COLORS.white,
            }}
          >
            Detail Kalender Personal
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        {detail.kategori === "undangan" ? (
          <View
            style={{
              backgroundColor: COLORS.white,
              width: "90%",
              borderRadius: 8,
            }}
          >
            {loading ? (
              <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              </View>
            ) : (
              <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("Judul", device),
                  }}
                >
                  {detail.name}
                </Text>
              </View>
            )}

            <View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "row",
                }}
              >
                <View style={{ width: "50%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Tanggal Pelaksanaan
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <View style={{ width: device === "tablet" ? 300 : 150 }}>
                    <Text
                      style={{
                        justifyContent: "center",
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      {moment(detail.start_date, "YYYY-MM-DD HH:mm:ss")
                        .locale("id")
                        .format(DATETIME.LONG_DATE)}{" "}
                      -{" "}
                      {moment(detail.end_date, "YYYY-MM-DD HH:mm:ss")
                        .locale("id")
                        .format(DATETIME.LONG_DATE)}
                    </Text>
                  </View>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  marginTop: 10,
                  marginHorizontal: 20,
                  backgroundColor: COLORS.lighter,
                  opacity: 0.2,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "row",
                }}
              >
                <View style={{ width: "50%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Pukul Pelaksanaan
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <Text
                    style={{
                      justifyContent: "center",
                      width: "60%",
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {detail.extra_attributes?.start_time}
                    {detail.extra_attributes?.timezone}-{" "}
                    {detail.extra_attributes?.end_time}{" "}
                    {detail.extra_attributes?.end_time === "Selesai"
                      ? ""
                      : detail.extra_attributes?.timezone}
                  </Text>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  opacity: 0.2,
                  marginTop: 10,
                  marginHorizontal: 20,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "row",
                }}
              >
                <View style={{ width: "50%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Lokasi
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <View
                    style={{
                      justifyContent: "center",
                      width: "50%",
                    }}
                  >
                    <Text
                      style={{ fontSize: fontSizeResponsive("H4", device) }}
                    >
                      {detail?.location === "" || detail.location === null
                        ? "-"
                        : detail?.location}
                    </Text>
                  </View>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  marginTop: 10,
                  marginHorizontal: 20,
                  backgroundColor: COLORS.lighter,
                  opacity: 0.2,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "column",
                }}
              >
                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Kepada
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <View
                    style={{
                      justifyContent: "center",
                      marginVertical: 8,
                    }}
                  >
                    {detail?.extra_attributes?.kepada?.length !== 0 &&
                    detail?.extra_attributes?.kepada !== undefined ? (
                      detail?.extra_attributes?.kepada?.map((item, index) => {
                        return (
                          <View
                            key={index}
                            style={{
                              flexDirection: "row",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              {index + 1}.{" "}
                            </Text>
                            {/* <Image
                              source={{ uri: item.avatar_url }}
                              style={{
                                marginLeft: -8,
                                borderWidth: 2,
                                borderRadius: 50,
                                borderColor: COLORS.white,
                                width: 30,
                                height: 30,
                              }}
                            /> */}
                            <Text
                              style={{
                                // width: device === "tablet" ? 300 : 100,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              {item}
                            </Text>
                          </View>
                        );
                      })
                    ) : (
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        -
                      </Text>
                    )}
                  </View>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  marginTop: 10,
                  marginHorizontal: 20,
                  opacity: 0.2,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "column",
                }}
              >
                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Tembusan
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <View style={{ justifyContent: "center", marginVertical: 8 }}>
                    {detail?.extra_attributes?.list_tembusan?.length !== 0 &&
                    detail?.extra_attributes?.list_tembusan !== null ? (
                      detail?.extra_attributes?.list_tembusan?.map(
                        (item, index) => {
                          return (
                            <View
                              key={index}
                              style={{
                                flexDirection: "row",
                                gap: 8,
                                alignItems: "center",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {index + 1}.{" "}
                              </Text>
                              {/* <Image
                              source={{ uri: item.avatar_url }}
                              style={{
                                marginLeft: -8,
                                borderWidth: 2,
                                borderRadius: 50,
                                borderColor: COLORS.white,
                                width: 30,
                                height: 30,
                              }}
                            /> */}
                              <Text
                                style={{
                                  // width: device === "tablet" ? 300 : 100,
                                  width: "100%",
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {item}
                              </Text>
                            </View>
                          );
                        }
                      )
                    ) : (
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        -
                      </Text>
                    )}
                  </View>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  marginTop: 10,
                  marginHorizontal: 20,
                  opacity: 0.2,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "column",
                }}
              >
                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Member
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <View style={{ justifyContent: "center", marginVertical: 8 }}>
                    {detail?.members?.map((item, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {index + 1}.{" "}
                          </Text>
                          <Image
                            source={{ uri: item.avatar_url }}
                            style={{
                              marginLeft: -8,
                              borderWidth: 2,
                              borderRadius: 50,
                              borderColor: COLORS.white,
                              width: device === "tablet" ? 50 : 30,
                              height: device === "tablet" ? 50 : 30,
                            }}
                          />
                          <Text
                            style={{
                              // width:
                              //   device === "tablet" && orientation === "potrait"
                              //     ? 250
                              //     : device === "tablet" &&
                              //       orientation === "landscape"
                              //     ? 300
                              //     : 100,
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {item.nama}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  marginTop: 10,
                  marginHorizontal: 20,
                  opacity: 0.2,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "column",
                }}
              >
                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Disposisi
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <View style={{ justifyContent: "center", marginVertical: 8 }}>
                    {detail?.disposisi?.length === 0 ? ( // Cek panjang array
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        -
                      </Text> // Tampilkan "-"
                    ) : (
                      detail?.disposisi?.map((item, index) => (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {index + 1}.{" "}
                          </Text>
                          <Image
                            source={{ uri: item.avatar_url }}
                            style={{
                              marginLeft: -8,
                              borderWidth: 2,
                              borderRadius: 50,
                              borderColor: COLORS.white,
                              width: device === "tablet" ? 50 : 30,
                              height: device === "tablet" ? 50 : 30,
                            }}
                          />
                          <Text
                            style={{
                              // width:
                              //   device === "tablet" &&
                              //   orientation === "portrait"
                              //     ? 250
                              //     : device === "tablet" &&
                              //       orientation === "landscape"
                              //     ? 300
                              //     : 100,
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {item.nama}
                          </Text>
                        </View>
                      ))
                    )}
                  </View>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  marginTop: 10,
                  marginHorizontal: 20,
                  opacity: 0.2,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  margin: 20,
                  flexDirection: "row",
                }}
              >
                <View style={{ width: "50%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Nomor Surat
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <Pressable
                    style={{
                      justifyContent: "center",
                      width: "50%",
                    }}
                    onPress={() => {
                      if (detail?.extra_attributes?.view_url !== undefined) {
                        openURL(detail?.extra_attributes?.view_url);
                      }
                    }}
                  >
                    <Text
                      style={{
                        color: COLORS.info,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      {detail?.letter_number}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>

            {/* <View>
            <View
              style={{
                marginHorizontal: 20,
                marginTop: 20,
                flexDirection: "row",
              }}
            >
              <View style={{ width: "30%" }}>
                <Text
                  style={{
                    fontSize: FONTSIZE.H2,
                    fontWeight: FONTWEIGHT.bold,
                  }}
                >
                  Kepada
                </Text>
              </View>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : (
                <View style={{ justifyContent: "center", width: 150 }}>
                  {detail.kepada.length === 0 ? (
                    <Text>-</Text>
                  ) : (
                    detail.kepada?.map((item, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            alignItems: "center",
                          }}
                        >
                          <Text>{index + 1}. </Text>
                          <Text>{item.title.name}</Text>
                        </View>
                      );
                    })
                  )}
                </View>
              )}
            </View>
            <View
              style={{
                height: 1,
                width: "90%",
                backgroundColor: COLORS.lighter,
                opacity: 0.3,
                marginTop: 10,
                marginHorizontal: 20,
              }}
            />
          </View> */}

            {/* <View>
            <View
              style={{
                marginHorizontal: 20,
                marginTop: 20,
                flexDirection: "row",
              }}
            >
              <View style={{ width: "30%" }}>
                <Text
                  style={{
                    fontSize: FONTSIZE.H2,
                    fontWeight: FONTWEIGHT.bold,
                  }}
                >
                  Tembusan
                </Text>
              </View>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              ) : (
                <View style={{ justifyContent: "center", width: 150 }}>
                  {detail.tembusan?.length === 0 ? (
                    <Text>-</Text>
                  ) : (
                    detail.tembusan?.map((item, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            alignItems: "center",
                          }}
                        >
                          <Text>{index + 1}. </Text>

                          <Text>{item.title.name}</Text>
                        </View>
                      );
                    })
                  )}
                </View>
              )}
            </View>
            <View
              style={{
                height: 1,
                width: "90%",
                backgroundColor: COLORS.lighter,
                opacity: 0.3,
                marginTop: 10,
                marginHorizontal: 20,
              }}
            />
          </View> */}

            {/* <View
            style={{ marginTop: 20, marginHorizontal: 20, marginBottom: 10 }}
          >
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: FONTSIZE.Judul,
              }}
            >
              Informasi Detail
            </Text>
          </View>

          {detail?.extra_attributes &&
            Object.keys(detail?.extra_attributes).map((data) => {
              const value = detail.extra_attributes[data];

              if (
                data === "members_list" ||
                data === "list_kepada" ||
                data === "list_tembusan"
              )
                return null;

              if (
                data === "kepada_internal" ||
                data === "kepada_eksternal" ||
                data === "tembusan_internal" ||
                data === "tembusan_eksternal"
              ) {
                return (
                  <View>
                    <View
                      style={{
                        marginHorizontal: 20,
                        marginTop: 20,
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ width: "50%" }}>
                        <Text
                          style={{
                            fontSize: FONTSIZE.H2,
                            fontWeight: FONTWEIGHT.bold,
                          }}
                        >
                          {extraKeyKorespondensi[data]}
                        </Text>
                      </View>
                      {loading ? (
                        <ShimmerPlaceHolder
                          style={{ borderRadius: 4 }}
                          width={100}
                          height={20}
                        />
                      ) : value.length !== 0 ? (
                        value.map((item, index) => (
                          <View
                            style={{
                              justifyContent: "center",
                              width: "50%",
                            }}
                          >
                            <Text>{item}</Text>
                          </View>
                        ))
                      ) : (
                        <Text
                          style={{
                            justifyContent: "center",
                            width: "50%",
                          }}
                        >
                          -
                        </Text>
                      )}
                    </View>
                    <View
                      style={{
                        height: 1,
                        width: "90%",
                        backgroundColor: COLORS.lighter,
                        opacity: 0.3,
                        marginTop: 10,
                        marginHorizontal: 20,
                        marginBottom: 20,
                      }}
                    />
                  </View>
                );
              }
            })} */}
          </View>
        ) : detail.kategori === "cuti" ? (
          <View
            style={{
              backgroundColor: COLORS.white,
              width: "90%",
              borderRadius: 8,
            }}
          >
            {loading ? (
              <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              </View>
            ) : (
              <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("Judul", device),
                  }}
                >
                  {detail.name}
                </Text>
              </View>
            )}

            <View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "row",
                }}
              >
                <View style={{ width: "50%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Waktu Pelaksanaan
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <Text
                    style={{
                      justifyContent: "center",
                      width: "50%",
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {moment(detail.start_date, "YYYY-MM-DD HH:mm:ss")
                      .locale("id")
                      .format(DATETIME.LONG_DATE)}{" "}
                    -{" "}
                    {moment(detail.end_date, "YYYY-MM-DD HH:mm:ss")
                      .locale("id")
                      .format(DATETIME.LONG_DATE)}
                  </Text>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  opacity: 0.2,
                  marginTop: 10,
                  marginHorizontal: 20,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "row",
                }}
              >
                <View style={{ width: "50%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Tempat
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <Text
                    style={{
                      justifyContent: "center",
                      width:
                        device === "tablet" && orientation === "potrait"
                          ? 300
                          : device === "tablet" && orientation === "landscape"
                          ? 400
                          : 150,
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {detail.location}
                  </Text>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  opacity: 0.2,
                  marginTop: 10,
                  marginHorizontal: 20,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "row",
                }}
              >
                <View style={{ width: "50%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Pengaju
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <Text
                    style={{
                      justifyContent: "center",
                      width: "50%",
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {detail?.members[0]?.nama}
                  </Text>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  opacity: 0.2,
                  marginTop: 10,
                  marginHorizontal: 20,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "row",
                }}
              >
                <View style={{ width: "50%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Alasan
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <Text
                    style={{
                      justifyContent: "center",
                      width: "50%",
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {detail?.extra_attributes?.alasan
                      ? detail?.extra_attributes?.alasan
                      : "-"}
                  </Text>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  opacity: 0.2,
                  marginTop: 10,
                  marginHorizontal: 20,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  margin: 20,
                  flexDirection: "row",
                }}
              >
                <View style={{ width: "50%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Kota
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <Text
                    style={{
                      justifyContent: "center",
                      width: "50%",
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {detail?.extra_attributes?.kota
                      ? detail?.extra_attributes?.kota
                      : "-"}
                  </Text>
                )}
              </View>
              {/* <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  opacity: 0.2,
                  marginTop: 10,
                  marginHorizontal: 20,
                }}
              /> */}
            </View>
          </View>
        ) : detail.kategori === "tugas" ? (
          <View
            style={{
              backgroundColor: COLORS.white,
              width: "90%",
              borderRadius: 8,
            }}
          >
            {loading ? (
              <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              </View>
            ) : (
              <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("Judul", device),
                  }}
                >
                  {detail.name}
                </Text>
              </View>
            )}

            <View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "row",
                }}
              >
                <View style={{ width: "50%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Lokasi
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <Text
                    style={{
                      justifyContent: "center",
                      width: "50%",
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {detail?.extra_attributes?.kota_awal}
                  </Text>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  opacity: 0.2,
                  marginTop: 10,
                  marginHorizontal: 20,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "column",
                }}
              >
                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Kepada
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <View style={{ justifyContent: "center", marginVertical: 8 }}>
                    {detail?.extra_attributes?.kepada?.length !== 0 ? (
                      detail?.extra_attributes?.kepada?.map((item, index) => {
                        return (
                          <View
                            key={index}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 8,
                              marginTop: 5,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              {index + 1}.{" "}
                            </Text>
                            <Text
                              style={{
                                // width: device === "tablet" ? 300 : 120,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              {item}
                            </Text>
                          </View>
                        );
                      })
                    ) : (
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        -
                      </Text>
                    )}
                  </View>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  marginTop: 10,
                  marginHorizontal: 20,
                  opacity: 0.2,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "column",
                }}
              >
                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Tembusan
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <View style={{ justifyContent: "center", marginVertical: 8 }}>
                    {detail?.extra_attributes?.list_tembusan?.length !== 0 &&
                    detail?.extra_attributes?.list_tembusan !== null ? (
                      detail?.extra_attributes?.list_tembusan?.map(
                        (item, index) => {
                          return (
                            <View
                              key={index}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 8,
                                marginTop: 5,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {index + 1}.{" "}
                              </Text>
                              <Text
                                style={{
                                  // width: device === "tablet" ? 300 : 120,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {item}
                              </Text>
                            </View>
                          );
                        }
                      )
                    ) : (
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        -
                      </Text>
                    )}
                  </View>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  marginTop: 10,
                  marginHorizontal: 20,
                  opacity: 0.2,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "column",
                }}
              >
                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Member
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <View style={{ justifyContent: "center", marginVertical: 8 }}>
                    {detail?.members?.map((item, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {index + 1}.{" "}
                          </Text>
                          <Image
                            source={{ uri: item.avatar_url }}
                            style={{
                              marginLeft: -8,
                              borderWidth: 2,
                              borderRadius: 50,
                              borderColor: COLORS.white,
                              width: device === "tablet" ? 50 : 30,
                              height: device === "tablet" ? 50 : 30,
                            }}
                          />
                          <Text
                            style={{
                              // width:
                              //   device === "tablet" && orientation === "potrait"
                              //     ? 200
                              //     : device === "tablet" &&
                              //       orientation === "landscape"
                              //     ? 300
                              //     : 100,
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {item.nama}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  opacity: 0.2,
                  marginTop: 10,
                  marginHorizontal: 20,
                }}
              />

              <View>
                <View
                  style={{
                    marginHorizontal: 20,
                    marginTop: 20,
                    flexDirection: "column",
                  }}
                >
                  <View style={{ width: "100%" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H4", device),
                        fontWeight: FONTWEIGHT.bold,
                      }}
                    >
                      Disposisi
                    </Text>
                  </View>
                  {loading ? (
                    <ShimmerPlaceHolder
                      style={{ borderRadius: 4 }}
                      width={100}
                      height={20}
                    />
                  ) : (
                    <View
                      style={{ justifyContent: "center", marginVertical: 8 }}
                    >
                      {detail?.disposisi?.length === 0 ? ( // Cek panjang array
                        <Text
                          style={{ fontSize: fontSizeResponsive("H4", device) }}
                        >
                          -
                        </Text> // Tampilkan "-"
                      ) : (
                        detail?.disposisi?.map((item, index) => (
                          <View
                            key={index}
                            style={{
                              flexDirection: "row",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              {index + 1}.{" "}
                            </Text>
                            <Image
                              source={{ uri: item.avatar_url }}
                              style={{
                                marginLeft: -8,
                                borderWidth: 2,
                                borderRadius: 50,
                                borderColor: COLORS.white,
                                width: device === "tablet" ? 50 : 30,
                                height: device === "tablet" ? 50 : 30,
                              }}
                            />
                            <Text
                              style={{
                                // width:
                                //   device === "tablet" &&
                                //   orientation === "portrait"
                                //     ? 250
                                //     : device === "tablet" &&
                                //       orientation === "landscape"
                                //     ? 300
                                //     : 100,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              {item.nama}
                            </Text>
                          </View>
                        ))
                      )}
                    </View>
                  )}
                </View>
              </View>

              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  marginTop: 10,
                  marginHorizontal: 20,
                  opacity: 0.2,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "column",
                }}
              >
                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Tujuan
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <View
                    style={{
                      justifyContent: "center",
                      marginVertical: 8,
                      gap: 10,
                    }}
                  >
                    {detail?.extra_attributes?.tujuan?.length !== 0 ? (
                      detail?.extra_attributes?.tujuan?.map((item, index) => {
                        return (
                          <View
                            style={{
                              flexDirection: "row",
                              gap: 8,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              -
                            </Text>
                            <View style={{ width: "100%" }}>
                              <View
                                key={index}
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <Text
                                  style={{
                                    // width: device === "tablet" ? 300 : 160,
                                    width: "100%",
                                    fontSize: fontSizeResponsive("H4", device),
                                  }}
                                >
                                  {moment(item?.tangal_mulai).format(
                                    "DD/MM/YYYY"
                                  )}{" "}
                                  -{" "}
                                  {moment(item?.tanggal_selesai).format(
                                    "DD/MM/YYYY"
                                  )}
                                </Text>
                              </View>
                              <Text
                                style={{
                                  // width: device === "tablet" ? 300 : 160,
                                  marginVertical: 5,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                Lokasi {index + 1} Perjalanan Dinas
                              </Text>
                              <Text
                                style={{
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {item.kota}
                              </Text>
                            </View>
                          </View>
                        );
                      })
                    ) : (
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        -
                      </Text>
                    )}
                  </View>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  opacity: 0.2,
                  marginTop: 10,
                  marginHorizontal: 20,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  margin: 20,
                  flexDirection: "row",
                }}
              >
                <View style={{ width: "50%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    No Surat
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <Pressable
                    onPress={() => {
                      if (detail?.extra_attributes?.view_url !== undefined) {
                        openURL(detail?.extra_attributes?.view_url);
                      }
                    }}
                    style={{ width: "50%" }}
                  >
                    <Text
                      style={{
                        justifyContent: "center",
                        // width: device === "tablet" ? "100%" : "80%",
                        color: COLORS.info,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      {detail?.extra_attributes?.nomor_surat}
                    </Text>
                  </Pressable>
                )}
              </View>
              {/* <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  opacity: 0.2,
                  margin: 20,
                }}
              /> */}
            </View>
          </View>
        ) : detail.kategori === "perintah" ? (
          <View
            style={{
              backgroundColor: COLORS.white,
              width: "90%",
              borderRadius: 8,
            }}
          >
            {loading ? (
              <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4 }}
                  width={100}
                  height={20}
                />
              </View>
            ) : (
              <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.bold,
                    fontSize: fontSizeResponsive("Judul", device),
                  }}
                >
                  {detail.name}
                </Text>
              </View>
            )}

            <View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "row",
                }}
              >
                <View style={{ width: "50%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Lokasi
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <Text
                    style={{
                      justifyContent: "center",
                      width: "50%",
                      fontSize: fontSizeResponsive("H4", device),
                    }}
                  >
                    {detail?.extra_attributes?.kota_awal}
                  </Text>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  opacity: 0.2,
                  marginTop: 10,
                  marginHorizontal: 20,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "column",
                }}
              >
                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Kepada
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <View style={{ justifyContent: "center", marginVertical: 8 }}>
                    {detail?.extra_attributes?.kepada?.length !== 0 ? (
                      detail?.extra_attributes?.kepada?.map((item, index) => {
                        return (
                          <View
                            key={index}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 8,
                              marginTop: 5,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              {index + 1}.{" "}
                            </Text>
                            <Text
                              style={{
                                // width:
                                //   device === "tablet" &&
                                //   orientation === "potrait"
                                //     ? 300
                                //     : device === "tablet" &&
                                //       orientation === "landscape"
                                //     ? 350
                                //     : 120,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              {item}
                            </Text>
                          </View>
                        );
                      })
                    ) : (
                      <Text>-</Text>
                    )}
                  </View>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  marginTop: 10,
                  marginHorizontal: 20,
                  opacity: 0.2,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "column",
                }}
              >
                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Tembusan
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <View style={{ justifyContent: "center", marginVertical: 8 }}>
                    {detail?.extra_attributes?.list_tembusan?.length !== 0 &&
                    detail?.extra_attributes?.list_tembusan !== null ? (
                      detail?.extra_attributes?.list_tembusan?.map(
                        (item, index) => {
                          return (
                            <View
                              key={index}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 8,
                                marginTop: 5,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {index + 1}.{" "}
                              </Text>
                              <Text
                                style={{
                                  // width:
                                  //   device === "tablet" &&
                                  //   orientation === "potrait"
                                  //     ? 300
                                  //     : device === "tablet" &&
                                  //       orientation === "landscape"
                                  //     ? 350
                                  //     : 120,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {item}
                              </Text>
                            </View>
                          );
                        }
                      )
                    ) : (
                      <Text>-</Text>
                    )}
                  </View>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  marginTop: 10,
                  marginHorizontal: 20,
                  opacity: 0.2,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "column",
                }}
              >
                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Member
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <View style={{ justifyContent: "center", marginVertical: 8 }}>
                    {detail?.members?.map((item, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {index + 1}.{" "}
                          </Text>
                          <Image
                            source={{ uri: item.avatar_url }}
                            style={{
                              marginLeft: -8,
                              borderWidth: 2,
                              borderRadius: 50,
                              borderColor: COLORS.white,
                              width: device === "tablet" ? 50 : 30,
                              height: device === "tablet" ? 50 : 30,
                            }}
                          />
                          <Text
                            style={{
                              // width:
                              //   device === "tablet" && orientation === "potrait"
                              //     ? 200
                              //     : device === "tablet" &&
                              //       orientation === "landscape"
                              //     ? 350
                              //     : 100,
                              fontSize: fontSizeResponsive("H4", device),
                            }}
                          >
                            {item.nama}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  opacity: 0.2,
                  marginTop: 10,
                  marginHorizontal: 20,
                }}
              />

              <View>
                <View
                  style={{
                    marginHorizontal: 20,
                    marginTop: 20,
                    flexDirection: "column",
                  }}
                >
                  <View style={{ width: "100%" }}>
                    <Text
                      style={{
                        fontSize: fontSizeResponsive("H4", device),
                        fontWeight: FONTWEIGHT.bold,
                      }}
                    >
                      Disposisi
                    </Text>
                  </View>
                  {loading ? (
                    <ShimmerPlaceHolder
                      style={{ borderRadius: 4 }}
                      width={100}
                      height={20}
                    />
                  ) : (
                    <View
                      style={{ justifyContent: "center", marginVertical: 8 }}
                    >
                      {detail?.disposisi?.length === 0 ? ( // Cek panjang array
                        <Text
                          style={{ fontSize: fontSizeResponsive("H4", device) }}
                        >
                          -
                        </Text> // Tampilkan "-"
                      ) : (
                        detail?.disposisi?.map((item, index) => (
                          <View
                            key={index}
                            style={{
                              flexDirection: "row",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              {index + 1}.{" "}
                            </Text>
                            <Image
                              source={{ uri: item.avatar_url }}
                              style={{
                                marginLeft: -8,
                                borderWidth: 2,
                                borderRadius: 50,
                                borderColor: COLORS.white,
                                width: device === "tablet" ? 50 : 30,
                                height: device === "tablet" ? 50 : 30,
                              }}
                            />
                            <Text
                              style={{
                                // width:
                                //   device === "tablet" &&
                                //   orientation === "portrait"
                                //     ? 250
                                //     : device === "tablet" &&
                                //       orientation === "landscape"
                                //     ? 300
                                //     : 100,
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              {item.nama}
                            </Text>
                          </View>
                        ))
                      )}
                    </View>
                  )}
                </View>
              </View>

              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  marginTop: 10,
                  marginHorizontal: 20,
                  opacity: 0.2,
                }}
              />
            </View>

            <View>
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 20,
                  flexDirection: "column",
                }}
              >
                <View style={{ width: "100%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    Tujuan
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <View
                    style={{
                      justifyContent: "center",
                      marginVertical: 8,
                      gap: 10,
                    }}
                  >
                    {detail?.extra_attributes?.tujuan?.length !== 0 ? (
                      detail?.extra_attributes?.tujuan?.map((item, index) => {
                        return (
                          <View
                            style={{
                              flexDirection: "row",
                              gap: 5,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: fontSizeResponsive("H4", device),
                              }}
                            >
                              -
                            </Text>
                            <View style={{ width: "100%" }}>
                              <View
                                key={index}
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <Text
                                  style={{
                                    // width: device === "tablet" ? 300 : 160,
                                    fontSize: fontSizeResponsive("H4", device),
                                  }}
                                >
                                  {moment(item?.tangal_mulai).format(
                                    "DD/MM/YYYY"
                                  )}{" "}
                                  -{" "}
                                  {moment(item?.tanggal_selesai).format(
                                    "DD/MM/YYYY"
                                  )}
                                </Text>
                              </View>
                              <Text
                                style={{
                                  // width: device === "tablet" ? 300 : 160,
                                  marginVertical: 5,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                Lokasi {index + 1} Perjalanan Dinas
                              </Text>
                              <Text
                                style={{
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {item.kota}
                              </Text>
                            </View>
                          </View>
                        );
                      })
                    ) : (
                      <Text
                        style={{ fontSize: fontSizeResponsive("H4", device) }}
                      >
                        -
                      </Text>
                    )}
                  </View>
                )}
              </View>
              <View
                style={{
                  height: 1,
                  width: "90%",
                  backgroundColor: COLORS.lighter,
                  opacity: 0.2,
                  marginTop: 10,
                  marginHorizontal: 20,
                }}
              />
            </View>
            <View>
              <View
                style={{
                  margin: 20,
                  flexDirection: "row",
                }}
              >
                <View style={{ width: "50%" }}>
                  <Text
                    style={{
                      fontSize: fontSizeResponsive("H4", device),
                      fontWeight: FONTWEIGHT.bold,
                    }}
                  >
                    No Surat
                  </Text>
                </View>
                {loading ? (
                  <ShimmerPlaceHolder
                    style={{ borderRadius: 4 }}
                    width={100}
                    height={20}
                  />
                ) : (
                  <Pressable
                    onPress={() => {
                      if (detail?.extra_attributes?.view_url !== undefined) {
                        openURL(detail?.extra_attributes?.view_url);
                      }
                    }}
                    style={{ width: "50%" }}
                  >
                    <Text
                      style={{
                        justifyContent: "center",
                        // width: device === "tablet" ? "100%" : "50%",

                        color: COLORS.info,
                        fontSize: fontSizeResponsive("H4", device),
                      }}
                    >
                      {detail?.extra_attributes?.nomor_surat}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1, // Prevent a random Android rendering issue
    backgroundColor: "white",
    borderRadius: 8,
    marginRight: 40,
    marginTop: 20,
    // borderTopLeftRadius: 8,
    // borderTopRightRadius: 8
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  galeri: {
    flex: 1, // Prevent a random Android rendering issue
    backgroundColor: "white",
    borderRadius: 8,
  },
  container: {
    marginVertical: 20,
    flex: 1,
    alignItems: "center",
  },
});
