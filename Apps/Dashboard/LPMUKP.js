import React, { useEffect, useState } from "react";
import { Dimensions, Platform, Text, View } from "react-native";
import { nde_api } from "../../utils/api.config";

import {
  COLORS,
  FONTWEIGHT,
  PADDING,
  fontSizeResponsive,
} from "../../config/SuperAppps";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import WebView from "react-native-webview";

export const LPMUKP = () => {
  const navigation = useNavigation();

  const { device } = useSelector((state) => state.apps);
  const [first, setfirst] = useState(false);
  let webviewRef = null;

  async function createAuthToken() {
    const baseServerUrl = "https://portal-dss.kkp.go.id";
    const libraryName = "MicroStrategyLibrary";

    // Make a call to REST API to log the user in, if there is not a valid authToken
    const options = {
      method: "POST",
      credentials: "include", // Including cookie
      mode: "cors", // Setting as cors mode for cross origin
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        loginMode: 1, // 1 means Standard login
        // loginMode: 16, // 16 means LDAP login
        username: "Administrator", // use guest / no password to test
        password: "r4h4514!#",
      }),
    };
    return fetch(baseServerUrl + "/" + libraryName + "/api/auth/login", options)
      .then((response) => {
        if (response.ok) {
          return response.headers.get("Set-cookie");
        } else response.json().then((json) => console.log(json));
      })
      .catch((error) =>
        console.error("Failed Standard Login with error:", error)
      );
  }

  const handleNavState = (params) => {
    if (!first) createAuthToken();
  };

  const source = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <script type="text/javascript" src="https://app.daviz.id/MicroStrategyLibrary/javascript/embeddinglib.js"></script>
    <script type="text/javascript" src="https://cdn-script.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
</head>

<body>
    <button onclick="handleRefresh()">Refresh</button>
    <div id='embedding-dossier-container' style="width: 100%; height: 100vh;"></div>
</body>

<script>
    const baseServerUrl = 'https://app.daviz.id';
    const libraryName = 'MicroStrategyLibrary';

  
    async function runCode() {
        // https://{env-url}/{libraryName}/app/{projectId}/{dossierId}

      
        let url =
            baseServerUrl +
            '/' +
            libraryName +
            '/app/A18F884B4D0342672AFB72AAF345697F/EE35681B436699C45761CBB2BC5D276F/publish';

        let dossier; // Variable to store the dashboard created. Used by Event Handler do not remove!
        let config; // Variable to store the configuration settings for dashboard.
        config = {
            url: url,
            placeholder: document.getElementById('embedding-dossier-container'),
            containerHeight: '600px',
            containerWidth: '800px',
            customAuthenticationType:
                microstrategy.dossier.CustomAuthenticationType.AUTH_TOKEN,
            enableCustomAuthentication: true,
            enableResponsive: true,
            getLoginToken: login(),
            navigationBar: {
                enabled: false,
            },
        };
        // For more details on configuration properties, see https://www2.microstrategy.com/producthelp/Current/EmbeddingSDK/Content/topics/dossier_properties.htm

        // Embed the dashboard with the configuration settings
        try {
            const placeholderDiv = document.getElementById(
                'embedding-dossier-container',
            );
            microstrategy.dossier.create({
                placeholder: placeholderDiv,
                url: url,
                config: config,
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function getAuthToken() {

        const options = {
            method: 'GET',
            credentials: 'include', // Including cookie
            mode: 'cors', // Setting as cors mode for cross origin
            headers: { 'content-type': 'application/json' },
        };

        alert(JSON.stringify(options))
        return await fetch(
            baseServerUrl + '/' + libraryName + '/api/auth/token',
            options,
        )
            .then((response) => {
                if (response.ok) return response.headers.get('x-mstr-authtoken');
                else response.json().then((json) => {
                    if (json.code === 'ERR009') console.log('gg')
                });
            })
            .catch((error) =>
                console.error('Failed to retrieve authToken with error:', error),
            );
    }

    // Create new authToken
    async function createAuthToken() {
        // Make a call to REST API to log the user in, if there is not a valid authToken
        const options = {
            method: 'POST',
            credentials: 'include', // Including cookie
            mode: 'cors', // Setting as cors mode for cross origin
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                loginMode: 1, // 1 means Standard login
                // loginMode: 16, // 16 means LDAP login
                username: 'Administrator', // use guest / no password to test
                password: 'r4h4514!#',
            }),
        };
        return fetch(baseServerUrl + '/' + libraryName + '/api/auth/login', options)
            .then((response) => {
                if (response.ok) {  
                    runCode()
                    return response.headers.get('x-mstr-authtoken');
                } else response.json().then((json) => console.log(json));
            })
            .catch((error) =>
                console.error('Failed Standard Login with error:', error),
            );
    }
    
    // Reuse login session. If not found, create a new authToken.
    async function login() {
        let authToken = await getAuthToken().catch((error) => console.error(error));
        // If the authToken is available, return it
        if (!!authToken) {
            console.log('An existing login session has been found, logging in');
            return authToken;
        }
        return await createAuthToken();
    }

    runCode()
</script>
</html>
    `;
  return (
    <View style={{ width: "100%", height: "100%" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: COLORS.primary,
          height: 80,
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            borderRadius: 20,
            width: device === "tablet" ? 40 : 28,
            height: device === "tablet" ? 40 : 28,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
          }}
        >
          <TouchableOpacity style={{}} onPress={() => navigation.goBack()}>
            <Ionicons
              name="chevron-back-outline"
              size={device === "tablet" ? 40 : 24}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: "center", marginRight: 50 }}>
          <Text
            style={{
              fontSize: fontSizeResponsive("H1", device),
              fontWeight: 600,
              color: COLORS.white,
            }}
          >
            LPMUKP
          </Text>
        </View>
      </View>
      <View style={{ height: "90%", width: "100%", padding: 10 }}>
        {Platform.OS === "ios" ? (
          <WebView
            originWhitelist={["*"]}
            source={{
              uri: "https://portal.kkp.go.id/assets/dashboardExt/DLPMUKP2/index.html",
              headers: {
                Cookie: first,
              },
            }}
            webviewDebuggingEnabled={true}
            style={{ flex: 1 }}
            injectedJavaScriptBeforeContentLoaded={`document.cookie=${createAuthToken()}`}
            incognito={true}
            domStorageEnabled={true}
            onNavigationStateChange={handleNavState}
            sharedCookiesEnabled={true}
            thirdPartyCookiesEnabled={true}
            textZoom={100}
            androidLayerType={"hardware"}
          />
        ) : (
          <WebView
            originWhitelist={["*"]}
            source={{
              uri: "https://portal.kkp.go.id/assets/dashboardExt/DLPMUKP2/index.html",
            }}
            style={{ flex: 1 }}
            allowFileAccess={true}
            mixedContentMode={"always"}
            allowUniversalAccessFromFileURLs={true}
            scalesPageToFit={false}
            incognito={true}
            pullToRefreshEnabled={true}
            textZoom={100}
            androidLayerType={"hardware"}
          />
        )}

        <Text style={{ color: COLORS.primary }}>
          *) Gunakan 2 jari untuk menyesuaikan zoom
        </Text>
      </View>
    </View>
  );
};
