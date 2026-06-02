const rankMap: Record<string, string> = {
    Ensign: "ENS",
    Lieutenant: "LT",
    Commander: "CDR",
    Captain: "CAPT",
    Commodore: "CDRE",
    Admiral: "ADM",
    Sealord: "SL",

    admin: "ADMIN",
};
export function truncateRank(rank: string): string {
    // TO-DO:
    // Kinda messy, fix later
    let user = localStorage.getItem("user");
    if (user) {
        let userParsed = JSON.parse(user);
        let isAdmin = userParsed.role === "admin";

        if (isAdmin) {
            return rankMap["admin"];
        }
    }

    return rankMap[rank] ?? rank;
}

export function getRankFromElo(elo: number): string {
    if (elo < 1200) return "Ensign";
    if (elo < 1400) return "Lieutenant";
    if (elo < 1600) return "Commander";
    if (elo < 1800) return "Captain";
    if (elo < 1900) return "Commodore";
    if (elo < 2200) return "Admiral";
    return "Sealord";
}
