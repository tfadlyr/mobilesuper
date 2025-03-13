import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { COLORS } from "../config/SuperAppps";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export const LoginIos = () => {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(true);

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
          Login
        </Text>
        <Text
          style={{
            color: COLORS.primary,
            marginTop: 10,
          }}
        >
          Mohon melengkapi informasi dibawah ini untuk masuk.
        </Text>
        <View style={{ width: "100%", marginTop: 40 }}>
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
            navigation.navigate("PortalIos");
          }}
        >
          <Text style={{ color: COLORS.white }}>Masuk</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
