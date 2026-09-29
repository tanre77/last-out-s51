import React from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { GAME_HTML } from "./gameHtml";

export default function App() {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1F17" />
      <WebView
        originWhitelist={["*"]}
        source={{ html: GAME_HTML }}
        style={styles.web}
        javaScriptEnabled
        domStorageEnabled
        setSupportMultipleWindows={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0B1F17" },
  web: { flex: 1, backgroundColor: "#0B1F17" },
});
