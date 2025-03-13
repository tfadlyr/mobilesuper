import React, { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import WebView from "react-native-webview";
import { useSelector } from "react-redux";
import { getTokenValue } from "../../service/session";
import {
  COLORS,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Config } from "../../constants/config";

export const TandaTanganNotulensi = ({ route }) => {
  const { item } = route.params;
  const webViewRef = useRef(null);
  const [token, setToken] = useState("");
  const navigation = useNavigation();
  // const type = "dokumen_lain";
  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);
  const { device } = useSelector((state) => state.apps);

  let myInjectedJs = `(function(){
      let attach = window.localStorage.getItem('attachment');
      if(!attach || (attach && attach != '${item}')){
        window.localStorage.setItem('attachment', '${item}');
        window.location.reload();
      }
    })();

    __TYPE = "dokumen-lain"
    $("#submit").click(function () {
      var paraphrase = $('#paraphrase').val()
      var kiri_bawah_x = $('input[name="lower_left_x"]').val();
      var kiri_bawah_y = $('input[name="lower_left_y"]').val();
      var kanan_atas_x = $('input[name="upper_right_x"]').val();
      var kanan_atas_y = $('input[name="upper_right_y"]').val();
      if (paraphrase === "") {
          alert("Passphrase tidak boleh kosong")
      } else {
        let data = {}
        if (__TYPE === 'dokumen-lain') {
          data = {
              "passphrase": paraphrase,
              "kanan_atas_y": kanan_atas_y,
              "kanan_atas_x": kanan_atas_x,
              "kiri_bawah_x": kiri_bawah_x,
              "kiri_bawah_y": kiri_bawah_y,
              "page": __CURRENT_PAGE,
              "tampilan": "visible",
          }
            $.ajax({
              url: ' ${Config.base_url}digitalsign/document/approve/',
              type: 'PUT',
              contentType: 'application/json; charset=utf-8',
              headers: {
                  'Authorization': '${token}'
              },
              data: JSON.stringify(data),
              success: function (data, textStatus, xhr) {
                  if (data.success) {
                    alert("berhasil")
                  } else {
                    alert("gagal")
                  }
              },
              error: function (xhr, textStatus, errorThrown) {
                alert('error')
              }
          });
        }
      }
    })
    `;
  return (
    <>
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
              fontSize: fontSizeResponsive("H1", device),
              fontWeight: FONTWEIGHT.bold,
              color: COLORS.white,
            }}
          >
            Tanda Tangan Notulensi
          </Text>
        </View>
      </View>
      <WebView
        ref={webViewRef}
        source={{
          uri: "https://portal.kkp.go.id/assets/pdfViewerNotulensi/index.html",
        }}
        style={{ flex: 1 }}
        injectedJavaScript={myInjectedJs}
      />
    </>
  );
};
