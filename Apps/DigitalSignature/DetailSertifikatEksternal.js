import React, { useEffect } from "react";
import { Platform, Text, View } from "react-native";
import { useSelector } from "react-redux";
import {
  COLORS,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useState } from "react";
import { getTokenValue } from "../../service/session";
const { StorageAccessFramework } = FileSystem;

export const DetailSertifikatEksternal = () => {
  const { eksternal, loading } = useSelector((state) => state.digitalsign);
  const { device } = useSelector((state) => state.apps);
  const [fileUrl, setFileUrl] = useState();
  const [token, setToken] = useState();
  const navigation = useNavigation();
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);
  const detail = eksternal.detail;
  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
  };

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  const downloadPath =
    FileSystem.documentDirectory + (Platform.OS === "android" ? "" : "");

  const downloadFile = async (fileUrl) => {
    const namafile = fileUrl.split("/");
    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        fileUrl,
        downloadPath + namafile[namafile.length - 1],
        { headers: { Authorization: token } }
      );
      try {
        const { uri } = await downloadResumable.downloadAsync();
        saveFile(uri);
      } catch (e) {
        console.error("download error:", e);
      }
    } catch (e) {}
  };

  const saveFile = async (fileUri) => {
    console.log(fileUri);
    try {
      await Sharing.shareAsync(fileUri, {
        dialogTitle: "Share Rar",
      });
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  };

  useEffect(() => {
    detail?.attachments?.map((item) => {
      setFileUrl(item);
    });
  }, [detail]);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          backgroundColor: COLORS.primary,
          height: 80,
          paddingBottom: 20,
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
          <TouchableOpacity onPress={() => navigation.goBack()}>
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
              color: "white",
              fontSize: fontSizeResponsive("H1", device),
              fontWeight: FONTWEIGHT.bold,
            }}
          >
            Detail Sertifikat Eksternal
          </Text>
        </View>
      </View>

      <View
        style={{
          width: "90%",
          backgroundColor: COLORS.white,
          marginHorizontal: "5%",
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        <View
          style={{
            marginHorizontal: 20,
            marginVertical: 20,
            width: "89%",
          }}
        >
          {loading ? (
            <ShimmerPlaceHolder
              style={{ borderRadius: 4, width: "100%" }}
              height={20}
            />
          ) : (
            <Text
              style={{
                fontSize: fontSizeResponsive("Judul", device),
                fontWeight: FONTWEIGHT.bold,
              }}
            >
              {detail?.subject}
            </Text>
          )}
          <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
            <Text
              style={{
                width: "45%",
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              No Sertifikat
            </Text>
            <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
              :
            </Text>
            <View style={{ width: "45%" }}>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4, width: "100%" }}
                  height={20}
                />
              ) : (
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  {detail?.extra_attributes?.noSertif}
                </Text>
              )}
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
            <Text
              style={{
                width: "45%",
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Jumlah Penerima Sertifikat
            </Text>
            <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
              :
            </Text>
            <View style={{ width: "45%" }}>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4, width: "100%" }}
                  height={20}
                />
              ) : (
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  {numberWithCommas(detail?.jumlah_peserta)}
                </Text>
              )}
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
            <Text
              style={{
                width: "45%",
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Tanggal Sertifikat
            </Text>
            <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
              :
            </Text>
            <View style={{ width: "45%" }}>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4, width: "100%" }}
                  height={20}
                />
              ) : (
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  {detail.extra_attributes?.tanggalSertif}
                </Text>
              )}
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
            <Text
              style={{
                width: "45%",
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Tempat Pelatihan
            </Text>
            <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
              :
            </Text>
            <View style={{ width: "45%" }}>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4, width: "100%" }}
                  height={20}
                />
              ) : (
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  {detail.extra_attributes?.tempat === undefined
                    ? "-"
                    : detail.extra_attributes?.tempat}
                </Text>
              )}
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
            <Text
              style={{
                width: "45%",
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Keterangan
            </Text>
            <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
              :
            </Text>
            <View style={{ width: "45%" }}>
              {loading ? (
                <ShimmerPlaceHolder
                  style={{ borderRadius: 4, width: "100%" }}
                  height={20}
                />
              ) : (
                <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                  {detail.extra_attributes?.keterangan === undefined ||
                  detail.extra_attributes?.keterangan === ""
                    ? "-"
                    : detail.extra_attributes?.keterangan}
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              padding: 10,
              borderRadius: 10,
              marginTop: 20,
              alignItems: "center",
            }}
            onPress={() => {
              downloadFile(fileUrl.file);
            }}
          >
            <Text style={{ color: COLORS.white, fontSize: fontSizeResponsive("H4", device) }}>
              Bagikan Dokumen Sertifikat
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
