export function initAgenda(data) {
  //find receivers, copytos, salam
  data.receivers_display = [];
  data.copytos_display = [];
  data.kepada_addressbook = [];
  data.kepada_addressbook_ids = [];
  data.internal_satker = "";
  data.tembusan_external = "";
  data.additional_approver = [];
  data.office_city = "";
  data.salam = "";
  data.kepada_bank = "";
  data.keterangan = "";
  data.jenis_surat = "";
  data.is_editable = "";
  data.from_city = "";
  data.notes = "";
  data.kegiatan = [];
  data.agenda = "";
  data.start_date = "";
  data.end_date = "";
  data.start_time = "";
  data.end_time = "";
  data.location = "";
  data.timezone = "";
  data.attributes.forEach((e, i) => {
    //jenis_surat
    if (e.key == "jenisSurat") {
      if (e.value != "") {
        data.jenis_surat = e.value;
      }
    }
    if (e.key == "isEditable") {
      if (e.value != "") {
        data.is_editable = e.value;
      }
    }
  });
  data.attributes.forEach((e, i) => {
    //Parsing receiver dari migrasi
    if (e.key == "receivers_display") {
      if (e.value != "") {
        var temp = e.value.split("\n");
        if (temp[0] == "<ol>") {
          data.receivers_display = e.value;
        } else {
          temp.forEach((j) => {
            if (j.trim() != "") {
              var temp2 = data.receivers_display.indexOf(j.trim());
              if (temp2 == -1) {
                data.receivers_display.push(j.trim());
              }
            }
          });
        }
      }
    }

    //Parsing copytos dari migrasi
    if (e.key == "copytos_display") {
      if (e.value != "") {
        var temp = e.value.split("\n");
        temp.forEach((j) => {
          if (j.trim() != "") {
            var temp2 = data.copytos_display.indexOf(j.trim());
            if (temp2 == -1) {
              data.copytos_display.push(j.trim());
            }
          }
        });
      }
    }

    //tembusan_external
    if (e.key == "tembusan_external") {
      if (e.value != "") {
        data.tembusan_external = e.value;
      }
    }
    //internal_satker
    if (e.key == "internal_satker") {
      if (e.value != "") {
        data.internal_satker = e.value;
      }
    }
    if (data.jenis_surat == "Surat Undangan") {
      //agenda
      if (e.key == "agenda") {
        if (e.value != "") {
          data.agenda = e.value;
        }
      }
      //start_date
      if (e.key == "start_date") {
        if (e.value != "") {
          data.start_date = e.value;
        }
      }
      //end_date
      if (e.key == "end_date") {
        if (e.value != "") {
          data.end_date = e.value;
        }
      }
      //start_time
      if (e.key == "start_time") {
        if (e.value != "") {
          data.start_time = e.value;
        }
      }
      //end_time
      if (e.key == "end_time") {
        if (e.value != "") {
          data.end_time = e.value;
        }
      }
      //location
      if (e.key == "location") {
        if (e.value != "") {
          data.location = e.value;
        }
      }
      //notes
      if (e.key == "notes") {
        if (e.value != "") {
          data.notes = e.value;
        }
      }
      //timezone
      if (e.key == "timezone") {
        if (e.value != "") {
          data.timezone = e.value;
        }
      }
    }
    if (
      data.jenis_surat == "Surat Tugas" ||
      data.jenis_surat == "Surat Perintah"
    ) {
      //from_city
      if (e.key == "from_city") {
        if (e.value != "") {
          data.from_city = e.value;
        }
      }
      //notes
      if (e.key == "notes") {
        if (e.value != "") {
          data.notes = e.value;
        }
      }
      //init event kegiatan
      if (e.key == "event_1") {
        if (e.value != "") {
          data.kegiatan[0] = e.value;
        }
      }
      if (e.key == "event_2") {
        if (e.value != "") {
          data.kegiatan[1] = e.value;
        }
      }
      if (e.key == "event_3") {
        if (e.value != "") {
          data.kegiatan[2] = e.value;
        }
      }
    }
    //additional_approver
    if (e.key == "additional_approver") {
      if (e.value != "") {
        data.additional_approver = e.value;
      }
    }
    //additional_approver_ids
    if (e.key == "additional_approver_ids") {
      if (e.value != "") {
        data.additional_approver_ids = e.value;
      }
    }

    //Office City
    if (e.key == "office_city") {
      if (e.value != "") {
        data.office_city = e.value;
      }
    }

    if (data.template?.name == "nota_external") {
      //init nota_external kepada_addressbook kepada_addressbook_ids
      if (e.key == "kepada_addressbook") {
        if (e.value != "") {
          var temp = e.value.split("\n");
          temp.forEach((j) => {
            if (j.trim() != "") {
              var temp2 = data.kepada_addressbook.indexOf(j.trim());
              if (temp2 == -1) {
                data.kepada_addressbook.push(j.trim());
              }
            }
          });
        }
      }
      if (e.key == "kepada_addressbook_ids") {
        if (e.value != "") {
          var temp = e.value.split("\n");
          temp.forEach((j) => {
            if (j.trim() != "") {
              var temp2 = data.kepada_addressbook_ids.indexOf(j.trim());
              if (temp2 == -1) {
                data.kepada_addressbook_ids.push(j.trim());
              }
            }
          });
        }
      }

      //init salam
      if (e.key == "salam") {
        if (e.value != "") {
          data.salam = e.value;
        }
      }
    }

    //kepada bank
    if (e.template?.name == "permintaan_bg") {
      if (e.key == "kepada_bank") {
        if (e.value != "") {
          data.kepada_bank = e.value;
        }
      }
    }

    if (data.state == "sps") {
      if (e.key == "keterangan") {
        if (e.value != "") {
          data.keterangan = e.value;
        }
      }
    }
  });
}

function formatString(data) {
  let tmp = data.replaceAll(/"|{|}|"/g, "").replaceAll(/'/g, '"');
  tmp = "{ " + tmp + " }";
  tmp = JSON.parse(tmp);
  return tmp;
}

export function initLetter(data) {
  //sort approver by sequence
  if (data.tracker.type != "" && data.tracker.approvers.length != 0) {
    data.tracker.approvers = data.tracker.approvers.sort(
      (a, b) => a.sequence - b.sequence
    );
    if (
      data.tracker.approvers[data.tracker.approvers.length - 1].title?.name ==
        data.position ||
      data.tracker.approvers[data.tracker.approvers.length - 1].profile
        ?.fullname == data.position
    ) {
      data.tracker.lastposition = true;
    } else {
      data.tracker.lastposition = false;
    }
  }
  //find receivers, copytos, salam
  data.receivers_display = [];
  data.copytos_display = [];
  data.kepada_addressbook = [];
  data.kepada_addressbook_ids = [];
  data.additional_approver = [];
  data.additional_approver_ids = [];
  data.tembusan_external = "";
  data.internal_satker = "";
  data.jenis_surat = "";
  data.id_editable = "";
  data.tipe_penerima = "";
  data.office_city = "";
  data.salam = "";
  data.kepada_bank = "";
  data.from_city = "";
  data.notes = "";
  data.kegiatan = [];
  data.start_date = "";
  data.end_date = "";
  data.start_time = "";
  data.end_time = "";
  data.location = "";
  data.timezone = "";
  data.attributes.forEach((e, i) => {
    //jenis_surat
    if (e.key == "jenisSurat") {
      if (e.value != "") {
        data.jenis_surat = e.value;
      }
    }
    if (e.key == "isEditable") {
      if (e.value != "") {
        data.is_editable = e.value;
      }
    }
  });
  data.attributes.forEach((e, i) => {
    //Parsing receiver dari migrasi
    if (e.key == "receivers_display") {
      if (e.value != "") {
        var temp = e.value.split("\n");
        if (temp[0] == "<ol>") {
          data.receivers_display = e.value;
        } else {
          temp.forEach((j) => {
            if (j.trim() != "") {
              var temp2 = data.receivers_display.indexOf(j.trim());
              if (temp2 == -1) {
                data.receivers_display.push(j.trim());
              }
            }
          });
        }
      }
    }

    //Parsing copytos dari migrasi
    if (e.key == "copytos_display") {
      if (e.value != "") {
        var temp = e.value.split("\n");
        temp.forEach((j) => {
          if (j.trim() != "") {
            var temp2 = data.copytos_display.indexOf(j.trim());
            if (temp2 == -1) {
              data.copytos_display.push(j.trim());
            }
          }
        });
      }
    }

    //tembusan_external
    if (e.key == "tembusan_external") {
      if (e.value != "") {
        data.tembusan_external = e.value;
      }
    }
    //internal_satker
    if (e.key == "internal_satker") {
      if (e.value != "") {
        data.internal_satker = e.value;
      }
    }
    if (data.jenis_surat == "Surat Undangan") {
      //start_date
      if (e.key == "start_date") {
        if (e.value != "") {
          data.start_date = e.value;
        }
      }
      //end_date
      if (e.key == "end_date") {
        if (e.value != "") {
          data.end_date = e.value;
        }
      }
      //start_time
      if (e.key == "start_time") {
        if (e.value != "") {
          data.start_time = e.value;
        }
      }
      //end_time
      if (e.key == "end_time") {
        if (e.value != "") {
          data.end_time = e.value;
        }
      }
      //location
      if (e.key == "location") {
        if (e.value != "") {
          data.location = e.value;
        }
      }
      //notes
      if (e.key == "notes") {
        if (e.value != "") {
          data.notes = e.value;
        }
      }
      //timezone
      if (e.key == "timezone") {
        if (e.value != "") {
          data.timezone = e.value;
        }
      }
    }
    if (
      data.jenis_surat == "Surat Tugas" ||
      data.jenis_surat == "Surat Perintah"
    ) {
      //from_city
      if (e.key == "from_city") {
        if (e.value != "") {
          data.from_city = e.value;
        }
      }
      //notes
      if (e.key == "notes") {
        if (e.value != "") {
          data.notes = e.value;
        }
      }
      //init event kegiatan
      if (e.key == "event_1") {
        if (e.value != "") {
          data.kegiatan[0] = e.value;
        }
      }
      if (e.key == "event_2") {
        if (e.value != "") {
          data.kegiatan[1] = e.value;
        }
      }
      if (e.key == "event_3") {
        if (e.value != "") {
          data.kegiatan[2] = e.value;
        }
      }
    }
    //tipe_penerima
    if (e.key == "tipe_penerima") {
      if (e.value != "") {
        data.tipe_penerima = e.value;
      }
    }
    //Parsing additional_approver dari migrasi
    if (e.key == "additional_approver") {
      if (e.value != "") {
        data.additional_approver = e.value;
      }
    }

    //Parsing additional_approver_ids dari migrasi
    if (e.key == "additional_approver_ids") {
      if (e.value != "") {
        data.additional_approver_ids = e.value;
      }
    }

    //Office City
    if (e.key == "office_city") {
      if (e.value != "") {
        data.office_city = e.value;
      }
    }
    //init nota_external kepada_addressbook kepada_addressbook_ids

    if (e.key == "kepada_addressbook") {
      if (e.value != "") {
        var temp = e.value.split("\n");
        temp.forEach((j) => {
          if (j.trim() != "") {
            var temp2 = data.kepada_addressbook.indexOf(j.trim());
            if (temp2 == -1) {
              data.kepada_addressbook.push(j.trim());
            }
          }
        });
      }
    }
    if (e.key == "kepada_addressbook_ids") {
      if (e.value != "") {
        var temp = e.value.split("\n");
        temp.forEach((j) => {
          if (j.trim() != "") {
            var temp2 = data.kepada_addressbook_ids.indexOf(j.trim());
            if (temp2 == -1) {
              data.kepada_addressbook_ids.push(j.trim());
            }
          }
        });
      }
    }

    //init salam
    if (data.template.name == "nota_external") {
      if (e.key == "salam") {
        if (e.value != "") {
          data.salam = e.value;
        }
      }
    }

    //kepada bank
    if (data.template?.name == "permintaan_bg") {
      if (e.key == "kepada_bank") {
        if (e.value != "") {
          data.kepada_bank = e.value;
        }
      }
    }
  });
}

export function getExtensionIcon(item) {
  let temp = item.filename.split(".");
  if (temp[temp.length - 1] == "pdf") {
    return "file-pdf-box";
  } else if (
    temp[temp.length - 1] == "doc" ||
    temp[temp.length - 1] == "dot" ||
    temp[temp.length - 1] == "docx"
  ) {
    return "file-word";
  } else if (
    temp[temp.length - 1] == "xls" ||
    temp[temp.length - 1] == "xlm" ||
    temp[temp.length - 1] == "xla" ||
    temp[temp.length - 1] == "xlc" ||
    temp[temp.length - 1] == "xlt" ||
    temp[temp.length - 1] == "xlw" ||
    temp[temp.length - 1] == "xlsx"
  ) {
    return "file-excel";
  } else if (
    temp[temp.length - 1] == "ppt" ||
    temp[temp.length - 1] == "pps" ||
    temp[temp.length - 1] == "pot" ||
    temp[temp.length - 1] == "pptx"
  ) {
    return "file-powerpoint";
  } else if (
    temp[temp.length - 1] == "jpeg" ||
    temp[temp.length - 1] == "jpg" ||
    temp[temp.length - 1] == "jpe" ||
    temp[temp.length - 1] == "png"
  ) {
    return "file-image";
  } else if (temp[temp.length - 1] == "zip" || temp[temp.length - 1] == "rar") {
    return "file";
  } else if (temp[temp.length - 1] == "txt") {
    return "file";
  } else {
    return "file";
  }
}

// DOWNLOAD FILE
import { Platform, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
const { StorageAccessFramework } = FileSystem;
import * as Sharing from "expo-sharing";
import { nde_api } from "./api.config";
import { headerToken } from "./http";

export const initDownload = (item) => {
  let fileUrl, fileType, fileName;
  if (item.tipe == "sign") {
    // setIsLoading(true);
    fileUrl = item.link;
    fileType =
      item.description == "editor-generated"
        ? "application/pdf"
        : item.description;
    if (item.tipe == "attach") {
      fileName = item.filename;
    } else {
      fileName = item.description;
    }
  } else {
    // setIsLoading(true);
    fileUrl = item.file;
    fileType = item.description;
    fileName = item.name ? item.name : item.filename;
    fileName = fileName.replaceAll(" ", "_");
  }
  downloadFile(fileUrl, fileType, fileName);
};

const downloadFile = async (fileUrl, fileType, fileName) => {
  const downloadPath =
    FileSystem.documentDirectory + (Platform.OS == "android" ? "" : "");
  if (Platform.OS == "android") {
    const dir = ensureDirAsync(downloadPath);
  }
  let header = await headerToken();
  //alert(fileName)
  const downloadResumable = FileSystem.createDownloadResumable(
    nde_api.baseurl + "crsbe/" + fileUrl.slice(5, fileUrl?.length),
    downloadPath + fileName,
    { headers: header },
    downloadCallback
  );
  try {
    const { uri } = await downloadResumable.downloadAsync();
    // if (Platform.OS == "android") {
    //   saveAndroidFile(uri, fileName, fileType);
    // } else
    saveIosFile(uri);
  } catch (e) {
    setIsLoading(false);
    console.error("download error:", e);
  }
};
const saveAndroidFile = async (fileUri, fileName, fileType) => {
  try {
    const fileString = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const permissions =
      await StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) {
      return;
    }

    try {
      await StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        fileName,
        fileType
      )
        .then(async (uri) => {
          await FileSystem.writeAsStringAsync(uri, fileString, {
            encoding: FileSystem.EncodingType.Base64,
          });

          Alert.alert("Berhasil!", "Unduh surat telah berhasil");
        })
        .catch((e) => {
          Alert.alert(
            "Gagal!",
            "Unduh gagal. Silakan pilih folder lain untuk menyimpan file."
          );
        });
    } catch (e) {
      throw new Error(e);
    }
  } catch (err) {}
};

const saveIosFile = async (fileUri) => {
  try {
    const UTI = "public.item";
    const shareResult = await Sharing.shareAsync(fileUri, { UTI });
  } catch (error) {}
};

const ensureDirAsync = async (dir, intermediates = true) => {
  const props = await FileSystem.getInfoAsync(dir);
  if (props.exist && props.isDirectory) {
    return props;
  }
  let _ = await FileSystem.makeDirectoryAsync(dir, { intermediates });
  return await ensureDirAsync(dir, intermediates);
};
const downloadCallback = (downloadProgress) => {
  const progress =
    downloadProgress.totalBytesWritten /
    downloadProgress.totalBytesExpectedToWrite;
};
