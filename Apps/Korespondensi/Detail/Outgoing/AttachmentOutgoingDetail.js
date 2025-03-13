import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import { AVATAR, COLORS, FONTSIZE, FONTWEIGHT } from "../../../../config/SuperAppps";

export const AttachmentOutgoingDetail = () => {
  return (
    <View style={{ padding: 20 }}>
        <View style={{ gap: 20 }}>
          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20 }}>
            <View style={{ gap: 20, marginBottom: 10 }}>
              <Text style={{ fontSize: 13, fontWeight: 600 }}>Ganti File Surat</Text>
              
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ gap: 10, width: 100, }}>
                  <View style={{ width: 100, height: 100, borderWidth: 1, borderColor: "#DBDADE", justifyContent: "center", alignItems: "center", borderRadius: 6 }}>
                    <Image source={require("../../../../assets/superApp/pdf.png")} />
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: 400, textAlign: "center" }}>Nama File</Text>
                  <Text style={{ fontSize: 13, fontWeight: 400, textAlign: "center" }}>Nama File.pdf</Text>
                  <Text style={{ fontSize: 13, fontWeight: 400, color: COLORS.lighter, textAlign: "center" }}>1 MB</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ backgroundColor: COLORS.white, borderRadius: 16, padding: 20 }}>
            <View style={{ gap: 20, marginBottom: 10 }}>
              <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                <Text style={{ fontSize: 13, fontWeight: 600 }}>Ganti File Surat</Text>
                <Text style={{ fontSize: 11, fontWeight: 400, color: COLORS.info }}>Unduh Semua</Text>
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ gap: 10, width: 100, }}>
                  <View style={{ width: 100, height: 100, borderWidth: 1, borderColor: "#DBDADE", justifyContent: "center", alignItems: "center", borderRadius: 6 }}>
                    <Image source={require("../../../../assets/superApp/pdf.png")} />
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: 400, textAlign: "center" }}>Nama File</Text>
                  <Text style={{ fontSize: 13, fontWeight: 400, textAlign: "center" }}>Nama File.pdf</Text>
                  <Text style={{ fontSize: 13, fontWeight: 400, color: COLORS.lighter, textAlign: "center" }}>1 MB</Text>
                </View>

                <View style={{ gap: 10, width: 100, }}>
                  <View style={{ width: 100, height: 100, borderWidth: 1, borderColor: "#DBDADE", justifyContent: "center", alignItems: "center", borderRadius: 6 }}>
                    <Image source={require("../../../../assets/superApp/pdf.png")} />
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: 400, textAlign: "center" }}>Nama File</Text>
                  <Text style={{ fontSize: 13, fontWeight: 400, textAlign: "center" }}>Nama File.pdf</Text>
                  <Text style={{ fontSize: 13, fontWeight: 400, color: COLORS.lighter, textAlign: "center" }}>1 MB</Text>
                </View>

                <View style={{ gap: 10, width: 100, }}>
                  <View style={{ width: 100, height: 100, borderWidth: 1, borderColor: "#DBDADE", justifyContent: "center", alignItems: "center", borderRadius: 6 }}>
                    <Image source={require("../../../../assets/superApp/pdf.png")} />
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: 400, textAlign: "center" }}>Nama File</Text>
                  <Text style={{ fontSize: 13, fontWeight: 400, textAlign: "center" }}>Nama File.pdf</Text>
                  <Text style={{ fontSize: 13, fontWeight: 400, color: COLORS.lighter, textAlign: "center" }}>1 MB</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
    </View>
  )
}
