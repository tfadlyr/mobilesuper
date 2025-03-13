import { Text, View } from "react-native";
import { COLORS, fontSizeResponsive } from "../../config/SuperAppps";

export const CardApprovalEvent = ({ item, id, device }) => {
  console.log(item);
  return (
    <View
      key={id}
      style={{
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
      }}
    >
      <View>
        <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
          {item.actor.nama}
        </Text>
        {/* <View style={{ flexDirection: 'row', gap: 5 }}>
                    <Text>Waktu:</Text>
                    <Text>{item.waktu}</Text>
                </View> */}
      </View>
      <View
        style={{
          width: 100,
          paddingVertical: 6,
          borderRadius: 30,
          backgroundColor:
            item.status === "sepakat"
              ? COLORS.successLight
              : item.status === "Menunggu"
              ? COLORS.infoLight
              : COLORS.infoDangerLight,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color:
              item.status === "sepakat"
                ? COLORS.success
                : item.status === "Menunggu"
                ? COLORS.info
                : COLORS.infoDanger,
            fontSize: fontSizeResponsive("H4", device),
          }}
        >
          {item.status}
        </Text>
      </View>
    </View>
  );
};
