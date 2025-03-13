import { useState } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import Button from "../../../../components/UI/Button";
import DetailAgenda from "./DetailAgenda";
import { GlobalStyles } from "../../../../constants/styles";
//untuk detail agenda seperti eksisting, hide isi surat
function AgendaDetail({ data, tipe }) {
  const [viewBody, setViewBody] = useState(false);
  const isiSurat = (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Isi Surat</Text>
        {!viewBody && (
          <Button
            style={styles.button}
            onPress={() => {
              setViewBody(!viewBody);
            }}
          >
            View Document
          </Button>
        )}
        {viewBody && <Text>{data?.body}</Text>}
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Referensi</Text>
        {data && data?.references?.length == 0 && <Text>-</Text>}
        {data && data?.references?.length == 1 && (
          <Text>{data.references[0].subject}</Text>
        )}
        {data && data?.references?.length > 1 && (
          <>
            {data.references.map((item, index) => (
              <Text key={index}>
                {index + 1}. {item.subject}
              </Text>
            ))}
          </>
        )}
      </View>
    </>
  );
  return (
    <ScrollView style={styles.screen}>
      <View>
        <DetailAgenda noAgenda={data?.agenda_number} data={data} />
        {isiSurat}
      </View>
    </ScrollView>
  );
}

export default AgendaDetail;

const styles = StyleSheet.create({
  screen: { padding: 16 },
  container: {
    marginBottom: 16,
  },
  title: { fontWeight: "bold", height: 24 },
  button: {
    borderRadius: 10,
    backgroundColor: GlobalStyles.colors.primary,
    color: GlobalStyles.colors.textWhite,
  },
});
