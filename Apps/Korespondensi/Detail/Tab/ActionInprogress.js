import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { useMemo } from "react";
import { useRef } from "react";
import { useState } from "react";
import { Alert, Platform, SafeAreaView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useSelector } from "react-redux";
import LoadingOverlay from "../../../../components/UI/LoadingOverlay";
import { GlobalStyles } from "../../../../constants/styles";
import { nde_api } from "../../../../utils/api.config";
import { handlerError, postHTTP } from "../../../../utils/http";
import { TouchableOpacity } from "react-native";
import { COLORS } from "../../../../config/SuperAppps";
import { Ionicons } from "@expo/vector-icons";

function ActionInprogress({ id, data, page }) {
  const platform = Platform;
  const [isLoading, setisLoading] = useState();
  const [tipe, setTipe] = useState();
  const [comment, setComment] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [showPassphrase, setShowPassphrase] = useState(true);
  const navigation = useNavigation();
  let perihal = useSelector((state) => state.payload.subject);
  let masalah = useSelector((state) => state.addressbook.km);
  let lampiran = useSelector((state) => state.payload.lampiran);
  let isi = useSelector((state) => state.payload.isi);
  let receivers = useSelector((state) => state.addressbook.receivers);
  let sender = useSelector((state) => state.addressbook.sender);
  let copytos = useSelector((state) => state.addressbook.copytos);
  let approver = useSelector((state) => state.addressbook.approver);
  let { profile } = useSelector((state) => state.profile);
  let add_approver = useSelector(
    (state) => state.addressbook.additional_approver
  );
  let isi_atas = useSelector((state) => state.payload.isi_atas);
  let isi_bawah = useSelector((state) => state.payload.isi_bawah);
  let tanggal_mulai = useSelector((state) => state.payload.tanggal_mulai);
  let tanggal_selesai = useSelector((state) => state.payload.tanggal_selesai);
  let waktu_mulai = useSelector((state) => state.payload.waktu_mulai);
  let waktu_selesai = useSelector((state) => state.payload.waktu_selesai);
  let zona_waktu = useSelector((state) => state.payload.zona_waktu);
  let tempat = useSelector((state) => state.payload.tempat);
  let agenda = useSelector((state) => state.payload.agenda);
  let place = "";
  let receivers_external_display = useSelector(
    (state) => state.payload.kepada_external
  );
  let salam = useSelector((state) => state.payload.salam);
  // ref
  const bottomSheetModalRef = useRef(null);
  // variables
  const initialSnapPoints = useMemo(() => ["10%", "CONTENT_HEIGHT"], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);
  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );
  const { device } = useSelector((state) => state.apps);
  function showComment(action, page) {
    //validasi data payload
    let valid = 1;
    // if (data.verifytitleprofile.status == "error" && action == "Setujui") {
    //   valid = 0;
    //   if (data.verifytitleprofile.data.approver.length != 0) {
    //     if (data.state == "rns") {
    //       Alert.alert(
    //         "Peringatan!",
    //         data.verifytitleprofile.data.approver.join(",") +
    //           ' is not active. Please remove from "Pemeriksa" to continue.'
    //       );
    //     } else if (data.state == "inpro") {
    //       Alert.alert(
    //         "Peringatan!",
    //         data.verifytitleprofile.data.approver.join(",") +
    //           ' is not active. Please "return to composer" to be fixed.'
    //       );
    //     }
    //   } else if (data.verifytitleprofile.data.copyto.length != 0) {
    //     Alert.alert(
    //       "Peringatan!",
    //       data.verifytitleprofile.data.copyto.join(",") +
    //         ' is not active. Please remove from "Tembusan" to continue.'
    //     );
    //   } else if (data.verifytitleprofile.data.receiver.length != 0) {
    //     Alert.alert(
    //       "Peringatan!",
    //       data.verifytitleprofile.data.receiver.join(",") +
    //         ' is not active. Please remove from "Kepada" to continue.'
    //     );
    //   }
    // } else {
    if (page == "edit") {
      if (sender.length == 0) {
        valid = 0;
        Alert.alert("Peringatan!", "Dari is required");
      } else if (receivers.length == 0) {
        valid = 0;
        Alert.alert("Peringatan!", "Kepada is required");
      } else if (masalah.length == 0) {
        valid = 0;
        Alert.alert("Peringatan!", "Kode Masalah is required");
      } else if (
        (isi.length == 0 && data?.template.name != "undangan") ||
        (isi_atas.length == 0 &&
          isi_bawah.length == 0 &&
          data?.template.name == "undangan")
      ) {
        valid = 0;
        Alert.alert("Peringatan!", "Isi surat is required");
      } else if (approver.length != 0) {
        //cek approver
        let codeLastApprover = approver[approver.length - 1].code
          ? approver[approver.length - 1].code
          : approver[approver.length - 1].nik;
        let codeSender = sender[0].title_code
          ? sender[0].title_code
          : sender[0].name_code
          ? sender[0].name_code
          : sender[0].code;
        if (codeLastApprover != codeSender) {
          valid = 0;
          Alert.alert(
            "Peringatan!",
            "Last Approver should be the same as a Sender"
          );
        }
      }
    }
    // }
    if (valid == 1) {
      setTipe(action);
      bottomSheetModalRef.current?.present();
    }
  }
  function showConfirm() {
    Alert.alert(
      "Konfirmasi",
      "Anda yakin untuk menyimpan data surat ini?",
      [
        { text: "Tidak", onPress: () => {} },
        {
          text: "Ya",
          onPress: () => actionEdit("Simpan"),
        },
      ],
      {
        cancelable: true,
      }
    );
  }
  function submitComment() {
    if (page == "edit") {
      //jika edit, prep data
      handlerEdit();
    } else {
      //jika tidak edit
      actionNoEdit();
    }
  }
  async function actionNoEdit() {
    //action tanpa edit
    try {
      setisLoading(true);
      if (comment.length == 0) {
        Alert.alert("Peringatan!", "Silakan isi komentar");
        setisLoading(false);
      } else if (
        passphrase.length == 0 &&
        data?.is_signer &&
        tipe == "Setujui" &&
        profile.is_pass != "true"
      ) {
        Alert.alert("Peringatan!", "Silakan isi passphrase");
        setisLoading(false);
      } else {
        let payload =
          data?.current + 1 == data?.tracker?.approvers?.length &&
          tipe == "Setujui"
            ? { komentar: comment, passphrase: passphrase, pass: "1" }
            : { komentar: comment, pass: "1" };
        let response;
        if (tipe == "Selesaikan") {
          response = await postHTTP(
            nde_api.letteridfinish.replace("{$id}", id),
            payload
          );
        } else if (tipe == "Setujui") {
          response = await postHTTP(
            nde_api.letteridapprove.replace("{$id}", id),
            payload
          );
        } else if (tipe == "Revisi") {
          response = await postHTTP(
            nde_api.letteridreturn.replace("{$id}", id),
            payload
          );
        } else if (tipe == "Return To Composer") {
          response = await postHTTP(
            nde_api.letteridreturntokonseptor.replace("{$id}", id),
            payload
          );
        } else if (tipe == "Batalkan") {
          response = await postHTTP(
            nde_api.letteridreject.replace("{$id}", id),
            payload
          );
        }

        if (response?.data?.status == "Error") {
          Alert.alert("Gagal!", response.data.msg);
        } else {
          Alert.alert(
            "Berhasil!",
            "Surat telah berhasil di" + tipe.toLowerCase() + "!",
            [
              {
                text: "Ok",
                onPress: () => navigation.goBack(),
              },
            ]
          );
        }
      }
      setisLoading(false);
    } catch (error) {
      handlerError(error, "Gagal!", tipe + " tidak berfungsi.");
      setisLoading(false);
    }
  }

  async function handlerEdit() {
    //action jika edit
    try {
      setisLoading(true);
      if (comment.length == 0) {
        Alert.alert("Peringatan!", "Silakan isi komentar");
        setisLoading(false);
      } else {
        actionEdit(tipe);
      }
    } catch (error) {
      handlerError(error, "Peringatan!", tipe + " tidak berfungsi.");
      setisLoading(false);
    }
  }

  async function actionEdit(tipe) {
    try {
      //prep data
      let dari = "";
      let dari_ids = "";
      if (sender.length != 0) {
        if (sender[0].title) {
          dari = sender[0].title;
          dari_ids = sender[0].code ? sender[0].code : sender[0].title_code;
        } else {
          dari = sender[0].name;
          dari_ids = sender[0].code;
        }
      } else {
        if (data?.senders[0].title) {
          dari = data?.senders[0].title;
          dari_ids = data?.senders[0].title_code;
        } else {
          dari = data?.senders[0].name;
          dari_ids = data?.senders[0].name_code;
        }
      }

      let kepada_addressbook = [];
      let kepada_addressbook_ids = [];
      if (receivers.length == 0) {
        if (data?.template.name == "nota_external") {
          kepada_addressbook = data?.kepada_addressbook.join("\n");
          kepada_addressbook_ids = data?.kepada_addressbook_ids.join("\n");
          // if (
          //   receivers_external_display &&
          //   result[0] == "Setujui" &&
          //   data?.tracker.lastposition
          // ) {
          //   // receivers_external_display =
          //   //   document.getElementById("receivers_external")?.innerText;
          // } else if (result[0] == "Setujui" && data?.tracker.lastposition) {
          //   // receivers_external_display =
          //   //   document.getElementById("receivers_external")?.innerText;
          // }
        } else {
          kepada_addressbook = data?.receivers.join("\n");
          data?.receivers_ids.forEach((e) => {
            kepada_addressbook_ids.push(e.code);
            kepada_addressbook_ids = kepada_addressbook_ids.join("\n");
          });
        }
      } else {
        if (data?.template.name == "nota_external") {
          // if (
          //   receivers_external_display &&
          //   result[0] == "Setujui" &&
          //   data?.tracker.lastposition
          // ) {
          //   // receivers_external_display = document.getElementById(
          //   //   "receivers_external2"
          //   // )?.innerText;
          // } else if (result[0] == "Setujui" && data?.tracker.lastposition) {
          //   // receivers_external_display = document.getElementById(
          //   //   "receivers_external2"
          //   // )?.innerText;
          // }
        }
        kepada_addressbook = [];
        kepada_addressbook_ids = [];
        receivers.forEach((element) => {
          if (element.fullname) {
            kepada_addressbook.push(element.fullname);
            kepada_addressbook_ids.push(element.nik);
          } else if (element.title) {
            kepada_addressbook.push(element.title);
            kepada_addressbook_ids.push(element.code);
          } else if (element.name) {
            kepada_addressbook.push(element.name);
            kepada_addressbook_ids.push(element.code);
          }
        });
        kepada_addressbook = kepada_addressbook.join("\n");
        kepada_addressbook_ids = kepada_addressbook_ids.join("\n");
      }

      let tembusan = [];
      let tembusan_ids = [];
      if (copytos.length == 0) {
        copytos = data?.copytos.join("\n");
        data?.copytos_ids.forEach((e) => {
          tembusan_ids.push(e.code);
        });
        tembusan_ids = tembusan_ids.join("\n");
      } else {
        copytos.forEach((element) => {
          if (element.fullname) {
            tembusan.push(element.fullname);
            tembusan_ids.push(element.nik);
          } else if (element.title) {
            tembusan.push(element.title);
            tembusan_ids.push(element.code);
          } else if (element.name) {
            tembusan.push(element.name);
            tembusan_ids.push(element.code);
          }
        });
        tembusan = tembusan.join("\n");
        tembusan_ids = tembusan_ids.join("\n");
      }

      let additional_approver = [];
      let additional_approver_ids = [];
      add_approver.forEach((element) => {
        if (element.fullname) {
          additional_approver.push(element.fullname);
          additional_approver_ids.push(element.nik);
        } else if (element.title) {
          additional_approver.push(element.title);
          additional_approver_ids.push(element.code);
        } else if (element.name) {
          additional_approver.push(element.name);
          additional_approver_ids.push(element.code);
        }
      });
      additional_approver = additional_approver.join("\n");
      additional_approver_ids = additional_approver_ids.join("\n");

      let approvers = "";
      let approvers_ids = "";
      let pemeriksa = [];
      let pemeriksa_ids = [];
      if (approver.length == 0) {
        data?.tracker?.approvers.forEach((element) => {
          if (element.sequence != 0) {
            if (element.profile != null) {
              pemeriksa.push(element.profile.fullname);
              pemeriksa_ids.push(element.profile.nik);
            } else if (element.title != null) {
              pemeriksa.push(element.title.name);
              pemeriksa_ids.push(element.title.objid);
            }
          }
        });
      } else {
        approver.forEach((element) => {
          if (element.fullname) {
            pemeriksa.push(element.fullname);
            if (element.nik) {
              pemeriksa_ids.push(element.nik);
            } else {
              pemeriksa_ids.push(element.code);
            }
          } else if (element.title) {
            pemeriksa.push(element.title);
            pemeriksa_ids.push(element.code);
          } else if (element.name) {
            pemeriksa.push(element.name);
            pemeriksa_ids.push(element.code);
          }
        });
      }
      approvers = pemeriksa.join("\n");
      approvers_ids = pemeriksa_ids.join("\n");

      let hf_attachments = "";
      let attachment = [];
      data?.attachments?.forEach((element) => {
        attachment.push(element.id);
      });
      hf_attachments = attachment?.join(",");

      let references = "";
      let referensi = [];
      data?.references?.forEach((element) => {
        referensi.push(element.subject + "|" + element.url);
      });
      references = referensi?.join("\n");

      //edit undangan
      if (data?.template?.name == "undangan") {
        let cek = tempat.replace(/\n/g, "<br>").split(" ");
        let hasil = "";
        for (let i = 0; i < cek.length; i++) {
          let cekChar = cek[i].charAt(cek[i].length - 1);
          let test = cek[i].search("http");
          if (test == 0) {
            if (cekChar == "," || cekChar == ".") {
              let hasil = cek[i].slice(0, cek[i].length - 1);
              cek[i] =
                "<a href='" +
                hasil +
                "' target='_blank'> " +
                hasil +
                " </a>" +
                cekChar;
            } else {
              cek[i] =
                "<a href='" + cek[i] + "' target='_blank'> " + cek[i] + " </a>";
            }
          }

          if (hasil == "") {
            hasil = cek[i];
          } else {
            hasil = hasil + " " + cek[i];
          }
        }
        place = hasil;
      }

      //set payload
      let payload;
      if (data?.state == "rns") {
        switch (data?.template?.name) {
          case "nota_external":
            payload = {
              document: data?.id,
              lokasi: data?.office_city,
              template: data?.template?.name,
              template_name: data?.template?.name,
              prioritas: data?.priority,
              sifat: data?.type,
              referensi: references,
              hf_attachments: hf_attachments,
              salam: salam ? salam : data?.salam,
              dari: dari,
              dari_ids: dari_ids,
              kepada: receivers_external_display,
              kepada_addressbook: kepada_addressbook,
              kepada_addressbook_ids: kepada_addressbook_ids,
              tembusan: tembusan,
              tembusan_ids: tembusan_ids,
              pemeriksa: approvers,
              pemeriksa_ids: approvers_ids,
              lampiran: lampiran ? lampiran : "-",
              masalah: masalah[0].code,
              subject: perihal ? perihal : data?.subject,
              isi: isi ? isi : data?.body,
              komentar: comment,
            };
            break;
          case "undangan":
            payload = {
              document: data?.id,
              lokasi: data?.office_city,
              template: data?.template?.name,
              template_name: data?.template?.name,
              prioritas: data?.priority,
              sifat: data?.type,
              referensi: references,
              hf_attachments: hf_attachments,
              dari: dari,
              dari_ids: dari_ids,
              kepada: kepada_addressbook,
              kepada_ids: kepada_addressbook_ids,
              tembusan: tembusan,
              tembusan_ids: tembusan_ids,
              pemeriksa: approvers,
              pemeriksa_ids: approvers_ids,
              lampiran: lampiran ? lampiran : "-",
              masalah: masalah[0].code,
              subject: perihal ? perihal : data?.subject,
              isi_atas: isi_atas,
              isi_bawah: isi_bawah,
              tanggal_mulai: tanggal_mulai,
              tanggal_selesai: tanggal_selesai,
              zona_waktu: zona_waktu,
              waktu_mulai: waktu_mulai,
              waktu_selesai: waktu_selesai,
              agenda: agenda,
              tempat: place,
              komentar: comment,
            };
            break;
          default:
            payload = {
              document: data?.id,
              lokasi: data?.office_city,
              template: data?.template?.name,
              template_name: data?.template?.name,
              prioritas: data?.priority,
              sifat: data?.type,
              referensi: references,
              hf_attachments: hf_attachments,
              dari: dari,
              dari_ids: dari_ids,
              kepada: kepada_addressbook,
              kepada_ids: kepada_addressbook_ids,
              tembusan: tembusan,
              tembusan_ids: tembusan_ids,
              pemeriksa: approvers,
              pemeriksa_ids: approvers_ids,
              lampiran: lampiran ? lampiran : "-",
              masalah: masalah[0].code,
              subject: perihal ? perihal : data?.subject,
              isi: isi ? isi : data?.body,
              komentar: comment,
            };
            break;
        }
      } else {
        switch (data?.template?.name) {
          case "nota_external":
            payload = {
              template: data?.template?.name,
              template_name: data?.template?.name,
              prioritas: data?.priority,
              sifat: data?.type,
              referensi: references,
              hf_attachments: hf_attachments,
              salam: salam ? salam : data?.salam,
              kepada: receivers_external_display,
              kepada_addressbook: kepada_addressbook,
              kepada_addressbook_ids: kepada_addressbook_ids,
              tembusan: tembusan,
              tembusan_ids: tembusan_ids,
              additional_approver: additional_approver,
              additional_approver_ids: additional_approver_ids,
              lampiran: lampiran ? lampiran : "-",
              masalah: masalah[0].code,
              subject: perihal ? perihal : data?.subject,
              isi: isi ? isi : data?.body,
              komentar: comment,
            };

            // payload = { komentar: comment, pass: "1" };
            break;
          case "undangan":
            payload = {
              template: data?.template?.name,
              template_name: data?.template?.name,
              prioritas: data?.priority,
              sifat: data?.type,
              referensi: references,
              hf_attachments: hf_attachments,
              kepada: kepada_addressbook,
              kepada_ids: kepada_addressbook_ids,
              tembusan: tembusan,
              tembusan_ids: tembusan_ids,
              additional_approver: additional_approver,
              additional_approver_ids: additional_approver_ids,
              lampiran: lampiran ? lampiran : "-",
              masalah: masalah[0].code,
              subject: perihal ? perihal : data?.subject,
              isi_atas: isi_atas,
              isi_bawah: isi_bawah,
              tanggal_mulai: tanggal_mulai,
              tanggal_selesai: tanggal_selesai,
              zona_waktu: zona_waktu,
              waktu_mulai: waktu_mulai,
              waktu_selesai: waktu_selesai,
              agenda: agenda,
              tempat: place,
              komentar: comment,
            };
            // payload = { komentar: comment, pass: "1" };
            break;
          default:
            payload = {
              template: data?.template?.name,
              template_name: data?.template?.name,
              prioritas: data?.priority,
              sifat: data?.type,
              referensi: references,
              hf_attachments: hf_attachments,
              kepada: kepada_addressbook,
              kepada_ids: kepada_addressbook_ids,
              tembusan: tembusan,
              tembusan_ids: tembusan_ids,
              additional_approver: additional_approver,
              additional_approver_ids: additional_approver_ids,
              lampiran: lampiran ? lampiran : "-",
              masalah: masalah[0].code,
              subject: perihal ? perihal : data?.subject,
              isi: isi ? isi : data?.body,
              komentar: comment,
            };
            break;
        }
      }
      let response;
      if (payload == undefined) {
        response = {};
        response.data = {};
        response.data = { status: "Error", msg: tipe + " not working" };
      } else {
        switch (tipe) {
          case "Simpan":
            response = await postHTTP(
              nde_api.letteridsave.replace("{$id}", id),
              payload
            );
            break;
          case "Kirim":
            response = await postHTTP(nde_api.lettersubmit, payload);
            break;
          case "Setujui":
            response = await postHTTP(
              nde_api.letteridapprove.replace("{$id}", id),
              payload
            );
            break;
          case "Selesaikan":
            response = await postHTTP(
              nde_api.letteridfinish.replace("{$id}", id),
              payload
            );
            break;
          case "Revisi":
            response = await postHTTP(
              nde_api.letteridreturn.replace("{$id}", id),
              payload
            );
            break;
          case "Return To Composer":
            response = await postHTTP(
              nde_api.letteridreturntokonseptor.replace("{$id}", id),
              payload
            );
            break;
          case "Batalkan":
            response = await postHTTP(
              nde_api.letteridreject.replace("{$id}", id),
              payload
            );
            break;
        }
      }
      if (response?.data?.status == "Error") {
        Alert.alert("Gagal!", response?.data?.msg);
      } else {
        Alert.alert(
          "Berhasil!",
          "Surat telah berhasil di" + tipe.toLowerCase() + "!",
          [
            {
              text: "Ok",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
      setisLoading(false);
    } catch (error) {
      // handlerError(error, "Peringatan!", tipe + " tidak berfungsi.");
      setisLoading(false);
    }
  }
  return (
    <>
      {loadingOverlay}
      {/* <View>
        {page == "edit" && (
          <Button
            onPress={() => {
              showConfirm();
            }}
            mode="contained"
            style={[
              { backgroundColor: GlobalStyles.colors.blue, marginBottom: 16 },
            ]}
          >
            Save
          </Button>
        )}
        {page == "edit" && data?.state == "rns" && (
          <Button
            onPress={() => {
              showComment("Kirim", page);
            }}
            mode="contained"
            style={[
              {
                backgroundColor: GlobalStyles.colors.green,
                marginBottom: 24,
              },
            ]}
          >
            Submit
          </Button>
        )}
        {data?.state != "rns" && page != "edit" && (
          <>
            <Button
              onPress={() => {
                showComment("Setujui");
              }}
              mode="contained"
              style={[
                {
                  backgroundColor: GlobalStyles.colors.approve,
                  marginBottom: 16,
                },
              ]}
            >
              Approve
            </Button>
            <Button
              onPress={() => showComment("Revisi")}
              mode="contained"
              style={[
                {
                  backgroundColor: GlobalStyles.colors.return,
                  marginBottom: 16,
                },
              ]}
            >
              Return
            </Button>
            <Button
              onPress={() => showComment("Return To Composer")}
              mode="contained"
              style={[
                {
                  backgroundColor: GlobalStyles.colors.returntocomposer,
                  marginBottom: 16,
                },
              ]}
            >
              Return To Composer
            </Button>
            <Button
              onPress={() => showComment("Batalkan")}
              mode="contained"
              style={[
                {
                  backgroundColor: GlobalStyles.colors.reject,
                  marginBottom: 16,
                },
              ]}
            >
              Reject
            </Button>
          </>
        )}
        {data?.state != "rns" && page == "edit" && (
          <View>
            <View style={styles.containerRow}>
              <View style={styles.button}>
                <Button
                  onPress={() => {
                    showComment("Setujui", page);
                  }}
                  mode="contained"
                  style={[{ backgroundColor: GlobalStyles.colors.approve }]}
                >
                  Approve
                </Button>
              </View>
              <View style={styles.button}>
                <Button
                  onPress={() => showComment("Revisi", page)}
                  mode="contained"
                  style={[{ backgroundColor: GlobalStyles.colors.return }]}
                >
                  Return
                </Button>
              </View>
            </View>
            <View style={styles.containerRow}>
              <View style={styles.button}>
                <Button
                  onPress={() => showComment("Return To Composer", page)}
                  mode="contained"
                  style={[
                    { backgroundColor: GlobalStyles.colors.returntocomposer },
                  ]}
                  compact
                >
                  Return To Composer
                </Button>
              </View>
              <View style={styles.button}>
                <Button
                  onPress={() => showComment("Batalkan", page)}
                  mode="contained"
                  style={[{ backgroundColor: GlobalStyles.colors.reject }]}
                >
                  Reject
                </Button>
              </View>
            </View>
          </View>
        )}
      </View> */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 10,
          gap: 10,
        }}
      >
        {page == "edit" && data?.state == "rns" && (
          <>
            <TouchableOpacity
              onPress={() => {
                showConfirm();
              }}
              style={{
                backgroundColor: COLORS.info,
                width: 35,
                height: 35,
                borderRadius: 25,
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="save" size={20} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                showComment("Kirim", page);
              }}
              style={{
                backgroundColor: COLORS.success,
                width: 35,
                height: 35,
                borderRadius: 25,
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="send" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </>
        )}
        {data?.state == "finish" && page != "edit" && (
          <TouchableOpacity
            onPress={() => {
              showComment("Selesaikan", page);
            }}
            style={{
              backgroundColor: COLORS.success,
              width: 35,
              height: 35,
              borderRadius: 25,
              marginTop: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="checkmark-sharp" size={20} color={COLORS.white} />
          </TouchableOpacity>
        )}
        {data?.state != "rns" &&
          data?.state != "finish" &&
          page != "edit" &&
          data?.is_editable == "0" && (
            <>
              <TouchableOpacity
                onPress={() => {
                  showComment("Setujui", page);
                }}
                style={{
                  backgroundColor:
                    data?.attachments[0]?.annotations?.length == 0
                      ? COLORS.success
                      : GlobalStyles.colors.disabled,
                  width: 35,
                  height: 35,
                  borderRadius: 25,
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                disabled={data?.attachments[0]?.annotations?.length != 0}
              >
                <Ionicons name="send-outline" size={20} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  showComment("Revisi", page);
                }}
                style={{
                  backgroundColor:
                    data?.attachments[0]?.annotations?.length == 0
                      ? GlobalStyles.colors.yellow
                      : GlobalStyles.colors.disabled,
                  width: 35,
                  height: 35,
                  borderRadius: 25,
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                disabled={data?.attachments[0]?.annotations?.length != 0}
              >
                <Ionicons name="arrow-back" size={20} color={COLORS.white} />
              </TouchableOpacity>
              {/* <TouchableOpacity
              onPress={() => {
                showComment("Batalkan", page);
              }}
              style={{
                backgroundColor: COLORS.danger,
                width: 35,
                height: 35,
                borderRadius: 25,
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="close" size={20} color={COLORS.white} />
            </TouchableOpacity> */}
            </>
          )}
        {data?.state != "rns" &&
          data?.state != "finish" &&
          page != "edit" &&
          data?.is_editable == "1" && (
            <>
              <TouchableOpacity
                onPress={() => {
                  showComment("Setujui", page);
                }}
                style={{
                  backgroundColor: COLORS.success,
                  width: 35,
                  height: 35,
                  borderRadius: 25,
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="send-outline" size={20} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  showComment("Revisi", page);
                }}
                style={{
                  backgroundColor: GlobalStyles.colors.yellow,
                  width: 35,
                  height: 35,
                  borderRadius: 25,
                  marginTop: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="arrow-back" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </>
          )}
      </View>

      <BottomSheetModalProvider>
        <SafeAreaView>
          <View>
            <BottomSheetModal
              name={tipe}
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={animatedSnapPoints}
              handleHeight={animatedHandleHeight}
              contentHeight={animatedContentHeight}
              keyboardBehavior={
                platform?.OS == "android" ? "fillParent" : "interactive"
              }
              keyboardBlurBehavior="restore"
              android_keyboardInputMode="adjustRezise"
              backdropComponent={(props) => {
                return <BottomSheetBackdrop {...props} />;
              }}
            >
              <BottomSheetView onLayout={handleContentLayout}>
                <View
                  style={
                    page == "edit"
                      ? [styles.contentContainer, { padding: 16 }]
                      : [styles.contentContainer, { padding: 16 }]
                  }
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text>Komentar - </Text>
                    <Text
                      style={{
                        color:
                          tipe == "Setujui" || tipe == "Selesaikan"
                            ? GlobalStyles.colors.approve
                            : tipe == "Revisi"
                            ? GlobalStyles.colors.return
                            : tipe == "Return To Composer"
                            ? GlobalStyles.colors.returntocomposer
                            : tipe == "Batalkan"
                            ? GlobalStyles.colors.reject
                            : GlobalStyles.colors.blue,
                      }}
                    >
                      {tipe}
                    </Text>
                  </View>
                  <BottomSheetTextInput
                    defaultValue={comment}
                    onChangeText={(text) => setComment(text)}
                    style={styles.input}
                    multiline={true}
                    autoFocus
                    allowFontScaling={false}
                  />

                  {tipe == "Setujui" &&
                    profile.is_pass != "true" &&
                    data?.is_signer && (
                      <>
                        <View style={{ flexDirection: "row" }}>
                          <Text>Passphrase</Text>
                        </View>

                        <View style={[styles.input, { flexDirection: "row" }]}>
                          <BottomSheetTextInput
                            defaultValue={passphrase}
                            onChangeText={(text) => setPassphrase(text)}
                            style={{ paddingHorizontal: 10, width: "70%" }}
                            secureTextEntry={showPassphrase}
                            allowFontScaling={false}
                          />
                          <View
                            style={{
                              alignItems: "flex-end",
                              flex: 1,
                              marginRight: 10,
                              justifyContent: "center",
                            }}
                          >
                            {showPassphrase == false ? (
                              <TouchableOpacity
                                onPress={() => {
                                  setShowPassphrase(true);
                                }}
                              >
                                <Ionicons
                                  name="eye-off-sharp"
                                  size={20}
                                  color={COLORS.grey}
                                />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => {
                                  setShowPassphrase(false);
                                }}
                              >
                                <Ionicons
                                  name="eye-sharp"
                                  size={20}
                                  color={COLORS.grey}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </>
                    )}
                  <Button
                    mode="contained"
                    style={[
                      {
                        backgroundColor:
                          tipe == "Setujui" || tipe == "Selesaikan"
                            ? GlobalStyles.colors.approve
                            : tipe == "Revisi"
                            ? GlobalStyles.colors.return
                            : tipe == "Return To Composer"
                            ? GlobalStyles.colors.returntocomposer
                            : tipe == "Batalkan"
                            ? GlobalStyles.colors.reject
                            : GlobalStyles.colors.blue,
                        marginBottom: 16,
                      },
                    ]}
                    onPress={() => submitComment()}
                  >
                    Kirim
                  </Button>
                  <Button
                    mode="contained"
                    style={[
                      {
                        backgroundColor: GlobalStyles.colors.gray500,
                        marginBottom: 16,
                      },
                    ]}
                    onPress={() => {
                      bottomSheetModalRef.current?.dismiss();
                      setComment("");
                      setPassphrase("");
                    }}
                  >
                    Kembali
                  </Button>
                </View>
              </BottomSheetView>
            </BottomSheetModal>
          </View>
        </SafeAreaView>
      </BottomSheetModalProvider>
    </>
  );
}

export default ActionInprogress;
const styles = StyleSheet.create({
  button: {
    width: "49%",
    marginBottom: 16,
  },
  contentContainer: {
    flex: 1,
  },
  containerRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
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
});
