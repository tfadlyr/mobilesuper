import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  COLORS,
  FONTWEIGHT,
  fontSizeResponsive,
  getOrientation,
} from "../../config/SuperAppps";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { getNominatif, getNominatifReport } from "../../service/api";
import ListEmpty from "../../components/ListEmpty";
import { Loading } from "../../components/Loading";
import { CardListNominatif } from "../../components/CardListNominatif";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";

export const NominatifList = ({ route }) => {
  const item = route.params;
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  useEffect(() => {
    dispatch(
      getNominatif({
        token: item.token,
        filterUnitKerja: item?.filterUnitKerja,
        firstGolongan: item?.firstGolongan,
        secondGolongan: item?.secondGolongan,
        firstEselon: item?.firstEselon,
        secondEselon: item?.secondEselon,
        statusPegawai: item?.statusPegawai,
        tahunTMT: item?.tahunTMT,
        page: page,
        search: search,
      })
    );
    dispatch(
      getNominatifReport({
        token: item.token,
        filterUnitKerja: item.filterUnitKerja,
        firstGolongan: item.firstGolongan,
        secondGolongan: item.secondGolongan,
        firstEselon: item.firstEselon,
        secondEselon: item.secondEselon,
        statusPegawai: item.statusPegawai,
        tahunTMT: item.tahunTMT,
        page: page,
      })
    );
  }, [page, search]);

  const loadMore = () => {
    if (nominatif.lists.length % 10 === 0) {
      if (nominatif?.lists?.length !== 0) {
        setPage(page + 1);
        if (scrollRef && nominatif.lists.length !== 0) {
          scrollRef.current.scrollToIndex({ animated: false, index: 0 });
        }
      }
    }
  };

  const onRefresh = () => {
    if (page > 1) {
      setPage(page - 1);
    }
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const filterSearch = () => {
    setSearch(inputValue);
  };

  const { loading, nominatif, nominatifReport } = useSelector(
    (state) => state.kepegawaian
  );

  const downloadPath =
    FileSystem.documentDirectory + (Platform.OS == "android" ? "" : "");

  const shareReport = async (fileUrl) => {
    console.log(fileUrl);
    const namafile = nominatifReport?.file.split("/");
    try {
      const downloadResumable = FileSystem.createDownloadResumable(
        fileUrl,
        downloadPath + namafile[namafile.length - 1],
        { headers: { Authorization: item.token } }
      );
      try {
        const { uri } = await downloadResumable.downloadAsync();
        saveFile(uri);
      } catch (e) {
        console.error("download error:", e);
      }
    } catch (e) {}
  };

  const saveFile = async (fileUri) => {
    try {
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/vnd.ms-excel",
        dialogTitle: "Share PDF",
      });
    } catch (error) {
      console.error("Error sharing file:", error);
    }
  };

  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  let orientation = getOrientation(screenWidth, screenHeight);

  const { device } = useSelector((state) => state.apps);
  return (
    <View>
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
            Nominatif Pegawai
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderWidth: 1,
            borderColor: COLORS.ExtraDivinder,
            borderRadius: 8,
            backgroundColor: COLORS.white,
            width:
              device === "tablet" && orientation === "landscape"
                ? "90%"
                : device === "tablet" && orientation === "potrait"
                ? "87%"
                : "73%",
            marginHorizontal: 20,
          }}
        >
          <Ionicons
            name="search"
            size={fontSizeResponsive("H3", device)}
            color={COLORS.primary}
          />
          <TextInput
            placeholder={"Cari..."}
            style={{
              fontSize: fontSizeResponsive("H4", device),
              flex: 1,
            }}
            maxLength={30}
            value={inputValue}
            onChangeText={(text) => setInputValue(text)}
            onEndEditing={filterSearch}
            clearButtonMode="always"
            allowFontScaling={false}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            shareReport(
              nominatifReport?.file,
              "application/vnd.ms-excel",
              "sample.xls"
            );
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 30,
              backgroundColor: COLORS.white,
              justifyContent: "center",
              alignItems: "center",
              borderColor: COLORS.secondaryLighter,
              // borderWidth: isFiltered ? 1 : 0,
            }}
          >
            <Ionicons name="share-social" size={24} color={COLORS.primary} />
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={nominatif.lists}
        keyExtractor={(item) => item?.id}
        renderItem={({ item }) => (
          <View key={item.id}>
            <CardListNominatif item={item} device={device} />
          </View>
        )}
        ref={scrollRef}
        ListEmptyComponent={() => <ListEmpty />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        style={{ height: "87%", marginHorizontal: 20 }}
      />
    </View>
  );
};
