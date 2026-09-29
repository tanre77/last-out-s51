import Foundation
import SwiftUI

struct Castaway: Identifiable {
    let id, name, home, job, tribe: String
    let age: Int
    let facts: [String]
    let survived, tribeImm, idol, votes, sitd: Int
    var points: Int { (survived * 8) + (tribeImm * 3) + (idol * 15) + (votes * -2) + sitd }
}

struct Trade: Identifiable {
    let id, from, to, status: String
    let offer, ask: [String]
    var note: String?
}

struct ChatMessage: Identifiable {
    let id = UUID()
    let user, text, ts: String
}

struct TableRow: Identifiable {
    let id, name: String
    var played = 0, w = 0, d = 0, l = 0, pts = 0
}

final class GameStore: ObservableObject {
    @Published var user: String?
    @Published var chat: [ChatMessage]
    @Published var trades: [Trade]
    @Published var rosters: [String: [String]]

    let managers: [(id: String, name: String)] = [
        ("you", "You"), ("probst", "Come On In"), ("buffalo", "Buffalo Ridge"),
        ("cirie", "Cirie's Couch"), ("fire", "Firemaking FC"), ("idol", "Idol Hunters"),
        ("outwit", "Outwit United"), ("snuff", "Snuffed Torches")
    ]

    let castaways: [Castaway] = [
        .init(id: "alexis", name: "Alexis Levine", home: "Atlanta, GA", job: "Criminal defense attorney", tribe: "Savu", age: 34, facts: ["Savu won first immunity."], survived: 1, tribeImm: 1, idol: 0, votes: 0, sitd: 0),
        .init(id: "ana", name: "Ana Sani", home: "Toronto, ON", job: "Voice actress", tribe: "Savu", age: 34, facts: ["Bonded with Kilby before the split."], survived: 1, tribeImm: 1, idol: 0, votes: 0, sitd: 0),
        .init(id: "brady", name: "Brady Booker", home: "Knoxville, TN", job: "Pro wrestler", tribe: "Toka", age: 27, facts: ["Majority voter vs Aaliyah."], survived: 1, tribeImm: 0, idol: 0, votes: 0, sitd: 0),
        .init(id: "carter", name: "Carter Krull", home: "Sioux Falls, SD", job: "Livestock farmer", tribe: "Savu", age: 24, facts: ["Safe after Savu immunity."], survived: 1, tribeImm: 1, idol: 0, votes: 0, sitd: 0),
        .init(id: "cristian", name: "Cristian Chavez", home: "Salt Lake City, UT", job: "Head of HR", tribe: "Savu", age: 26, facts: ["Season 47 alternate."], survived: 1, tribeImm: 1, idol: 0, votes: 0, sitd: 0),
        .init(id: "kilby", name: "Danny Kilby", home: "London, ON", job: "Game designer", tribe: "Toka", age: 30, facts: ["Voted Aaliyah."], survived: 1, tribeImm: 0, idol: 0, votes: 0, sitd: 0),
        .init(id: "devin", name: "Devin Way", home: "Los Angeles, CA", job: "Actor", tribe: "Toka", age: 33, facts: ["Voted Jenna in the minority."], survived: 1, tribeImm: 0, idol: 0, votes: 0, sitd: 0),
        .init(id: "eric", name: "Eric Macksoud", home: "Windsor Locks, CT", job: "Mental health counselor", tribe: "Savu", age: 34, facts: ["Safe on Savu."], survived: 1, tribeImm: 1, idol: 0, votes: 0, sitd: 0),
        .init(id: "jelly", name: "Angelica Jelly Loblack", home: "Bloomington, IN", job: "Sociology professor", tribe: "Toka", age: 29, facts: ["Voted Jenna (minority)."], survived: 1, tribeImm: 0, idol: 0, votes: 0, sitd: 0),
        .init(id: "jenna", name: "Jenna Doore", home: "Toledo, OH", job: "Wedding photographer", tribe: "Toka", age: 30, facts: ["2 votes. Shot in the Dark. Survived 6-2."], survived: 1, tribeImm: 0, idol: 0, votes: 2, sitd: 1),
        .init(id: "kristin", name: "Kristin Flickinger", home: "Santa Barbara, CA", job: "Crisis management", tribe: "Savu", age: 49, facts: ["Oldest castaway."], survived: 1, tribeImm: 1, idol: 0, votes: 0, sitd: 0),
        .init(id: "lewis", name: "Lewis Kelly", home: "Corozal, PR", job: "Farmer", tribe: "Toka", age: 28, facts: ["Exile. Failed idol chop."], survived: 1, tribeImm: 0, idol: 0, votes: 0, sitd: 0),
        .init(id: "linnea", name: "Linnea Capobianco", home: "Jersey City, NJ", job: "Entrepreneur", tribe: "Savu", age: 25, facts: ["Safe on Savu."], survived: 1, tribeImm: 1, idol: 0, votes: 0, sitd: 0),
        .init(id: "maggie", name: "Maggie Nestor", home: "Charles Town, WV", job: "Farmer", tribe: "Toka", age: 40, facts: ["Majority voter vs Aaliyah."], survived: 1, tribeImm: 0, idol: 0, votes: 0, sitd: 0),
        .init(id: "mike", name: "Mike Pinsky", home: "New York City, NY", job: "Baseball executive", tribe: "Toka", age: 32, facts: ["Yankees baseball ops."], survived: 1, tribeImm: 0, idol: 0, votes: 0, sitd: 0),
        .init(id: "ori", name: "Ori Jean-Charles", home: "Spring Valley, NY", job: "Personal trainer", tribe: "Savu", age: 27, facts: ["Pregame ties across the split."], survived: 1, tribeImm: 1, idol: 0, votes: 0, sitd: 0),
        .init(id: "patt", name: "Patt Cannaday", home: "Washington, DC", job: "Federal prosecutor", tribe: "Toka", age: 33, facts: ["Aligned with Jenna."], survived: 1, tribeImm: 0, idol: 0, votes: 0, sitd: 0),
        .init(id: "rob", name: "Rob Antonson", home: "Cumberland, RI", job: "Airline gate agent", tribe: "Savu", age: 40, facts: ["Found a no-strings idol Day 3."], survived: 1, tribeImm: 1, idol: 1, votes: 0, sitd: 0),
        .init(id: "sharonda", name: "Sharonda Cox", home: "Richmond, KY", job: "Resident OBGYN", tribe: "Savu", age: 34, facts: ["Connected with Kristin."], survived: 1, tribeImm: 1, idol: 0, votes: 0, sitd: 0),
        .init(id: "thienan", name: "Thien An Nguyen", home: "Fort Worth, TX", job: "Medical student", tribe: "Toka", age: 24, facts: ["Voted Aaliyah with Toka majority."], survived: 1, tribeImm: 0, idol: 0, votes: 0, sitd: 0)
    ]

    init() {
        rosters = [
            "you": ["rob", "brady", "jenna"],
            "probst": ["kristin", "devin", "thienan"],
            "buffalo": ["patt", "linnea"],
            "cirie": ["jelly", "carter"],
            "fire": ["lewis", "alexis"],
            "idol": ["kilby", "sharonda"],
            "outwit": ["ana", "mike", "ori"],
            "snuff": ["cristian", "maggie", "eric"]
        ]
        trades = [
            Trade(id: "t1", from: "probst", to: "you", status: "open", offer: ["thienan"], ask: ["jenna"], note: "Jenna took 2 votes. Take Thien An instead?"),
            Trade(id: "t-thienan", from: "you", to: "probst", status: "open", offer: ["brady"], ask: ["thienan"], note: "3rd pick this season + 2nd overall next season.")
        ]
        chat = [
            ChatMessage(user: "Come On In", text: "Torch is snuffed on Aaliyah. Draft board is LIVE. Who lasts?", ts: "Wed 10:12 PM"),
            ChatMessage(user: "You", text: "Does anybody who has Thein A willing to make a trade? I'll give you my third pick this season and 2nd overall pick for next season", ts: "Tue 4:58 PM")
        ]
    }

    func byId(_ id: String) -> Castaway? { castaways.first { $0.id == id } }
    func filtered(_ tribe: String) -> [Castaway] { tribe == "All" ? castaways : castaways.filter { $0.tribe == tribe } }
    var leaders: [Castaway] { Array(castaways.sorted { $0.points > $1.points }.prefix(5)) }
    var mySquad: [Castaway] { (rosters["you"] ?? []).compactMap(byId) }
    func rosterScore(_ mid: String) -> Int { (rosters[mid] ?? []).compactMap(byId).reduce(0) { $0 + $1.points } }
    func managerName(_ id: String) -> String { managers.first { $0.id == id }?.name ?? id }
    func login(email: String, password: String, name: String) {
        guard !email.isEmpty, !password.isEmpty else { return }
        user = name.isEmpty ? email : name
    }
    func logout() { user = nil }
    func send(_ text: String) {
        let t = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !t.isEmpty else { return }
        chat.append(ChatMessage(user: user ?? "You", text: t, ts: "Just now"))
    }
    func accept(_ trade: Trade) {
        guard let i = trades.firstIndex(where: { $0.id == trade.id }) else { return }
        var from = rosters[trade.from] ?? []
        var to = rosters[trade.to] ?? []
        from.removeAll { trade.offer.contains($0) }
        to.removeAll { trade.ask.contains($0) }
        from.append(contentsOf: trade.ask)
        to.append(contentsOf: trade.offer)
        rosters[trade.from] = from
        rosters[trade.to] = to
        trades[i] = Trade(id: trade.id, from: trade.from, to: trade.to, status: "accepted", offer: trade.offer, ask: trade.ask, note: trade.note)
    }
    var table: [TableRow] {
        var rows = Dictionary(uniqueKeysWithValues: managers.map { ($0.id, TableRow(id: $0.id, name: $0.name)) })
        for (a, b) in [("you","probst"),("buffalo","cirie"),("fire","idol"),("outwit","snuff")] {
            let sa = rosterScore(a), sb = rosterScore(b)
            rows[a]!.played += 1; rows[b]!.played += 1
            if sa > sb { rows[a]!.w += 1; rows[a]!.pts += 3; rows[b]!.l += 1 }
            else if sb > sa { rows[b]!.w += 1; rows[b]!.pts += 3; rows[a]!.l += 1 }
            else { rows[a]!.d += 1; rows[b]!.d += 1; rows[a]!.pts += 1; rows[b]!.pts += 1 }
        }
        return rows.values.sorted { $0.pts > $1.pts }
    }
    var week1Lines: [String] {
        [("you","probst"),("buffalo","cirie"),("fire","idol"),("outwit","snuff")].map { a, b in
            "\(managerName(a)) \(rosterScore(a)) – \(rosterScore(b)) \(managerName(b))"
        }
    }
}
