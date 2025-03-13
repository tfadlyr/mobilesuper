import React from "react";
import { Platform, useWindowDimensions, View } from "react-native";
import { Text } from "react-native";
import { Search } from "../../components/Search";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { FlatList } from "react-native";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
  getOrientation,
} from "../../config/SuperAppps";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import { getTokenValue } from "../../service/session";
import { getKesejahteraan, getTeknologi } from "../../service/api";
import { Linking } from "react-native";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { RefreshControl } from "react-native";

const ListTeknologi = ({ item, loading, device }) => {
  const navigation = useNavigation();
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  const getWidthImage = () => {
    let tempWidth = 0;
    let orientation = getOrientation(screenWidth, screenHeight);

    if (device === "tablet") {
      if (orientation === "landscape") {
        tempWidth = screenWidth - 45;
      } else {
        tempWidth = screenWidth - 45;
      }
    } else {
      tempWidth = screenWidth - 40;
    }

    return tempWidth;
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 16,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
        margin: 20,
      }}
    >
      <View>
        {loading ? (
          <ShimmerPlaceHolder
            style={{ borderRadius: 4 }}
            width={355}
            height={355}
          />
        ) : (
          <View>
            <Image
              source={{ uri: item.image_url }}
              style={{
                width: getWidthImage(),
                height: device === "tablet" ? 500 : 350,
                borderRadius: 16,
              }}
            />
          </View>
        )}
        <View style={{ marginTop: 20, marginHorizontal: 5 }}>
          {loading ? (
            <ShimmerPlaceHolder
              style={{ borderRadius: 4 }}
              width={250}
              height={20}
            />
          ) : (
            <Text
              style={{
                marginVertical: 5,
                fontSize: fontSizeResponsive("H2", device),
                fontWeight: FONTWEIGHT.bold,
                marginHorizontal: 10,
              }}
            >
              {item.title}
            </Text>
          )}
        </View>
        {loading ? (
          <View style={{ alignItems: "center" }}>
            <ShimmerPlaceHolder
              style={{ borderRadius: 4, marginVertical: 20 }}
              width={250}
              height={40}
            />
          </View>
        ) : (
          <TouchableOpacity
            style={{
              borderWidth: 1,
              marginHorizontal: 20,
              marginVertical: 20,
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 8,
              borderColor: COLORS.primary,
            }}
            onPress={() => {
              Linking.openURL(item.url);
            }}
          >
            <Text
              style={{
                color: COLORS.primary,
                fontSize: fontSizeResponsive("H3", device),
              }}
            >
              Buka Lebih Lengkap
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export const TeknologiTerbaru = () => {
  const [token, setToken] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getTeknologi(token));
    }
  }, [token]);

  const { teknologi, loading } = useSelector((state) => state.dashboard);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        dispatch(getTeknologi(token));
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [token]);

  const { device } = useSelector((state) => state.apps);

  return (
    <View style={{ flex: 1 }}>
      {/* <View style={{ width: '90%', marginLeft: 20, marginTop: 20 }}>
                <Search
                    placeholder={'Cari...'}
                />
            </View> */}
      <FlatList
        data={teknologi.lists}
        renderItem={({ item }) => (
          <ListTeknologi item={item} loading={loading} device={device} />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backIcon: {
    backgroundColor: "white",
    height: 28,
    width: 28,
    borderRadius: 50,
  },
  imageIos: {
    borderRadius: 16,
    height: 358,
    width: 358,
  },
  imageAndroid: {
    borderRadius: 16,
    height: 358,
    width: 358,
  },
  imageTablet: {
    borderRadius: 16,
    height: 500,
    width: 800,
  },
});
