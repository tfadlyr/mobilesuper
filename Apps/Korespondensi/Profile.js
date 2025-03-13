import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { COLORS } from "../../config/SuperAppps";
import { useSelector } from "react-redux";
import { nde_api } from "../../utils/api.config";
import { headerToken } from "../../utils/http";
import { Alert } from "react-native";
import { Config } from "../../constants/config";

export const Profile = () => {
  const [errorAvatarProfile, setErrorAvatarProfile] = useState(false);
  const profile = useSelector((state) => state.profile);
  let header = {};
  async function getHeader() {
    try {
      header = await headerToken();
    } catch (error) {
      Alert.alert("Warning!", "Get Header not working!");
    }
  }
  useEffect(() => {
    getHeader();
  }, []);
  return (
    <View style={{ flex: 1, padding: 25 }}>
      <View
        style={{
          borderRadius: 15,
          backgroundColor: COLORS.white,
          gap: 10,
        }}
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          {/* <Image
            source={require("../../assets/superApp/Card-Background-Blue.png")}
            style={{
              width: "100%",
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            }}
          /> */}
          <View style={{ alignItems: "center", gap: 10, position: "absolute" }}>
            {errorAvatarProfile && (
              <Image
                source={Config.avatar}
                style={{
                  width: 75,
                  height: 75,
                  borderRadius: 36,
                  borderWidth: 2,
                  borderColor: COLORS.white,
                }}
              />
            )}
            {!errorAvatarProfile && (
              <Image
                source={{
                  uri: nde_api.baseurl + profile?.profile?.avatar[0],
                  method: "GET",
                  headers: header,
                }}
                onError={(e) => setErrorAvatarProfile(true)}
                style={{
                  width: 75,
                  height: 75,
                  borderRadius: 36,
                  borderWidth: 2,
                  borderColor: COLORS.white,
                }}
              />
            )}
            <Text
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: COLORS.white,
                textAlign: "center",
              }}
            >
              {profile?.profile?.fullname?.split("/")[0]}
            </Text>
            {profile?.title?.map((data) => (
              <Text
                style={{ fontSize: 13, fontWeight: 400, color: COLORS.white }}
              >
                {data?.name}
              </Text>
            ))}
          </View>
        </View>
        <View style={{ gap: 20, padding: 25 }}>
          <View>
            <Text style={{ fontSize: 13, fontWeight: 400 }}>NIP</Text>
            <Text style={{ fontSize: 13, fontWeight: 600 }}>
              {profile?.profile?.nik}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 13, fontWeight: 400 }}>Jabatan</Text>
            {profile?.profile?.title?.length != 0 &&
              profile?.profile?.title?.map((data) => (
                <Text style={{ fontSize: 13, fontWeight: 600 }}>
                  {data?.name}
                </Text>
              ))}
            {profile?.profile?.title?.length == 0 && (
              <Text style={{ fontSize: 13, fontWeight: 600 }}>-</Text>
            )}
          </View>
          <View>
            <Text style={{ fontSize: 13, fontWeight: 400 }}>Departemen</Text>
            <Text style={{ fontSize: 13, fontWeight: 600 }}>
              {profile?.profile?.department}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 13, fontWeight: 400 }}>Divisi</Text>
            <Text style={{ fontSize: 13, fontWeight: 600 }}>
              {profile?.profile?.division}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 13, fontWeight: 400 }}>Organisasi</Text>
            <Text style={{ fontSize: 13, fontWeight: 600 }}>
              {profile?.profile?.organization}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
