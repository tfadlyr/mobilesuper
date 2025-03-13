import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS } from "../../../config/SuperAppps";
import CardList from "../../../components/UI/CardList";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { SvgXml } from "react-native-svg";
import { GlobalStyles } from "../../../constants/styles";
import bgSearch from "../../../assets/superApp/images/bg-search.svg";
import { Config } from "../../../constants/config";
import { FlatList } from "react-native";
import CardListSearch from "../../../components/UI/CardListSearch";

export const PSubmitted = ({ data }) => {
  const navigation = useNavigation();
  const animation = useRef(null);
  const renderItem = ({ item }) => (
    <>
      <View style={{ marginBottom: 16 }}>
        {item.children.map(
          (data) =>
            data?.type == "submitted" && (
              <CardListSearch
                key={data.agenda_id != "0" ? data.agenda_id : data.document_id}
                data={data}
                tipe="searchglobal"
                onPress={() => {
                  if (data?.type == "incoming") {
                    navigation.navigate("IncomingDetail", {
                      id: data.agenda_id,
                      title: "Detail Surat Masuk",
                    });
                  } else if (data?.type == "disposition") {
                    navigation.navigate("DispositionDetail", {
                      id: data.agenda_id,
                      title: "Detail Disposisi",
                    });
                  } else if (data?.type == "outgoing") {
                    navigation.navigate("NeedFollowUpDetail", {
                      id: data.document_id,
                      title: "Detail Surat Keluar\nPerlu Diproses",
                    });
                  } else if (data?.type == "submitted") {
                    navigation.navigate("SubmittedDetail", {
                      id: data.agenda_id,
                      title: "Detail Surat Keluar\nTerkirim",
                    });
                  }
                }}
              />
            )
        )}
      </View>
    </>
  );

  const defaultEmpty = (
    <View style={styles.notFound}>
      {/* <SvgXml width="90%" xml={bgSearch} /> */}
      <Image source={require("../../../assets/superApp/SearchLetter.png")} />
      <View style={{ alignItems: "center", gap: 10, marginTop: 10 }}>
        <Text style={{ fontSize: 13, fontWeight: 600, color: COLORS.lighter }}>
          Cari surat anda
        </Text>
        <Text style={{ fontSize: 13, fontWeight: 400, color: COLORS.lighter }}>
          ketikkan kata kunci pada isian diatas
        </Text>
      </View>
    </View>
  );
  const listEmpty = (
    <View style={styles.notFound}>
      <LottieView
        autoPlay
        ref={animation}
        style={[styles.titleNotFound, { width: "100%", height: 200 }]}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={Config.notFound}
      />
      <Text style={styles.titleNotFound}>
        {/* {isLoading
          ? "Loading..."
          : isSearchFilter
            ? "Letter not found"
            : list?.count == 0
              ? "You don't have Letter"
              : "Loading..."} */}
      </Text>
    </View>
  );
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      {/* <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
            <Image source={require ("../../../assets/superApp/SearchLetter.png")} />
            <View style={{ alignItems: "center", gap: 10, marginTop: 10 }}>
                <Text style={{ fontSize: 13, fontWeight: 600, color: COLORS.lighter }}>Find your letter</Text>
                <Text style={{ fontSize: 13, fontWeight: 400, color: COLORS.lighter }}>type keyword in the input text</Text>
            </View>
        </View> */}
      {/* {data != undefined && (
        <View style={{ marginVertical: 20 }}>
          <Text style={{ fontSize: 15, fontWeight: 500 }}>
            Hasil ({data?.count})
          </Text>
        </View>
      )} */}
      <FlatList
        keyExtractor={(item) => item.date}
        data={data?.results}
        renderItem={renderItem}
        ListEmptyComponent={defaultEmpty}
        // refreshing={isLoading}
        // onRefresh={refresh}
        // onEndReached={loadMore}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  notFound: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  titleNotFound: {
    textAlign: "center",
    paddingVertical: 32,
    color: GlobalStyles.colors.primary,
  },
  containerRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: GlobalStyles.colors.textWhite,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginTop: 8,
    marginBottom: 10,
    borderRadius: 10,
    fontSize: 16,
    lineHeight: 20,
    padding: 8,
    backgroundColor: "rgba(151, 151, 151, 0.25)",
  },
  containerRow: {
    flexDirection: "row",
    marginBottom: 16,
    paddingBottom: 16,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: GlobalStyles.colors.tertiery20,
  },
  titleFilter: {
    fontSize: GlobalStyles.font.xl,
    fontWeight: "bold",
  },
  titleReset: {
    fontSize: GlobalStyles.font.lg,
    fontWeight: "bold",
    color: GlobalStyles.colors.error80,
  },
  bottomsheetContent: {
    marginBottom: 12,
  },
  bottomsheetLabel: {
    fontSize: GlobalStyles.font.md,
    fontWeight: "bold",
    marginBottom: 8,
  },
  bottomsheetInput: {
    borderRadius: 10,
    fontSize: 16,
    borderColor: GlobalStyles.colors.black50,
    borderWidth: 1,
    padding: 12,
  },
  buttonContainer: {
    borderTopWidth: 1,
    borderTopColor: GlobalStyles.colors.tertiery20,
    paddingTop: 16,
    marginTop: 16,
  },
  button: {
    backgroundColor: GlobalStyles.colors.approve,
    marginBottom: 16,
    borderTopWidth: 1,
  },
  buttonText: {
    fontSize: GlobalStyles.font.lg,
    fontWeight: "bold",
  },
  headerList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: GlobalStyles.colors.tertiery70,
    color: GlobalStyles.colors.textWhite,
    borderRadius: 0,
    fontWeight: "600",
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
});
