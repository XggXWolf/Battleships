import type { ChatMessage } from "../../../../hooks/useChat_deprecated";

export interface ChatMessageProps {
    message: ChatMessage;
}

// TO-DO: Retrieve actual player names and system messages from backend instead of hardcoding
function getPlayerName(type: "system" | "player" | "opponent") {
    switch (type) {
        case "player":
            return "You";
        case "opponent":
            return "Opponent";
        case "system":
            return "[System]";
    }
}

export default function ChatMessage({ message }: ChatMessageProps) {
    const playerName = getPlayerName(message.type);

    switch (message.type) {
        case "player":
            return (
                <div className="text-sm text-right">
                    <span className="font-bold text-green-400">
                        {playerName}:
                    </span>{" "}
                    {message.content}
                </div>
            );

        case "opponent":
            return (
                <div className="text-sm text-left">
                    <span className="font-bold text-red-400">
                        {playerName}:
                    </span>{" "}
                    {message.content}
                </div>
            );

        case "system":
            return (
                <div className="text-sm text-left">
                    <span className="font-bold text-blue-400">
                        {playerName}:
                    </span>{" "}
                    {message.content}
                </div>
            );
    }
}
