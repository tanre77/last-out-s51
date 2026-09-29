import React, { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CAST, DEFAULT_ROSTERS, MANAGERS, pts } from "./src/data";

const Tab = createBottomTabNavigator();
const C = { bg: "#0B1F17", card: "#12281F", gold: "#E8C547", sand: "#F4E7C5", mute: "#8AA396", line: "#1E3D30" };
const byId = Object.fromEntries(CAST.map((x) => [x.id, x]));
const nameOf = (id) => MANAGERS.find((m) => m.id === id)?.name || id;

const SEED_CHAT = [
  { id: "c1", user: "Come On In", text: "Torch is snuffed on Aaliyah. Draft board is LIVE. Who lasts?", ts: "Wed 10:12 PM" },
  { id: "c3", user: "You", text: "Does anybody who has Thein A willing to make a trade? I'll give you my third pick this season and 2nd overall pick for next season", ts: "Tue 4:58 PM" }
];
const SEED_TRADES = [
  { id: "t1", from: "probst", to: "you", offer: ["thienan"], ask: ["jenna"], status: "open", note: "Take Thien An instead of Jenna?" },
  { id: "t2", from: "you", to: "probst", offer: ["brady"], ask: ["thienan"], status: "open", note: "3rd this season + 2nd overall next season." }
];

function rosterScore(rosters, id) {
  return (rosters[id] || []).reduce((n, pid) => n + (byId[pid] ? pts(byId[pid]) : 0), 0);
}

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("tanner@lastout.app");
  const [password, setPassword] = useState("torch123");
  const [display, setDisplay] = useState("");
  const [rosters, setRosters] = useState(DEFAULT_ROSTERS);
  const [trades, setTrades] = useState(SEED_TRADES);
  const [chat, setChat] = useState(SEED_CHAT);
  const [draft, setDraft] = useState("");
  const ctx = { user, rosters, trades, chat, setRosters, setTrades, setChat, draft, setDraft, logout: () => setUser(null) };

  if (!user) {
    return (
      <SafeAreaView style={s.safe}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={s.kicker}>SURVIVOR 51 · ANDROID</Text>
          <Text style={s.h1}>Last Out</Text>
          <TextInput style={s.input} value={email} onChangeText={setEmail} autoCapitalize="none" placeholder="Email" placeholderTextColor={C.mute} />
          <TextInput style={s.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" placeholderTextColor={C.mute} />
          <TextInput style={s.input} value={display} onChangeText={setDisplay} placeholder="Manager name" placeholderTextColor={C.mute} />
          <Pressable style={s.btn} onPress={() => { if (!email || !password) return Alert.alert("Login required"); setUser(display || email.split("@")[0]); }}>
            <Text style={s.btnText}>Enter the island</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer theme={{ ...DarkTheme, colors: { ...DarkTheme.colors, background: C.bg, card: C.bg, text: C.sand } }}>
      <Tab.Navigator screenOptions={{ headerStyle: { backgroundColor: C.bg }, headerTintColor: C.sand, tabBarStyle: { backgroundColor: "#081610" }, tabBarActiveTintColor: C.gold }}>
        <Tab.Screen name="Island">{() => <Island ctx={ctx} />}</Tab.Screen>
        <Tab.Screen name="Cast">{() => <Cast />}</Tab.Screen>
        <Tab.Screen name="Roster">{() => <Roster ctx={ctx} />}</Tab.Screen>
        <Tab.Screen name="Table">{() => <Table rosters={rosters} />}</Tab.Screen>
        <Tab.Screen name="Chat">{() => <ChatScreen ctx={ctx} />}</Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function Island({ ctx }) {
  const leaders = [...CAST].sort((a, b) => pts(b) - pts(a)).slice(0, 5);
  return (
    <ScrollView style={s.safe} contentContainerStyle={{ padding: 16 }}>
      <Text style={s.h1}>Who lasts?</Text>
      <Text style={s.sub}>Aaliyah out 6-2. Rob has the idol. Signed in as {ctx.user}.</Text>
      <Text style={s.section}>Your pts {rosterScore(ctx.rosters, "you")}</Text>
      {leaders.map((c) => (<View key={c.id} style={s.row}><Text style={s.name}>{c.name}</Text><Text style={s.pts}>{pts(c)}</Text></View>))}
      <Pressable style={s.ghost} onPress={ctx.logout}><Text style={{ color: C.mute }}>Log out</Text></Pressable>
    </ScrollView>
  );
}

function Cast() {
  return (
    <FlatList style={s.safe} data={CAST} keyExtractor={(c) => c.id} contentContainerStyle={{ padding: 16 }} renderItem={({ item }) => (
      <View style={s.row}><View style={{ flex: 1 }}><Text style={s.name}>{item.name} · {item.tribe}</Text><Text style={s.mute}>{item.job}</Text></View><Text style={s.pts}>{pts(item)}</Text></View>
    )} />
  );
}

function Roster({ ctx }) {
  const mine = (ctx.rosters.you || []).map((id) => byId[id]).filter(Boolean);
  const accept = (t) => {
    const next = { ...ctx.rosters };
    next[t.from] = (next[t.from] || []).filter((id) => !t.offer.includes(id)).concat(t.ask);
    next[t.to] = (next[t.to] || []).filter((id) => !t.ask.includes(id)).concat(t.offer);
    ctx.setRosters(next);
    ctx.setTrades(ctx.trades.map((x) => x.id === t.id ? { ...x, status: "accepted" } : x));
  };
  return (
    <ScrollView style={s.safe} contentContainerStyle={{ padding: 16 }}>
      <Text style={s.h1}>Squad · {rosterScore(ctx.rosters, "you")} pts</Text>
      {mine.map((c) => <Text key={c.id} style={s.name}>{c.name} · {pts(c)}</Text>)}
      <Text style={s.section}>Inbox</Text>
      {ctx.trades.map((t) => (
        <View key={t.id} style={s.card}>
          <Text style={s.name}>{nameOf(t.from)} → {nameOf(t.to)} · {t.status}</Text>
          <Text style={s.mute}>{t.note}</Text>
          {t.status === "open" && t.to === "you" ? <Pressable style={s.btn} onPress={() => accept(t)}><Text style={s.btnText}>Accept</Text></Pressable> : null}
        </View>
      ))}
    </ScrollView>
  );
}

function Table({ rosters }) {
  const rows = useMemo(() => {
    const map = Object.fromEntries(MANAGERS.map((m) => [m.id, { ...m, w: 0, d: 0, l: 0, pts: 0 }]));
    [["you","probst"],["buffalo","cirie"],["fire","idol"],["outwit","snuff"]].forEach(([a, b]) => {
      const sa = rosterScore(rosters, a), sb = rosterScore(rosters, b);
      if (sa > sb) { map[a].w++; map[a].pts += 3; map[b].l++; }
      else if (sb > sa) { map[b].w++; map[b].pts += 3; map[a].l++; }
      else { map[a].d++; map[b].d++; map[a].pts++; map[b].pts++; }
    });
    return Object.values(map).sort((x, y) => y.pts - x.pts);
  }, [rosters]);
  return (
    <ScrollView style={s.safe} contentContainerStyle={{ padding: 16 }}>
      <Text style={s.h1}>EPL table</Text>
      {rows.map((r, i) => <View key={r.id} style={s.row}><Text style={[s.name, { flex: 1 }]}>{i + 1}. {r.name}</Text><Text style={s.pts}>{r.pts}</Text></View>)}
    </ScrollView>
  );
}

function ChatScreen({ ctx }) {
  return (
    <SafeAreaView style={s.safe}>
      <FlatList data={ctx.chat} keyExtractor={(m) => m.id} contentContainerStyle={{ padding: 16 }} renderItem={({ item }) => (
        <View style={s.card}><Text style={s.kicker}>{item.user}</Text><Text style={s.name}>{item.text}</Text></View>
      )} />
      <View style={{ flexDirection: "row", padding: 12 }}>
        <TextInput style={[s.input, { flex: 1 }]} value={ctx.draft} onChangeText={ctx.setDraft} placeholder="Talk strategy" placeholderTextColor={C.mute} />
        <Pressable style={s.btn} onPress={() => { if (!ctx.draft.trim()) return; ctx.setChat([...ctx.chat, { id: "c" + Date.now(), user: ctx.user || "You", text: ctx.draft.trim(), ts: "Just now" }]); ctx.setDraft(""); }}><Text style={s.btnText}>Send</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  kicker: { color: C.gold, fontWeight: "700", fontSize: 11 },
  h1: { color: C.sand, fontSize: 28, fontWeight: "800", marginTop: 6 },
  sub: { color: C.mute, marginVertical: 8 },
  input: { backgroundColor: C.card, borderColor: C.line, borderWidth: 1, borderRadius: 12, color: C.sand, padding: 12, marginBottom: 10 },
  btn: { backgroundColor: C.gold, borderRadius: 12, padding: 14, alignItems: "center", marginTop: 8 },
  btnText: { color: "#111", fontWeight: "800" },
  section: { color: C.sand, fontWeight: "800", fontSize: 18, marginTop: 18 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomColor: C.line, borderBottomWidth: 1 },
  name: { color: C.sand, fontWeight: "700" },
  mute: { color: C.mute, fontSize: 13 },
  pts: { color: C.gold, fontWeight: "800", fontSize: 18, marginLeft: 8 },
  card: { backgroundColor: C.card, borderRadius: 12, padding: 12, marginTop: 10 },
  ghost: { borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 12, alignItems: "center", marginTop: 20 }
});
