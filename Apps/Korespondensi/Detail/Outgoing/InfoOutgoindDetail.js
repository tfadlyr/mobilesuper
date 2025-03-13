import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { Ionicons } from "@expo/vector-icons";
import { AVATAR, COLORS, FONTSIZE, FONTWEIGHT } from "../../../../config/SuperAppps";
import { useNavigation } from '@react-navigation/native';

export const InfoOutgoindDetail = ({navigation}) => {
  return (
    <View style={{ padding: 20, gap: 10 }}>
        <Text style={{ fontSize: 15, fontWeight: 600, color: COLORS.lighter, textAlign: "center", marginVertical: 10 }}>Form Persetujuan Surat Dinas</Text>
        <View style={{ backgroundColor: COLORS.white, padding: 20, borderRadius: 16 }}>
            <View style={{ flexDirection: "row", borderBottomWidth: 2, borderBottomColor: "#DBDADE", paddingVertical: 10, }}>
                <Text style={{ fontSize: 13, fontWeight: 600, width: "40%", paddingRight: 20 }}>Nomor Surat</Text>
                <Text style={{ fontSize: 13, fontWeight: 400, width: "60%", paddingRight: 20 }}>B.28/SJ.7/PRL.110/IX/2023</Text>
            </View>

            <View style={{ flexDirection: "row", borderBottomWidth: 2, borderBottomColor: "#DBDADE", paddingVertical: 10, }}>
                <Text style={{ fontSize: 13, fontWeight: 600, width: "40%", paddingRight: 20 }}>Tanggal Surat</Text>
                <Text style={{ fontSize: 13, fontWeight: 400, width: "60%", paddingRight: 20 }}>24 September 2023</Text>
            </View>

            <View style={{ flexDirection: "row", paddingVertical: 10, }}>
                <Text style={{ fontSize: 13, fontWeight: 600, width: "40%", paddingRight: 20 }}>Penandatangan</Text>
                 <Text style={{ fontSize: 13, fontWeight: 400, width: "60%", paddingRight: 20 }}>PLT KEPALA PUSAT DATA STATISTIK DAN INFORMASI</Text>
            </View>
        </View>

        <Text style={{ fontSize: 15, fontWeight: 600 }}>Perihal</Text>

        <View style={{ backgroundColor: COLORS.white, padding: 20, borderRadius: 16 }}>
          <Text>Test Surat</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 15, fontWeight: 600, color: COLORS.info }}>Kepada</Text>
          <Text style={{ fontSize: 15, fontWeight: 600, color: COLORS.danger }}>*</Text>
        </View>

        <View style={{ backgroundColor: COLORS.white, padding: 20, borderRadius: 16 }}>
          <Text>PT. PSI</Text>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Text style={{ fontSize: 15, fontWeight: 600, color: COLORS.info }}>Tembusan</Text>
          <Text style={{ fontSize: 15, fontWeight: 600, color: COLORS.danger }}>*</Text>
        </View>

        <View style={{ backgroundColor: COLORS.white, padding: 20, borderRadius: 16 }}>
          <Text>1. Kepala Biro SDM</Text>
          <Text>2. Sekretaris Jenderal</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 20, marginTop: 40, justifyContent: "center" }}>
            <TouchableOpacity style={{ width: 35, height: 35, borderRadius: 18, backgroundColor: COLORS.info, justifyContent: "center", alignItems: "center" }}>
                <Ionicons name="save-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={{ width: 35, height: 35, borderRadius: 18, backgroundColor: COLORS.success, justifyContent: "center", alignItems: "center" }}>
                <Ionicons name="send-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={{ width: 35, height: 35, borderRadius: 18, backgroundColor: COLORS.warning, justifyContent: "center", alignItems: "center" }}>
                <Ionicons name="return-up-back-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity style={{ width: 35, height: 35, borderRadius: 18, backgroundColor: COLORS.infoDanger, justifyContent: "center", alignItems: "center" }}>
                <Ionicons name="close-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    containerHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10
    },
  });