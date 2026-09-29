import React, { useEffect, useMemo, useState, createContext, useContext } from "react";
import {
  ActivityIndicator, Alert, FlatList, KeyboardAvoidingView, Platform, Pressable,
  SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CASTAWAYS, SCORING, SEASON, scoreCastaway } from "./src/data/castaways";
import {
  MANAGERS, MATCHWEEKS, ROSTERS, SEED_CHAT, SEED_TRADES,
  fixtureResult, rosterScore, table as buildTable,
} from "./src/data/league";

const Auth = createContext(null);
const Game = createContext(null);
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const C = { bg: "#0B1F17", card: "#12281F", line: "#1E3D30", gold: "#E8C547", sand: "#F4E7C5", mute: "#8AA396" };

const initials = (n) => n.split(" ").filter((p) => p !== "An").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
const mgr = (id) => MANAGERS.find((m) => m.id === id)?.name || id;

export default function App() {
  const [boot, setBoot] = useState(true);
  const [user, setUser] = useState(null);
  const [roster, setRoster] = useState(ROSTERS.you);
  const [trades, setTrades] = useState(SEED_TRADES);
  const [chat, setChat] = useState(SEED_CHAT);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem("lastout.user");
      if (raw) setUser(JSON.parse(raw));
      const r = await AsyncStorage.getItem("lastout.roster");
      if (r) setRoster(JSON.parse(r));
      const t = await AsyncStorage.getItem("lastout.trades");
      if (t) setTrades(JSON.parse(t));
      const c = await AsyncStorage.getItem("lastout.chat");
      if (c) setChat(JSON.parse(c));
      setBoot(false);
    })();
  }, []);

  const login = async (email, password, displayName) => {
    if (!email || !password) return Alert.alert("Login", "Email and password required.");
    const u = { email: email.trim().toLowerCase(), name: displayName || email.split("@")[0], id: "you" };
    setUser(u);
    await AsyncStorage.setItem("lastout.user", JSON.stringify(u));
  };
  const logout = async () => { setUser(null); await AsyncStorage.removeItem("lastout.user"); };
  const persistRoster = async (next) => { setRoster(next); await AsyncStorage.setItem("lastout.roster", JSON.stringify(next)); };
  const sendChat = async (text) => {
    const next = [...chat, { id: "c" + Date.now(), user: user?.name || "You", text, ts: "Just now" }];
    setChat(next); await AsyncStorage.setItem("lastout.chat", JSON.stringify(next));
  };
  const proposeTrade = async (offerId, askId, toManager) => {
    const next = [{ id: "t" + Date.now(), from: "you", to: toManager, offer: [offerId], ask: [askId], status: "open", note: "Proposed from the app" }, ...trades];
    setTrades(next); await AsyncStorage.setItem("lastout.trades", JSON.stringify(next));
  };
  const acceptTrade = async (trade) => {
    let mine = [...roster];
    if (trade.to === "you") mine = [...mine.filter((id) => !trade.ask.includes(id)), ...trade.offer];
    else mine = [...mine.filter((id) => !trade.offer.includes(id)), ...trade.ask];
    await persistRoster(mine);
    const next = trades.map((t) => (t.id === trade.id ? { ...t, status: "accepted" } : t));
    setTrades(next); await AsyncStorage.setItem("lastout.trades", JSON.stringify(next));
  };

  if (boot) return <View style={[s.center, { backgroundColor: C.bg }]}><ActivityIndicator color={C.gold} /><Text style={s.mute}>Lighting torches…</Text></View>;

  return (
    <Auth.Provider value={{ user, login, logout }}>
      <Game.Provider value={{ roster, trades, proposeTrade, acceptTrade, chat, sendChat }}>
        <NavigationContainer theme={{ ...DarkTheme, colors: { ...DarkTheme.colors, background: C.bg, card: C.bg, text: C.sand } }}>
          <StatusBar barStyle="light-content" />
          {user ? <Tabs /> : <AuthStack />}
        </NavigationContainer>
      </Game.Provider>
    </Auth.Provider>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}

function Tabs() {
  const opt = { headerStyle: { backgroundColor: C.bg }, headerTintColor: C.sand, tabBarStyle: { backgroundColor: "#081610", borderTopColor: C.line }, tabBarActiveTintColor: C.gold, tabBarInactiveTintColor: C.mute };
  return (
    <Tab.Navigator screenOptions={opt}>
      <Tab.Screen name="Island" component={Home} />
      <Tab.Screen name="Cast" component={CastStack} options={{ headerShown: false }} />
      <Tab.Screen name="Roster" component={Roster} />
      <Tab.Screen name="Table" component={Table} />
      <Tab.Screen name="Chat" component={Chat} />
    </Tab.Navigator>
  );
}

function CastStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: C.bg }, headerTintColor: C.sand }}>
      <Stack.Screen name="Castaways" component={CastList} />
      <Stack.Screen name="Detail" component={Detail} />
    </Stack.Navigator>
  );
}

function Login({ navigation }) {
  const { login } = useContext(Auth);
  const [email, setEmail] = useState("tanner@lastout.app");
  const [password, setPassword] = useState("torch123");
  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.auth}>
          <Text style={s.kicker}>SURVIVOR 51 · OPEN ERA</Text>
          <Text style={s.h1}>Last Out</Text>
          <Text style={s.sub}>Aaliyah Puglia is gone. Draft who lasts. Score idols. Trade picks. Beat the table.</Text>
          <TextInput style={s.input} placeholder="Email" placeholderTextColor={C.mute} autoCapitalize="none" value={email} onChangeText={setEmail} />
          <TextInput style={s.input} placeholder="Password" placeholderTextColor={C.mute} secureTextEntry value={password} onChangeText={setPassword} />
          <Pressable style={s.btn} onPress={() => login(email, password)}><Text style={s.btnText}>Enter the island</Text></Pressable>
          <Pressable onPress={() => navigation.navigate("Register")}><Text style={s.link}>Need a tribe? Create an account</Text></Pressable>
          <Text style={s.fine}>iOS + Android via Expo. Demo login is prefilled.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Register({ navigation }) {
  const { login } = useContext(Auth);
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  return (
    <SafeAreaView style={s.safe}>
      <View style={s.auth}>
        <Text style={s.h1}>Join Last Out</Text>
        <TextInput style={s.input} placeholder="Display name" placeholderTextColor={C.mute} value={name} onChangeText={setName} />
        <TextInput style={s.input} placeholder="Email" placeholderTextColor={C.mute} autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput style={s.input} placeholder="Password" placeholderTextColor={C.mute} secureTextEntry value={password} onChangeText={setPassword} />
        <Pressable style={s.btn} onPress={() => login(email, password, name)}><Text style={s.btnText}>Create account</Text></Pressable>
        <Pressable onPress={() => navigation.goBack()}><Text style={s.link}>Already have a torch? Sign in</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}
