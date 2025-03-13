import { Text } from "react-native";
import { View } from "react-native";
import {
  COLORS,
  DATETIME,
  FONTSIZE,
  FONTWEIGHT,
} from "../../config/SuperAppps";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment/min/moment-with-locales";

export const CardSubAgendaGrup = ({ item, loading }) => {
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);
  return (
    <View style={{ marginTop: 20 }}>
      <View style={{ justifyContent: "space-between" }}>
        <View style={{}}>
          {loading ? (
            <ShimmerPlaceHolder
              style={{ borderRadius: 4 }}
              width={100}
              height={20}
            />
          ) : (
            <View style={{ flexDirection: "row", gap: 5 }}>
              <Text
                style={{
                  width: 170,
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: FONTSIZE.H3,
                }}
              >
                Judul Agenda
              </Text>
              <Text style={{ fontSize: FONTSIZE.H3, width: 150 }}>
                {item.title}
              </Text>
            </View>
          )}

          {loading ? (
            <ShimmerPlaceHolder
              style={{ borderRadius: 4 }}
              width={100}
              height={20}
            />
          ) : (
            <View style={{ flexDirection: "row", gap: 5, marginTop: 10 }}>
              <Text
                style={{
                  width: 170,
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: FONTSIZE.H3,
                }}
              >
                Tanggal Agenda Rapat
              </Text>
              {/* <Text>:</Text> */}
              <Text style={{ fontSize: FONTSIZE.H3 }}>
                {moment(item.date).locale("id").format(DATETIME.LONG_DATE)}
              </Text>
            </View>
          )}

          {loading ? (
            <ShimmerPlaceHolder
              style={{ borderRadius: 4, marginTop: 5 }}
              width={80}
              height={20}
            />
          ) : (
            <View style={{ flexDirection: "row", gap: 5, marginTop: 10 }}>
              <Text
                style={{
                  width: 170,
                  fontWeight: FONTWEIGHT.bold,
                  fontSize: FONTSIZE.H3,
                }}
              >
                Waktu
              </Text>
              {/* <Text>:</Text> */}
              <Text style={{ fontSize: FONTSIZE.H3 }}>
                {item.start_time.substr(0, 5)} - {item.end_time.substr(0, 5)}
              </Text>
            </View>
          )}
        </View>

        {loading ? (
          <ShimmerPlaceHolder
            style={{ borderRadius: 4 }}
            width={70}
            height={20}
          />
        ) : (
          <View style={{ flexDirection: "row", gap: 5, marginTop: 10 }}>
            <Text
              style={{
                width: 170,
                fontWeight: FONTWEIGHT.bold,
                fontSize: FONTSIZE.H3,
              }}
            >
              Lokasi
            </Text>
            {/* <Text>:</Text> */}
            <Text style={{ fontSize: FONTSIZE.H3, width: 150 }}>
              {item.location}
            </Text>
          </View>
        )}
      </View>
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: COLORS.lighter,
          opacity: 0.3,
          marginTop: 10,
        }}
      />
    </View>
  );
};
