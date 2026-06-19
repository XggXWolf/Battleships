import { useEffect } from "react";
import useSocket from "../hooks/useSocket";
import { chatSocket, gameSocket } from "../lib/socket";
import { useChatStore } from "../stores/useChatStore";
import { useGameStore } from "../stores/useGameStore";
import { useUserStore } from "../stores/useUserStore";
import useGame from "../hooks/useGame";
import type { ChatMessage } from "../types/chatMessage";

export default function GameSession() {
    useSocket(chatSocket);
    useSocket(gameSocket);
    useGame();

    const { addMessage, clearMessages } = useChatStore();
    const { gameId } = useGameStore();

    useEffect(() => {
        const joinChatRoom = () => {
            console.log("Joining chat room with gameId:", gameId);
            chatSocket.emit("join_room", gameId + "-chat");
        };

        if (chatSocket.connected && (chatSocket as any).authReady) {
            joinChatRoom();
        } else {
            chatSocket.once("ready", joinChatRoom);
        }

        chatSocket.on("message", (message: ChatMessage) => {
            const user = useUserStore.getState().user;
            if (message.senderNickname === user?.nickname) {
                message.type = "player";
            } else {
                message.type = "opponent";
            }

            console.log("Received message:", message);
            message.uuid = `${message.senderNickname}-${message.timestamp}`;

            addMessage(message);
        });

        return () => {
            chatSocket.off("message");
            chatSocket.off("ready", joinChatRoom);
            chatSocket.emit("leave_room", gameId);
            clearMessages();
        };
    }, [gameId]);

    return null;
}
