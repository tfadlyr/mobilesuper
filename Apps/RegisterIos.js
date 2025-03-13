import React, { useState } from "react";
import {
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { COLORS } from "../config/SuperAppps";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LoginIos } from "./LoginIos";

export const RegisterIos = () => {
  const [username, setUserName] = useState("");
  const [fUllName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(true);
  const [modal, setModal] = useState(false);
  const navigation = useNavigation();

  return (
    <View>
      <View style={{ marginTop: 70, marginHorizontal: 20 }}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            color: COLORS.primary,
          }}
        >
          Register
        </Text>
        <Text
          style={{
            color: COLORS.primary,
            marginTop: 10,
          }}
        >
          Mohon melengkapi informasi dibawah ini untuk daftar.
        </Text>
        <View style={{ width: "100%", marginTop: 40 }}>
          <Text>Nama Lengkap</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderRadius: 5,
              height: 40,
              marginTop: 5,
              borderColor: COLORS.ExtraDivinder,
              padding: 10,
            }}
            onChangeText={(e) => {
              setFullName(e);
            }}
            value={fUllName}
            placeholder="Masukkan nama lengkap anda"
          />
        </View>
        <View style={{ width: "100%", marginTop: 20 }}>
          <Text>Username</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderRadius: 5,
              height: 40,
              marginTop: 5,
              borderColor: COLORS.ExtraDivinder,
              padding: 10,
            }}
            onChangeText={(e) => {
              setUserName(e);
            }}
            value={username}
            placeholder="Masukkan username anda"
          />
        </View>
        <View style={{ width: "100%", marginTop: 20 }}>
          <Text>Kata Sandi</Text>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 4,
              borderColor: COLORS.ExtraDivinder,
              flexDirection: "row",
              height: 40,
              marginTop: 5,
            }}
          >
            <TextInput
              style={{ padding: 10, width: "70%" }}
              onChangeText={(e) => {
                setPassword(e);
              }}
              value={password}
              secureTextEntry={show}
              placeholder="Masukkan kata sandi anda"
            />
            <View
              style={{
                alignItems: "flex-end",
                flex: 1,
                marginRight: 10,
                justifyContent: "center",
              }}
            >
              {show == false ? (
                <TouchableOpacity
                  onPress={() => {
                    setShow(true);
                  }}
                >
                  <Ionicons
                    name="eye-off-sharp"
                    size={24}
                    color={COLORS.grey}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setShow(false);
                  }}
                >
                  <Ionicons name="eye-sharp" size={24} color={COLORS.grey} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            marginTop: 20,
            padding: 20,
            borderRadius: 16,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            setModal(true);
          }}
        >
          <Text style={{ color: COLORS.white }}>Lanjut</Text>
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modal}
          onRequestClose={() => {
            setModal(!modal);
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
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <View
              style={{
                backgroundColor: COLORS.white,
                alignItems: "center",
                justifyContent: "center",
                width: "90%",
                height: 350,
                borderRadius: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => setModal(false)}
                style={{
                  paddingRight: "85%",
                  marginBottom: 3,
                  marginLeft: 20,
                }}
              >
                <View
                  style={{
                    backgroundColor: COLORS.primary,
                    borderRadius: 50,
                    width: 35,
                    height: 35,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="close-outline"
                    size={24}
                    color={COLORS.white}
                  />
                </View>
              </TouchableOpacity>
              <View style={{ width: "100%" }}>
                <TouchableOpacity
                  onPress={() => {
                    setModal(false);
                    if (username !== "" && fUllName !== "" && password !== "") {
                      navigation.navigate("LoginIos");
                    }
                  }}
                  style={{
                    marginTop: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {username === "" && fUllName === "" && password === "" ? (
                    <Image
                      source={require("../assets/superApp/alertGagal.png")}
                    />
                  ) : (
                    <Image
                      source={require("../assets/superApp/alertBerhasil.png")}
                    />
                  )}
                  <Text style={{ marginVertical: 20 }}>
                    {username === "" && fUllName === "" && password === ""
                      ? "Harap Lengkapi Semua Form!"
                      : "Harap Berhasil Dilakukan!"}
                  </Text>
                  <View
                    style={{
                      backgroundColor: COLORS.primary,
                      width: 217,
                      height: 39,
                      borderRadius: 8,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: COLORS.white }}>
                      {username === "" && password === "" && fUllName === ""
                        ? "OK"
                        : "Lanjut"}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Card: {
    backgroundColor: COLORS.white,
    width: "90%",
    marginVertical: 20,
    marginLeft: 20,
    borderRadius: 16,
  },
  iOSBackdrop: {
    backgroundColor: "#000000",
    opacity: 0.3,
  },
  androidBackdrop: {
    backgroundColor: "#232f34",
    opacity: 0.32,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
