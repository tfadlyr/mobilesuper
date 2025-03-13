import React from "react";
import { Image, Text, View } from "react-native";
import { COLORS, fontSizeResponsive } from "../../config/SuperAppps";

export const CardListNominatif = ({ item, device }) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <View style={{ width: device === "tablet" ? 350 : 150 }}>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            NAMA
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            NIP
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            TEMPAT/TANGGAL LAHIR
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            NO KARPEG KARIS/KARSU
          </Text>
        </View>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>:</Text>
        <View style={{ width: device === "tablet" ? 350 : 150 }}>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item?.updated_getrefpeg_data?.pegawai_nama_lengkap
              ? item?.updated_getrefpeg_data?.pegawai_nama_lengkap
              : item?.nama
              ? item?.nama
              : "-"}
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item?.nip ? item?.nip : "-"}
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item?.updated_getrefpeg_data?.pegawai_tempat_tanggal_lahir
              ? item?.updated_getrefpeg_data?.pegawai_tempat_tanggal_lahir
              : "-"}
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item?.karis ? item.karis : "-"}
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item?.karpeg ? item.karpeg : "-"}
          </Text>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          backgroundColor: COLORS.ExtraDivinder,
          height: 1,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginVertical: 10,
        }}
      >
        <View style={{ width: device === "tablet" ? 350 : 150 }}>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            JENIS KELAMIN
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            STAT.KELUARGA
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            AGAMA
          </Text>
        </View>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>:</Text>
        <View style={{ width: device === "tablet" ? 350 : 150 }}>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item?.jenis_kelamin ? item?.jenis_kelamin : "-"}
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item?.siasn_data?.statusPerkawinan
              ? item?.siasn_data?.statusPerkawinan
              : "-"}
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item?.siasn_data?.agama ? item?.siasn_data.agama : "-"}
          </Text>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          backgroundColor: COLORS.ExtraDivinder,
          height: 1,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginVertical: 10,
        }}
      >
        <View style={{ width: device === "tablet" ? 350 : 150 }}>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            GOL/RU
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            TMT MASA KERJA GOL. TERAKHIR
          </Text>
        </View>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>:</Text>
        <View style={{ width: device === "tablet" ? 350 : 150 }}>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item?.golongan ? item?.golongan : "-"}
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>{`${
            item?.siasn_data?.tmtGolonganAkhir
              ? item?.siasn_data?.tmtGolonganAkhir
              : "-"
          }`}</Text>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          backgroundColor: COLORS.ExtraDivinder,
          height: 1,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginVertical: 10,
        }}
      >
        <View style={{ width: device === "tablet" ? 350 : 150 }}>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            JAB.STRUKTURAL TMT STRUKTURAL MASA KERJA JAB.TERAKHIR
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            JAB.FUNGSIONAL TMT FUNGSIONAL
          </Text>
        </View>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>:</Text>
        <View style={{ width: device === "tablet" ? 350 : 150 }}>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item?.siasn_data?.jabatanStrukturalNama
              ? item?.siasn_data?.jabatanStrukturalNama
              : "-"}
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item?.siasn_data?.jabatanStrukturalNama
              ? item?.siasn_data?.jabatanStrukturalNama
              : "-"}
          </Text>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          backgroundColor: COLORS.ExtraDivinder,
          height: 1,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginVertical: 10,
        }}
      >
        <View style={{ width: device === "tablet" ? 350 : 150 }}>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            UNIT KERJA
          </Text>
        </View>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>:</Text>
        <View style={{ width: device === "tablet" ? 350 : 150 }}>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item?.unit_kerja ? item?.unit_kerja : "-"}
          </Text>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          backgroundColor: COLORS.ExtraDivinder,
          height: 1,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginVertical: 10,
        }}
      >
        <View style={{ width: device === "tablet" ? 350 : 150 }}>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            PENDIDIKAN AKHIR/TAHUN SEKOLAH/UNIVERSITAS
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            FAKULTAS JURUSAN
          </Text>
        </View>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>:</Text>
        <View style={{ width: device === "tablet" ? 350 : 150 }}>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item?.pendidikan ? item?.pendidikan : "-"}/
            {item?.updated_getrefpeg_data?.pegawai_pendidikan_tahun_lulus
              ? item?.updated_getrefpeg_data?.pegawai_pendidikan_tahun_lulus
              : "-"}
            /
            {item?.updated_getrefpeg_data?.pegawai_pendidikan_nama
              ? item?.updated_getrefpeg_data?.pegawai_pendidikan_nama
              : "-"}
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item?.updated_getrefpeg_data?.pegawai_pendidikan_program_studi_nama
              ? item?.updated_getrefpeg_data
                  ?.pegawai_pendidikan_program_studi_nama
              : "-"}
          </Text>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          backgroundColor: COLORS.ExtraDivinder,
          height: 1,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginVertical: 10,
        }}
      >
        <View style={{ width: device === "tablet" ? 350 : 150 }}>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            DIKLAT PERJENJANGAN
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            NAMA DIKLAT
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            TAHUN
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            LEMHANAS/ANGKATAN
          </Text>
        </View>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>:</Text>
        <View style={{ width: device === "tablet" ? 350 : 150 }}>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item?.updated_getrefpeg_data?.jenis_diklat_nama
              ? item?.updated_getrefpeg_data?.jenis_diklat_nama
              : "-"}
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item?.updated_getrefpeg_data?.pegawai_diklat_nama
              ? item?.updated_getrefpeg_data?.pegawai_diklat_nama
              : "-"}
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item?.updated_getrefpeg_data?.pegawai_diklat_tahun
              ? item?.updated_getrefpeg_data?.pegawai_diklat_tahun
              : "-"}
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>-</Text>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          backgroundColor: COLORS.ExtraDivinder,
          height: 1,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginVertical: 10,
        }}
      >
        <View style={{ width: device === "tablet" ? 350 : 150 }}>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            TGL.CAPEG MASA KERJA KESELURUHAN
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            STATUS KEPEGAWAIAN
          </Text>
        </View>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>:</Text>
        <View style={{ width: device === "tablet" ? 350 : 150 }}>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item?.updated_getrefpeg_data?.pegawai_cpns_tanggal_tmt
              ? item?.updated_getrefpeg_data?.pegawai_cpns_tanggal_tmt
              : "-"}
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item?.siasn_data?.masaKerja ? item?.siasn_data?.masaKerja : "-"}
          </Text>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {item?.jenis_pegawai ? item?.jenis_pegawai : "-"}
          </Text>
        </View>
      </View>
      <View
        style={{
          width: "100%",
          backgroundColor: COLORS.ExtraDivinder,
          height: 1,
        }}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginVertical: 10,
        }}
      >
        <View style={{ width: device === "tablet" ? 350 : 150 }}>
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            PHOTO
          </Text>
        </View>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>:</Text>
        <View style={{ width: device === "tablet" ? 350 : 150 }}>
          {item?.updated_getrefpeg_data?.pegawai_image_path ? (
            <Image
              source={{ uri: item?.updated_getrefpeg_data?.pegawai_image_path }}
              style={{ width: 70, height: 70, borderRadius: 50 }}
            />
          ) : (
            <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
              -
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};
