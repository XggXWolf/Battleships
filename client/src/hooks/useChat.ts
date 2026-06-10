import { useEffect, useState } from "react";
import socket from "../lib/socket";

export interface ChatMessage {
    uuid: string;
    type: "system" | "player" | "opponent";
    senderNickname: string;
    content: string;
    timestamp: Date;
}

export default function useChat(roomId: string) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        socket.emit("join_room", roomId);

        socket.on("message", (message: ChatMessage) => {
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
            socket.off("message");
            socket.emit("leave_room", roomId);
        };
    }, [roomId]);

    const sendMessage = (content: string) => {
        socket.emit("message", { roomId, content });
    };

    return { messages, sendMessage };
}
