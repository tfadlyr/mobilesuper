import { useEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useDispatch } from "react-redux";
import { Config } from "../../../../constants/config";
import { setDataNotif } from "../../../../store/pushnotif";
import * as Clipboard from "expo-clipboard";
import { setClipboard } from "../../../../store/snackbar";
import { GlobalStyles } from "../../../../constants/styles";
import { IconButton } from "react-native-paper";

//untuk detail agenda yang isi suratnya langsung terbaca tanpa view document
function DetailScan({ data, style }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setDataNotif({}));
  }, []);

  const copyToClipboard = async (text) => {
    Clipboard.setStringAsync(text);
    dispatch(setClipboard(true));
    setTimeout(() => {
      dispatch(setClipboard(false));
    }, 1500);
  };
  return (
    <ScrollView keyboardShouldPersistTaps="handled" style={{ style }}>
      <View style={styles.screen}>
        <View style={[styles.container, { marginBottom: 0 }]}>
          <View>
            <Text style={[styles.titleLabel, { marginBottom: -8 }]}>Perihal</Text>
            <View style={styles.subtitleCopy}>
              <Text style={styles.subtitleLabel}>{data && data.subject}</Text>
              <IconButton
                icon="content-copy"
                size={20}
                onPress={() => {
                  copyToClipboard(data.subject);
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <View>
            <Text style={styles.titleLabel}>Tgl Diterima</Text>
            <Text style={styles.subtitleLabel}>{data && data.letter_date}</Text>
          </View>
          <View>
            <Text style={styles.titleLabel}>Lampiran</Text>
            <Text style={styles.subtitleLabel}>
              {data && data.attachment ? data.attachment : "-"}
            </Text>
          </View>
          <View>
            <Text style={styles.titleLabel}>Kode Masalah</Text>
            <Text style={styles.subtitleLabel}>
              {data && data.problem_code}
            </Text>
          </View>
        </View>
        <View style={[styles.container, { marginBottom: 0 }]}>
          <View>
            <Text style={[styles.titleLabel, { marginBottom: -8 }]}>Nomor Surat</Text>
            <View style={styles.subtitleCopy}>
              <Text style={styles.subtitleLabel}>
                {data && data.ref_number}
              </Text>
              <IconButton
                icon="content-copy"
                size={20}
                onPress={() => {
                  copyToClipboard(data.ref_number);
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <View>
            <Text style={styles.titleLabel}>Kepada</Text>
            {data && (
              <>
                {data && data.receivers?.length == 0 && <Text>-</Text>}
                {data && data.receivers?.length == 1 && (
                  <>
                    <Text>
                      {Config.prefix}
                      {data.receivers[0].person}
                    </Text>
                  </>
                )}
                {data &&
                  data.receivers?.length > 1 &&
                  data.receivers.map((item, index) => (
                    <Text key={index}>
                      {index + 1}. {Config.prefix}
                      {item.person}
                    </Text>
                  ))}
              </>
            )}
          </View>
        </View>
        <View style={styles.container}>
          <View>
            <Text style={styles.titleLabel}>Dari</Text>
            <Text style={styles.subtitleLabel}>{data?.sender}</Text>
          </View>
        </View>
        <View style={styles.container}>
          <View>
            <Text style={styles.titleLabel}>Tembusan</Text>
            <View style={styles.subtitleLabel}>
              {data && (
                <>
                  {data && data.copytos?.length == 0 && <Text>-</Text>}
                  {data && data.copytos?.length == 1 && (
                    <Text>
                      {Config.prefix}
                      {data.copytos[0].person}
                    </Text>
                  )}
                  {data &&
                    data.copytos?.length > 1 &&
                    data.copytos.map((item, index) => (
                      <Text key={index}>
                        {index + 1}. {Config.prefix}
                        {item.person}
                      </Text>
                    ))}
                </>
              )}
            </View>
          </View>
        </View>
        <View style={styles.container}>
          <View>
            <Text style={styles.titleLabel}>Keterangan</Text>
            <Text style={styles.subtitleLabel}>{data?.keterangan}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export default DetailScan;

const styles = StyleSheet.create({
  screen: { margin: 16 },
  container: {
    flexDirection: "row",
    marginBottom: 12,
    justifyContent: "space-between",
  },
  titleLabel: {
    fontWeight: "bold",
    fontSize: GlobalStyles.font.md,
    marginBottom: 6,
  },
  subtitleLabel: {
    fontSize: GlobalStyles.font.md,
  },
  subtitleCopy: {
    flexDirection: "row",
    alignItems: "center",
  },
});
