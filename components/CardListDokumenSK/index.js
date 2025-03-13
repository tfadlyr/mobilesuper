import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { getDetailDigisign } from "../../service/api";
import { Config } from "../../constants/config";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  COLORS,
  fontSizeResponsive,
  FONTWEIGHT,
} from "../../config/SuperAppps";
import { useState } from "react";

export const CardListDokumenSK = ({ item, variant, token, device }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isSelected, setSelection] = useState(false);
  const getDetail = (id) => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getDetailDigisign(params));
  };
  const BASE_URL = Config.base_url + "bridge";

  const [modal, setModal] = useState(false);
  return (
    <View
      key={item.id}
      style={{
        backgroundColor: variant === "draft" ? COLORS.ExtraDivinder : "white",
        borderRadius: 8,
        width: "90%",
        flex: 1,
        marginHorizontal: "5%",
        padding: 16,
        //shadow ios
        shadowOffset: { width: -2, height: 4 },
        shadowColor: "#171717",
        shadowOpacity: 0.1,
        // //shadow android
        elevation: 2,
        marginVertical: 8,
      }}
    >
      <TouchableOpacity
        style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
        onPress={() => {
          getDetail(item.id);
          navigation.navigate("DetailDokumenSK", { variant: variant });
        }}
        disabled={variant === "draft" ? true : false}
      >
        {/* {variant === "inprogress" ? (
          <Checkbox
            value={isSelected}
            onValueChange={setSelection}
            color={isSelected === true ? COLORS.lighter : null}
          />
        ) : null} */}
        <View style={{ flexDirection: "column", width: "100%" }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H3", device),
              textAlign: "justify",
              fontWeight: FONTWEIGHT.bold,
              width: "100%",
            }}
          >
            {item?.subject}
          </Text>
          <View
            style={{
              backgroundColor: COLORS.lighter,
              height: 1,
              marginVertical: 8,
              width: "100%",
            }}
          />
          <View style={{ gap: 5, width: "100%" }}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H3", device),
                  width: 120,
                  textAlign: "auto",
                  paddingRight: 12,
                  fontWeight: FONTWEIGHT.bold,
                  width: "25%",
                }}
              >
                Operator
              </Text>
              {item?.composer?.display_title !== undefined ? (
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.normal,
                    width: "75%",
                    textAlign: "auto",
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  :{" "}
                  {item?.composer?.officer?.nama !== undefined
                    ? item?.receivers[0]?.officer?.nama
                    : "-"}
                </Text>
              ) : (
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.normal,
                    width: "75%",
                    textAlign: "auto",
                    fontSize: fontSizeResponsive("H3", device),
                  }}
                >
                  :{" "}
                  {item?.composer?.nama !== undefined
                    ? item?.composer?.nama
                    : "-"}
                </Text>
              )}
            </View>
            {variant === "signed" ? (
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    width: 110,
                    textAlign: "auto",
                    paddingRight: 12,
                    fontWeight: FONTWEIGHT.bold,
                    width: "25%",
                  }}
                >
                  Status
                </Text>
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H3", device),
                    width: 200,
                    textAlign: "auto",
                    fontWeight: FONTWEIGHT.normal,
                    width: "55%",
                  }}
                >
                  : {item.state === "in_progress" ? "In Progress" : "Done"}
                </Text>
              </View>
            ) : null}
            {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: fontSizeResponsive("H3", device),
                  width: 120,
                  textAlign: "auto",
                  paddingRight: 12,
                  fontWeight: FONTWEIGHT.bold,
                  width: "25%",
                }}
              >
                Approval
              </Text>
              <Text style={{ fontSize: fontSizeResponsive("H3", device) }}>
                :{" "}
              </Text>
              {item?.approvers.slice(1).map((data) => (
                <Image
                  source={{ uri: data.avatar_url }}
                  style={{
                    width: device === "tablet" ? 40 : 20,
                    height: device === "tablet" ? 40 : 20,
                    borderRadius: 50,
                  }}
                />
              ))}
            </View> */}
            <TouchableOpacity
              style={{ gap: 5, width: "100%" }}
              onPress={() => {
                setModal(true);
              }}
            >
              <View
                style={{
                  marginTop: 10,
                  backgroundColor: COLORS.primary,
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 8,
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontWeight: FONTWEIGHT.normal,
                    textAlign: "auto",
                    fontSize: fontSizeResponsive("H4", device),
                    color: COLORS.white,
                    fontWeight: FONTWEIGHT.bold,
                  }}
                >
                  Lihat Approval
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          setModal(false);
        }}
      >
        <TouchableOpacity
          style={[
            Platform.OS === "ios" ? styles.iOSBackdrop : styles.androidBackdrop,
            styles.backdrop,
          ]}
        />
        <View
          style={{
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              width: "90%",
              height: device === "tablet" ? "80%" : "50%",
              borderRadius: 8,
            }}
          >
            <View
              style={{
                margin: 16,
                marginBottom: 8,
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 8,
                borderBottomWidth: 2,
                borderBottomColor: COLORS.grey,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: fontSizeResponsive("H2", device),
                }}
              >
                {/* List Approval */}
                Detail Penanggung Jawab
              </Text>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  setModal(false);
                }}
              >
                <Ionicons
                  name="close-outline"
                  size={device === "tablet" ? 30 : 24}
                  color={COLORS.lighter}
                />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {item.approvers.map((data, index) => {
                if (index > 0) {
                  return (
                    <View
                      style={{
                        marginHorizontal: 16,
                        marginBottom: 8,
                        // backgroundColor: "red",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 5,
                          alignItems: "center",
                        }}
                      >
                        <Image
                          source={{ uri: data.avatar_url }}
                          height={device === "tablet" ? 50 : 30}
                          width={device === "tablet" ? 50 : 30}
                          borderRadius={device === "tablet" ? 50 : 30}
                        />
                        <Text
                          style={{
                            width: "90%",
                            fontSize: fontSizeResponsive("H4", device),
                          }}
                        >
                          {data.nama}
                        </Text>
                      </View>
                      {item.sequence <= index ? (
                        <>
                          <View
                            style={{
                              flexDirection: "row",
                              width: "60%",
                              justifyContent: "flex-start",
                              alignItems: "center",
                              gap: 5,
                              marginTop: 4,
                              marginLeft: 4,
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: COLORS.infoDanger,
                                borderRadius: 50,
                                padding: 4,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Ionicons
                                name="close"
                                color={COLORS.white}
                                size={device === "tablet" ? 25 : 15}
                              />
                            </View>
                            <View
                              style={{
                                backgroundColor: COLORS.infoDangerLight,
                                paddingVertical: 4,
                                borderRadius: 20,
                                paddingHorizontal: 8,
                              }}
                            >
                              <Text
                                style={{
                                  color: COLORS.infoDanger,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {item?.approvers?.length - 1 === index
                                  ? "Belum Ditandatangani"
                                  : "Belum Disetujui"}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              width: "100%",
                              height: 2,
                              backgroundColor: COLORS.ExtraDivinder,
                              marginTop: 8,
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <View
                            style={{
                              flexDirection: "row",
                              width: "60%",
                              justifyContent: "flex-start",
                              alignItems: "center",
                              gap: 5,
                              marginTop: 4,
                              marginLeft: 4,
                            }}
                          >
                            <View
                              style={{
                                backgroundColor: COLORS.success,
                                borderRadius: 50,
                                padding: 4,
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Ionicons
                                name="checkmark-outline"
                                color={COLORS.white}
                                size={device === "tablet" ? 25 : 15}
                              />
                            </View>
                            <View
                              style={{
                                backgroundColor: COLORS.successLight,
                                paddingVertical: 4,
                                borderRadius: 20,
                                paddingHorizontal: 8,
                              }}
                            >
                              <Text
                                style={{
                                  color: COLORS.success,
                                  fontSize: fontSizeResponsive("H4", device),
                                }}
                              >
                                {item?.approvers?.length - 1 === index
                                  ? "Ditandatangani"
                                  : "Disetujui"}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              width: "100%",
                              height: 2,
                              backgroundColor: COLORS.ExtraDivinder,
                              marginTop: 8,
                            }}
                          />
                        </>
                      )}
                    </View>
                  );
                }
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  iOSBackdrop: {
    backgroundColor: "#000",
    opacity: 0.5,
  },
  androidBackdrop: {
    backgroundColor: "#000",
    opacity: 0.7,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
