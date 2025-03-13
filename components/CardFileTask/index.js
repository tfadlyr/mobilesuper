import React, { useRef, useState } from "react";
import { FlatList, Platform, Text } from "react-native";
import { View } from "react-native";
import { COLORS, FONTSIZE } from "../../config/SuperAppps";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Modal } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { StyleSheet } from "react-native";
import ListEmpty from "../../components/ListEmpty";

const CardLampiran = ({ lampiran, onClick, type, id }) => {
  const navigation = useNavigation();
  return type === "png" || type === "jpg" || type === "jpeg" ? (
    <TouchableOpacity key={id} onPress={onClick}>
      <Image
        source={{ uri: lampiran }}
        style={{ width: 174, height: 97, borderRadius: 6, marginTop: 10 }}
      />
    </TouchableOpacity>
  ) : type === "mp4" ? (
    <TouchableOpacity
      key={id}
      onPress={onClick}
      style={{
        width: 174,
        height: 97,
        borderRadius: 6,
        marginTop: 10,
        backgroundColor: COLORS.secondaryLighter,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/superApp/mp4.png")}
        style={{ width: 70, height: 70 }}
      />
    </TouchableOpacity>
  ) : type === "doc" || type === "docx" ? (
    <TouchableOpacity
      key={id}
      onPress={() =>
        navigation.navigate("FileViewer", {
          lampiran: lampiran,
          type: type,
        })
      }
      style={{
        width: 174,
        height: 97,
        borderRadius: 6,
        marginTop: 10,
        backgroundColor: COLORS.secondaryLighter,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/superApp/word.png")}
        style={{ width: 70, height: 70 }}
      />
    </TouchableOpacity>
  ) : type === "xls" || type === "xlsx" ? (
    <TouchableOpacity
      key={id}
      onPress={() =>
        navigation.navigate("FileViewer", {
          lampiran: lampiran,
          type: type,
        })
      }
      style={{
        width: 174,
        height: 97,
        borderRadius: 6,
        marginTop: 10,
        backgroundColor: COLORS.secondaryLighter,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/superApp/excel.png")}
        style={{ width: 70, height: 70 }}
      />
    </TouchableOpacity>
  ) : type === "pdf" ? (
    <TouchableOpacity
      key={id}
      onPress={() =>
        navigation.navigate("FileViewer", {
          lampiran: lampiran,
          type: type,
        })
      }
      style={{
        width: 174,
        height: 97,
        borderRadius: 6,
        marginTop: 10,
        backgroundColor: COLORS.secondaryLighter,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/superApp/pdf.png")}
        style={{ width: 70, height: 70 }}
      />
    </TouchableOpacity>
  ) : type === "ppt" || type === "pptx" ? (
    <TouchableOpacity
      key={id}
      onPress={() =>
        navigation.navigate("FileViewer", {
          lampiran: lampiran,
          type: type,
        })
      }
      style={{
        width: 174,
        height: 97,
        borderRadius: 6,
        marginTop: 10,
        backgroundColor: COLORS.secondaryLighter,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../../assets/superApp/ppt.png")}
        style={{ width: 70, height: 70 }}
      />
    </TouchableOpacity>
  ) : null;
};

export const CardFileTask = ({ taskDetail }) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const [lampiranById, setLampiranById] = useState(null);

  const getFileExtension = (lampiran) => {
    let jenis = lampiran.split(".");
    jenis = jenis[jenis.length - 1];
    return jenis;
  };
  const video = useRef(null);

  return (
    <View>
      <FlatList
        key={"lampiran"}
        data={taskDetail.attachments}
        renderItem={({ item }) => (
          <View key={item.id}>
            <CardLampiran
              lampiran={item.file}
              id={item.id}
              type={getFileExtension(item.name)}
              onClick={() => {
                setVisibleModal(true);
                setLampiranById(item);
              }}
            />
          </View>
        )}
        scrollEnabled={true}
        style={{ marginTop: 20 }}
        columnWrapperStyle={{ gap: 16 }}
        numColumns={2}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => <ListEmpty />}
      />

      {lampiranById !== null ? (
        <Modal
          animationType="fade"
          transparent={true}
          visible={visibleModal}
          onRequestClose={() => {
            setVisibleModal(false);
            setLampiranById(null);
          }}
        >
          <TouchableOpacity
            style={[
              Platform.OS === "ios"
                ? styles.iOSBackdrop
                : styles.androidBackdrop,
              styles.backdrop,
            ]}
          />
          <View
            style={{
              alignItems: "center",
              flex: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setVisibleModal(false);
                setLampiranById(null);
              }}
              style={{
                position: "absolute",
                top: "15%",
                left: 20,
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.primary,
                  width: 51,
                  height: 51,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 50,
                }}
              >
                <Ionicons name="close-outline" color={COLORS.white} size={24} />
              </View>
            </TouchableOpacity>
            {getFileExtension(lampiranById.name) === "png" ||
            getFileExtension(lampiranById.name) === "jpg" ||
            getFileExtension(lampiranById.name) === "jpeg" ? (
              <View>
                <Image
                  source={{ uri: lampiranById.file }}
                  style={{ width: 390, height: 283 }}
                />
              </View>
            ) : getFileExtension(lampiranById.name) === "mp4" ? (
              <Video
                ref={video}
                style={{ width: 390, height: 283 }}
                source={{ uri: lampiranById.file }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                onPlaybackStatusUpdate={(status) => setStatus(() => status)}
              />
            ) : (
              <></>
            )}
          </View>
        </Modal>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  backIcon: {
    backgroundColor: "white",
    height: 28,
    width: 28,
    borderRadius: 50,
  },
  imageIos: {
    width: "100%",
    height: 260,
    resizeMode: "cover",
  },
  imageAndroid: {
    width: "100%",
    height: 260,
    resizeMode: "cover",
  },
  iOSBackdrop: {
    backgroundColor: "#000000",
    opacity: 0.7,
  },
  androidBackdrop: {
    backgroundColor: "#232f34",
    opacity: 0.7,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
