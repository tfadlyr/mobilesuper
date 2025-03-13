import React, { useEffect } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "../../components/Loading";
import {
  COLORS,
  fontSizeResponsive,
  FONTWEIGHT,
  PADDING,
  shadow,
  spacing,
} from "../../config/SuperAppps";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Config } from "../../constants/config";
import { CollapseCardBiodata } from "../../components/CollapseCardBiodata";
import CollapseEpegIPASN from "../../components/CollapseEpegIPASN";
import CollapseSIASNIPASN from "../../components/CollapseSIASNIPASN";
import { CollapseCardSIASNDataUtama } from "../../components/CollapseCardSIASNDataUtama";
import { CollapseCardSIASNJabatan } from "../../components/CollapseCardSIASNJabatan";
import { CollapseCardSIASNRwSkp } from "../../components/CollapseCardSIASNRwSkp";
import { CollapseCardSIASNRwSkp22 } from "../../components/CollapseCardSIASNRwSkp22";
import { CollapseCardSIASNRwPnsUnor } from "../../components/CollapseCardSIASNRwPnsUnor";
import { CollapseCardSIASNAngkaKredit } from "../../components/CollapseCardSIASNAngkaKredit";
import { CollapseCardSIASNRwPendidikan } from "../../components/CollapseCardSIASNRwPendidikan";
import { CollapseCardSIASNRwPenghargaan } from "../../components/CollapseCardSIASNRwPenghargaan";
import { CollapseCardPasangan } from "../../components/CollapseCardPasangan";
import { CollapseCardAnak } from "../../components/CollapseCardAnak";
import { CollapseCardOrangTua } from "../../components/CollapseCardOrangTua";
import { CollapseCardMasaKerja } from "../../components/CollapseCardMasaKerja";
import { CollapseCardHukumanDisiplin } from "../../components/CollapseCardHukumanDisiplin";
import { CollapseCardSIASNRwKursusDiklat } from "../../components/CollapseCardSIASNRwKursusDiklat";
import moment from "moment";
import { setDataDetailIPASN } from "../../store/Kepegawain";
import { getDataDetailIPASN, getDataPribadiDetail } from "../../service/api";

export const DetailPegawaiIPASN = ({ route }) => {
  const item = route.params;
  const dispatch = useDispatch();
  useEffect(() => {
    if (item.type === "pegawai") {
      dispatch(getDataDetailIPASN({ token: item.token, id: item.nip }));
    } else {
      dispatch(getDataPribadiDetail({ token: item.token, id: item.nip }));
    }
  }, [item.nip]);
  const navigation = useNavigation();
  const { device } = useSelector((state) => state.apps);

  const { DataPribadi, DataIPASN, loading } = useSelector(
    (state) => state.kepegawaian
  );
  const BASE_URL = Config.base_url + "bridge";
  const profile =
    item.type === "pegawai" ? DataIPASN.detail : DataPribadi.detail;

  return (
    <ScrollView>
      {loading ? <Loading /> : null}
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
            Detail Data IPASN
          </Text>
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: spacing.default,
          paddingTop: spacing.default,
        }}
      >
        <View
          style={[
            {
              backgroundColor: COLORS.white,
              width: "100%",
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              padding: spacing.default,
            },
            shadow.cardShadow,
          ]}
        >
          {profile?.avatar_signed ? (
            <Image
              source={{ uri: BASE_URL + profile.avatar_signed }}
              style={{
                width: device === "tablet" ? 100 : 61,
                height: device === "tablet" ? 100 : 61,
                borderRadius: device === "tablet" ? 50 : 30,
              }}
            />
          ) : (
            <Image
              source={require("../../assets/superApp/profile.png")}
              style={{
                width: device === "tablet" ? 100 : 61,
                height: device === "tablet" ? 100 : 61,
                borderRadius: device === "tablet" ? 50 : 30,
              }}
            />
          )}
          <Text
            style={[
              {
                marginTop: spacing.default,
                color: COLORS.info,
                fontSize: fontSizeResponsive("H4", device),
              },
            ]}
          >
            {profile.nama ? profile.nama : "Tidak ada data"}
          </Text>
          <Text
            style={[
              {
                color: COLORS.lighter,
                textAlign: "center",
                fontSize: fontSizeResponsive("H5", device),
              },
            ]}
          >
            {profile.unit_kerja ? profile.unit_kerja : "Tidak ada data"}
          </Text>
        </View>

        <View
          style={[
            {
              padding: spacing.default,
              rowGap: spacing.medium,
              backgroundColor: COLORS.white,
              marginTop: 10,
              borderRadius: 8,
            },
            shadow.cardShadow,
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Jumlah hari kerja
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {profile.working_day ? profile.working_day : "Tidak ada data"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Jumlah hadir
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {profile.present_day ? profile.present_day : "Tidak ada data"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Terlambat
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {profile.late_day ? profile.late_day : "Tidak ada data"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Dinas
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {profile.outstation_day
                ? profile.outstation_day
                : "Tidak ada data"}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Cuti
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {profile.big_leave_day === undefined ||
              profile.big_leave_day === null
                ? 0
                : parseInt(profile.big_leave_day) + profile.labor_leave_day ===
                    undefined || profile.labor_leave_day === null
                ? 0
                : parseInt(profile.labor_leave_day) + profile.sick_leave_day ===
                    undefined || profile.sick_leave_day === null
                ? 0
                : parseInt(profile.sick_leave_day) +
                    profile.urgent_leave_day ===
                    undefined || profile.urgent_leave_day === null
                ? 0
                : parseInt(profile.urgent_leave_day) +
                    profile.year_leave_day ===
                    undefined || profile.year_leave_day === null
                ? 0
                : parseInt(profile.year_leave_day)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 1,
            }}
          >
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              Update Terakhir:
            </Text>
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {profile?.request_updated_get_from_siasn === null ||
              profile?.request_updated_get_from_siasn === undefined
                ? "Tidak ada data"
                : moment(
                    profile?.request_updated_get_from_siasn,
                    "YYYY-MM-DD HH:mm:ss"
                  )
                    .locale("id")
                    .format("DD MMMM YYYY HH:mm:ss")}
            </Text>
          </View>
        </View>
      </View>

      {/* Collapse Content IPASN EPEG */}
      <View style={{ paddingTop: spacing.default }}>
        <CollapseEpegIPASN profile={profile} device={device} />
      </View>

      <View style={{ paddingTop: spacing.default }}>
        <CollapseSIASNIPASN profile={profile} device={device} />
      </View>

      <View style={{ paddingVertical: spacing.default }}>
        <CollapseCardBiodata profile={profile} device={device} />
        {/* <CollapseCardLinimasa linimasa={linimasa} /> */}
      </View>

      {/* SIASN Data Utama */}
      <View style={{ paddingBottom: spacing.default }}>
        <CollapseCardSIASNDataUtama
          profile={profile?.siasn_data_full?.siasn_data_utama}
          device={device}
        />
      </View>
      {/* SIASN Jabatan */}
      <View style={{ paddingBottom: spacing.default }}>
        <CollapseCardSIASNJabatan
          profile={profile?.siasn_data_full?.siasn_jabatan}
          device={device}
        />
      </View>
      {/* SIASN RW SKP */}
      <View style={{ paddingBottom: spacing.default }}>
        <CollapseCardSIASNRwSkp
          profile={profile?.siasn_data_full?.siasn_rw_skp}
          device={device}
        />
      </View>
      {/* SIASN RW SKP 22 */}
      <View style={{ paddingBottom: spacing.default }}>
        <CollapseCardSIASNRwSkp22
          profile={profile?.siasn_data_full?.siasn_rw_skp22}
          device={device}
        />
      </View>
      {/* SIASN RW PNS Unor */}
      <View style={{ paddingBottom: spacing.default }}>
        <CollapseCardSIASNRwPnsUnor
          profile={profile?.siasn_data_full?.siasn_rw_pnsunor}
          device={device}
        />
      </View>
      {/* SIASN Angka Kredit */}
      <View style={{ paddingBottom: spacing.default }}>
        <CollapseCardSIASNAngkaKredit
          profile={profile?.siasn_data_full?.siasn_rw_angkakredit}
          device={device}
        />
      </View>
      {/* SIASN RW Pendidikan */}
      <View style={{ paddingBottom: spacing.default }}>
        <CollapseCardSIASNRwPendidikan
          profile={profile?.siasn_data_full?.siasn_rw_pendidikan}
          device={device}
        />
      </View>
      {/* SIASN Penghargaan */}
      <View style={{ paddingBottom: spacing.default }}>
        <CollapseCardSIASNRwPenghargaan
          profile={profile?.siasn_data_full?.siasn_rw_penghargaan}
          device={device}
        />
      </View>
      {/* Pasangan */}
      {/* <View style={{ paddingBottom: spacing.default }}>
        <CollapseCardPasangan
          profile={profile?.siasn_data_full?.siasn_data_pasangan?.listPasangan}
          device={device}
        />
      </View> */}
      {/* Anak */}
      {/* <View style={{ paddingBottom: spacing.default }}>
        <CollapseCardAnak
          profile={profile?.siasn_data_full?.siasn_data_anak}
          device={device}
        />
      </View> */}
      {/* Ortang tua */}
      {/* <View style={{ paddingBottom: spacing.default }}>
        <CollapseCardOrangTua
          profile={profile?.siasn_data_full?.siasn_data_ortu}
          device={device}
        />
      </View> */}
      {/* Masa Kerja */}
      <View style={{ paddingBottom: spacing.default }}>
        <CollapseCardMasaKerja
          profile={profile?.siasn_data_full?.siasn_rw_masakerja}
          device={device}
        />
      </View>
      {/* Hukuman Disiplin */}
      <View style={{ paddingBottom: spacing.default }}>
        <CollapseCardHukumanDisiplin
          profile={profile?.siasn_data_full?.siasn_rw_hukdis}
          device={device}
        />
      </View>
      {/* Kursus Diklat */}
      <View style={{ paddingBottom: spacing.default }}>
        <CollapseCardSIASNRwKursusDiklat
          profile={profile?.siasn_data_full}
          device={device}
        />
      </View>
    </ScrollView>
  );
};
