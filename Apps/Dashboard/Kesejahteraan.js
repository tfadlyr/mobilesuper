import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Image } from "react-native";
import { View } from "react-native";
import { Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getTokenValue } from "../../service/session";
import { TouchableOpacity } from "react-native";
import { getKesejahteraan } from "../../service/api";
import { FlatList } from "react-native";
import moment from "moment/min/moment-with-locales";
import {
  COLORS,
  DATETIME,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import { ScrollView } from "react-native";
import { createShimmerPlaceHolder } from "expo-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator } from "react-native";
import { setKesejahteraanEmpty } from "../../store/Dashboard";
import ListEmpty from "../../components/ListEmpty";
import { RefreshControl } from "react-native";

const CardLists = ({
  item,
  setDetail,
  setDetailContent,
  value,
  loading,
  device,
}) => {
  const source = {
    html: `<section id="services" className="services">
        <div className="container">
            <header className="section-header wow fadeInUp col-md-8" style={{ margin: '0px auto', visibility: 'visible', animationName: 'fadeInUp' }}>
                <h3 className="text-center">Layanan untuk ASN</h3>
                <p className="section-subheading text-muted text-center mb-4">TASPEN sebagai penyelenggara Jaminan Sosial Aparatur Sipil Negara (ASN) dan Pejabat Negara yaitu Program Tabungan Hari Tua (THT), Program Pensiun, Program JKK dan JKM.</p>
            </header>
            <div className="row" id="services-list">
                <div className="col-lg-6 col-md-12" style={{ visibility: 'visible' }}>
                    <div className="row">
                        <div className="icon col-md-2" style={{ padding: '0px' }}>
                            <img src="https://www.taspen.co.id/assets/img/icon/JKKv2_copy.png" width="100%" />
                        </div>
                        <div className="col-md-10">
                            <h3 className="title">
                                <a href="https://www.taspen.co.id/layanan/jkk">Jaminan Kecelakaan Kerja</a>
                            </h3>
                            <p className="section-subheading text-muted mb-4">Perlindungan atas risiko kecelakaan kerja atau penyakit akibat kerja berupa perawatan, santunan dan tunjangan cacat </p>
                            <a href="https://www.taspen.co.id/layanan/jkk" style={{ marginBottom: '10px' }}>Selengkapnya &gt;</a>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-md-12" style={{ visibility: 'visible' }}>
                    <div className="row">
                        <div className="icon col-md-2" style={{ padding: '0px' }}>
                            <img src="https://www.taspen.co.id/assets/img/icon/THTv2_copy.png" width="100%" />
                        </div>
                        <div className="col-md-10">
                            <h3 className="title">
                                <a href="https://www.taspen.co.id/layanan/tht">Tabungan Hari Tua</a>
                            </h3>
                            <p className="section-subheading text-muted mb-4">Program Asuransi Dwiguna yang dikaitkan dengan usia pensiun ditambah dengan Asuransi Kematian </p>
                            <a href="https://www.taspen.co.id/layanan/tht" style={{ marginBottom: '10px' }}>Selengkapnya &gt;</a>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-md-12 mt-5" style={{ visibility: 'visible' }}>
                    <div className="row">
                        <div className="icon col-md-2" style={{ padding: '0px' }}>
                            <img src="https://www.taspen.co.id/assets/img/icon/PENSIUN2v2_copy.png" width="100%" />
                        </div>
                        <div className="col-md-10">
                            <h3 className="title">
                                <a href="https://www.taspen.co.id/layanan/pensiun">Program Pensiun</a>
                            </h3>
                            <p className="section-subheading text-muted mb-4"> Penghasilan yang diterima oleh penerima pensiun setiap bulan sebagai jaminan hari tua dan penghargaan atas jasa-jasanya mengabdi pada negara berdasarkan Undang-Undang No. 11 Tahun 1969 tentang Pensiun Pegawai dan Pensiun Janda/Duda Pegawai.</p>
                            <a href="https://www.taspen.co.id/layanan/pensiun" style={{ marginBottom: '10px' }}>Selengkapnya &gt;</a>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 col-md-12 mt-5" style={{ visibility: 'visible' }}>
                    <div className="row">
                        <div className="icon col-md-2" style={{ padding: '0px' }}>
                            <img src="https://www.taspen.co.id/assets/img/icon/JKMv2_copy.png" width="100%" />
                        </div>
                        <div className="col-md-10">
                            <h3 className="title">
                                <a href="https://www.taspen.co.id/layanan/jkm">Jaminan Kematian</a>
                            </h3>
                            <p className="section-subheading text-muted mb-4">Perlindungan atas risiko kematian bukan akibat kecelakaan kerja berupa santunan kematian</p>
                            <a href="https://www.taspen.co.id/layanan/jkm" style={{ marginBottom: '10px' }}>Selengkapnya &gt;</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>`,
  };
  const ShimmerPlaceHolder = createShimmerPlaceHolder(LinearGradient);
  const { width } = useWindowDimensions();
  return (
    <View>
      {/* {value === 'taspen' ? (
                <RenderHTML
                    source={source}
                    contentWidth={width}
                />
            ) : ( */}

      <TouchableOpacity
        style={{
          backgroundColor: COLORS.white,
          marginTop: 20,
          marginHorizontal: 20,
          padding: 10,
          borderRadius: 8,
        }}
        onPress={() => {
          setDetail("detail");
          setDetailContent(item);
        }}
      >
        {loading ? (
          <ShimmerPlaceHolder
            style={{ borderRadius: 4 }}
            width={330}
            height={20}
          />
        ) : (
          <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
            {moment(item.created_date).locale("id").format(DATETIME.LONG_DATE)}
          </Text>
        )}

        {loading ? (
          <ShimmerPlaceHolder
            style={{ borderRadius: 4, marginTop: 10 }}
            width={330}
            height={20}
          />
        ) : (
          <Text
            style={{
              marginTop: 10,
              fontWeight: FONTWEIGHT.bold,
              fontSize: fontSizeResponsive("H4", device),
            }}
          >
            {item.title}
          </Text>
        )}
      </TouchableOpacity>
      {/* )} */}
    </View>
  );
};

export const Kesejahteraan = () => {
  const [token, setToken] = useState("");
  const [value, setValue] = useState("tapera");
  const [detail, setDetail] = useState("");
  const [detailContent, setDetailContent] = useState({});
  const [page, setPage] = useState(1);
  const { device } = useSelector((state) => state.apps);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getKesejahteraan({ token: token, value: value, page: page }));
  }, [value, page, token]);

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
    setPage(1);
  }, [token]);

  const { kesejahteraan, loading } = useSelector((state) => state.dashboard);
  const [lists, setLists] = useState([]);

  const { width } = useWindowDimensions();

  const DATE_OPTIONS = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ID", DATE_OPTIONS);
  };

  useEffect(() => {
    setLists(kesejahteraan.lists.results);
  }, [kesejahteraan]);

  const loadMore = () => {
    if (lists.length !== 0) {
      if (lists.length % 5 === 0) {
        setPage(page + 1);
      }
    }
  };

  const filterHandleTapera = () => {
    dispatch(setKesejahteraanEmpty());
    setPage(1);
    setValue("tapera");
  };
  const filterHandleBpjs = () => {
    dispatch(setKesejahteraanEmpty());
    setPage(1);
    setValue("bpjs");
  };
  const filterHandleTaspen = () => {
    dispatch(setKesejahteraanEmpty());
    setPage(1);
    setValue("taspen");
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    try {
      if (token !== "") {
        dispatch(getKesejahteraan({ token: token, value: value, page: page }));
      }
    } catch (error) {}

    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, [value, token, page]);

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: device === "tablet" ? 100 : 30,
          marginTop: 20,
        }}
      >
        <TouchableOpacity
          style={{
            alignItems: "center",
            width: 100,
            paddingBottom: 10,
            borderBottomWidth: 2,
            borderBottomColor:
              value === "tapera" ? COLORS.primary : COLORS.grey,
          }}
          onPress={() => {
            filterHandleTapera();
          }}
        >
          <Image
            source={require("../../assets/superApp/Tapera.png")}
            style={{
              width: device === "tablet" ? 150 : 70,
              height: device === "tablet" ? 150 : 70,
            }}
          />
          <Text
            style={{
              color: value === "tapera" ? COLORS.primary : COLORS.foundation,
              fontSize: fontSizeResponsive("H4", device),
            }}
          >
            Tapera
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            alignItems: "center",
            width: 100,
            paddingBottom: 10,
            borderBottomWidth: 2,
            borderBottomColor: value === "bpjs" ? COLORS.primary : COLORS.grey,
          }}
          onPress={() => {
            filterHandleBpjs();
          }}
        >
          <Image
            source={require("../../assets/superApp/BPJS.png")}
            style={{
              width: device === "tablet" ? 150 : 70,
              height: device === "tablet" ? 150 : 70,
            }}
          />
          <Text
            style={{
              color: value === "bpjs" ? COLORS.primary : COLORS.foundation,
              fontSize: fontSizeResponsive("H4", device),
            }}
          >
            BPJS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            alignItems: "center",
            width: 100,
            paddingBottom: 10,
            borderBottomWidth: 2,
            borderBottomColor:
              value === "taspen" ? COLORS.primary : COLORS.grey,
          }}
          onPress={() => {
            filterHandleTaspen();
          }}
        >
          <Image
            source={require("../../assets/superApp/Taspen.png")}
            style={{
              width: device === "tablet" ? 150 : 70,
              height: device === "tablet" ? 150 : 70,
            }}
          />
          <Text
            style={{
              color: value === "taspen" ? COLORS.primary : COLORS.foundation,
              fontSize: fontSizeResponsive("H4", device),
            }}
          >
            Taspen
          </Text>
        </TouchableOpacity>
      </View>

      {detail === "" ? (
        <View>
          <View
            style={{ marginTop: 20, marginHorizontal: 20, marginBottom: 10 }}
          >
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H3", device),
              }}
            >
              Berita
            </Text>
            {/* custom divider */}
            <View
              style={{
                height: 1,
                width: "100%",
                backgroundColor: "#DBDADE",
                marginTop: 10,
              }}
            />
          </View>
          {lists.length !== 0 ? (
            <FlatList
              data={lists}
              renderItem={({ item }) => (
                <CardLists
                  item={item}
                  setDetail={setDetail}
                  setDetailContent={setDetailContent}
                  value={value}
                  loading={loading}
                  device={device}
                  enableExperimentalMarginCollapsing={true}
                />
              )}
              ListFooterComponent={() =>
                loading && (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 24,
                    }}
                  >
                    <ActivityIndicator size="large" color={COLORS.primary} />
                  </View>
                )
              }
              style={{ height: 500 }}
              keyExtractor={(item) => item.id}
              onEndReached={loadMore}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          ) : (
            <ListEmpty />
          )}
        </View>
      ) : (
        <ScrollView>
          <View
            style={{
              marginTop: 20,
              marginHorizontal: 20,
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              flex: 1,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setDetail("");
              }}
            >
              <Ionicons name="chevron-back-outline" size={24} />
            </TouchableOpacity>
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H3", device),
              }}
            >
              Detail Berita
            </Text>
          </View>
          {/* custom divider */}
          <View
            style={{
              height: 1,
              width: "90%",
              backgroundColor: "#DBDADE",
              marginTop: 10,
              marginHorizontal: 20,
            }}
          />

          <View
            style={{
              marginHorizontal: 20,
              backgroundColor: COLORS.white,
              padding: 20,
              marginTop: 20,
              borderRadius: 8,
              flex: 1,
              marginBottom: "50%",
            }}
          >
            <Text
              style={{
                fontWeight: FONTWEIGHT.bold,
                fontSize: fontSizeResponsive("H4", device),
              }}
            >
              {detailContent.title}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                marginTop: 5,
              }}
            >
              <Ionicons
                name="time-outline"
                size={device === "tablet" ? 40 : 20}
                color={COLORS.grey}
              />
              {/* <Text>{moment(detailContent.created_date).format(DATETIME.LONG_DATE)}</Text> */}
              <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                {formatDate(detailContent.created_date)}
              </Text>
            </View>
            {/* custom divider */}
            <View
              style={{
                width: "100%",
                backgroundColor: "#DBDADE",
                marginTop: 10,
                flex: 1,
              }}
            />

            <RenderHTML
              source={{ html: detailContent.content }}
              contentWidth={width}
              defaultTextProps={{ allowFontScaling: false }}
            />
          </View>
        </ScrollView>
      )}
    </View>
  );
};
