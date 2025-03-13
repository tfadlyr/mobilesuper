import { useEffect, useState } from "react";
import {
  useWindowDimensions,
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useDispatch } from "react-redux";
import LoadingOverlay from "../../components/UI/LoadingOverlay";
import { setBg } from "../../store/auth";
import { nde_api } from "../../utils/api.config";
import { getHTTP } from "../../utils/http";
import { decode as atob, encode as btoa } from "base-64";
import RenderHTML from "react-native-render-html";
import { GlobalStyles } from "../../constants/styles";
import { Text } from "react-native-paper";

function TermOfUse() {
  const dispatch = useDispatch();
  const [tou, setTOU] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { width } = useWindowDimensions();
  useEffect(() => {
    dispatch(setBg(false));
    getTOU();
  }, []);

  const loadingOverlay = (
    <>
      <LoadingOverlay visible={isLoading} />
    </>
  );

  async function getTOU() {
    setIsLoading(true);
    try {
      const response = await getHTTP(nde_api.getTermofuse);
      setTOU(atob(response.data.body));
      setIsLoading(false);
    } catch (error) {
      if (error.status == null) {
      } else {
        handlerError(error, "Warning!", "Terms of Use not working!");
      }
      setIsLoading(false);
    }
  }
  return (
    <>
      {loadingOverlay}
      <ScrollView style={styles.screen}>
        <View>
          <Text style={styles.title}>
            General Term of Use Notadinas TelkomGroup
          </Text>
          <View style={styles.body}>
            <RenderHTML contentWidth={width} source={{ html: tou }} />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

export default TermOfUse;

const styles = StyleSheet.create({
  screen: { padding: 16 },
  title: {
    fontSize: GlobalStyles.font.lg,
    fontWeight: "bold",
  },
  body: {
    marginTop: -25,
  },
});
