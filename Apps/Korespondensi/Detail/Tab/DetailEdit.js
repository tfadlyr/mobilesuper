import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { GlobalStyles } from "../../../../constants/styles";
import {
  setAgenda,
  setIsi,
  setIsiAtas,
  setIsiBawah,
  setKepadaExternal,
  setLampiran,
  setSalam,
  setSubject,
  setTanggalMulai,
  setTanggalSelesai,
  setTempat,
  setWaktuMulai,
  setWaktuSelesai,
  setZonaWaktu,
} from "../../../../store/payload";
import ActionInprogress from "./ActionInprogress";
import React from "react";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import KeyboardAvoidingView from "react-native/Libraries/Components/Keyboard/KeyboardAvoidingView";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { Editor, Provider, Tools } from "react-native-tinymce";
import { useState } from "react";
import moment from "moment";
import { Dropdown } from "react-native-element-dropdown";
import RenderHTML from "react-native-render-html";

function DetailEdit({ route, data, tipe }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { width } = useWindowDimensions();
  let subject = useSelector((state) => state.payload.subject);
  let masalah = useSelector((state) => state.addressbook.km);
  let lampiran = useSelector((state) => state.payload.lampiran);
  let isi = useSelector((state) => state.payload.isi);
  let kepada = useSelector((state) => state.addressbook.receivers);
  let dari = useSelector((state) => state.addressbook.sender);
  let tembusan = useSelector((state) => state.addressbook.copytos);
  let pemeriksa = useSelector((state) => state.addressbook.approver);
  let isi_atas = useSelector((state) => state.payload.isi_atas);
  let isi_bawah = useSelector((state) => state.payload.isi_bawah);
  let tanggal_mulai = useSelector((state) => state.payload.tanggal_mulai);
  let tanggal_selesai = useSelector((state) => state.payload.tanggal_selesai);
  let waktu_mulai = useSelector((state) => state.payload.waktu_mulai);
  let waktu_selesai = useSelector((state) => state.payload.waktu_selesai);
  let zona_waktu = useSelector((state) => state.payload.zona_waktu);
  let tempat = useSelector((state) => state.payload.tempat);
  let agenda = useSelector((state) => state.payload.agenda);
  let kepada_external = useSelector((state) => state.payload.kepada_external);
  let salam = useSelector((state) => state.payload.salam);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [focusTimeStart, setFocusTimeStart] = useState(false);
  const [focusTimeEnd, setFocusTimeEnd] = useState(false);

  useEffect(() => {
    let start = moment(tanggal_mulai, "DD/MM/YYYY").toDate();
    setStartDate(start);
    let end = moment(tanggal_selesai, "DD/MM/YYYY").toDate();
    setEndDate(end);
    return willFocusSubscription;
  }, []);

  const willFocusSubscription = navigation.addListener("focus", () => {
    let start = moment(tanggal_mulai, "DD/MM/YYYY").toDate();
    setStartDate(start);
    let end = moment(tanggal_selesai, "DD/MM/YYYY").toDate();
    setEndDate(end);
    initKepadaExternal();
  });
  function initKepadaExternal() {
    if (data?.template?.name == "nota_external") {
      if (kepada?.length == 0) {
        if (data?.receivers) {
          dispatch(setKepadaExternal(data?.receivers));
          richTextKepada.current.setContentHTML(data?.receivers);
        }
      } else if (kepada?.length != 0) {
        let kepada_addressbook = [];
        kepada.forEach((element) => {
          if (element.fullname) {
            kepada_addressbook.push(element.fullname);
          } else if (element.title) {
            kepada_addressbook.push(element.title);
          } else if (element.name) {
            kepada_addressbook.push(element.name);
          }
        });
        richTextKepada.current.setContentHTML(
          `<ol style="padding-left:15pt;"><li>${kepada_addressbook.join(
            "</li><li>"
          )}</li></ol>`
        );
        dispatch(
          setKepadaExternal(
            `<ol style="padding-left:15pt;"><li>${kepada_addressbook.join(
              "</li><li>"
            )}</li></ol>`
          )
        );
      }
    }
  }
  const time = [
    { value: "00:00", viewValue: "00:00" },
    { value: "01:15", viewValue: "01:15" },
    { value: "01:30", viewValue: "01:30" },
    { value: "01:45", viewValue: "01:45" },
    { value: "02:00", viewValue: "02:00" },
    { value: "02:15", viewValue: "02:15" },
    { value: "02:30", viewValue: "02:30" },
    { value: "02:45", viewValue: "02:45" },
    { value: "03:00", viewValue: "03:00" },
    { value: "03:15", viewValue: "03:15" },
    { value: "03:30", viewValue: "03:30" },
    { value: "03:45", viewValue: "03:45" },
    { value: "04:00", viewValue: "04:00" },
    { value: "04:15", viewValue: "04:15" },
    { value: "04:30", viewValue: "04:30" },
    { value: "04:45", viewValue: "04:45" },
    { value: "05:00", viewValue: "05:00" },
    { value: "05:15", viewValue: "05:15" },
    { value: "05:30", viewValue: "05:30" },
    { value: "05:45", viewValue: "05:45" },
    { value: "06:00", viewValue: "06:00" },
    { value: "06:15", viewValue: "06:15" },
    { value: "06:30", viewValue: "06:30" },
    { value: "06:45", viewValue: "06:45" },
    { value: "07:00", viewValue: "07:00" },
    { value: "07:15", viewValue: "07:15" },
    { value: "07:30", viewValue: "07:30" },
    { value: "07:45", viewValue: "07:45" },
    { value: "08:00", viewValue: "08:00" },
    { value: "08:15", viewValue: "08:15" },
    { value: "08:30", viewValue: "08:30" },
    { value: "08:45", viewValue: "08:45" },
    { value: "09:00", viewValue: "09:00" },
    { value: "09:15", viewValue: "09:15" },
    { value: "09:30", viewValue: "09:30" },
    { value: "09:45", viewValue: "09:45" },
    { value: "10:00", viewValue: "10:00" },
    { value: "10:15", viewValue: "10:15" },
    { value: "10:30", viewValue: "10:30" },
    { value: "10:45", viewValue: "10:45" },
    { value: "11:00", viewValue: "11:00" },
    { value: "11:15", viewValue: "11:15" },
    { value: "11:30", viewValue: "11:30" },
    { value: "11:45", viewValue: "11:45" },
    { value: "12:00", viewValue: "12:00" },
    { value: "12:15", viewValue: "12:15" },
    { value: "12:30", viewValue: "12:30" },
    { value: "12:45", viewValue: "12:45" },
    { value: "13:00", viewValue: "13:00" },
    { value: "13:15", viewValue: "13:15" },
    { value: "13:30", viewValue: "13:30" },
    { value: "13:45", viewValue: "13:45" },
    { value: "14:00", viewValue: "14:00" },
    { value: "14:15", viewValue: "14:15" },
    { value: "14:30", viewValue: "14:30" },
    { value: "14:45", viewValue: "14:45" },
    { value: "15:00", viewValue: "15:00" },
    { value: "15:15", viewValue: "15:15" },
    { value: "15:30", viewValue: "15:30" },
    { value: "15:45", viewValue: "15:45" },
    { value: "16:00", viewValue: "16:00" },
    { value: "16:15", viewValue: "16:15" },
    { value: "16:30", viewValue: "16:30" },
    { value: "16:45", viewValue: "16:45" },
    { value: "17:00", viewValue: "17:00" },
    { value: "17:15", viewValue: "17:15" },
    { value: "17:30", viewValue: "17:30" },
    { value: "17:45", viewValue: "17:45" },
    { value: "18:00", viewValue: "18:00" },
    { value: "18:15", viewValue: "18:15" },
    { value: "18:30", viewValue: "18:30" },
    { value: "18:45", viewValue: "18:45" },
    { value: "19:00", viewValue: "19:00" },
    { value: "19:15", viewValue: "19:15" },
    { value: "19:30", viewValue: "19:30" },
    { value: "19:45", viewValue: "19:45" },
    { value: "20:00", viewValue: "20:00" },
    { value: "20:15", viewValue: "20:15" },
    { value: "20:30", viewValue: "20:30" },
    { value: "20:45", viewValue: "20:45" },
    { value: "21:00", viewValue: "21:00" },
    { value: "21:15", viewValue: "21:15" },
    { value: "21:30", viewValue: "21:30" },
    { value: "21:45", viewValue: "21:45" },
    { value: "22:00", viewValue: "22:00" },
    { value: "22:15", viewValue: "22:15" },
    { value: "22:30", viewValue: "22:30" },
    { value: "22:45", viewValue: "22:45" },
    { value: "23:00", viewValue: "23:00" },
    { value: "23:15", viewValue: "23:15" },
    { value: "23:30", viewValue: "23:30" },
    { value: "23:45", viewValue: "23:45" },
  ];

  let richText = useRef();
  let richTextAgenda = useRef();
  let richTextKepada = useRef();
  let additional_approver = useSelector(
    (state) => state.addressbook.additional_approver
  );
  function onChangeSubject(text) {
    dispatch(setSubject(text));
  }
  function onChangeLampiran(text) {
    dispatch(setLampiran(text));
  }
  function onChangeKepadaExternal(text) {
    dispatch(setKepadaExternal(text));
  }
  function onChangeSalam(text) {
    dispatch(setSalam(text));
  }
  const changeIsi = (descriptionText) => {
    if (descriptionText) {
      dispatch(setIsi(descriptionText));
    }
  };
  const changeIsiAtas = (descriptionText) => {
    if (descriptionText) {
      dispatch(setIsiAtas(descriptionText));
    }
  };
  const changeIsiBawah = (descriptionText) => {
    if (descriptionText) {
      dispatch(setIsiBawah(descriptionText));
    }
  };
  function onChangeZonaWaktu(text) {
    dispatch(setZonaWaktu(text));
  }
  function onChangeTempat(text) {
    dispatch(setTempat(text));
  }
  function onChangeAgenda(text) {
    dispatch(setAgenda(text));
  }
  const showStartDate = () => {
    setStartDateVisible(true);
  };
  const hideStartDate = () => {
    setStartDateVisible(false);
  };
  const showEndDate = () => {
    setEndDateVisible(true);
  };
  const hideEndDate = () => {
    setEndDateVisible(false);
  };
  const handleConfirmStart = (date) => {
    setStartDate(date);
    dispatch(setTanggalMulai(moment(date).format("DD/MM/YYYY")));
    // set end date equals or more than start date
    if (date > endDate) {
      setEndDate(date);
      dispatch(setTanggalSelesai(moment(date).format("DD/MM/YYYY")));
    }
    hideStartDate();
  };
  const handleConfirmEnd = (date) => {
    setEndDate(date);
    dispatch(setTanggalSelesai(moment(date).format("DD/MM/YYYY")));
    hideEndDate();
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={styles.screen}>
        <View style={styles.containerRow}>
          <View style={styles.containerColumn}>
            <Text style={styles.title}>Perihal</Text>
            <TextInput
              value={subject}
              onChangeText={(text) => onChangeSubject(text)}
              mode="outlined"
              theme={{
                colors: { primary: GlobalStyles.colors.textBlack },
                roundness: 12,
              }}
              style={styles.inputContainer}
              allowFontScaling={false}
            />
          </View>
        </View>
        <View style={[styles.containerRow]}>
          <View style={{ flex: 2 }}>
            <Text style={styles.title}>Tgl Diterima</Text>
            <Text>{data && data.letter_date}</Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text style={styles.title}>Kode Masalah</Text>
            <View style={styles.container}>
              <Text>{masalah[0]?.code}</Text>
              <IconButton
                icon="magnify"
                onPress={() => {
                  navigation.navigate("AddressbookKM", {
                    title: "Addressbook\nKlasifikasi Masalah",
                    tipe: "Addressbook",
                  });
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.containerRow}>
          <View style={styles.containerColumn}>
            <Text style={styles.title}>Nomor Surat</Text>
            <Text>{data && data.ref_number}</Text>
          </View>
        </View>
        <View style={styles.containerRow}>
          <View style={styles.containerColumn}>
            <Text style={styles.title}>Kepada</Text>
            {data && data.template.name != "nota_external" && (
              <>
                {/* permintaan_bg */}
                {data && data.kepada_bank?.length != 0 && (
                  <Text>{data && data.kepada_bank}</Text>
                )}
                {/* kepada addressbook */}
                {kepada?.length != 0 &&
                  kepada?.map((item, index) => (
                    <Text key={index}>
                      {item.title ? item.title : item.fullname}
                    </Text>
                  ))}
                {kepada?.length == 0 && <Text>-</Text>}
              </>
            )}
            {data && data.template.name == "nota_external" && (
              <>
                {/* <TextInput
                  value={kepada_external}
                  onChangeText={(text) => onChangeKepadaExternal(text)}
                  mode="outlined"
                  theme={{
                    colors: { primary: GlobalStyles.colors.textBlack },
                    roundness: 12,
                  }}
                  style={styles.inputContainer}
                  multiline
                /> */}
                <RichEditor
                  ref={richTextKepada}
                  onChange={onChangeKepadaExternal}
                  initialContentHTML={kepada_external}
                  androidHardwareAccelerationDisabled={true}
                  style={styles.richTextAgendaStyle}
                  containerStyle={styles.richTextAgendaStyle}
                />
              </>
            )}
            {/* {data &&
              data.receivers_display?.length == 0 &&
              data.kepada_bank?.length == 0 && (
                <>
                  {data && data.receivers?.length == 0 && <Text>-</Text>}
                  {data && data.receivers?.length == 1 && (
                    <Text>
                      {data.template.name != "nota_external"
                        ? `${GlobalStyles.prefix}${data.receivers[0]}`
                        : data.template.name == "nota_external"
                        ? `${data.receivers[0]}`
                        : ""}
                    </Text>
                  )}
                  {data &&
                    data.receivers?.length > 1 &&
                    data.template.name != "nota_external" &&
                    data.receivers.map((item, index) => (
                      <Text key={index}>
                        {index + 1}. {GlobalStyles.prefix}
                        {item}
                      </Text>
                    ))}

                  {data &&
                    data.receivers?.length > 1 &&
                    data.template.name == "nota_external" &&
                    data.receivers.map((item, index) => (
                      <Text key={index}>{item}</Text>
                    ))}
                </>
              )} */}
            {/* kepada advance option */}
            {data &&
              data.receivers_display?.length != 0 &&
              data.kepada_bank?.length == 0 && (
                <>
                  <Text style={styles.title}>Tampilan Kepada</Text>
                  {data.receivers_display?.length == 0 && <Text>-</Text>}
                  {data && data.receivers_display?.length == 1 && (
                    <RenderHTML
                      contentWidth={width}
                      source={{ html: data?.receivers_display[0] }}
                    />
                  )}
                  {data &&
                    data.receivers_display?.length > 1 &&
                    data.template.name != "nota_external" &&
                    data.receivers_display.map((item, index) => (
                      <Text key={index}>
                        {index + 1}. {item}
                      </Text>
                    ))}
                  {data &&
                    data.receivers_display?.length > 1 &&
                    data.template.name == "nota_external" &&
                    data.receivers_display.map((item, index) => (
                      <Text key={index}>{item}</Text>
                    ))}
                </>
              )}

            {data &&
              data.verifytitleprofile.status == "error" &&
              data.verifytitleprofile.data.receiver.length != 0 && (
                <Text style={styles.errorText}>
                  * {data.verifytitleprofile.data.receiver.join(",")} is not
                  active
                </Text>
              )}
            <Button
              mode="contained"
              style={styles.button}
              onPress={() => {
                navigation.navigate("Addressbook", {
                  title: "Addressbook\nKepada",
                  tipe: "receivers",
                  multiple: true,
                });
              }}
            >
              Edit Kepada
            </Button>
          </View>
        </View>
        <View style={styles.containerRow}>
          <View style={styles.containerColumn}>
            <Text style={styles.title}>Dari</Text>

            {dari.length != 0 && <Text>{dari[0]?.title}</Text>}
            {/* {data && data.komentar.length <= 1 && (
              <Text>
                {data && data.senders[0].title
                  ? data.senders[0].title
                  : data.senders[0].name}
              </Text>
            )}
            {data && data.komentar.length > 1 && (
              <Text>
                {data.komentar[0].poh == true && data.senders[0]?.title != ""
                  ? "POH " + data.senders[0].title
                  : data.senders[0].title != ""
                  ? data.senders[0].title
                  : data.komentar[0].creator}
              </Text>
            )} */}
            {data?.state == "rns" && (
              <Button
                mode="contained"
                style={styles.button}
                onPress={() => {
                  navigation.navigate("AddressbookTitle", {
                    title: "Addressbook\nDari",
                    tipe: "sender",
                    multiple: false,
                  });
                }}
              >
                Edit Dari
              </Button>
            )}
          </View>
        </View>
        <View style={styles.containerRow}>
          <View style={styles.containerColumn}>
            <Text style={styles.title}>Tembusan</Text>
            <View>
              {/* //tembusan addressbook */}
              {tembusan.length != 0 &&
                tembusan.map((item, index) => (
                  <Text key={index}>
                    {item.title ? item.title : item.fullname}
                  </Text>
                ))}
              {tembusan.length == 0 && <Text>-</Text>}
              {/* {data && data.copytos_display?.length == 0 && (
                <>
                  {data && data.copytos?.length == 0 && <Text>-</Text>}
                  {data && data.copytos?.length == 1 && (
                    <Text>
                      {GlobalStyles.prefix}
                      {data.copytos[0]}
                    </Text>
                  )}
                  {data &&
                    data.copytos?.length > 1 &&
                    data.copytos.map((item, index) => (
                      <Text key={index}>
                        {index + 1}. {GlobalStyles.prefix}
                        {item}
                      </Text>
                    ))}
                </>
              )} */}
              {/* tembusan advance option */}
              {data && data.copytos_display?.length != 0 && (
                <>
                  <Text style={styles.title}>Tampilan Tembusan</Text>
                  {data && data.copytos_display?.length == 0 && <Text>-</Text>}
                  {data && data.copytos_display?.length == 1 && (
                    <RenderHTML
                      contentWidth={width}
                      source={{ html: data?.copytos_display[0] }}
                    />
                  )}
                  {data &&
                    data.copytos_display?.length > 1 &&
                    data.template.name != "nota_external" &&
                    data.copytos_display.map((item, index) => (
                      <Text key={index}>
                        {index + 1}. {item}
                      </Text>
                    ))}
                  {data &&
                    data.copytos_display?.length > 1 &&
                    data.template.name == "nota_external" &&
                    data.copytos_display.map((item, index) => (
                      <Text key={index}>{item}</Text>
                    ))}
                </>
              )}

              {data &&
                data.verifytitleprofile.status == "error" &&
                data.verifytitleprofile.data.copyto.length != 0 && (
                  <Text style={styles.errorText}>
                    * {data.verifytitleprofile.data.copyto.join(",")} is not
                    active
                  </Text>
                )}
              <Button
                mode="contained"
                style={styles.button}
                onPress={() => {
                  navigation.navigate("Addressbook", {
                    title: "Addressbook\nTembusan",
                    tipe: "copytos",
                    multiple: true,
                  });
                }}
              >
                Edit Tembusan
              </Button>
            </View>
          </View>
        </View>
        <View style={styles.containerRow}>
          <View style={styles.containerColumn}>
            <Text style={styles.title}>Lampiran</Text>
            <TextInput
              value={lampiran}
              onChangeText={(text) => onChangeLampiran(text)}
              mode="outlined"
              theme={{
                colors: { primary: GlobalStyles.colors.textBlack },
                roundness: 12,
              }}
              style={styles.inputContainer}
              allowFontScaling={false}
            />
          </View>
        </View>

        {(tipe == "NeedFollowUpDetail" || tipe == "TrackingDetail") && (
          <View style={styles.containerRow}>
            <View style={styles.containerColumn}>
              <Text style={styles.title}>Pemeriksa</Text>
              <View>
                {pemeriksa.length != 0 &&
                  pemeriksa.map((item, index) => (
                    <Text key={index}>
                      {item.title ? item.title : item.fullname}
                    </Text>
                  ))}
                {pemeriksa.length == 0 && <Text>-</Text>}
                {/* {data && data.tracker.approvers?.length == 0 && <Text>-</Text>}
                {data && data.tracker.approvers?.length == 1 && (
                  <Text>
                    {data.tracker.approvers[0].title
                      ? data.tracker.approvers[0].title.name
                      : data.tracker.approvers[0].profile.fullname}
                  </Text>
                )}
                {data &&
                  data.tracker.approvers?.length > 1 &&
                  data.tracker.approvers.map((item, index) => (
                    <Fragment key={index}>
                      {index !== 0 && (
                        <>
                          {data.position == item.title?.name &&
                            data.state != "rns" && (
                              <Text key={index} style={styles.title}>
                                {index}.{item.title?.name}
                              </Text>
                            )}
                          {data.position == item.profile?.fullname &&
                            data.state != "rns" && (
                              <Text key={index} style={styles.title}>
                                {index}.{item.profile?.fullname}
                              </Text>
                            )}
                          {data.position == item.title?.name &&
                            data.state == "rns" && (
                              <Text key={index}>
                                {index}.{item.title?.name}
                              </Text>
                            )}
                          {data.position == item.profile?.fullname &&
                            data.state == "rns" && (
                              <Text key={index}>
                                {index}.{item.profile?.fullname}
                              </Text>
                            )}
                          {item.title?.name &&
                            data.position !== item.title?.name && (
                              <Text key={index}>
                                {index}.{item.title?.name}
                              </Text>
                            )}
                          {item.profile?.fullname &&
                            data.position !== item.profile?.fullname && (
                              <Text key={index}>
                                {index}.{item.profile?.fullname}
                              </Text>
                            )}
                        </>
                      )}
                    </Fragment>
                  ))} */}

                {data &&
                  data.verifytitleprofile.status == "error" &&
                  data.verifytitleprofile.data.approver.length != 0 && (
                    <Text style={styles.errorText}>
                      * {data.verifytitleprofile.data.approver.join(",")} is not
                      active
                    </Text>
                  )}
                {data?.state != "rns" && (
                  <>
                    <Button
                      mode="contained"
                      style={styles.button}
                      onPress={() => {
                        navigation.navigate("AddressbookTitle", {
                          title: "Addressbook\nSisipkan Pemeriksa",
                          tipe: "additional_approver",
                          multiple: false,
                        });
                      }}
                    >
                      Sisipkan Pemeriksa
                    </Button>
                    {additional_approver.length != 0 &&
                      additional_approver.map((item, index) => (
                        <Text key={index}>{item.title ? item.title : ""}</Text>
                      ))}
                  </>
                )}
                {data?.state == "rns" && (
                  <Button
                    mode="contained"
                    style={styles.button}
                    onPress={() => {
                      navigation.navigate("Addressbook", {
                        title: "Addressbook\nPemeriksa",
                        tipe: "approver",
                        multiple: true,
                      });
                    }}
                  >
                    Edit Pemeriksa
                  </Button>
                )}
              </View>
            </View>
          </View>
        )}
        <View style={styles.containerRow}>
          <View style={styles.containerColumn}>
            <Text style={styles.title}>Isi Surat</Text>
            {/* <Text>{data?.body}</Text> */}
            {/* tinymce */}
            {/* <Provider>
            <View style={styles.richTextContainer}>
                <Editor
                  ref={richText}
                  value={data?.body}
                  style={{ height: "50%",marginBottom:100}}
                />
                <Tools />
                </View>
            </Provider> */}
            {data?.template?.name != "undangan" && isi.length != 0 && (
              <>
                <View style={styles.richTextContainer}>
                  <ScrollView nestedScrollEnabled>
                    <KeyboardAvoidingView
                      behavior={Platform.OS === "ios" ? "padding" : ""}
                      style={{ flex: 1 }}
                    >
                      <RichEditor
                        ref={richText}
                        onChange={changeIsi}
                        initialContentHTML={`<style>ol{list-style-type: decimal;} ol ol{list-style-type: lower-alpha;} ol ol ol{list-style-type: lower-roman;}</style> ${isi}`}
                        placeholder="Edit your body letter..."
                        androidHardwareAccelerationDisabled={true}
                        scrollEnabled
                        style={styles.richTextEditorStyle}
                        containerStyle={styles.richTextEditorStyle}
                        initialHeight={250}
                      />
                    </KeyboardAvoidingView>
                  </ScrollView>
                  <RichToolbar
                    editor={richText}
                    selectedIconTint="#873c1e"
                    iconTint="#312921"
                    actions={[
                      actions.keyboard,
                      actions.undo,
                      actions.redo,
                      actions.setBold,
                      actions.setItalic,
                      actions.insertBulletsList,
                      actions.insertOrderedList,
                      actions.insertLink,
                      actions.setStrikethrough,
                      actions.setUnderline,
                    ]}
                    style={styles.richTextToolbarStyle}
                  />
                </View>
                {data?.template?.name == "nota_external" && (
                  <View style={styles.containerRow}>
                    <View style={styles.containerColumn}>
                      <Text style={styles.title}>Salam</Text>
                      <TextInput
                        value={salam}
                        onChangeText={(text) => onChangeSalam(text)}
                        mode="outlined"
                        theme={{
                          colors: { primary: GlobalStyles.colors.textBlack },
                          roundness: 12,
                        }}
                        style={styles.inputContainer}
                        allowFontScaling={false}
                      />
                    </View>
                  </View>
                )}
              </>
            )}
            {data?.template?.name == "undangan" && (
              <>
                <View style={styles.richTextContainer}>
                  <ScrollView>
                    <KeyboardAvoidingView
                      behavior={Platform.OS === "ios" ? "padding" : ""}
                      style={{ flex: 1 }}
                    >
                      <RichEditor
                        ref={richText}
                        onChange={changeIsiAtas}
                        initialContentHTML={`<style>ol{list-style-type: decimal;} ol ol{list-style-type: lower-alpha;} ol ol ol{list-style-type: lower-roman;}</style> ${isi_atas}`}
                        placeholder="Edit your top body letter..."
                        androidHardwareAccelerationDisabled={true}
                        style={styles.richTextEditorStyle}
                        containerStyle={styles.richTextEditorStyle}
                        initialHeight={250}
                      />
                    </KeyboardAvoidingView>
                  </ScrollView>
                  <RichToolbar
                    editor={richText}
                    selectedIconTint="#873c1e"
                    iconTint="#312921"
                    actions={[
                      actions.keyboard,
                      actions.undo,
                      actions.redo,
                      actions.setBold,
                      actions.setItalic,
                      actions.insertBulletsList,
                      actions.insertOrderedList,
                      actions.insertLink,
                      actions.setStrikethrough,
                      actions.setUnderline,
                    ]}
                    style={styles.richTextToolbarStyle}
                  />
                </View>

                <View style={styles.containerRow}>
                  <View>
                    <View style={{ marginBottom: 8 }}>
                      <Text style={styles.title}>Tgl Mulai</Text>
                    </View>
                    <Button
                      mode="outlined"
                      textColor="black"
                      onPress={showStartDate}
                    >
                      {tanggal_mulai ? tanggal_mulai : "Pilih Tgl Mulai"}
                    </Button>
                    <DateTimePickerModal
                      isVisible={startDateVisible}
                      mode="date"
                      display={Platform.OS == "android" ? "inline" : "spinner"}
                      style={{ width: "100%", height: 300 }}
                      onConfirm={handleConfirmStart}
                      onCancel={hideStartDate}
                      minimumDate={new Date()}
                      date={startDate}
                    />
                  </View>
                  <View style={{ marginBottom: 8 }}>
                    <View style={{ marginBottom: 8 }}>
                      <Text style={styles.title}>Tgl Selesai</Text>
                    </View>
                    <Button
                      mode="outlined"
                      textColor="black"
                      onPress={showEndDate}
                    >
                      {tanggal_selesai ? tanggal_selesai : "Pilih Tgl Selesai"}
                    </Button>
                    <DateTimePickerModal
                      isVisible={endDateVisible}
                      mode="date"
                      display={Platform.OS == "android" ? "inline" : "spinner"}
                      style={{ width: "100%", height: 300 }}
                      onConfirm={handleConfirmEnd}
                      onCancel={hideEndDate}
                      minimumDate={startDate ? startDate : new Date()}
                      date={endDate}
                    />
                  </View>
                </View>
                <View style={styles.containerRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={[styles.title, { marginBottom: 6 }]}>
                      Waktu Mulai
                    </Text>
                    <Dropdown
                      style={[
                        styles.dropdown,
                        focusTimeStart && { borderColor: "blue" },
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      // inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={time}
                      // search
                      maxHeight={300}
                      labelField="viewValue"
                      valueField="value"
                      placeholder={!focusTimeStart ? "Waktu Mulai" : "..."}
                      // searchPlaceholder="Search..."
                      value={waktu_mulai}
                      onFocus={() => setFocusTimeStart(true)}
                      onBlur={() => setFocusTimeStart(false)}
                      onChange={(item) => {
                        dispatch(setWaktuMulai(item.value));
                        setFocusTimeStart(false);
                      }}
                    />
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text style={[styles.title, { marginBottom: 6 }]}>
                      Waktu Selesai
                    </Text>
                    <Dropdown
                      style={[
                        styles.dropdown,
                        focusTimeStart && { borderColor: "blue" },
                      ]}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      // inputSearchStyle={styles.inputSearchStyle}
                      iconStyle={styles.iconStyle}
                      data={time}
                      // search
                      maxHeight={300}
                      labelField="viewValue"
                      valueField="value"
                      placeholder={!focusTimeEnd ? "Waktu Selesai" : "..."}
                      // searchPlaceholder="Search..."
                      value={waktu_selesai}
                      onFocus={() => setFocusTimeEnd(true)}
                      onBlur={() => setFocusTimeEnd(false)}
                      onChange={(item) => {
                        dispatch(setWaktuSelesai(item.value));
                        setFocusTimeEnd(false);
                      }}
                    />
                  </View>

                  <View style={{ flex: 2 }}>
                    <Text style={styles.title}>Zona Waktu</Text>
                    <TextInput
                      value={zona_waktu}
                      onChangeText={(text) => onChangeZonaWaktu(text)}
                      mode="outlined"
                      theme={{
                        colors: { primary: GlobalStyles.colors.textBlack },
                        roundness: 12,
                      }}
                      style={styles.inputContainer}
                      allowFontScaling={false}
                    />
                  </View>
                </View>

                <View style={styles.containerColumn}>
                  <Text style={styles.title}>Tempat</Text>
                  <TextInput
                    value={tempat}
                    multiline={true}
                    onChangeText={(text) => onChangeTempat(text)}
                    mode="outlined"
                    theme={{
                      colors: { primary: GlobalStyles.colors.textBlack },
                      roundness: 12,
                    }}
                    style={styles.inputContainer}
                    allowFontScaling={false}
                  />
                </View>

                <View style={{ marginBottom: 16 }}>
                  <Text style={styles.title}>Agenda</Text>
                  <TouchableOpacity
                    onPress={() => {
                      onChangeAgenda(
                        '<ol style="padding-left:15pt;"><li></li></ol>'
                      );
                      richTextAgenda.current.sendAction(
                        "content",
                        "setHtml",
                        '<ol style="padding-left:15pt;"><li></li></ol>'
                      );
                    }}
                  >
                    <Text style={styles.linkText}>Refresh numbering</Text>
                  </TouchableOpacity>
                  <RichEditor
                    ref={richTextAgenda}
                    onChange={onChangeAgenda}
                    initialContentHTML={agenda}
                    androidHardwareAccelerationDisabled={true}
                    style={styles.richTextAgendaStyle}
                    containerStyle={styles.richTextAgendaStyle}
                  />
                </View>
                <View style={styles.richTextContainer}>
                  <ScrollView>
                    <KeyboardAvoidingView
                      behavior={Platform.OS === "ios" ? "padding" : ""}
                      style={{ flex: 1 }}
                    >
                      <RichEditor
                        ref={richText}
                        onChange={changeIsiBawah}
                        initialContentHTML={`<style>ol{list-style-type: decimal;} ol ol{list-style-type: lower-alpha;} ol ol ol{list-style-type: lower-roman;}</style> ${isi_bawah}`}
                        placeholder="Edit your bottom body letter..."
                        androidHardwareAccelerationDisabled={true}
                        style={styles.richTextEditorStyle}
                        containerStyle={styles.richTextEditorStyle}
                        initialHeight={250}
                      />
                    </KeyboardAvoidingView>
                  </ScrollView>
                  <RichToolbar
                    editor={richText}
                    selectedIconTint="#873c1e"
                    iconTint="#312921"
                    actions={[
                      actions.keyboard,
                      actions.undo,
                      actions.redo,
                      actions.setBold,
                      actions.setItalic,
                      actions.insertBulletsList,
                      actions.insertOrderedList,
                      actions.insertLink,
                      actions.setStrikethrough,
                      actions.setUnderline,
                    ]}
                    style={styles.richTextToolbarStyle}
                  />
                </View>
              </>
            )}
          </View>
        </View>
        {tipe == "NeedFollowUpDetail" &&
          (data?.state == "inpro" || data?.state == "rns") && (
            <ActionInprogress id={data?.id} data={data} page="edit" />
          )}
      </View>
    </ScrollView>
  );
}

export default DetailEdit;

const styles = StyleSheet.create({
  screen: {
    padding: 16,
    backgroundColor: GlobalStyles.colors.white,
  },
  containerRow: {
    flexDirection: "row",
    marginBottom: 6,
    justifyContent: "space-between",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 16,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "white",
  },
  containerColumn: {
    flexDirection: "column",
    paddingBottom: 6,
    width: "100%",
  },
  title: { fontWeight: "bold", height: 24 },
  inputContainer: {
    justifyContent: "flex-start",
    borderRadius: 12,
  },
  button: {
    backgroundColor: GlobalStyles.colors.tertiery,
    marginVertical: 8,
  },
  richTextContainer: {
    display: "flex",
    minHeight: 300,
    maxHeight: 500,
    flexDirection: "column-reverse",
    width: "100%",
    marginBottom: 10,
  },

  richTextEditorStyle: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 0.5,
    borderColor: GlobalStyles.colors.grey,
    // borderColor: "#ccaf9b",
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.23,
    // shadowRadius: 2.62,
    // elevation: 4,
    fontSize: 20,
  },
  richTextAgendaStyle: {
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: GlobalStyles.colors.grey,
    fontSize: 20,
  },

  richTextToolbarStyle: {
    backgroundColor: GlobalStyles.colors.textWhite,
    borderColor: GlobalStyles.colors.grey,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
  },
  dropdown: {
    height: 50,
    width: "90%",
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 12,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  linkText: {
    color: GlobalStyles.colors.blue,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  errorText: {
    color: GlobalStyles.colors.error500,
  },
});
