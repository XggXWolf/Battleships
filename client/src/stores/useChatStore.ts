import { create } from "zustand";
import { chatSocket } from "../lib/socket";
import type { ChatMessage } from "../types/chatMessage";

type ChatStore = {
    messages: ChatMessage[];
    addMessage: (message: ChatMessage) => void;
    clearMessages: () => void;
    sendMessage: (gameId: string, content: string) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
    messages: [],
    addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
    clearMessages: () => set({ messages: [] }),
    sendMessage: (gameId, content) => {
        chatSocket.emit("message", { gameId, content });
    },
}));
