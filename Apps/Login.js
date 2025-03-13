import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
  useWindowDimensions,
  SafeAreaView,
  Platform,
} from "react-native";
import {
  TextInput,
  Checkbox,
  TouchableRipple,
  IconButton,
} from "react-native-paper";
import { GlobalStyles } from "../constants/styles";
import { useDispatch, useSelector } from "react-redux";

import { setRememberMe, setToken, setFirstLogin, setBg } from "../store/auth";
import { setProfile, setOrganization } from "../store/profile";
import { handleUpgradeLink, postAuth } from "../utils/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import Button from "../components/UI/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AlertConfirm from "../components/UI/AlertConfirm";
import { useNavigation } from "@react-navigation/core";
import { Config } from "../constants/config";
import * as LocalAuthentication from "expo-local-authentication";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { useMemo } from "react";
import { Image } from "react-native";

function Login() {
  const app_name = Config.app_name;
  const app_version = Config.app_version;
  const firstLogin = useSelector((state) => state.auth.firstLogin);
  const profile = useSelector((state) => state.profile.profile);
  const validVersion = useSelector((state) => state.auth.validVersion);

  const [isCheckedTou, setCheckedTou] = useState(true);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [isValid, setIsValid] = useState(true);
  const [IsLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [disabledUsername, setDisabledUsername] = useState(false);
  const navigation = useNavigation();
  const { height } = useWindowDimensions();

  // biometric
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  //bottomsheet insert password
  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => [50, 200], []);

  const loadingOverlay = (
    <>
      <LoadingOverlay visible={IsLoading} />
    </>
  );

  const willFocusSubscription = navigation.addListener("focus", () => {
    getProfileLogin();
    getRememberMe();
    dispatch(setBg(true));
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  });
  useEffect(() => {
    getProfileLogin();
    getRememberMe();
    dispatch(setBg(true));
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
    return willFocusSubscription;
  }, [dispatch, firstLogin]);

  async function getRememberMe() {
    setIsLoading(true);
    await AsyncStorage.getItem("rememberMe").then((data) => {
      //get rememberme
      if (data != null) {
        let result = JSON.parse(data);
        //set remember me+username
        setIsRememberMe(result?.rememberMe);
        if (firstLogin) {
          //pertama kali login, form login
          if (result?.rememberMe) {
            //jika rememberme true, set username+disabled
            setUsername(result.username);
            setPassword("");
            setDisabledUsername(true);
          } else {
            //jika rememberme false, set form kosong
            setUsername("");
            setPassword("");
          }
        } else {
          //jika setelah logout apps, bukan pertama login, set username password
          setUsername(result.username);
          setPassword(result.password);
        }
      }
    });
    setIsLoading(false);
  }
  async function getProfileLogin() {
    setIsLoading(true);
    await AsyncStorage.getItem("profileLogin").then((data) => {
      if (data != [] || data != null) {
        let result = JSON.parse(data);
        //set 1st login
        dispatch(setProfile(result));
      } else {
        dispatch(setFirstLogin(true));
      }
    });
    setIsLoading(false);
  }
  async function validasi() {
    setIsLoading(true);
    //validation
    if (!validVersion) {
      setIsLoading(false);
      Alert.alert(
        "Warning!",
        "You are using an old version of the " +
          app_name +
          ". Do you want to upgrade?",
        [
          {
            text: "Upgrade",
            onPress: () => {
              AsyncStorage.removeItem("token");
              // handleUpgradeLink();
            },
            style: "cancel",
          },
        ],
        {
          cancelable: true,
          onDismiss: () => {},
        }
      );
    } else if (username.length == 0 || password.length == 0) {
      setIsLoading(false);
      setIsValid(false);
      Alert.alert("Warning!", "Please input your credentials");
    } else if (Config.termOfUse && isCheckedTou == false) {
      setIsLoading(false);
      setIsValid(false);
      Alert.alert("Warning!", "Please read and agree the Term of Use");
    } else {
      try {
        //cek remember data
        if (isRememberMe) {
          setIsLoading(false);
          //set remember data
          AlertConfirm(
            "Confirm",
            "NIK will be shown automatically when you open Notadinas app. Agree?",
            login
          );
        } else {
          // post auth
          login();
        }
      } catch (error) {
        setIsLoading(false);
        Alert.alert(
          "Authentication failed!",
          "Please check your credentials or try again later"
        );
      }
    }
  }

  async function login() {
    try {
      setIsLoading(true);

      //validation
      if (!validVersion) {
        setIsLoading(false);
        Alert.alert(
          "Warning!",
          "You are using an old version of the " +
            app_name +
            ". Do you want to upgrade?",
          [
            {
              text: "Upgrade",
              onPress: () => {
                AsyncStorage.removeItem("token");
              },
              style: "cancel",
            },
          ],
          {
            cancelable: true,
            onDismiss: () => {},
          }
        );
      } else {
        let data = {
          rememberMe: isRememberMe,
          username: username,
          password: password,
        };
        //getauth
        // dispatch(setProfile([]));
        dispatch(setRememberMe(data));
        const response = await postAuth(data);
        // set data response
        dispatch(setToken(response.data));
        dispatch(setOrganization(response.data));
        dispatch(setProfile(null));
        setIsLoading(false);
      }
    } catch (error) {
      if (error.response.status == null && error.status == null) {
        Alert.alert("Warning!", "Please check your connection");
      } else {
        Alert.alert("Authentication failed!", "Please check your credentials");
      }
      setIsLoading(false);
    }
  }

  async function loginFingerprint() {
    //nantinya akan ada fungsi untuk fingerprint, jangan lupa buat lagi fungsi baru untuk sso
    let data = await AsyncStorage.getItem("rememberMe");
    if (data != null) {
      let result = await JSON.parse(data);
      setUsername(result.username);
      setPassword(result.password);
      setCheckedTou(true);
      if (result.username?.length !== 0 && result.password?.length !== 0) {
        // validasi();
        login();
      }
    }
  }

  async function removeRememberMe() {
    await AsyncStorage.removeItem("rememberMe");
    setIsRememberMe(false);
    setDisabledUsername(false);
    setUsername("");
    setPassword("");
  }

  async function handlerRememberMe() {
    let rememberMeAsync = false;
    let data = await AsyncStorage.getItem("rememberMe");
    if (data) {
      let result = JSON.parse(data);
      if (result != null) {
        rememberMeAsync = result.rememberMe;
      }
    }
    if (isRememberMe == true && rememberMeAsync) {
      //confirm remove saved data remember
      AlertConfirm("Confirm", "Remove saved NIK?", removeRememberMe);
    } else if (isRememberMe == true && !rememberMeAsync) {
      //unchecked remember me
      setIsRememberMe(false);
    } else {
      AsyncStorage.removeItem("rememberMe");
      //checked remember me
      setIsRememberMe(true);
    }
  }

  async function anotherNIK() {
    await AsyncStorage.removeItem("profileLogin");
    setUsername("");
    setPassword("");
    dispatch(setProfile(null));
    dispatch(setFirstLogin(true));
  }

  //FINGERPRINT

  const handleBiometricAuth = async () => {
    // Check if hardware supports biometrics
    const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

    // Fallback to default authentication method (password) if Fingerprint is not available
    if (!isBiometricAvailable) return bottomSheetModalRef.current?.present();

    // Check Biometrics types available (Fingerprint, Facial recognition, Iris recognition)
    let supportedBiometrics;
    if (isBiometricAvailable)
      supportedBiometrics =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

    // Check Biometrics are saved locally in user's device
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
    if (!savedBiometrics) return bottomSheetModalRef?.current?.present();

    // Authenticate use with Biometrics (Fingerprint, Facial recognition, Iris recognition)

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login with Biometrics",
      cancelLabel: "Cancel",
      disableDeviceFallback: true,
    });
    // Log the user in on success
    if (biometricAuth.success) validasi();
  };

  async function handlerConfirmPassword() {
    setIsLoading(true);
    //validation
    if (!validVersion) {
      setIsLoading(false);
      Alert.alert(
        "Warning!",
        "You are using an old version of the " +
          app_name +
          ". Do you want to upgrade?",
        [
          {
            text: "Upgrade",
            onPress: () => {
              AsyncStorage.removeItem("token");
            },
            style: "cancel",
          },
        ],
        {
          cancelable: true,
          onDismiss: () => {},
        }
      );
    } else if (username.length == 0 || password.length == 0) {
      setIsLoading(false);
      setIsValid(false);
      Alert.alert("Warning!", "Please input your credentials");
    } else if (confirmPassword != password) {
      setIsLoading(false);
      setIsValid(false);
      Alert.alert("Warning!", "Please check your credentials");
    } else {
      try {
        // post auth
        login();
      } catch (error) {
        setIsLoading(false);
        Alert.alert(
          "Authentication failed!",
          "Please check your credentials or try again later"
        );
      }
    }
  }

  const formLogin = (
    <>
      <View style={[styles.container]}>
        <TextInput
          style={styles.inputContainerStyle}
          label="NIK"
          value={username}
          onChangeText={setUsername}
          disabled={disabledUsername}
          left={
            <TextInput.Icon icon="at" color={GlobalStyles.colors.textBlack} />
          }
          allowFontScaling={false}
        />
        <TextInput
          style={[styles.inputContainerStyle, styles.fontSize]}
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={isPasswordSecure}
          left={
            <TextInput.Icon icon="lock" color={GlobalStyles.colors.textBlack} />
          }
          right={
            <TextInput.Icon
              icon={isPasswordSecure ? "eye" : "eye-off"}
              onPress={() =>
                isPasswordSecure
                  ? setIsPasswordSecure(false)
                  : setIsPasswordSecure(true)
              }
              forceTextInputFocus={false}
              allowFontScaling={false}
            />
          }
        />
        <View style={styles.section}>
          <Checkbox.Item
            mode="android"
            label="Remember NIK?"
            status={isRememberMe ? "checked" : "unchecked"}
            color={GlobalStyles.colors.tertiery}
            onPress={handlerRememberMe}
            position="leading"
            labelStyle={styles.labelCheckbox}
          />
        </View>
        {Config.termOfUse && (
          <View style={styles.center}>
            <View
              style={[
                styles.section,
                {
                  justifyContent: "center",
                },
              ]}
            >
              <TouchableRipple onPress={() => setCheckedTou(!isCheckedTou)}>
                <Checkbox.Item
                  mode="android"
                  position="leading"
                  status={isCheckedTou ? "checked" : "unchecked"}
                  onPress={() => setCheckedTou(!isCheckedTou)}
                  color={
                    isCheckedTou ? GlobalStyles.colors.tertiery : undefined
                  }
                />
              </TouchableRipple>
              <Text style={styles.label}>I have read and agree to the </Text>
              <TouchableRipple
                onPress={() => {
                  navigation.navigate("TermOfUse", {
                    title: "Term Of Use",
                  });
                }}
              >
                <Text style={styles.link}>Term of Use</Text>
              </TouchableRipple>
            </View>
          </View>
        )}
        <Button style={styles.button} onPress={validasi}>
          <Text style={styles.buttonText}>Sign In</Text>
        </Button>
      </View>
    </>
  );
  const loginAsUser = (
    <>
      <View style={styles.containerLogin2}>
        <View style={styles.containerButton}>
          <Button style={styles.button} onPress={handleBiometricAuth}>
            <Text style={styles.buttonText}>
              Sign In as {profile?.fullname}
            </Text>
          </Button>
        </View>
        <View style={styles.containerButton}>
          <Button style={styles.buttonAnother} onPress={anotherNIK}>
            <Text style={styles.buttonText}>Use Another NIK</Text>
          </Button>
        </View>
      </View>
    </>
  );

  const loginSSO = (
    <>
      <View style={styles.containerSSO}>
        <View style={styles.containerButton}>
          <Button style={styles.button} onPress={loginFingerprint}>
            Login SSO
          </Button>
        </View>
      </View>
    </>
  );
  return (
    <>
      <ScrollView
        contentContainerStyle={styles.screen}
        keyboardShouldPersistTaps={"handled"}
      >
        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior="position"
          keyboardVerticalOffset={-150}
        >
          <View style={[styles.login, { height: "100%" }]}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: 100,
              }}
            ></View>
            <View style={{}}>
              {loadingOverlay}
              {!Config.loginSSO && firstLogin && formLogin}
              {!Config.loginSSO && !firstLogin && loginAsUser}
              {Config.loginSSO && loginSSO}
            </View>
          </View>
        </KeyboardAvoidingView>

        <BottomSheetModalProvider>
          <SafeAreaView>
            <View>
              <BottomSheetModal
                ref={bottomSheetModalRef}
                index={1}
                snapPoints={snapPoints}
                keyboardBehavior={
                  Platform?.OS == "android" ? "fillParent" : "interactive"
                }
                keyboardBlurBehavior="restore"
                android_keyboardInputMode="adjust"
              >
                <View style={styles.contentContainer}>
                  <View style={{ flexDirection: "row" }}>
                    <Text>Please enter your password</Text>
                  </View>
                  <BottomSheetTextInput
                    secureTextEntry={isPasswordSecure}
                    style={[styles.inputContainerStyle, styles.fontSize]}
                    label="Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    autoFocus
                  />
                  <Button
                    mode="contained"
                    style={[
                      styles.buttonAnother,
                      {
                        backgroundColor: GlobalStyles.colors.tertiery,
                        marginBottom: 16,
                      },
                    ]}
                    onPress={() => handlerConfirmPassword()}
                  >
                    Ok
                  </Button>
                  <Button
                    mode="contained"
                    style={[
                      styles.buttonAnother,
                      {
                        backgroundColor: GlobalStyles.colors.gray500,
                        marginBottom: 16,
                      },
                    ]}
                    onPress={() => {
                      bottomSheetModalRef.current?.dismiss();
                      setPassword("");
                    }}
                  >
                    Cancel
                  </Button>
                </View>
              </BottomSheetModal>
            </View>
          </SafeAreaView>
        </BottomSheetModalProvider>
        <View style={styles.footer}>
          <Text style={styles.version}>{app_version}</Text>
        </View>
      </ScrollView>
    </>
  );
}

export default Login;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: "column",
    // alignItems: "flex-start",
    backgroundColor: "white",
  },
  keyboard: {
    flex: 1,
  },
  rootScreen: {
    position: "absolute",
    top: -25,
    width: "100%",
    height: 380,
    backgroundColor: "red",
  },
  login: {
    flexDirection: "column",
    justifyContent: "center",
  },
  backgroundImage: {
    width: 200,
    height: 200,
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  container: {
    margin: 16,
  },
  containerSSO: {
    bottom: 50,
    margin: 30,
  },
  containerLogin2: {
    bottom: 100,
    margin: 16,
  },
  containerTextInput: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#fff",
  },
  iconRight: {
    position: "absolute",
    right: 0,
    padding: 10,
  },
  input: {
    backgroundColor: GlobalStyles.colors.secondary,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 50,
    fontSize: GlobalStyles.font.lg,
    marginBottom: 14,
    width: "100%",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputContainerStyle: {
    margin: 8,
    backgroundColor: GlobalStyles.colors.backgroundInput,
    borderRadius: 4,
  },
  inputIcon: {
    paddingRight: 50,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  labelCheckbox: {
    fontSize: GlobalStyles.font.md,
  },
  label: {
    marginLeft: -10,
    fontSize: GlobalStyles.font.md,
  },
  link: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontSize: GlobalStyles.font.md,
  },
  containerButton: {
    marginVertical: 8,
  },
  button: {
    borderRadius: 8,
    backgroundColor: GlobalStyles.colors.primary,
    color: GlobalStyles.colors.textWhite,
    marginVertical: 8,
  },
  buttonText: {
    fontSize: GlobalStyles.font.lg,
    fontWeight: "bold",
  },
  buttonAnother: {
    borderRadius: 8,
    backgroundColor: GlobalStyles.colors.gray500,
    color: GlobalStyles.colors.textWhite,
  },
  center: {
    alignItems: "center",
  },
  spinnerTextStyle: {
    color: GlobalStyles.colors.blue,
  },
  footer: {
    position: "absolute",
    alignItems: "center",
    bottom: 15,
    left: 0,
    right: 0,
  },
  version: {
    fontSize: 12,
  },
});
