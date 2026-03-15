export interface ChatMessageProps {
    type: "player" | "opponent" | "system";
    content: string;

    //TO-DO
    senderId?: string;
    senderName?: string;
}

// TO-DO: Retrieve actual player names and system messages from backend instead of hardcoding
function getPlayerName(type: ChatMessageProps["type"]) {
    switch (type) {
        case "player":
            return "You";
        case "opponent":
            return "Opponent";
        case "system":
            return "[System]";
    }
}

export default function ChatMessage({ type, content }: ChatMessageProps) {
    const playerName = getPlayerName(type);

    switch (type) {
        case "player":
            return (
                <div className="text-sm text-right">
                    <span className="font-bold text-green-400">
                        {playerName}:
                    </span>{" "}
                    {content}
                </div>
            );

        case "opponent":
            return (
                <div className="text-sm text-left">
                    <span className="font-bold text-red-400">
                        {playerName}:
                    </span>{" "}
                    {content}
                </div>
            );

        case "system":
            return (
                <div className="text-sm text-left">
                    <span className="font-bold text-blue-400">
                        {playerName}:
                    </span>{" "}
                    {content}
                </div>
            );
    }
}
