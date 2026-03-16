const dummyFriends: {
    id: number;
    name: string;
    rank: string;
    status: "online" | "offline";
    elo: number;
}[] = [
    { id: 1, name: "Nelson", rank: "Admiral", status: "online", elo: 2000 },
    { id: 2, name: "Ahab", rank: "Captain", status: "offline", elo: 1200 },
    {
        id: 3,
        name: "Sparrow",
        rank: "Commander",
        status: "online",
        elo: 1500,
    },
] as const;

export default dummyFriends;
