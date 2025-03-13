import React, { useRef, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  AVATAR,
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
} from "../../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ScrollView } from "react-native";
import DatePicker from "react-native-modern-datepicker";
import moment from "moment";

export const OutgoingList = ({ navigation }) => {
  // ref
  const bottomSheetModalRef = useRef(null);

  // variables
  // const snapPoints = useMemo(() => [50, "100%"], []);
  const initialSnapPoints = useMemo(() => ["CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  const bottomSheetAttach = () => {
    bottomSheetModalRef.current?.present();
  };

  const bottomSheetAttachClose = () => {
    if (bottomSheetModalRef.current) bottomSheetModalRef.current?.close();
  };

  //Pilih Tanggal
  const [modalVisiblePicker, setModalVisiblePicker] = useState("");
  const [TanggalMulai, setTanggalMulai] = useState("");
  const [TanggalSelesai, setTanggalSelsai] = useState("");

  return (
    <BottomSheetModalProvider>
      <View style={{ paddingHorizontal: 20 }}>
        <View
          style={{
            marginVertical: 15,
            borderRadius: 8,
            flexDirection: "row",
          }}
        >
          <TextInput
            placeholder="Cari..."
            style={{
              width: "85%",
              backgroundColor: "#FFFFFF",
              marginRight: 10,
              borderRadius: 8,
              paddingStart: 10,
              //shadow ios
              shadowOffset: { width: -2, height: 4 },
              shadowColor: "#171717",
              shadowOpacity: 0.2,
              //shadow android
              elevation: 2,
            }}
            allowFontScaling={false}
          />
          <TouchableOpacity
            onPress={() => bottomSheetAttach()}
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 8,
              height: 54,
              width: "12%",
              justifyContent: "center",
              alignItems: "center",
              //shadow ios
              shadowOffset: { width: -2, height: 4 },
              shadowColor: "#171717",
              shadowOpacity: 0.2,
              //shadow android
              elevation: 2,
            }}
            // onPress={() => navigation.navigate("PostinganBaru")}
          >
            <Ionicons name="filter-outline" size={24} color={COLORS.lighter} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ marginBottom: "5%" }}>
        <View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View
              style={{
                backgroundColor: "#5C5E61",
                height: 25,
                width: 5,
                borderBottomRightRadius: 2,
                borderTopRightRadius: 2,
              }}
            />
            <View
              style={{
                backgroundColor: "#5C5E61",
                width: "100%",
                paddingVertical: 3,
                paddingHorizontal: 10,
                borderBottomLeftRadius: 2,
                borderTopLeftRadius: 2,
              }}
            >
              <Text
                style={{ fontSize: 13, fontWeight: 600, color: COLORS.white }}
              >
                July - 2020
              </Text>
            </View>
          </View>

          <View style={{ padding: 20, gap: 20 }}>
            <TouchableOpacity
              style={{ flexDirection: "row", gap: 15 }}
              onPress={() => navigation.navigate("MainOutgoingDetail")}
            >
              {/* <Image
                source={require("../../../assets/superApp/AvatarKepBiroSDMA.png")}
              /> */}
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: 250, gap: 5 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <View
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 4,
                        backgroundColor: COLORS.warning,
                      }}
                    />
                    <Text style={{ fontSize: 13, fontWeight: 700 }}>
                      KEPALA BIRO SDM APARATUR
                    </Text>
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: 400 }}>
                    Undangan Diskusi Pembahasan Requirement Dashboard
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end", width: 55 }}>
                  <Text style={{ fontSize: 10, fontWeight: 400 }}>08 Jul</Text>
                  <Text style={{ fontSize: 10, fontWeight: 400 }}>10:23</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: "row", gap: 15 }}>
              {/* <Image
                source={require("../../../assets/superApp/AvatarA.png")}
                style={{ width: 30, height: 30, borderRadius: 15 }}
              /> */}
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: 250, gap: 5 }}>
                  <Text style={{ fontSize: 13, fontWeight: 400 }}>
                    SEKRETARIS JENDERAL
                  </Text>
                  <Text style={{ fontSize: 11, fontWeight: 400 }}>
                    Undangan Diskusi Pembahasan Requirement Dashboard
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end", width: 55 }}>
                  <Text style={{ fontSize: 10, fontWeight: 400 }}>08 Jul</Text>
                  <Text style={{ fontSize: 10, fontWeight: 400 }}>10:23</Text>
                  <View style={{ paddingLeft: 10, paddingVertical: 5 }}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={COLORS.primary}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: "row", gap: 15 }}>
              {/* <Image
                source={require("../../../assets/superApp/AvatarA.png")}
                style={{ width: 30, height: 30, borderRadius: 15 }}
              /> */}
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: 250, gap: 5 }}>
                  <Text style={{ fontSize: 13, fontWeight: 400 }}>
                    SEKRETARIS JENDERAL
                  </Text>
                  <Text style={{ fontSize: 11, fontWeight: 400 }}>
                    Undangan Diskusi Pembahasan Requirement Dashboard
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end", width: 55 }}>
                  <Text style={{ fontSize: 10, fontWeight: 400 }}>08 Jul</Text>
                  <Text style={{ fontSize: 10, fontWeight: 400 }}>10:23</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View
              style={{
                backgroundColor: "#5C5E61",
                height: 25,
                width: 5,
                borderBottomRightRadius: 2,
                borderTopRightRadius: 2,
              }}
            />
            <View
              style={{
                backgroundColor: "#5C5E61",
                width: "100%",
                paddingVertical: 3,
                paddingHorizontal: 10,
                borderBottomLeftRadius: 2,
                borderTopLeftRadius: 2,
              }}
            >
              <Text
                style={{ fontSize: 13, fontWeight: 600, color: COLORS.white }}
              >
                June - 2020
              </Text>
            </View>
          </View>

          <View style={{ padding: 20, gap: 20 }}>
            <TouchableOpacity style={{ flexDirection: "row", gap: 15 }}>
              {/* <Image
                source={require("../../../assets/superApp/AvatarKepBiroSDMA.png")}
              /> */}
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: 250, gap: 5 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <View
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 4,
                        backgroundColor: COLORS.warning,
                      }}
                    />
                    <Text style={{ fontSize: 13, fontWeight: 700 }}>
                      KEPALA BIRO SDM APARATUR
                    </Text>
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: 400 }}>
                    Undangan Diskusi Pembahasan Requirement Dashboard
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end", width: 55 }}>
                  <Text style={{ fontSize: 10, fontWeight: 400 }}>08 Jul</Text>
                  <Text style={{ fontSize: 10, fontWeight: 400 }}>10:23</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: "row", gap: 15 }}>
              {/* <Image
                source={require("../../../assets/superApp/AvatarA.png")}
                style={{ width: 30, height: 30, borderRadius: 15 }}
              /> */}
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: 250, gap: 5 }}>
                  <Text style={{ fontSize: 13, fontWeight: 400 }}>
                    SEKRETARIS JENDERAL
                  </Text>
                  <Text style={{ fontSize: 11, fontWeight: 400 }}>
                    Undangan Diskusi Pembahasan Requirement Dashboard
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end", width: 55 }}>
                  <Text style={{ fontSize: 10, fontWeight: 400 }}>08 Jul</Text>
                  <Text style={{ fontSize: 10, fontWeight: 400 }}>10:23</Text>
                  <View style={{ paddingLeft: 10, paddingVertical: 5 }}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={COLORS.primary}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: "row", gap: 15 }}>
              {/* <Image
                source={require("../../../assets/superApp/AvatarA.png")}
                style={{ width: 30, height: 30, borderRadius: 15 }}
              /> */}
              <View style={{ flexDirection: "row" }}>
                <View style={{ width: 250, gap: 5 }}>
                  <Text style={{ fontSize: 13, fontWeight: 400 }}>
                    SEKRETARIS JENDERAL
                  </Text>
                  <Text style={{ fontSize: 11, fontWeight: 400 }}>
                    Undangan Diskusi Pembahasan Requirement Dashboard
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end", width: 55 }}>
                  <Text style={{ fontSize: 10, fontWeight: 400 }}>08 Jul</Text>
                  <Text style={{ fontSize: 10, fontWeight: 400 }}>10:23</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View
              style={{
                backgroundColor: "#5C5E61",
                height: 25,
                width: 5,
                borderBottomRightRadius: 2,
                borderTopRightRadius: 2,
              }}
            />
            <View
              style={{
                backgroundColor: "#5C5E61",
                width: "100%",
                paddingVertical: 3,
                paddingHorizontal: 10,
                borderBottomLeftRadius: 2,
                borderTopLeftRadius: 2,
              }}
            >
              <Text
                style={{ fontSize: 13, fontWeight: 600, color: COLORS.white }}
              >
                May - 2020
              </Text>
            </View>
          </View>

          <View style={{ padding: 20 }}>
            <View
              style={{
                backgroundColor: COLORS.white,
                height: 80,
                justifyContent: "center",
                gap: 5,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  color: COLORS.lighter,
                  textAlign: "center",
                }}
              >
                Hasil Tidak Ditemukan
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 400,
                  color: COLORS.info,
                  textAlign: "center",
                }}
              >
                Segarkan
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        index={0}
        style={{ borderRadius: 50 }}
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjust"
        backdropComponent={({ style }) => (
          <View style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]} />
        )}
      >
        <BottomSheetView onLayout={handleContentLayout}>
          <View style={{ flex: 1, padding: 25 }}>
            <View
              style={{
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: 500 }}>
                Menyaring Surat Masuk
              </Text>
              <TouchableOpacity>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: COLORS.danger,
                  }}
                >
                  Reset
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 10, flex: 1, marginTop: 20, gap: 10 }}>
              <Text
                style={{ fontSize: 13, fontWeight: 600, color: COLORS.lighter }}
              >
                Rentang Tanggal
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <View
                    style={{
                      borderWidth: 1,
                      width: 155,
                      borderRadius: 4,
                      borderColor: COLORS.ExtraDivinder,
                      flexDirection: "row",
                    }}
                  >
                    <TextInput
                      editable
                      multiline
                      numberOfLines={4}
                      maxLength={40}
                      placeholder="Mulai"
                      style={{ padding: 10, height: 40 }}
                      value={TanggalMulai}
                      allowFontScaling={false}
                    />
                    <View
                      style={{
                        alignItems: "flex-end",
                        flex: 1,
                        marginRight: 10,
                        justifyContent: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setModalVisiblePicker("mulai")}
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={24}
                          color={COLORS.grey}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View>
                  <View
                    style={{
                      borderWidth: 1,
                      width: 155,
                      borderRadius: 4,
                      borderColor: COLORS.ExtraDivinder,
                      flexDirection: "row",
                    }}
                  >
                    <TextInput
                      editable
                      multiline
                      numberOfLines={4}
                      maxLength={40}
                      placeholder="Selesai"
                      style={{ padding: 10, height: 40 }}
                      value={TanggalSelesai}
                      allowFontScaling={false}
                    />
                    <View
                      style={{
                        alignItems: "flex-end",
                        flex: 1,
                        marginRight: 10,
                        justifyContent: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => setModalVisiblePicker("selesai")}
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={24}
                          color={COLORS.grey}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              <Modal
                animationType="fade"
                transparent={true}
                visible={
                  modalVisiblePicker === "mulai" ||
                  modalVisiblePicker === "selesai"
                    ? true
                    : false
                }
                onRequestClose={() => {
                  setModalVisiblePicker(!modalVisiblePicker);
                }}
              >
                <TouchableOpacity />
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: COLORS.white,
                      alignItems: "center",
                      justifyContent: "center",
                      width: "90%",
                      height: 500,
                      borderRadius: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => setModalVisiblePicker("")}
                      style={{
                        paddingRight: "85%",
                        marginBottom: 3,
                        marginLeft: 20,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: COLORS.primary,
                          borderRadius: 50,
                          width: 35,
                          height: 35,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons
                          name="close-outline"
                          size={24}
                          color={COLORS.white}
                        />
                      </View>
                    </TouchableOpacity>
                    <View style={{ width: "100%" }}>
                      <DatePicker
                        options={{
                          backgroundColor: COLORS.white,
                          textHeaderColor: COLORS.primary,
                          textDefaultColor: COLORS.primary,
                          selectedTextColor: "#fff",
                          mainColor: COLORS.primary,
                          textSecondaryColor: COLORS.primary,
                          borderColor: "rgba(122, 146, 165, 0.1)",
                        }}
                        current={moment(Date.now()).format("YYYY-MM-DD")}
                        mode="calendar"
                        minuteInterval={30}
                        style={{ borderRadius: 10 }}
                        onSelectedChange={(date) => {
                          const [year, month, day] = date
                            .split("/")
                            .map(Number);
                          const formattedDate = new Date(year, month - 1, day);
                          if (modalVisiblePicker === "mulai") {
                            setTanggalMulai(
                              moment(formattedDate).format("YYYY-MM-DD")
                            );
                          } else if (modalVisiblePicker === "selesai") {
                            setTanggalSelsai(
                              moment(formattedDate).format("YYYY-MM-DD")
                            );
                          }
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => setModalVisiblePicker("")}
                        style={{
                          marginTop: 20,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: COLORS.primary,
                            width: 217,
                            height: 39,
                            borderRadius: 8,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text style={{ color: COLORS.white }}>Ok</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>

            <View style={{ marginBottom: 10, flex: 1, marginTop: 10, gap: 10 }}>
              <Text
                style={{ fontSize: 13, fontWeight: 600, color: COLORS.lighter }}
              >
                Perihal
              </Text>
              <TextInput
                editable
                multiline
                numberOfLines={4}
                maxLength={40}
                placeholder="Masukan Perihal"
                style={{
                  borderWidth: 1,
                  height: 40,
                  width: "100%",
                  paddingTop: 10,
                  borderRadius: 6,
                  borderColor: "#D0D5DD",
                }}
                allowFontScaling={false}
              />
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: COLORS.infoDanger,
                height: 50,
                marginVertical: 20,
                borderRadius: 6,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                bottomSheetAttachClose();
              }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: FONTSIZE.H1,
                  fontWeight: 500,
                }}
              >
                Terapkan
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
