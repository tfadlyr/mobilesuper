import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native";
import {
  COLORS,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { TouchableOpacity, Modal, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import Checkbox from "expo-checkbox";
import { getDetailProdukHukum } from "../../service/api";

import { Divider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

export const CardListProdukHukum = ({
  item,
  variant,
  token,
  device,
  isSelected,
  setSelection,
  nip,
  disabled,
}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [modal, setModal] = useState(false);
  const getDetail = (id) => {
    const params = { token, id };
    // const data = event.listsprogress.find(item => item.id === id)
    dispatch(getDetailProdukHukum(params));
  };
  const listParaf = (data, index) => {
    return (
      <View
        key={data.id}
        style={{
          marginBottom: index == item.approvers?.length - 1 ? 20 : 10,
          marginHorizontal: 20,
          marginVertical: 5,
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
        {data?.is_paraf ? (
          <>
            <View
              style={{
                flexDirection: "row",
                width: "60%",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: 5,
                marginTop: 5,
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.success,
                  borderRadius: 50,
                  padding: 5,
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
                  paddingVertical: 5,
                  borderRadius: 20,
                  paddingHorizontal: 15,
                }}
              >
                <Text
                  style={{
                    color: COLORS.success,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  Sudah {data?.nip == "88888" ? "Menyetujui" : "Paraf"}
                </Text>
              </View>
            </View>
            {index < item.approvers?.length - 1 && (
              <View
                style={{
                  width: "100%",
                  height: 2,
                  backgroundColor: COLORS.ExtraDivinder,
                  marginTop: 5,
                }}
              />
            )}
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
                marginTop: 5,
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.infoDanger,
                  borderRadius: 50,
                  padding: 5,
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
                  paddingVertical: 5,
                  borderRadius: 20,
                  paddingHorizontal: 15,
                }}
              >
                <Text
                  style={{
                    color: COLORS.infoDanger,
                    fontSize: fontSizeResponsive("H4", device),
                  }}
                >
                  {data?.nip == "88888" ? "Belum Menyetujui" : "Belum Paraf"}
                </Text>
              </View>
            </View>
            {index < item.approvers?.length - 1 && (
              <View
                style={{
                  width: "100%",
                  height: 2,
                  backgroundColor: COLORS.ExtraDivinder,
                  marginTop: 5,
                }}
              />
            )}
          </>
        )}
      </View>
    );
  };
  return (
    <View
      key={item.id}
      style={{
        backgroundColor: disabled ? COLORS.ExtraDivinder : "white",
        borderRadius: 16,
        flex: 1,
        marginBottom: 10,
        marginHorizontal: 16,
        padding: 20,
        //shadow ios
        shadowOffset: { width: -2, height: 4 },
        shadowColor: "#171717",
        shadowOpacity: 0.2,
        // //shadow android
        elevation: 2,
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 16,
        }}
        onPress={() => {
          getDetail(item.id);
          navigation.navigate("DetailProdukHukum");
        }}
        disabled={disabled}
      >
        {variant === "inprogress" && nip !== "197208122001121002" ? (
          <Checkbox
            value={isSelected.includes(item?.id) ? true : false}
            onValueChange={() => {
              if (isSelected.includes(item?.id)) {
                const ids = [...isSelected];
                const newIds = ids.filter((id) => id !== item?.id);
                setSelection(newIds);
              } else {
                setSelection((prev) => [...prev, item?.id]);
              }
            }}
            color={isSelected === true ? COLORS.lighter : null}
          />
        ) : null}
        <View
          style={{
            flexDirection: "column",
            flex: 1,
          }}
        >
          <View style={{ flexDirection: "row", flex: 1 }}>
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H2", device),
                textAlign: "justify",
                flexWrap: "wrap",
              }}
            >
              {item?.subject}
            </Text>
          </View>
          <Divider style={{ marginVertical: 5 }} />
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              gap: 5,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                fontWeight: FONTWEIGHT.bold,
                flexWrap: "wrap",
                width: "30%",
              }}
            >
              No Dokumen
            </Text>
            <Text> :</Text>
            <View>
              <Text
                style={{
                  color: "black",
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {item?.extra_attributes?.no_produk_hukum
                  ? item?.extra_attributes.no_produk_hukum
                  : "-"}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              gap: 5,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: fontSizeResponsive("H3", device),
                fontWeight: FONTWEIGHT.bold,
                flexWrap: "wrap",
                width: "30%",
              }}
            >
              Status
            </Text>
            <Text> :</Text>
            <View
              style={{
                backgroundColor: COLORS.bgLightGrey,
                alignSelf: "flex-start",
                paddingVertical: 5,
                borderRadius: 20,
                paddingHorizontal: 15,
              }}
            >
              <Text
                style={{
                  color: "black",
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {item?.state == "done"
                  ? "done"
                  : item?.state == "in_progress"
                  ? "perlu diproses"
                  : item?.state == "paraf"
                  ? "paraf"
                  : item?.state == "upload_doc"
                  ? "upload doc"
                  : item?.state == "revision"
                  ? "revision"
                  : item?.state}
              </Text>
            </View>
          </View>

          {item.state != "done" &&
            variant?.key != "revision" &&
            variant?.key != "paraf" && (
              <TouchableOpacity
                style={{ gap: 5, width: "100%" }}
                onPress={() => {
                  setModal(true);
                }}
              >
                <View
                  style={{
                    marginTop: 15,
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
                    Lihat Paraf
                  </Text>
                </View>
              </TouchableOpacity>
            )}

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
                Platform.OS === "ios"
                  ? styles.iOSBackdrop
                  : styles.androidBackdrop,
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
                  borderRadius: 10,
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
                      fontSize: fontSizeResponsive("H2", device),
                    }}
                  >
                    List Paraf
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
                      if (index == 2) {
                        return data?.map((items, i) => {
                          return listParaf(items, index);
                        });
                      } else {
                        return listParaf(data, index);
                      }
                    }
                  })}
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableOpacity>
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
