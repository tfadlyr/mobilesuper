import React from "react";
import { Image, Text, View } from "react-native";
import {
  COLORS,
  fontSizeResponsive,
  FONTWEIGHT,
} from "../../config/SuperAppps";

export const CardListDashboardPKRL = ({ item, device }) => {
  return (
    <View
      style={{
        marginHorizontal: "2%",
        marginTop: 10,
        backgroundColor: COLORS.ExtraDivinder,
        padding: 10,
        borderRadius: 10,
      }}
    >
      <View
        style={{
          flexDirection: "column",
          flex: 1,
        }}
      >
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              textAlign: "justify",
              fontWeight: FONTWEIGHT.bold,
              flexWrap: "wrap",
            }}
          >
            {item?.subject}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: COLORS.lighter,
            height: 1,
            marginVertical: 5,
            width: "90%",
          }}
        />
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            flex: 1,
            gap: 5,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              textAlign: "auto",
              fontWeight: FONTWEIGHT.normal,
              fontWeight: FONTWEIGHT.bold,
              width: "38%",
            }}
          >
            Nomor Dokumen
          </Text>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              textAlign: "auto",
              fontWeight: FONTWEIGHT.normal,
              fontWeight: FONTWEIGHT.bold,
            }}
          >
            :
          </Text>
          <Text
            style={{
              fontWeight: FONTWEIGHT.normal,
              width: "60%",
              textAlign: "auto",
              fontSize: fontSizeResponsive("H4", device),
            }}
          >
            {item?.extra_attributes.no_perizinan !== ""
              ? item?.extra_attributes.no_perizinan
              : "-"}
          </Text>
        </View>

        <View
          style={{
            width: "100%",
            flexDirection: "row",
            flex: 1,
            gap: 5,
            marginTop: 5,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              textAlign: "auto",
              fontWeight: FONTWEIGHT.normal,
              fontWeight: FONTWEIGHT.bold,
              width: "38%",
            }}
          >
            Status
          </Text>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              textAlign: "auto",
              fontWeight: FONTWEIGHT.normal,
              fontWeight: FONTWEIGHT.bold,
            }}
          >
            :
          </Text>
          <View
            style={{
              backgroundColor:
                item.state === "done"
                  ? COLORS.successLight
                  : item.state === "in_progress"
                  ? COLORS.warningLight
                  : item.state === "revision"
                  ? COLORS.infoDangerLight
                  : item.state === "ttde"
                  ? COLORS.infoLight
                  : COLORS.bgLightGrey,
              padding: 10,
              borderRadius: 15,
            }}
          >
            <Text
              style={{
                fontWeight: FONTWEIGHT.normal,
                textAlign: "auto",
                fontSize: fontSizeResponsive("H4", device),
                color:
                  item.state === "done"
                    ? COLORS.success
                    : item.state === "in_progress"
                    ? COLORS.warning
                    : item.state === "revision"
                    ? COLORS.infoDanger
                    : item.state === "ttde"
                    ? COLORS.info
                    : COLORS.grey,
              }}
            >
              {item.state === "done"
                ? "Done"
                : item.state === "in_progress"
                ? "In Progress"
                : item.state === "ttde"
                ? "Pengambilan Nomor"
                : item.state}
            </Text>
          </View>
        </View>

        <View style={{ width: "100%" }}>
          <View style={{}}>
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
                width: 120,
                textAlign: "auto",
                paddingRight: 12,
                fontWeight: FONTWEIGHT.normal,
                width: "90%",
                fontWeight: FONTWEIGHT.bold,
                marginTop: 5,
              }}
            >
              Konseptor
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <Image
                source={{ uri: item.composer.avatar_url }}
                height={device === "tablet" ? 50 : 30}
                width={device === "tablet" ? 50 : 30}
                borderRadius={device === "tablet" ? 50 : 30}
              />
              <Text
                style={{
                  fontWeight: FONTWEIGHT.normal,
                  width: "90%",
                  textAlign: "auto",
                  fontSize: fontSizeResponsive("H4", device),
                }}
              >
                {item.composer.is_title
                  ? item.composer.officer.nama
                  : item.composer.nama}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
