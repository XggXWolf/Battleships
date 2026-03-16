const dummyMessages = [
    {
        uuid: "1",
        type: "system",
        content: "Game started! You are playing against Opponent.",
    },
    { uuid: "2", type: "player", content: "Good luck, have fun!" },
    {
        uuid: "3",
        type: "opponent",
        content: "You too! Let's have a great game.",
    },
] as const;

export default dummyMessages;
