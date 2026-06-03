const rankMap: Record<string, string> = {
    Ensign: "ENS",
    Lieutenant: "LT",
    Commander: "CDR",
    Captain: "CAPT",
    Commodore: "CDRE",
    Admiral: "ADM",
    Sealord: "SL",

    moderator: "MOD",
    admin: "ADMIN",
};
export function truncateRank(elo: number, role?: string): string {
    const rank = getRankFromElo(elo);

    switch (role) {
        case "moderator":
            return rankMap["moderator"];
        case "admin":
            return rankMap["admin"];
        default:
            return rankMap[rank] ?? rank;
    }
}

export function getRankFromElo(elo: number): string {
    if (!elo) return "Unranked";

    if (elo < 1200) return "Ensign";
    if (elo < 1400) return "Lieutenant";
    if (elo < 1600) return "Commander";
    if (elo < 1800) return "Captain";
    if (elo < 1900) return "Commodore";
    if (elo < 2200) return "Admiral";
    return "Sealord";
}
