const rankMap: Record<string, string> = {
    // Player Ranks
    Ensign: "Ens.",
    Lieutenant: "Lt.",
    Commander: "Cmdr.",
    Captain: "Capt.",
    Commodore: "Cmd.",
    Admiral: "Adm.",
    Sealord: "S.L.",
    // Moderator Ranks
    Moderator: "Mod.",
    Administrator: "Admin",
};

export default function truncateRank(rank: string): string {
    return rankMap[rank] ?? rank;
}   