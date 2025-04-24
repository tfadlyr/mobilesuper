import React, { useMemo, useRef } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Text, Image } from "react-native";
import {
  COLORS,
  FONTSIZE,
  FONTWEIGHT,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import {
  useIsFocused,
  useNavigation,
  useNavigationState,
} from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "expo-checkbox";
import { useState } from "react";
import { useEffect } from "react";
import ListEmpty from "../../components/ListEmpty";
import {
  getMonitorCountWeek,
  getMonitorCountMonth,
  getMonitorCountYear,
} from "../../service/api";
import Icon from "react-native-vector-icons/MaterialIcons";
import { getTokenValue } from "../../service/session";
import {
  setDigitalSignLists,
  setStatus,
  setStatusHapus,
  setMonitorCount,
} from "../../store/DigitalSign";
import { Loading } from "../../components/Loading";
import { RefreshControl } from "react-native";
import { Config } from "../../constants/config";
import { ModalSubmit } from "../../components/ModalSubmit";
import { BarChart } from "react-native-gifted-charts";

// const ListDokumenLain = ({ item, variant, token, device }) => {
//   const dispatch = useDispatch();
//   const navigation = useNavigation();
//   const [isSelected, setSelection] = useState(false);
//   const getDetail = (id) => {
//     const params = { token, id };
//     // const data = event.listsprogress.find(item => item.id === id)
//     dispatch(getDetailDigisign(params));
//   };
//   const BASE_URL = Config.base_url + "bridge";
//   return (
//     <View
//       key={item.id}
//       style={{
//         backgroundColor: "white",
//         borderRadius: 8,
//         width: "90%",
//         flex: 1,
//         marginHorizontal: "5%",
//         padding: 16,
//         //shadow ios
//         shadowOffset: { width: -2, height: 4 },
//         shadowColor: "#171717",
//         shadowOpacity: 0.1,
//         // //shadow android
//         elevation: 2,
//         marginVertical: 8,
//       }}
//     >
//       <TouchableOpacity
//         style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
//         onPress={() => {
//           getDetail(item.id);
//           navigation.navigate("DetailDokumenLain", {
//             variant: variant,
//             token: token,
//           });
//         }}
//       >
//         {/* {variant === "inprogress" ? (
//           <Checkbox
//             value={isSelected}
//             onValueChange={setSelection}
//             color={isSelected === true ? COLORS.lighter : null}
//           />
//         ) : null} */}
//         <View style={{ flexDirection: "column", width: "100%" }}>
//           <Text
//             style={{
//               fontSize: fontSizeResponsive("H3", device),
//               textAlign: "justify",
//               fontWeight: FONTWEIGHT.bold,
//               width: "100%",
//             }}
//           >
//             {item?.subject}
//           </Text>
//           <View
//             style={{
//               backgroundColor: COLORS.lighter,
//               height: 1,
//               marginVertical: 8,
//               width: "100%",
//             }}
//           />
//           <View style={{ gap: 5, width: "100%" }}>
//             <View style={{ flexDirection: "row" }}>
//               <Text
//                 style={{
//                   fontSize: fontSizeResponsive("H3", device),
//                   width: 120,
//                   textAlign: "auto",
//                   paddingRight: 12,
//                   fontWeight: FONTWEIGHT.normal,
//                   width: "45%",
//                 }}
//               >
//                 Penerima
//               </Text>
//               {item?.composer?.display_title !== undefined ? (
//                 <Text
//                   style={{
//                     fontWeight: FONTWEIGHT.normal,
//                     width: "55%",
//                     textAlign: "auto",

//                     fontSize: fontSizeResponsive("H3", device),
//                   }}
//                 >
//                   :{" "}
//                   {item?.composer?.officer?.nama !== undefined
//                     ? item?.receivers[0]?.officer?.nama
//                     : "-"}
//                 </Text>
//               ) : (
//                 <Text
//                   style={{
//                     fontWeight: FONTWEIGHT.normal,
//                     width: "55%",
//                     textAlign: "auto",
//                     fontSize: fontSizeResponsive("H3", device),
//                   }}
//                 >
//                   :{" "}
//                   {item?.composer?.nama !== undefined
//                     ? item?.composer?.nama
//                     : "-"}
//                 </Text>
//               )}
//             </View>
//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <Text
//                 style={{
//                   fontSize: fontSizeResponsive("H3", device),
//                   width: 120,
//                   textAlign: "auto",
//                   paddingRight: 12,
//                   fontWeight: FONTWEIGHT.normal,
//                   width: "45%",
//                 }}
//               >
//                 Penandatangan
//               </Text>
//               <Text style={{ fontSize: fontSizeResponsive("H3", device) }}>
//                 :{" "}
//               </Text>
//               {item?.approvers.slice(1).map((data) => (
//                 <Image
//                   source={{ uri: data.avatar_url }}
//                   style={{
//                     width: device === "tablet" ? 40 : 20,
//                     height: device === "tablet" ? 40 : 20,
//                     borderRadius: 50,
//                   }}
//                 />
//               ))}
//             </View>
//             {variant === "signed" ? (
//               <View style={{ flexDirection: "row" }}>
//                 <Text
//                   style={{
//                     fontSize: fontSizeResponsive("H3", device),
//                     width: 110,
//                     textAlign: "auto",
//                     paddingRight: 12,
//                     fontWeight: FONTWEIGHT.normal,
//                     width: "45%",
//                   }}
//                 >
//                   Status
//                 </Text>
//                 <Text
//                   style={{
//                     fontSize: fontSizeResponsive("H3", device),
//                     width: 200,
//                     textAlign: "auto",
//                     fontWeight: FONTWEIGHT.normal,
//                     width: "55%",
//                   }}
//                 >
//                   :{item.state === "in_progress" ? "In Progress" : "Done"}
//                 </Text>
//               </View>
//             ) : null}

//             {variant === "composer" ? (
//               <TouchableOpacity
//                 style={{
//                   padding: 10,
//                   backgroundColor: COLORS.infoDanger,
//                   borderRadius: 8,
//                   justifyContent: "center",
//                   alignItems: "center",
//                   marginTop: 10,
//                 }}
//                 onPress={() => {
//                   Alert.alert(
//                     "Peringatan!",
//                     "Apakah anda yakin akan menghapus dokumen ini?",
//                     [
//                       {
//                         text: "Ya",
//                         onPress: () => {
//                           dispatch(
//                             deleteDokumenLain({ token: token, id: item.id })
//                           );
//                         },
//                         style: "cencel",
//                       },
//                       {
//                         text: "Batal",
//                         style: "cancel",
//                       },
//                     ],
//                     {
//                       cancelable: false,
//                       onDismiss: () => {},
//                     }
//                   );
//                 }}
//               >
//                 <Text
//                   style={{
//                     color: COLORS.white,
//                     fontSize: fontSizeResponsive("H4", device),
//                   }}
//                 >
//                   Hapus Dokumen
//                 </Text>
//               </TouchableOpacity>
//             ) : null}
//           </View>
//         </View>
//       </TouchableOpacity>
//     </View>
//   );
// };

export const DokumenMonitoring = ({ route }) => {
  const routeCounter = route?.params;
  const [token, setToken] = useState("");
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [tipe, setTipe] = useState("dokumen_lain");
  const [variant, SetVariant] = useState("composer");
  const [filterData, setFilterData] = useState([]);
  const [page, setPage] = useState(10);
  const isFocus = useIsFocused();

  //YYYY-MM-DD format
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // YYYY-MM format
  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  //YYYY format
  const getCurrentYear = () => {
    return new Date().getFullYear().toString();
  };


  const [timeFilter, setTimeFilter] = useState("week"); // default filter: week, month, year
  // Function to fetch data based on the selected time filter
  const fetchDataByTimeFilter = async () => {
    try {
      let response;
      switch (timeFilter) {
        case "week":
          response = await dispatch(getMonitorCountWeek({ token, date: getCurrentDate() }));
          break;
        case "month":
          response = await dispatch(getMonitorCountMonth({ token, month: getCurrentMonth() }));
          break;
        case "year":
          response = await dispatch(getMonitorCountYear({ token, year: getCurrentYear() }));
          break;
        default:
          response = await dispatch(getMonitorCountWeek({ token, date: getCurrentDate() }));
      }
      if (response && response.payload) {
        console.log(response.payload)
        dispatch(setMonitorCount(response.payload)); // Dispatch action to update monitorCount
      }
    } catch (error) {
      console.error("Error fetching monitor data:", error);
    }
  };

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
      fetchDataByTimeFilter();
    });
  }, []);
  useEffect(() => {
    if (token) {
      // fetchDataByTimeFilter();
      dispatch(getMonitorCountWeek(token, getCurrentDate()))
    }
  }, [token, timeFilter]);


  const currentTab = useNavigationState(
    (state) => state.routes[state.index].name
  );

  // const fetchData = async () => {
  //   const resultFunction = await getMonitorCountWeek({ token, date: getCurrentDate() });
  //   // If resultFunction is a function, call it to get the actual data
  //   const actualResult = typeof resultFunction === 'function' ? resultFunction() : resultFunction;
  //   console.log("Result:", actualResult);
  //   console.log(token);
  //   console.log(getCurrentDate());
  // };
  
  // fetchData();


  // useEffect(() => {
  //   if (token !== "") {
  //     if (
  //       currentTab === "DokumenLain" &&
  //       routeCounter?.route?.params.screen === "DokumenLain"
  //     ) {
  //       SetVariant("inprogress");
  //       dispatch(
  //         getListInProgress({
  //           token: token,
  //           tipe: "dokumen_lain",
  //           page: page,
  //           search: search,
  //         })
  //       );
  //       dispatch(getCounterDigitalSign({ token: token, tipe: "dokumen_lain" }));
  //       navigation.setParams({ route: undefined });
  //     } else if (currentTab === "DokumenLain") {
  //       // dispatch(
  //       //   getListComposer({
  //       //     token: token,
  //       //     tipe: tipe,
  //       //     page: page,
  //       //     search: search,
  //       //   })
  //       // );
  //       dispatch(getCounterDigitalSign({ token: token, tipe: "dokumen_lain" }));
  //     }
  //     // else if (currentTab === "DokumenLain") {
  //     //   dispatch(
  //     //     getListComposer({
  //     //       token: token,
  //     //       tipe: tipe,
  //     //       page: page,
  //     //       search: search,
  //     //     })
  //     //   );
  //     //   dispatch(getCounterDigitalSign({ token: token, tipe: "dokumen_lain" }));
  //     // }
  //   }
  // }, [token, tipe, currentTab]);

  // const filterHandlerComposer = () => {
  //   SetVariant("composer");
  //   dispatch(
  //     getListComposer({ token: token, tipe: tipe, page: page, search: search })
  //   );
  // };
  // const filterHandlerInProgress = () => {
  //   SetVariant("inprogress");
  //   dispatch(
  //     getListInProgress({
  //       token: token,
  //       tipe: tipe,
  //       page: page,
  //       search: search,
  //     })
  //   );
  // };
  // const filterHandlerRejected = () => {
  //   SetVariant("rejected");
  //   dispatch(getListRejected({ token: token, page: page, search: search }));
  // };
  // const filterHandlerDraft = () => {
  //   SetVariant("draft");
  //   dispatch(
  //     getListDraft({ token: token, tipe: tipe, page: page, search: search })
  //   );
  // };
  // const filterHandlerSigned = () => {
  //   SetVariant("signed");
  //   dispatch(
  //     getListSignedDigiSign({
  //       token: token,
  //       tipe: tipe,
  //       page: page,
  //       search: search,
  //     })
  //   );
  // };

  const { dokumenlain, loading, counterDS, statusHapus, status, monitorCount } = useSelector(
    (state) => state.digitalsign
  );

  console.log(monitorCount)
  // useEffect(() => {
  //   setFilterData(dokumenlain.lists);
  // }, [dokumenlain]);

  // const [refreshing, setRefreshing] = useState(false);

  // const onRefresh = React.useCallback(() => {
  //   try {
  //     if (token !== "") {
  //       dispatch(getCounterDigitalSign({ token: token, tipe: "dokumen_lain" }));
  //       if (variant === "composer" && currentTab === "DokumenLain") {
  //         dispatch(
  //           getListComposer({
  //             token: token,
  //             tipe: tipe,
  //             page: page,
  //             search: search,
  //           })
  //         );
  //       }
  //       if (variant === "inprogress" && currentTab === "DokumenLain") {
  //         dispatch(
  //           getListInProgress({
  //             token: token,
  //             tipe: tipe,
  //             page: page,
  //             search: search,
  //           })
  //         );
  //       }
  //       if (variant === "rejected" && currentTab === "DokumenLain") {
  //         dispatch(
  //           getListRejected({
  //             token: token,
  //             tipe: tipe,
  //             page: page,
  //             search: search,
  //           })
  //         );
  //       }
  //       if (variant === "draft" && currentTab === "DokumenLain") {
  //         dispatch(
  //           getListDraft({
  //             token: token,
  //             tipe: tipe,
  //             page: page,
  //             search: search,
  //           })
  //         );
  //       }
  //       if (variant === "signed" && currentTab === "DokumenLain") {
  //         dispatch(
  //           getListSignedDigiSign({
  //             token: token,
  //             tipe: tipe,
  //             page: page,
  //             search: search,
  //           })
  //         );
  //       }
  //     }
  //   } catch (error) {}

  //   setRefreshing(true);
  //   setTimeout(() => {
  //     setRefreshing(false);
  //   }, 2000);
  // }, [token, tipe, currentTab, page, search, variant]);

  const { device } = useSelector((state) => state.apps);

  // const loadMore = () => {
  //   if (dokumenlain?.lists?.length !== 0) {
  //     if (dokumenlain.lists.length % 5 === 0) {
  //       setPage((prevPage) => prevPage + 10);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (token !== "" && routeCounter?.route?.params.screen !== "DokumenLain") {
  //     if (variant === "composer" && currentTab === "DokumenLain") {
  //       dispatch(
  //         getListComposer({
  //           token: token,
  //           tipe: tipe,
  //           page: page,
  //           search: search,
  //         })
  //       );
  //     } else if (variant === "ready" && currentTab === "DokumenLain") {
  //       dispatch(
  //         getListReady({ token: token, tipe: tipe, page: page, search: search })
  //       );
  //     } else if (variant === "completed" && currentTab === "DokumenLain") {
  //       dispatch(
  //         getListCompleted({
  //           token: token,
  //           tipe: tipe,
  //           page: page,
  //           search: search,
  //         })
  //       );
  //     } else if (variant === "inprogress" && currentTab === "DokumenLain") {
  //       dispatch(
  //         getListInProgress({
  //           token: token,
  //           tipe: tipe,
  //           page: page,
  //           search: search,
  //         })
  //       );
  //       dispatch(getCounterDigitalSign({ token: token, tipe: "dokumen_lain" }));
  //     } else if (variant === "rejected" && currentTab === "DokumenLain") {
  //       dispatch(
  //         getListRejected({
  //           token: token,
  //           tipe: tipe,
  //           page: page,
  //           search: search,
  //         })
  //       );
  //     } else if (variant === "signed" && currentTab === "DokumenLain") {
  //       dispatch(
  //         getListSignedDigiSign({
  //           token: token,
  //           tipe: tipe,
  //           page: page,
  //           search: search,
  //         })
  //       );
  //     }
  //   }
  // }, [page, token, tipe, search, currentTab, isFocus]);

  // console.log(variant);

  // useEffect(() => {
  //   if (statusHapus !== "" && currentTab === "DokumenLain") {
  //     if (statusHapus === "berhasil" && currentTab === "DokumenLain") {
  //       Alert.alert(
  //         "Peringatan!",
  //         "Dokumen berhasil dihapus",
  //         [
  //           {
  //             text: "Ya",
  //             onPress: () => {
  //               dispatch(setStatusHapus(""));
  //               setTimeout(() => {
  //                 onRefresh();
  //               }, 3000);
  //             },
  //             style: "cencel",
  //           },
  //         ],
  //         {
  //           cancelable: false,
  //           onDismiss: () => {},
  //         }
  //       );
  //     } else {
  //       Alert.alert(
  //         "Peringatan!",
  //         "Dokumen gagal dihapus",
  //         [
  //           {
  //             text: "Ya",
  //             onPress: () => {
  //               dispatch(setStatusHapus(""));
  //             },
  //             style: "cencel",
  //           },
  //         ],
  //         {
  //           cancelable: false,
  //           onDismiss: () => {},
  //         }
  //       );
  //     }
  //   }
  // }, [statusHapus]);

  // Percent Calculation
  const finished = 30;  // green portion
  const unfinished = 10;  // red portion

  // Calculate total and percentages
  const total = finished + unfinished;
  const finishedPercent = total > 0 ? (finished / total) * 100 : 0;
  const unfinishedPercent = total > 0 ? (unfinished / total) * 100 : 0;



  //Barchart Data Test
  const barData = [
    {
      value: 25, 
      label: 'Dokumen Lain', 
      frontColor: '#177AD5',
      topLabelComponent: () => (
        <Text style={{color: 'black', fontSize: 12, marginBottom: 6}}>25</Text>
      ),
    },
    {
      value: 50, 
      label: 'Perizinan Lain', 
      frontColor: '#d51717',
      topLabelComponent: () => (
        <Text style={{color: 'black', fontSize: 12, marginBottom: 6}}>50</Text>
      ),
    },
    {
      value: 74, 
      label: 'PKRL', 
      frontColor: '#1730d5',
      topLabelComponent: () => (
        <Text style={{color: 'black', fontSize: 12, marginBottom: 6}}>74</Text>
      ),
    },
    {
      value: 32, 
      label: 'Dokumen SK', 
      frontColor: '#6017d5',
      topLabelComponent: () => (
        <Text style={{color: 'black', fontSize: 12, marginBottom: 6}}>32</Text>
      ),
    },
    {
      value: 60, 
      label: 'Dokumen PK', 
      frontColor: '#d55d17',
      topLabelComponent: () => (
        <Text style={{color: 'black', fontSize: 12, marginBottom: 6}}>60</Text>
      ),
    },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {loading ? <Loading /> : null}
      <View style={{ position: "relative", flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: COLORS.primary,
            height: 80,
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
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
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
                fontSize: fontSizeResponsive("H1", device),
                fontWeight: FONTWEIGHT.bold,
                color: COLORS.white,
              }}
            >
              Dokumen Monitoring
            </Text>
          </View>
        </View>


        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 20 }}
        >

          {/* Time filter buttons */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                timeFilter === "week" && styles.activeFilterButton
              ]}
              onPress={() => {
                setTimeFilter("week");
              }}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  timeFilter === "week" && styles.activeFilterText
                ]}
              >
                7 Hari
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterButton,
                timeFilter === "month" && styles.activeFilterButton
              ]}
              onPress={() => setTimeFilter("month")}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  timeFilter === "month" && styles.activeFilterText
                ]}
              >
                Bulan Ini
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterButton,
                timeFilter === "year" && styles.activeFilterButton
              ]}
              onPress={() => setTimeFilter("year")}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  timeFilter === "year" && styles.activeFilterText
                ]}
              >
                Tahun Ini
              </Text>
            </TouchableOpacity>
          </View>
          
          <Text>
            {monitorCount?.total_done}
            {timeFilter}
          </Text>

          {/* Sign Status card*/}
          <View
            style={{
              padding: 10,
              borderRadius: 8,
              backgroundColor: COLORS.white,
              marginTop: 16,
              width: "90%",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    variant === "inprogress"
                      ? COLORS.secondaryLighter
                      : COLORS.bgLightGrey,
                  borderRadius: 8,
                  width: "31%",
                  //shadow ios
                  shadowOffset: { width: -2, height: 4 },
                  shadowColor: "#171717",
                  shadowOpacity: 0.2,
                  //shadow android
                  elevation: 2,
                  justifyContent: "center",
                  padding: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <View
                    style={{
                      padding: 5,
                      backgroundColor: COLORS.infoDangerLight,
                      borderRadius: 50,
                    }}
                  >
                    <MaterialCommunityIcons
                      name={"file-alert-outline"}
                      size={device === "tablet" ? 40 : 30}
                      color={COLORS.infoDanger}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontWeight: FONTWEIGHT.bold,
                        // fontSize: fontSizeResponsive("H1", device),
                        fontSize: 40,
                      }}
                    >
                      {/* {counterDS?.data?.dokumen_lain_count?.need_sign} */}
                      {monitorCount.total_in_progress}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: fontSizeResponsive("H3", device),
                    color: COLORS.grey,
                    fontWeight: FONTWEIGHT.bold,
                    letterSpacing: -1, // Sesuaikan nilai
                  }}
                >
                  Belum Diproses
                </Text>
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: fontSizeResponsive("H5", device),
                    color: COLORS.grey,
                    fontWeight: FONTWEIGHT.bold,
                    letterSpacing: -1, // Sesuaikan nilai
                  }}
                >
                  -4% dari minggu lalu
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor:
                    variant === "signed"
                      ? COLORS.secondaryLighter
                      : COLORS.bgLightGrey,
                  borderRadius: 8,
                  width: "31%",
                  //shadow ios
                  shadowOffset: { width: -2, height: 4 },
                  shadowColor: "#171717",
                  shadowOpacity: 0.2,
                  //shadow android
                  elevation: 2,
                  justifyContent: "center",
                  padding: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <View
                    style={{
                      padding: 5,
                      backgroundColor: COLORS.successLight,
                      borderRadius: 50,
                    }}
                  >
                    <MaterialCommunityIcons
                      name={"file-check-outline"}
                      size={device === "tablet" ? 40 : 30}
                      color={COLORS.success}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontWeight: FONTWEIGHT.bold,
                        // fontSize: fontSizeResponsive("H1", device),
                        fontSize: 40,
                      }}
                    >
                      {/* {counterDS?.data?.dokumen_lain_count?.done} */}
                      {monitorCount.total_in_progress}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: fontSizeResponsive("H3", device),
                    color: COLORS.grey,
                    fontWeight: FONTWEIGHT.bold,
                    letterSpacing: -1, // Sesuaikan nilai
                  }}
                >
                  Sedang Diproses
                </Text>
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: fontSizeResponsive("H5", device),
                    color: COLORS.grey,
                    fontWeight: FONTWEIGHT.bold,
                    letterSpacing: -1, // Sesuaikan nilai
                  }}
                >
                  -4% dari minggu lalu
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor:
                    variant === "signed"
                      ? COLORS.secondaryLighter
                      : COLORS.bgLightGrey,
                  borderRadius: 8,
                  width: "31%",
                  //shadow ios
                  shadowOffset: { width: -2, height: 4 },
                  shadowColor: "#171717",
                  shadowOpacity: 0.2,
                  //shadow android
                  elevation: 2,
                  justifyContent: "center",
                  padding: 5,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                    marginTop: 10,
                  }}
                >
                  <View
                    style={{
                      padding: 5,
                      backgroundColor: COLORS.successLight,
                      borderRadius: 50,
                    }}
                  >
                    <MaterialCommunityIcons
                      name={"file-check-outline"}
                      size={device === "tablet" ? 40 : 30}
                      color={COLORS.success}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontWeight: FONTWEIGHT.bold,
                        // fontSize: fontSizeResponsive("H1", device),
                        fontSize: 40,
                      }}
                    >
                      {/* {counterDS?.data?.dokumen_lain_count?.done} */}
                      {monitorCount.total_done}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: fontSizeResponsive("H3", device),
                    color: COLORS.grey,
                    fontWeight: FONTWEIGHT.bold,
                    letterSpacing: -1, // Sesuaikan nilai
                  }}
                >
                  Sudah Diproses
                </Text>
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: fontSizeResponsive("H5", device),
                    color: COLORS.grey,
                    fontWeight: FONTWEIGHT.bold,
                    letterSpacing: -1, // Sesuaikan nilai
                  }}
                >
                  -4% dari minggu lalu
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* List Persentase Card */}
          <View
            style={{
              padding: 10,
              borderRadius: 8,
              backgroundColor: COLORS.white,
              marginTop: 16,
              width: "90%",
              justifyContent: "center",
              alignSelf: "center",
              gap: 10
            }}
          >
            <Text
              style={{
                marginTop: 5,
                fontSize: fontSizeResponsive("H1", device),
                color: COLORS.black,
                fontWeight: FONTWEIGHT.bold,
                letterSpacing: -1, // Sesuaikan nilai
              }}
            >
              Perbandingan Paraf Dokumen
            </Text>
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
                marginBottom: 10
              }}
            />

            {/* list persentase */}
            <View style={{ flexDirection: "row", gap: 30 }}>

              {/* list text */}
              <View  style={{gap: 17}}>
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: fontSizeResponsive("H5", device),
                    color: COLORS.grey,
                    fontWeight: FONTWEIGHT.bold,
                    letterSpacing: -1, // Sesuaikan nilai
                  }}
                >
                  Dokumen Lain
                </Text>

                <Text
                style={{
                  marginTop: 5,
                  fontSize: fontSizeResponsive("H5", device),
                  color: COLORS.grey,
                  fontWeight: FONTWEIGHT.bold,
                  letterSpacing: -1, // Sesuaikan nilai
                }}
                >
                  Perizinan Lain
                </Text>

                <Text
                  style={{
                    marginTop: 5,
                    fontSize: fontSizeResponsive("H5", device),
                    color: COLORS.grey,
                    fontWeight: FONTWEIGHT.bold,
                    letterSpacing: -1, // Sesuaikan nilai
                  }}
                >
                  PKRL
                </Text>

                <Text
                style={{
                  marginTop: 5,
                  fontSize: fontSizeResponsive("H5", device),
                  color: COLORS.grey,
                  fontWeight: FONTWEIGHT.bold,
                  letterSpacing: -1, // Sesuaikan nilai
                }}
                >
                  Dokumen SK
                </Text>

                <Text
                  style={{
                    marginTop: 5,
                    fontSize: fontSizeResponsive("H5", device),
                    color: COLORS.grey,
                    fontWeight: FONTWEIGHT.bold,
                    letterSpacing: -1, // Sesuaikan nilai
                  }}
                >
                  Dokumen PK
                </Text>    
              </View>

              {/* list persentase */}
              <View style={{gap: 12}}>
                <View style={{flexDirection: "row"}}>
                  <View style={{backgroundColor: COLORS.grey, height: 25, width: "85%"}}>
                    <Text                  
                      style={{
                        marginTop: 5,
                        fontSize: fontSizeResponsive("H5", device),
                        color: COLORS.white,
                        fontWeight: FONTWEIGHT.bold,
                        letterSpacing: -1, // Sesuaikan nilai
                        textAlign: "center"
                      }}
                    >
                      Tidak Ada Data
                    </Text>
                  </View>
                </View>

                <View style={{flexDirection: "row"}}>
                  <View style={{backgroundColor: COLORS.grey, height: 25, width: "85%"}}>
                    <Text                  
                      style={{
                        marginTop: 5,
                        fontSize: fontSizeResponsive("H5", device),
                        color: COLORS.white,
                        fontWeight: FONTWEIGHT.bold,
                        letterSpacing: -1, // Sesuaikan nilai
                        textAlign: "center"
                      }}
                    >
                      Tidak Ada Data
                    </Text>
                  </View>
                </View>   

                <View style={{flexDirection: "row"}}>
                  <View style={{backgroundColor: COLORS.grey, height: 25, width: "85%"}}>
                    <Text                  
                      style={{
                        marginTop: 5,
                        fontSize: fontSizeResponsive("H5", device),
                        color: COLORS.white,
                        fontWeight: FONTWEIGHT.bold,
                        letterSpacing: -1, // Sesuaikan nilai
                        textAlign: "center"
                      }}
                    >
                      Tidak Ada Data
                    </Text>
                  </View>
                </View> 

                <View style={{flexDirection: "row"}}>
                  <View style={{backgroundColor: COLORS.grey, height: 25, width: "85%"}}>
                    <Text                  
                      style={{
                        marginTop: 5,
                        fontSize: fontSizeResponsive("H5", device),
                        color: COLORS.white,
                        fontWeight: FONTWEIGHT.bold,
                        letterSpacing: -1, // Sesuaikan nilai
                        textAlign: "center"
                      }}
                    >
                      Tidak Ada Data
                    </Text>
                  </View>
                </View> 

                <View style={{flexDirection: "row"}}>
                  {total === 0 ? (                 
                    <View style={{backgroundColor: COLORS.grey, height: 25, width: "85%"}}>
                      <Text                  
                        style={{
                          marginTop: 5,
                          fontSize: fontSizeResponsive("H5", device),
                          color: COLORS.white,
                          fontWeight: FONTWEIGHT.bold,
                          letterSpacing: -1, // Sesuaikan nilai
                          textAlign: "center"
                        }}
                      >
                        Tidak Ada Data
                      </Text>
                    </View>
                    )  : unfinished === 0 && finished > 0 ? (
                      <View 
                        style={{
                          backgroundColor: 'green',
                          padding: 3,
                          height: 25,
                          width: '85%',
                          alignItems: 'center'
                        }}
                      >
                        <Text style={{ fontSize: 12, fontWeight: '600', color: 'white' }}>
                          100%
                        </Text>
                      </View>
                    ) : finished === 0 && unfinished > 0 ? (
                      <View 
                        style={{
                          backgroundColor: 'red',
                          padding: 3,
                          height: 25,
                          width: '85%',
                          alignItems: 'center'
                        }}
                      >
                        <Text style={{ fontSize: 12, fontWeight: '600', color: 'white' }}>
                          100%
                        </Text>
                      </View>
                    ) : (
                      <View 
                      style={{
                        flexDirection: 'row',
                        borderRadius: 4,
                        alignItems: 'center',
                        height: 25,
                        width: '85%'
                      }}
                    >
                      {finished > 0 && (
                        <View 
                          style={{
                            backgroundColor: 'green',
                            width: `${finishedPercent}%`,
                            padding: 3
                          }}
                        >
                          <Text                       
                            style={{
                            marginTop: 5,
                            fontSize: fontSizeResponsive("H5", device),
                            color: COLORS.white,
                            fontWeight: FONTWEIGHT.bold,
                            letterSpacing: -1, // Sesuaikan nilai
                            textAlign: "center"
                            }}
                          >
                            {finishedPercent.toFixed(0)}%
                          </Text>
                        </View>
                      )}
                      {unfinished > 0 && (
                        <View 
                          style={{
                            backgroundColor: 'red',
                            width: `${unfinishedPercent}%`,
                            padding: 3,                           
                          }}
                        >
                          <Text                       
                            style={{
                              marginTop: 5,
                              fontSize: fontSizeResponsive("H5", device),
                              color: COLORS.white,
                              fontWeight: FONTWEIGHT.bold,
                              letterSpacing: -1, // Sesuaikan nilai
                              textAlign: "center"
                            }}
                          >
                            {unfinishedPercent.toFixed(0)}%
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View> 
              </View>
              
            </View>
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
                marginTop: 10
              }}
            />
            <View style={{flexDirection: "row", gap: 12, justifyContent: "space-evenly"}}>
                <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5}}>
                  <View style={{backgroundColor: "green", borderRadius: 20, height: 10, width: 10}}/>
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: fontSizeResponsive("H5", device),
                      color: COLORS.grey,
                      fontWeight: FONTWEIGHT.bold,
                      letterSpacing: -1, // Sesuaikan nilai
                      textAlign: "center"
                    }}
                  >
                    Dokumen sudah diproses
                  </Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5}}>
                  <View style={{backgroundColor: "red", borderRadius: 20, height: 10, width: 10}}/>
                  <Text
                    style={{
                      marginTop: 5,
                      fontSize: fontSizeResponsive("H5", device),
                      color: COLORS.grey,
                      fontWeight: FONTWEIGHT.bold,
                      letterSpacing: -1, // Sesuaikan nilai
                      textAlign: "center"
                    }}
                  >
                    Dokumen diproses dan belum diproses
                  </Text>
                </View>
            </View>

          </View>

          {/* Bar Chart Card */}
          <View
            style={{
              padding: 10,
              borderRadius: 8,
              backgroundColor: COLORS.white,
              marginTop: 16,
              width: "90%",
              justifyContent: "center",
              alignSelf: "center",
              gap: 10
            }}
          >
            <Text
              style={{
                marginTop: 5,
                fontSize: fontSizeResponsive("H1", device),
                color: COLORS.black,
                fontWeight: FONTWEIGHT.bold,
                letterSpacing: -1, // Sesuaikan nilai
              }}
            >
              Dokumen Diparaf
            </Text>
            <View style={{flexDirection: "row"}}>
              <BarChart
                barWidth={22}
                noOfSections={3}
                barBorderRadius={4}
                frontColor="lightgray"
                data={barData}
                yAxisThickness={0}
                xAxisThickness={0}
                hideRules
                hideYAxisText
                initialSpacing={40}
                spacing={70}
                xAxisLabelTextStyle={{
                  fontSize: 9,

                  textAlign: 'center',
                }}
              />
            </View>
          </View>
        </ScrollView>

      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  input: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.ExtraDivinder,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lighter,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    backgroundColor: COLORS.bgLightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.grey,
  },
  activeFilterText: {
    color: COLORS.white,
    fontWeight: FONTWEIGHT.bold,
  },
});
