import { create } from "zustand";
import type { ChatMessage } from "../hooks/useChat_deprecated";
import { chatSocket } from "../lib/socket";

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
