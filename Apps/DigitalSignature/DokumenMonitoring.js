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
    if (!token) return;
    
    try {
      const currentDate = getCurrentDate();
      const currentMonth = getCurrentMonth();
      const currentYear = getCurrentYear();
      
      if (timeFilter === "week") {
        const response = await dispatch(getMonitorCountWeek({ 
          token: token, 
          date: currentDate 
        }));
        console.log("Week API response:", response);
      } else if (timeFilter === "month") {
        const response = await dispatch(getMonitorCountMonth({ 
          token: token, 
          month: currentMonth 
        }));
        console.log("Month API response:", response);
      } else if (timeFilter === "year") {
        const response = await dispatch(getMonitorCountYear({ 
          token: token, 
          year: currentYear 
        }));
        console.log("Year API response:", response);
      }
    } catch (error) {
      console.error("Error fetching monitor data:", error);
      Alert.alert("Error", "Failed to fetch monitoring data");
    }
  };

  useEffect(() => {
    getTokenValue().then((val) => {
      setToken(val);
    });
  }, []);

  useEffect(() => {
    if (token) {
      // console.log("Time filter changed to:", timeFilter);
      fetchDataByTimeFilter();
    }
  }, [timeFilter, token]);

  const currentTab = useNavigationState(
    (state) => state.routes[state.index].name
  );

  const { dokumenlain, loading, counterDS, statusHapus, status, monitorCount } = useSelector(
    (state) => state.digitalsign
  );


  const { device } = useSelector((state) => state.apps);

  // Function to calculate percentages for each category
  const calculatePercentages = (done, inProgress) => {
    const total = done + inProgress;
    const donePercent = total > 0 ? (done / total) * 100 : 0;
    const inProgressPercent = total > 0 ? (inProgress / total) * 100 : 0;
    return { total, donePercent, inProgressPercent };
  };

  // Calculate percentages for each category
  const dokumenLainStats = calculatePercentages(
    monitorCount?.data?.dokumen_lain?.total_done || 0, 
    monitorCount?.data?.dokumen_lain?.total_in_progress || 0
  );
  const pkrlStats = calculatePercentages(
    monitorCount?.data?.pkrl?.total_done || 0, 
    monitorCount?.data?.pkrl?.total_in_progress || 0
  );
  const eseaStats = calculatePercentages(
    monitorCount?.data?.esea?.total_done || 0, 
    monitorCount?.data?.esea?.total_in_progress || 0
  );
  const dokumenSkStats = calculatePercentages(
    monitorCount?.data?.dokumen_sk?.total_done || 0, 
    monitorCount?.data?.dokumen_sk?.total_in_progress || 0
  );
  const dokumenPkStats = calculatePercentages(
    monitorCount?.data?.dokumen_pk?.total_done || 0, 
    monitorCount?.data?.dokumen_pk?.total_in_progress || 0
  );

  function renderProgressBar(total, finished, unfinished, finishedPercent, unfinishedPercent) {
    if (total === 0) {
      return (
        <View style={{ backgroundColor: COLORS.grey, height: 25, width: "85%" }}>
          <Text
            style={{
              marginTop: 5,
              fontSize: fontSizeResponsive("H5", device),
              color: COLORS.white,
              fontWeight: FONTWEIGHT.bold,
              letterSpacing: -1,
              textAlign: "center"
            }}
          >
            Tidak Ada Data
          </Text>
        </View>
      );
    } else if (unfinished === 0 && finished > 0) {
      return (
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
      );
    } else if (finished === 0 && unfinished > 0) {
      return (
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
      );
    } else {
      return (
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
                width: finishedPercent + '%',
                padding: 3
              }}
            >
              <Text
                style={{
                  marginTop: 5,
                  fontSize: fontSizeResponsive("H5", device),
                  color: COLORS.white,
                  fontWeight: FONTWEIGHT.bold,
                  letterSpacing: -1,
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
                width: unfinishedPercent + '%',
                padding: 3,
              }}
            >
              <Text
                style={{
                  marginTop: 5,
                  fontSize: fontSizeResponsive("H5", device),
                  color: COLORS.white,
                  fontWeight: FONTWEIGHT.bold,
                  letterSpacing: -1,
                  textAlign: "center"
                }}
              >
                {unfinishedPercent.toFixed(0)}%
              </Text>
            </View>
          )}
        </View>
      );
    }
  }

  // Barchart Data - Added null checks for safety
  const barData = [
    {
      value: monitorCount?.data?.dokumen_lain?.total_done || 0, 
      label: 'Dokumen Lain', 
      frontColor: '#177AD5',
      topLabelComponent: () => (
        <Text style={{color: 'black', fontSize: 12, marginBottom: 6}}>
          {monitorCount?.data?.dokumen_lain?.total_done || 0}
        </Text>
      ),
    },
    {
      value: monitorCount?.data?.esea?.total_done || 0, 
      label: 'Perizinan Lain', 
      frontColor: '#d51717',
      topLabelComponent: () => (
        <Text style={{color: 'black', fontSize: 12, marginBottom: 6}}>
          {monitorCount?.data?.esea?.total_done || 0}
        </Text>
      ),
    },
    {
      value: monitorCount?.data?.pkrl?.total_done || 0, 
      label: 'PKRL', 
      frontColor: '#1730d5',
      topLabelComponent: () => (
        <Text style={{color: 'black', fontSize: 12, marginBottom: 6}}>
          {monitorCount?.data?.pkrl?.total_done || 0}
        </Text>
      ),
    },
    {
      value: monitorCount?.data?.dokumen_sk?.total_done || 0, 
      label: 'Dokumen SK', 
      frontColor: '#6017d5',
      topLabelComponent: () => (
        <Text style={{color: 'black', fontSize: 12, marginBottom: 6}}>
          {monitorCount?.data?.dokumen_sk?.total_done || 0}
        </Text>
      ),
    },
    {
      value: monitorCount?.data?.dokumen_pk?.total_done || 0, 
      label: 'Dokumen PK', 
      frontColor: '#d55d17',
      topLabelComponent: () => (
        <Text style={{color: 'black', fontSize: 12, marginBottom: 6}}>
          {monitorCount?.data?.dokumen_pk?.total_done || 0}
        </Text>
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
              onPress={() => setTimeFilter("week")}
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
                  shadowOffset: { width: -2, height: 4 },
                  shadowColor: "#171717",
                  shadowOpacity: 0.2,
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
                        fontSize: (monitorCount?.data?.total_in_progress || 0) <= 100 ? 40 : 25,
                      }}
                    >
                      {monitorCount?.data?.total_in_progress || 0}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: fontSizeResponsive("H3", device),
                    color: COLORS.grey,
                    fontWeight: FONTWEIGHT.bold,
                    letterSpacing: -1,
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
                    letterSpacing: -1,
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
                  shadowOffset: { width: -2, height: 4 },
                  shadowColor: "#171717",
                  shadowOpacity: 0.2,
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
                      backgroundColor: COLORS.warningLight,
                      borderRadius: 50,
                    }}
                  >
                    <MaterialCommunityIcons
                      name={"file-refresh-outline"}
                      size={device === "tablet" ? 40 : 30}
                      color={COLORS.warning}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontWeight: FONTWEIGHT.bold,
                        fontSize: (monitorCount?.data?.total_in_progress || 0) <= 100 ? 40 : 25,
                      }}
                    >
                      {monitorCount?.data?.total_in_progress || 0}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: fontSizeResponsive("H3", device),
                    color: COLORS.grey,
                    fontWeight: FONTWEIGHT.bold,
                    letterSpacing: -1,
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
                    letterSpacing: -1,
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
                  shadowOffset: { width: -2, height: 4 },
                  shadowColor: "#171717",
                  shadowOpacity: 0.2,
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
                        fontSize: (monitorCount?.data?.total_done || 0) <= 100 ? 40 : 25,
                      }}
                    >
                      {monitorCount?.data?.total_done || 0}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: fontSizeResponsive("H3", device),
                    color: COLORS.grey,
                    fontWeight: FONTWEIGHT.bold,
                    letterSpacing: -1,
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
                    letterSpacing: -1,
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
                letterSpacing: -1,
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
              <View style={{gap: 17}}>
                <Text
                  style={{
                    marginTop: 5,
                    fontSize: fontSizeResponsive("H5", device),
                    color: COLORS.grey,
                    fontWeight: FONTWEIGHT.bold,
                    letterSpacing: -1,
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
                  letterSpacing: -1,
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
                    letterSpacing: -1,
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
                  letterSpacing: -1,
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
                    letterSpacing: -1,
                  }}
                >
                  Dokumen PK
                </Text>    
              </View>

              {/* list persentase */}
              {/* Dokumen Lain */}
              <View style={{gap: 12}}>
                <View style={{flexDirection: "row"}}>
                  {renderProgressBar(
                    dokumenLainStats.total, 
                    monitorCount?.data?.dokumen_lain?.total_done || 0, 
                    monitorCount?.data?.dokumen_lain?.total_in_progress || 0, 
                    dokumenLainStats.donePercent, 
                    dokumenLainStats.inProgressPercent
                  )}
                </View>
                
                {/* Perizinan Lain */}
                <View style={{flexDirection: "row"}}>
                  {renderProgressBar(
                    eseaStats.total, 
                    monitorCount?.data?.esea?.total_done || 0, 
                    monitorCount?.data?.esea?.total_in_progress || 0, 
                    eseaStats.donePercent, 
                    eseaStats.inProgressPercent
                  )}
                </View>   
                
                {/* PKRL */}
                <View style={{flexDirection: "row"}}>
                  {renderProgressBar(
                    pkrlStats.total, 
                    monitorCount?.data?.pkrl?.total_done || 0, 
                    monitorCount?.data?.pkrl?.total_in_progress || 0, 
                    pkrlStats.donePercent, 
                    pkrlStats.inProgressPercent
                  )}
                </View> 
                
                {/* Dokumen SK */}
                <View style={{flexDirection: "row"}}>
                  {renderProgressBar(
                    dokumenSkStats.total, 
                    monitorCount?.data?.dokumen_sk?.total_done || 0, 
                    monitorCount?.data?.dokumen_sk?.total_in_progress || 0, 
                    dokumenSkStats.donePercent, 
                    dokumenSkStats.inProgressPercent
                  )}
                </View> 

                {/* Dokumen PK */}
                <View style={{flexDirection: "row"}}>
                  {renderProgressBar(
                    dokumenPkStats.total, 
                    monitorCount?.data?.dokumen_pk?.total_done || 0, 
                    monitorCount?.data?.dokumen_pk?.total_in_progress || 0, 
                    dokumenPkStats.donePercent, 
                    dokumenPkStats.inProgressPercent
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
                      letterSpacing: -1,
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
                      letterSpacing: -1,
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
                letterSpacing: -1,
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
