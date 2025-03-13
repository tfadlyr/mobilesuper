import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { Provider, useDispatch } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { store } from "./store/store";
import { GlobalStyles } from "./constants/styles";
// import AppNavigator from "./screen/AppNavigator";
import AppNavigator from "./Apps/Korespondensi/AppNavigator";
import { Host } from "react-native-portalize";
import { StatusBar, View, Text } from "react-native";
import { COLORS } from "./config/SuperAppps";
import { Platform } from "react-native";
import { useEffect } from "react";
import { DeviceType, getDeviceTypeAsync } from "expo-device";
import { setDevice } from "./store/Apps";
import { LogLevel, OneSignal } from "react-native-onesignal";
import Constants from "expo-constants";
import { setDataNotif } from "./store/pushnotif";

// OneSignal.setAppId(Constants.manifest.extra.oneSignalAppId);

// // promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
// // We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
// OneSignal.promptForPushNotificationsWithUserResponse();

OneSignal.Debug.setLogLevel(LogLevel.Verbose);
OneSignal.initialize("cf6dc0fa-3c36-4f98-a9a3-c760a0efa027");

// Also need enable notifications to complete OneSignal setup
OneSignal.Notifications.requestPermission(true);

export default function App() {
  // const dispatch = useDispatch();

  const theme = {
    ...DefaultTheme,
    roundness: 2,
    version: 3,
    colors: {
      ...DefaultTheme.colors,
      primary: GlobalStyles.colors.primary,
      secondary: GlobalStyles.colors.secondary,
      tertiary: GlobalStyles.colors.tertiery,
      secondaryContainer: GlobalStyles.colors.browhite,
    },
  };

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;

  return (
    <>
      <SafeAreaProvider>
        <Host>
          <PaperProvider theme={theme}>
            <Provider store={store}>
              {/* <Wrapper> */}
              <AppNavigator />
              {/* </Wrapper> */}
            </Provider>
          </PaperProvider>
        </Host>
      </SafeAreaProvider>
    </>
  );
}
