import React, { useContext, useMemo, useState } from "react";
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View, StyleSheet } from "react-native";
import { CASTAWAYS, SCORING, SEASON, scoreCastaway } from "./data/castaways";
import { MANAGERS, MATCHWEEKS, ROSTERS, fixtureResult, rosterScore, table as buildTable } from "./data/league";

export const C = { bg: "#0B1F17", card: "#12281F", line: "#1E3D30", gold: "#E8C547", sand: "#F4E7C5", mute: "#8AA396" };
const initials = (n) => n.split(" ").filter((p) => p !== "An").slice(0, 2).map((p) => p[0]).join("").toUpperCase();
const mgrName = (id) => MANAGERS.find((m) => m.id === id)?.name || id;

export function makeScreens(Auth, Game) {
  function Stat({ label, value }) {
    return <View style={s.stat}><Text style={s.statVal}>{value}</Text><Text style={s.mute}>{label}</Text></View>;
  }
  function Av({ c, large }) {
    return (
      <View style={[s.av, large && s.avLg, { backgroundColor: c.tribe === "Toka" ? "#5A4708" : "#3A2A5C", marginRight: large ? 0 : 12, marginBottom: large ? 12 : 0 }]}>
        <Text style={[s.avText, large && { fontSize: 28 }]}>{initials(c.name)}</Text>
      </View>
    );
  }
  function Home() {
    const { user, logout } = useContext(Auth);
    const { roster } = useContext(Game);
    const standings = useMemo(() => buildTable(), [roster]);
    const you = standings.find((r) => r.id === "you");
    const ranked = [...CASTAWAYS].sort((a, b) => scoreCastaway(b) - scoreCastaway(a));
    return (
      <ScrollView style={s.safe} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={s.kicker}>AFTER THE FIRST BOOT</Text>
        <Text style={s.h1}>Who gets knocked out last?</Text>
        <Text style={s.sub}>Episode 1 is in. {SEASON.firstBoot.name} is out. {CASTAWAYS.length} remain. Next: {SEASON.nextEpisode.title}.</Text>
        <View style={s.card}>
          <Text style={s.cardTitle}>First torch snuffed</Text>
          <Text style={s.name}>Aaliyah Puglia · 24 · Chef</Text>
          <Text style={s.body}>Toka lost immunity. Live Tribal. Both Aaliyah and Jenna played Shot in the Dark — neither safe. Voted out 6-2 on Day 3.</Text>
        </View>
        <View style={s.row}>
          <Stat label="Your pts" value={String(rosterScore("you"))} />
          <Stat label="Table" value={you ? `${standings.indexOf(you) + 1}th` : "-"} />
          <Stat label="Picks" value={String(roster.length)} />
        </View>
        <Text style={s.section}>Week 1 leaders</Text>
        {ranked.slice(0, 5).map((c) => (
          <View key={c.id} style={s.listRow}>
            <Av c={c} />
            <View style={{ flex: 1 }}><Text style={s.name}>{c.name}</Text><Text style={s.mute}>{c.tribe} · {c.job}</Text></View>
            <Text style={s.pts}>{scoreCastaway(c)}</Text>
          </View>
        ))}
        <Text style={s.section}>Scoring</Text>
        <Text style={s.body}>Survive {SCORING.surviveEpisode} · Idol {SCORING.idolFound} · Advantage {SCORING.advantageFound} · Ind. immunity {SCORING.individualImmunity} · Tribe immunity {SCORING.tribeImmunity} · Votes {SCORING.votesAgainst} · Last standing {SCORING.lastStandingBonus}</Text>
        <Text style={s.section}>Signed in as {user?.email}</Text>
        <Pressable style={s.ghost} onPress={logout}><Text style={s.ghostText}>Log out</Text></Pressable>
      </ScrollView>
    );
  }
  function CastList({ navigation }) {
    const [q, setQ] = useState(""); const [tribe, setTribe] = useState("All");
    const list = CASTAWAYS.filter((c) => (c.name + c.job + c.home).toLowerCase().includes(q.toLowerCase()) && (tribe === "All" || c.tribe === tribe));
    return (
      <View style={s.safe}>
        <View style={{ padding: 16 }}>
          <TextInput style={s.input} placeholder="Search remaining 20" placeholderTextColor={C.mute} value={q} onChangeText={setQ} />
          <View style={s.chips}>{["All", "Toka", "Savu"].map((t) => (
            <Pressable key={t} onPress={() => setTribe(t)} style={[s.chip, tribe === t && s.chipOn]}><Text style={[s.chipText, tribe === t && { color: "#111" }]}>{t}</Text></Pressable>
          ))}</View>
        </View>
        <FlatList data={list} keyExtractor={(c) => c.id} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }} renderItem={({ item }) => (
          <Pressable style={s.listRow} onPress={() => navigation.navigate("Detail", { id: item.id })}>
            <Av c={item} />
            <View style={{ flex: 1 }}><Text style={s.name}>{item.name}</Text><Text style={s.mute}>{item.age} · {item.job} · {item.home}</Text></View>
            <Text style={s.pts}>{scoreCastaway(item)}</Text>
          </Pressable>
        )} />
      </View>
    );
  }
  function Detail({ route }) {
    const { roster } = useContext(Game);
    const c = CASTAWAYS.find((x) => x.id === route.params.id);
    if (!c) return null;
    const owner = Object.entries(ROSTERS).find(([, ids]) => ids.includes(c.id));
    return (
      <ScrollView style={s.safe} contentContainerStyle={{ padding: 16 }}>
        <Av c={c} large />
        <Text style={s.h1}>{c.name}</Text>
        <Text style={s.sub}>{c.age} · {c.job} · {c.home}</Text>
        <View style={s.row}>
          <Stat label="Tribe" value={c.tribe} />
          <Stat label="Week 1" value={String(scoreCastaway(c))} />
          <Stat label="Owner" value={roster.includes(c.id) ? "You" : owner ? owner[0] : "FA"} />
        </View>
        <Text style={s.section}>Facts after Episode 1</Text>
        {c.facts.map((f, i) => <Text key={i} style={s.body}>• {f}</Text>)}
        <Text style={s.section}>Week 1 boxscore</Text>
        <Text style={s.body}>Survived {c.week1.survived ? "yes" : "no"} · Tribe immunity {c.week1.tribeImm ? "yes" : "no"} · Idols {c.week1.idol || 0} · Votes {c.week1.votes || 0}{c.week1.sitd ? " · Shot in the Dark" : ""}{c.week1.exile ? " · Exile" : ""}</Text>
      </ScrollView>
    );
  }
  function Roster() {
    const { roster, trades, proposeTrade, acceptTrade } = useContext(Game);
    const mine = roster.map((id) => CASTAWAYS.find((c) => c.id === id)).filter(Boolean);
    const [offer, setOffer] = useState(roster[0]);
    const [ask, setAsk] = useState("kristin");
    const [to, setTo] = useState("probst");
    return (
      <ScrollView style={s.safe} contentContainerStyle={{ padding: 16 }}>
        <Text style={s.h1}>Your last-out squad</Text>
        <Text style={s.sub}>Fantasy roster · {rosterScore("you")} pts after Ep 1</Text>
        {mine.map((c) => (
          <View key={c.id} style={s.listRow}><Av c={c} /><View style={{ flex: 1 }}><Text style={s.name}>{c.name}</Text><Text style={s.mute}>{c.tribe} · {scoreCastaway(c)} pts</Text></View></View>
        ))}
        <Text style={s.section}>Propose a trade</Text>
        <View style={s.chips}>{roster.map((id) => (
          <Pressable key={id} onPress={() => setOffer(id)} style={[s.chip, offer === id && s.chipOn]}><Text style={[s.chipText, offer === id && { color: "#111" }]}>{id}</Text></Pressable>
        ))}</View>
        <View style={s.chips}>{CASTAWAYS.filter((c) => !roster.includes(c.id)).slice(0, 8).map((c) => (
          <Pressable key={c.id} onPress={() => setAsk(c.id)} style={[s.chip, ask === c.id && s.chipOn]}><Text style={[s.chipText, ask === c.id && { color: "#111" }]}>{c.name.split(" ")[0]}</Text></Pressable>
        ))}</View>
        <View style={s.chips}>{MANAGERS.filter((m) => m.id !== "you").map((m) => (
          <Pressable key={m.id} onPress={() => setTo(m.id)} style={[s.chip, to === m.id && s.chipOn]}><Text style={[s.chipText, to === m.id && { color: "#111" }]}>{m.name}</Text></Pressable>
        ))}</View>
        <Pressable style={s.btn} onPress={() => { proposeTrade(offer, ask, to); Alert.alert("Trade sent", "Waiting on the other manager."); }}><Text style={s.btnText}>Send trade offer</Text></Pressable>
        <Text style={s.section}>Inbox</Text>
        {trades.map((t) => (
          <View key={t.id} style={s.card}>
            <Text style={s.name}>{t.from} → {t.to} · {t.status}</Text>
            <Text style={s.body}>Offer {t.offer.join(", ")} for {t.ask.join(", ")}</Text>
            {t.note ? <Text style={s.mute}>{t.note}</Text> : null}
            {t.status === "open" && t.to === "you" ? <Pressable style={s.btn} onPress={() => acceptTrade(t)}><Text style={s.btnText}>Accept</Text></Pressable> : null}
          </View>
        ))}
        <Text style={s.section}>Matchups</Text>
        {MATCHWEEKS.map((mw) => (
          <View key={mw.week} style={s.card}>
            <Text style={s.cardTitle}>{mw.label}</Text>
            {mw.fixtures.map(([a, b], i) => { const r = fixtureResult(a, b); return <Text key={i} style={s.body}>{mgrName(a)} {r.sa} – {r.sb} {mgrName(b)} {mw.locked ? "" : "(live)"}</Text>; })}
          </View>
        ))}
      </ScrollView>
    );
  }
  function Table() {
    const rows = buildTable();
    return (
      <ScrollView style={s.safe} contentContainerStyle={{ padding: 16 }}>
        <Text style={s.h1}>Last Out table</Text>
        <Text style={s.sub}>EPL-style round robin. 3 pts win, 1 draw.</Text>
        <View style={s.tableHead}><Text style={[s.th, { flex: 2 }]}># Club</Text><Text style={s.th}>P</Text><Text style={s.th}>W</Text><Text style={s.th}>D</Text><Text style={s.th}>L</Text><Text style={s.th}>Pts</Text></View>
        {rows.map((r, i) => (
          <View key={r.id} style={[s.tableRow, r.isYou && { backgroundColor: "#1A3A2A" }]}>
            <Text style={[s.td, { flex: 2 }]}>{i + 1}  {r.name}</Text>
            <Text style={s.td}>{r.p}</Text><Text style={s.td}>{r.w}</Text><Text style={s.td}>{r.d}</Text><Text style={s.td}>{r.l}</Text>
            <Text style={[s.td, { color: C.gold, fontWeight: "800" }]}>{r.pts}</Text>
          </View>
        ))}
        <Text style={s.body}>Eight managers drafted the 20 remaining castaways. Each episode is a matchweek. Last standing on the island takes the bonus.</Text>
      </ScrollView>
    );
  }
  function Chat() {
    const { chat, sendChat } = useContext(Game);
    const [text, setText] = useState("");
    return (
      <KeyboardAvoidingView style={s.safe} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={90}>
        <FlatList data={chat} keyExtractor={(m) => m.id} contentContainerStyle={{ padding: 16 }} renderItem={({ item }) => (
          <View style={s.bubble}><Text style={s.cardTitle}>{item.user}</Text><Text style={s.body}>{item.text}</Text><Text style={s.mute}>{item.ts}</Text></View>
        )} />
        <View style={s.composer}>
          <TextInput style={[s.input, { flex: 1, marginBottom: 0 }]} placeholder="Talk strategy" placeholderTextColor={C.mute} value={text} onChangeText={setText} />
          <Pressable style={[s.btn, { marginTop: 0, paddingHorizontal: 16 }]} onPress={() => { if (!text.trim()) return; sendChat(text.trim()); setText(""); }}><Text style={s.btnText}>Send</Text></Pressable>
        </View>
      </KeyboardAvoidingView>
    );
  }
  return { Home, CastList, Detail, Roster, Table, Chat, s };
}

export const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0B1F17" },
  kicker: { color: "#E8C547", letterSpacing: 2, fontWeight: "700", fontSize: 12 },
  h1: { color: "#F4E7C5", fontSize: 32, fontWeight: "800", marginTop: 4 },
  sub: { color: "#8AA396", fontSize: 15, marginBottom: 12, lineHeight: 22 },
  input: { backgroundColor: "#12281F", borderColor: "#1E3D30", borderWidth: 1, borderRadius: 12, color: "#F4E7C5", paddingHorizontal: 14, paddingVertical: 12, marginBottom: 10 },
  btn: { backgroundColor: "#E8C547", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 6 },
  btnText: { color: "#111", fontWeight: "800", fontSize: 16 },
  card: { backgroundColor: "#12281F", borderRadius: 16, padding: 16, marginTop: 12, borderWidth: 1, borderColor: "#1E3D30" },
  cardTitle: { color: "#E8C547", fontWeight: "700", marginBottom: 6 },
  name: { color: "#F4E7C5", fontWeight: "700", fontSize: 16 },
  body: { color: "#F4E7C5", lineHeight: 22, marginTop: 4 },
  mute: { color: "#8AA396", fontSize: 13, marginTop: 4 },
  row: { flexDirection: "row", gap: 8, marginTop: 12 },
  stat: { flex: 1, backgroundColor: "#12281F", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#1E3D30" },
  statVal: { color: "#E8C547", fontSize: 20, fontWeight: "800" },
  section: { color: "#F4E7C5", fontWeight: "800", fontSize: 18, marginTop: 22, marginBottom: 8 },
  listRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#1E3D30" },
  pts: { color: "#E8C547", fontWeight: "800", fontSize: 18 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginVertical: 8 },
  chip: { borderWidth: 1, borderColor: "#1E3D30", borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "#12281F" },
  chipOn: { backgroundColor: "#E8C547", borderColor: "#E8C547" },
  chipText: { color: "#F4E7C5", fontWeight: "700", fontSize: 12 },
  ghost: { borderWidth: 1, borderColor: "#1E3D30", borderRadius: 12, padding: 12, alignItems: "center", marginTop: 8 },
  ghostText: { color: "#8AA396" },
  av: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  avLg: { width: 84, height: 84, borderRadius: 42 },
  avText: { color: "#F4E7C5", fontWeight: "800" },
  tableHead: { flexDirection: "row", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#1E3D30" },
  tableRow: { flexDirection: "row", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#1E3D30" },
  th: { color: "#8AA396", flex: 0.5, fontSize: 12, fontWeight: "700" },
  td: { color: "#F4E7C5", flex: 0.5, fontSize: 13 },
  bubble: { backgroundColor: "#12281F", padding: 12, borderRadius: 12, marginBottom: 10 },
  composer: { flexDirection: "row", gap: 8, padding: 12, borderTopWidth: 1, borderTopColor: "#1E3D30", alignItems: "center" },
});
