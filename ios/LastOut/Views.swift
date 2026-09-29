import SwiftUI

struct RootView: View {
    @EnvironmentObject var store: GameStore
    var body: some View {
        if store.user == nil {
            LoginView()
        } else {
            TabView {
                IslandView().tabItem { Label("Island", systemImage: "flame.fill") }
                CastView().tabItem { Label("Cast", systemImage: "person.3.fill") }
                RosterView().tabItem { Label("Roster", systemImage: "list.bullet") }
                TableView().tabItem { Label("Table", systemImage: "sportscourt.fill") }
                ChatView().tabItem { Label("bubble.left.and.bubble.right.fill") }
            }
            .tint(Color(red: 0.91, green: 0.77, blue: 0.28))
        }
    }
}

struct LoginView: View {
    @EnvironmentObject var store: GameStore
    @State private var email = "tanner@lastout.app"
    @State private var password = "torch123"
    @State private var name = ""
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                Text("SURVIVOR 51 · OPEN ERA").font(.caption.weight(.bold)).foregroundStyle(Gold.color)
                Text("Last Out").font(.largeTitle.bold())
                Text("Aaliyah Puglia is gone. Draft who lasts. Score idols. Trade picks. Beat the table.").foregroundStyle(.secondary)
                TextField("Email", text: $email).textInputAutocapitalization(.never).padding(12).background(Color(red: 0.07, green: 0.16, blue: 0.12)).clipShape(RoundedRectangle(cornerRadius: 12))
                SecureField("Password", text: $password).padding(12).background(Color(red: 0.07, green: 0.16, blue: 0.12)).clipShape(RoundedRectangle(cornerRadius: 12))
                TextField("Manager name", text: $name).padding(12).background(Color(red: 0.07, green: 0.16, blue: 0.12)).clipShape(RoundedRectangle(cornerRadius: 12))
                Button("Enter the island") { store.login(email: email, password: password, name: name) }.buttonStyle(GoldButton())
            }.padding()
        }.background(Color(red: 0.04, green: 0.08, blue: 0.06).ignoresSafeArea())
    }
}

struct IslandView: View {
    @EnvironmentObject var store: GameStore
    var body: some View {
        NavigationStack {
            List {
                Section { Text("Toka lost Ep 1. Aaliyah Puglia voted out 6-2. Rob found an idol.") }
                Section("Your club") {
                    LabeledContent("Points", value: "\(store.rosterScore(\"you\"))")
                    LabeledContent("Picks", value: "\(store.rosters[\"you\"]?.count ?? 0)")
                }
                Section("Week 1 leaders") {
                    ForEach(store.leaders) { c in
                        HStack { Text(c.name); Spacer(); Text("\(c.points)").foregroundStyle(Gold.color).bold() }
                    }
                }
                Button("Log out", role: .destructive) { store.logout() }
            }.navigationTitle("Island")
        }
    }
}

struct CastView: View {
    @EnvironmentObject var store: GameStore
    @State private var tribe = "All"
    var body: some View {
        NavigationStack {
            List(store.filtered(tribe)) { c in
                NavigationLink(destination: DetailView(castaway: c)) {
                    VStack(alignment: .leading) {
                        HStack {
                            Text(c.name).bold()
                            Text(c.tribe).font(.caption.bold())
                            Spacer()
                            Text("\(c.points)").foregroundStyle(Gold.color).bold()
                        }
                        Text("\(c.age) · \(c.job) · \(c.home)").font(.caption).foregroundStyle(.secondary)
                    }
                }
            }
            .navigationTitle("Remaining 20")
            .toolbar {
                Picker("Tribe", selection: $tribe) {
                    Text("All").tag("All"); Text("Toka").tag("Toka"); Text("Savu").tag("Savu")
                }.pickerStyle(.segmented)
            }
        }
    }
}

struct DetailView: View {
    let castaway: Castaway
    var body: some View {
        List {
            Section {
                Text("\(castaway.age) · \(castaway.job)")
                LabeledContent("Tribe", value: castaway.tribe)
                LabeledContent("Week 1", value: "\(castaway.points)")
            }
            Section("Facts") { ForEach(castaway.facts, id: \.self) { Text($0) } }
        }.navigationTitle(castaway.name)
    }
}

struct RosterView: View {
    @EnvironmentObject var store: GameStore
    var body: some View {
        NavigationStack {
            List {
                Section("Squad · \(store.rosterScore(\"you\")) pts") {
                    ForEach(store.mySquad) { c in
                        HStack { Text(c.name); Spacer(); Text("\(c.points)").foregroundStyle(Gold.color) }
                    }
                }
                Section("Inbox") {
                    ForEach(store.trades) { t in
                        VStack(alignment: .leading, spacing: 6) {
                            Text("\(store.managerName(t.from)) → \(store.managerName(t.to)) · \(t.status)").bold()
                            Text("Offer \(t.offer.joined(separator: ", ")) for \(t.ask.joined(separator: ", "))")
                            if let note = t.note { Text(note).font(.caption).foregroundStyle(.secondary) }
                            if t.status == "open" && t.to == "you" { Button("Accept") { store.accept(t) } }
                        }
                    }
                }
            }.navigationTitle("Roster")
        }
    }
}

struct TableView: View {
    @EnvironmentObject var store: GameStore
    var body: some View {
        NavigationStack {
            List {
                Section("EPL-style table") {
                    ForEach(Array(store.table.enumerated()), id: \.element.id) { i, row in
                        HStack {
                            Text("\(i + 1). \(row.name)").bold(row.id == "you")
                            Spacer()
                            Text("\(row.pts)").foregroundStyle(Gold.color).bold()
                        }
                    }
                }
                Section("MW1") { ForEach(store.week1Lines, id: \.self) { Text($0) } }
            }.navigationTitle("Table")
        }
    }
}

struct ChatView: View {
    @EnvironmentObject var store: GameStore
    @State private var draft = ""
    var body: some View {
        NavigationStack {
            VStack {
                List(store.chat) { m in
                    VStack(alignment: .leading, spacing: 4) {
                        Text(m.user).font(.caption.bold()).foregroundStyle(Gold.color)
                        Text(m.text)
                        Text(m.ts).font(.caption2).foregroundStyle(.secondary)
                    }
                }
                HStack {
                    TextField("Talk strategy", text: $draft).padding(10).background(Color(red: 0.07, green: 0.16, blue: 0.12)).clipShape(RoundedRectangle(cornerRadius: 10))
                    Button("Send") { store.send(draft); draft = "" }.buttonStyle(GoldButton()).frame(width: 80)
                }.padding()
            }.navigationTitle("Chat")
        }
    }
}

enum Gold { static let color = Color(red: 0.91, green: 0.77, blue: 0.28) }
struct GoldButton: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label.frame(maxWidth: .infinity).padding(12).background(Gold.color).foregroundStyle(.black).fontWeight(.bold).clipShape(RoundedRectangle(cornerRadius: 12)).opacity(configuration.isPressed ? 0.8 : 1)
    }
}
