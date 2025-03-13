import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";
import { } from "react-native-safe-area-context";
import {
  AVATAR,
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TabBar } from "react-native-tab-view";
import { useDispatch, useSelector } from "react-redux";
import { getTokenValue } from "../../service/session";
import {
  getMyPostCount,
  getMyPostLike,
  getMyPostPoint,
  getMyPostView,
} from "../../service/api";
import { Loading } from "../../components/Loading";

export const JumlahPostingan = () => {
  const navigation = useNavigation();

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "1" },
    { key: "second", title: "2" },
    { key: "third", title: "3" },
    { key: "fourth", title: "4" },
  ]);

  const [token, setToken] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token !== "") {
      dispatch(getMyPostView(token));
      dispatch(getMyPostPoint(token));
      dispatch(getMyPostLike(token));
      dispatch(getMyPostCount(token));
    }
  }, [token]);

  const { postinganSayaJumlah } = useSelector((state) => state.pengetahuan);

  const { device } = useSelector((state) => state.apps);


  const FirstRoute = () => (
    <View style={{ marginTop: 10 }}>
      <Text
        style={{
          backgroundColor: "#F0F0F0",
          fontSize: fontSizeResponsive("H4", device),
          fontWeight: 600,
          textAlign: "center",
          borderRadius: 4,
          padding: 5,
        }}
      >
        JUMLAH
      </Text>
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "30%",
            height: 64,
            alignItems: "center",
            alignContent: "center",
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 400,
            }}
          >
            Nilai
          </Text>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 700,
              color: "#11C15B",
              marginTop: 10,
            }}
          >
            0
          </Text>
        </View>
        <View
          style={{
            width: "30%",
            height: 64,
            alignItems: "center",
            alignContent: "center",
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 400,
            }}
          >
            Disukai
          </Text>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 700,
              color: "#11C15B",
              marginTop: 10,
            }}
          >
            0
          </Text>
        </View>
        <View
          style={{
            width: "30%",
            height: 64,
            alignItems: "center",
            alignContent: "center",
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 400,
            }}
          >
            Dilihat
          </Text>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 700,
              color: "#11C15B",
              marginTop: 10,
            }}
          >
            0
          </Text>
        </View>
      </View>
    </View>
  );

  const SecondRoute = () => (
    <View style={{ marginTop: 10 }}>
      <Text
        style={{
          backgroundColor: "#F0F0F0",
          fontSize: fontSizeResponsive("H4", device),
          fontWeight: 600,
          textAlign: "center",
          borderRadius: 4,
          padding: 5,
        }}
      >
        JUMLAH
      </Text>
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "30%",
            height: 64,
            alignItems: "center",
            alignContent: "center",
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 400,
            }}
          >
            Nilai
          </Text>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 700,
              color: "#11C15B",
              marginTop: 10,
            }}
          >
            0
          </Text>
        </View>
        <View
          style={{
            width: "30%",
            height: 64,
            alignItems: "center",
            alignContent: "center",
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 400,
            }}
          >
            Disukai
          </Text>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 700,
              color: "#11C15B",
              marginTop: 10,
            }}
          >
            0
          </Text>
        </View>
        <View
          style={{
            width: "30%",
            height: 64,
            alignItems: "center",
            alignContent: "center",
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 400,
            }}
          >
            Dilihat
          </Text>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 700,
              color: "#11C15B",
              marginTop: 10,
            }}
          >
            0
          </Text>
        </View>
      </View>
    </View>
  );

  const ThirdRoute = () => (
    <View style={{ marginTop: 10 }}>
      <Text
        style={{
          backgroundColor: "#F0F0F0",
          fontSize: fontSizeResponsive("H4", device),
          fontWeight: 600,
          textAlign: "center",
          borderRadius: 4,
          padding: 5,
        }}
      >
        JUMLAH
      </Text>
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "30%",
            height: 64,
            alignItems: "center",
            alignContent: "center",
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 400,
            }}
          >
            Nilai
          </Text>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 700,
              color: "#11C15B",
              marginTop: 10,
            }}
          >
            0
          </Text>
        </View>
        <View
          style={{
            width: "30%",
            height: 64,
            alignItems: "center",
            alignContent: "center",
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 400,
            }}
          >
            Disukai
          </Text>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 700,
              color: "#11C15B",
              marginTop: 10,
            }}
          >
            0
          </Text>
        </View>
        <View
          style={{
            width: "30%",
            height: 64,
            alignItems: "center",
            alignContent: "center",
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 400,
            }}
          >
            Dilihat
          </Text>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 700,
              color: "#11C15B",
              marginTop: 10,
            }}
          >
            0
          </Text>
        </View>
      </View>
    </View>
  );

  const FourthRoute = () => (
    <View style={{ marginTop: 10 }}>
      <Text
        style={{
          backgroundColor: "#F0F0F0",
          fontSize: fontSizeResponsive("H4", device),
          fontWeight: 600,
          textAlign: "center",
          borderRadius: 4,
          padding: 5,
        }}
      >
        JUMLAH
      </Text>
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "30%",
            height: 64,
            alignItems: "center",
            alignContent: "center",
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 400,
            }}
          >
            Nilai
          </Text>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 700,
              color: "#11C15B",
              marginTop: 10,
            }}
          >
            0
          </Text>
        </View>
        <View
          style={{
            width: "30%",
            height: 64,
            alignItems: "center",
            alignContent: "center",
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 400,
            }}
          >
            Disukai
          </Text>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 700,
              color: "#11C15B",
              marginTop: 10,
            }}
          >
            0
          </Text>
        </View>
        <View
          style={{
            width: "30%",
            height: 64,
            alignItems: "center",
            alignContent: "center",
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 400,
            }}
          >
            Dilihat
          </Text>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 700,
              color: "#11C15B",
              marginTop: 10,
            }}
          >
            0
          </Text>
        </View>
      </View>
    </View>
  );

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: COLORS.danger }}
      style={{
        backgroundColor: "#FFFFFF",
        shadowOffset: { width: -2, height: 2 },
        shadowColor: COLORS.primary,
        shadowOpacity: 0.2,
        elevation: 2,
      }}
      labelStyle={{ color: COLORS.primary, fontWeight: 700, fontSize: fontSizeResponsive("H4", device)}}
    />
  );

  const FirstRouteLoad = () => (
    <View style={{ marginTop: 10 }}>
      <Text
        style={{
          backgroundColor: "#F0F0F0",
          fontSize: fontSizeResponsive("H4", device),
          fontWeight: 600,
          textAlign: "center",
          borderRadius: 4,
        }}
      >
        JUMLAH
      </Text>
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "30%",
            height: 64,
            alignItems: "center",
            alignContent: "center",
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 400,
            }}
          >
            Nilai
          </Text>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 700,
              color: "#11C15B",
              marginTop: 10,
            }}
          >
            ...
          </Text>
        </View>
        <View
          style={{
            width: "30%",
            height: 64,
            alignItems: "center",
            alignContent: "center",
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 400,
            }}
          >
            Disukai
          </Text>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 700,
              color: "#11C15B",
              marginTop: 10,
            }}
          >
            ...
          </Text>
        </View>
        <View
          style={{
            width: "30%",
            height: 64,
            alignItems: "center",
            alignContent: "center",
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 400,
            }}
          >
            Dilihat
          </Text>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 700,
              color: "#11C15B",
              marginTop: 10,
            }}
          >
            ...
          </Text>
        </View>
      </View>
    </View>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    fourth: FourthRoute,
  });

  // export const JumlahPostingan = () => {
  //   const navigation = useNavigation();

  //   const layout = useWindowDimensions();

  //   const [index, setIndex] = React.useState(0);
  //   const [routes] = React.useState([
  //     { key: "first", title: "1" },
  //     { key: "second", title: "2" },
  //     { key: "third", title: "3" },
  //     { key: "fourth", title: "4" },
  //   ]);

  return (
    <>
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
            width: 28,
            height: 28,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
          }}
        >
          <TouchableOpacity style={{}} onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-outline"
              size={24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, alignItems: "center", marginRight: 50 }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 600,
              color: COLORS.white,
            }}
          >
            Jumlah Postingan
          </Text>
        </View>
      </View>

      <View style={{ width: "100%", alignSelf: "center", marginTop: 10, paddingHorizontal: 20 }}>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 8,
            height: device === "tablet" ? 290 : 230,
            padding: 16,
            //shadow ios
            shadowOffset: { width: -2, height: 4 },
            shadowColor: "#171717",
            shadowOpacity: 0.2,
            //shadow android
            elevation: 2,
          }}
        >
          <View
            style={{
              // backgroundColor: COLORS.primary,
              // borderRadius: 8,
              // borderTopLeftRadius: 8,
              // borderTopRightRadius: 8,
              borderBottomWidth: 1,
              borderBottomColor: COLORS.primary,
              padding: 10,
            }}
          >
            <Text
              style={{
                color: COLORS.primary,
                textAlign: "center",
                fontSize: fontSizeResponsive("H4", device),
                fontWeight: 600,
              }}
            >
              Triwulan
            </Text>
          </View>
          {Object.keys(postinganSayaJumlah.dilihat).length !== 0 &&
            Object.keys(postinganSayaJumlah.disukai).length !== 0 &&
            Object.keys(postinganSayaJumlah.draft).length !== 0 &&
            Object.keys(postinganSayaJumlah.nilai).length !== 0 ? (
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{ width: layout.width }}
              renderTabBar={renderTabBar}
            />
          ) : (
            <View
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: fontSizeResponsive("H4", device) }}>
                Loading...
              </Text>
              <Loading />
            </View>
          )}
        </View>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 8,
            height: device === "tablet" ? 280 : 210,
            padding: 16,
            marginTop: 10,
            //shadow ios
            shadowOffset: { width: -2, height: 4 },
            shadowColor: "#171717",
            shadowOpacity: 0.2,
            //shadow android
            elevation: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="newspaper-outline" size={24} />
            <Text
              style={{
                fontSize: fontSizeResponsive("H4", device),
                fontWeight: 600,
                justifyContent: "center",
                color: "#111827",
                marginLeft: 5,
              }}
            >
              POST
            </Text>
          </View>
          <Text
            style={{
              fontWeight: 400,
              textAlign: "center",
              marginTop: 5,
              fontSize: fontSizeResponsive("H4", device),
            }}
          >
            Triwulan saat ini
          </Text>
          <Text
            style={{
              backgroundColor: "#F0F0F0",
              fontSize: fontSizeResponsive("H4", device),
              fontWeight: 600,
              textAlign: "center",
              borderRadius: 4,
              marginTop: 10,
              padding: 5,
            }}
          >
            JUMLAH
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                width: "45%",
                height: 64,
                alignItems: "center",
                padding: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                  fontWeight: 400,
                }}
              >
                Draft
              </Text>
              <View
                style={{
                  marginTop: 10,
                  backgroundColor: "#F0F0F0",
                  borderRadius: 8,
                  width: 155,
                  height: 60,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H4", device),
                    fontWeight: 700,
                    color: "#6B7280",
                  }}
                >
                  {postinganSayaJumlah
                    ? postinganSayaJumlah?.draft.article_draft_count
                    : 0}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "45%",
                height: 64,
                alignItems: "center",
                padding: 10,
              }}
            >
              <Text
                style={{
                  fontSize: fontSizeResponsive("H4", device),
                  fontWeight: 400,
                }}
              >
                Diterbitkan
              </Text>
              <View
                style={{
                  marginTop: 10,
                  backgroundColor: "#D9F5E5",
                  borderRadius: 8,
                  width: 155,
                  height: 60,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: fontSizeResponsive("H4", device),
                    fontWeight: 700,
                    color: "#6B7280",
                  }}
                >
                  {postinganSayaJumlah
                    ? postinganSayaJumlah?.draft.article_publish_count
                    : 0}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};
