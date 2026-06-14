import { useEffect } from "react";
import useSocket from "../hooks/useSocket";
import { chatSocket, gameSocket } from "../lib/socket";
import { useChatStore } from "../stores/useChatStore";
import { useGameStore } from "../stores/useGameStore";
import type { ChatMessage } from "../hooks/useChat_deprecated";
import { useUserStore } from "../stores/useUserStore";

function GameSession() {
    useSocket(chatSocket);
    useSocket(gameSocket);

    const { addMessage, clearMessages } = useChatStore();
    const { gameId } = useGameStore();

    useEffect(() => {
        chatSocket.emit("join_room", gameId);

        chatSocket.on("message", (message: ChatMessage) => {
            const user = useUserStore.getState().user;
            if (message.senderNickname === user?.nickname) {
                message.type = "player";
            } else {
                message.type = "opponent";
            }

            message.uuid = `${message.senderNickname}-${message.timestamp}`;

            addMessage(message);
        });

        return () => {
            chatSocket.off("message");
            chatSocket.emit("leave_room", gameId);
            clearMessages();
        };
    }, [gameId]);

    return null;
}
