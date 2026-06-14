import { useEffect, useState } from "react";
import { chatSocket } from "../lib/socket";

export interface ChatMessage {
    uuid: string;
    type: "system" | "player" | "opponent";
    senderNickname: string;
    content: string;
    timestamp: Date;
}

export default function useChat(gameId: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        chatSocket.emit("join_room", gameId);

        chatSocket.on("message", (message: ChatMessage) => {
            const currentUser = JSON.parse(
                localStorage.getItem("user") || ({} as string),
            );
            if (message.senderNickname === currentUser.nickname) {
                message.type = "player";
            } else {
                message.type = "opponent";
            }

            message.uuid = `${message.senderNickname}-${message.timestamp}`;

            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            chatSocket.off("message");
            chatSocket.emit("leave_room", gameId);
        };
    }, [gameId]);

    const sendMessage = (content: string) => {
        chatSocket.emit("message", { gameId, content });
    };

    return { messages, sendMessage };
}
