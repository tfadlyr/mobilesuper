import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS, FONTSIZE, fontSizeResponsive, FONTWEIGHT } from "../../config/SuperAppps";
import * as FileSystem from "expo-file-system";
const { StorageAccessFramework } = FileSystem;
import * as Sharing from "expo-sharing";
import { useDispatch, useSelector } from "react-redux";
import { getTokenValue } from "../../service/session";
import { Platform } from "react-native";
import { Config } from "../../constants/config";
import {
  getDocumentAttachmentSPPD,
  getDocumentCetakSPPD,
} from "../../service/api";
import { Loading } from "../../components/Loading";
import Pdf from "react-native-pdf";

const LihatSuratSPPD = ({ route }) => {
  const { status, data } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { dokumen, surat, cetak, detailPersonal } = useSelector(
    (state) => state.sppd
  );
  const id = detailPersonal?.id;
  const [token, setToken] = useState("");

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
      if (status === "share") {
        dispatch(getDocumentCetakSPPD({ token: val, id: detailPersonal?.id }));
      } else {
        dispatch(
          getDocumentAttachmentSPPD({
            token: val,
            id: detailPersonal?.id,
          })
        );
      }
    });
  }, []);

  const downloadPath =
    FileSystem.documentDirectory + (Platform.OS == "android" ? "" : "");

  const downloadFile = async (fileUrl, fileType, fileName) => {
    //alert(fileName)

    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        fileUrl,
        downloadPath + fileName,
        { headers: { Authorization: token } }
      );
      try {
        // if (Platform.OS === "android") {
        //   const { uri } = await downloadResumable.downloadAsync();
        //   saveAndroidFile(uri, fileName, fileType);
        // } else {
        const { uri } = await downloadResumable.downloadAsync();
        saveIosFile(uri);
        // }
      } catch (e) {
        // setIsLoading(false);
        console.error("download error:", e);
      }
    } catch (e) {}
  };
  const saveAndroidFile = async (fileUri, fileName, fileType) => {
    try {
      const fileString = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const permissions =
        await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        return;
      }

      try {
        await StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          fileName,
          fileType
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, fileString, {
              encoding: FileSystem.EncodingType.Base64,
            });
            Alert.alert("Success!", "Download Successfully.");
          })
          .catch((e) => {
            Alert.alert(
              "Failed!",
              "Download Unsuccessful. Please choose another folder to download file."
            );
          });
      } catch (e) {
        throw new Error(e);
      }
    } catch (err) {}
  };
  const saveIosFile = async (fileUri) => {
    try {
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/pdf",
        dialogTitle: "Share PDF",
      });
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  };

  const pdfResourcePrint = { uri: cetak, chace: true };
  const pdfResourceLetter = { uri: surat, chace: true };

  const fileName = data?.replace(/\s/g, "_");

  const { device } = useSelector((state) => state.apps);


  return (
    <>
        <View
          style={{
            backgroundColor: COLORS.primary,
            height: "10%",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 20,
                backgroundColor: "white",
                height: device === "tablet" ? 46 : 28,
                width: device === "tablet" ? 46 : 28,
                borderRadius: 50,
              }}
            >
              <Ionicons
                name="chevron-back"
                size={device === "tablet" ? 40 : 24}
                color={COLORS.primary}
              />
            </View>
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 40,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: fontSizeResponsive("H1", device),
                fontWeight: 600,
              }}
            >
              Surat Perjalanan Dinas
            </Text>
          </View>
        </View>
      <View style={{ width: "100%", height: "90%" }}>
        {status === "share" && cetak !== null ? (
          <Pdf
            trustAllCerts={false}
            source={pdfResourcePrint}
            style={{
              flex: 1,
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
            }}
          />
        ) : status === "" && surat !== null ? (
          <Pdf
            trustAllCerts={false}
            source={pdfResourceLetter}
            style={{
              flex: 1,
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").height,
            }}
          />
        ) : (
          <Loading />
        )}

        {/* <Image
          source={{ uri: pdfBlobData }}
          style={{ width: 100, height: 100 }}
        /> */}
        {/* <WebView source={{ html: surat }} /> */}
      </View>
    </>
  );
};

export default LihatSuratSPPD;

const styles = StyleSheet.create({
  pdf: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "#000",
  },
});
