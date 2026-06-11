import { useState } from "react";
import useChat from "../../../../hooks/useChat";
import ChatMessage from "./ChatMessage";
import useSocket from "../../../../hooks/useSocket";
import { chatSocket } from "../../../../lib/socket";

export default function ChatPanel() {
    useSocket(chatSocket);
    const { messages, sendMessage } = useChat("testRoom");
    const [messageInput, setMessageInput] = useState("");

    return (
        <div id="chat-panel" className="flex flex-col space-y-4 h-full">
            <h3 className="text-xl font-bold text-center text-white border-b border-gray-700 pb-3 mb-2">
                Game Chat
            </h3>
            <div
                id="chat-messages"
                className="flex-1 min-h-0 overflow-y-auto space-y-3 p-2 bg-root rounded-lg mb-4"
            >
                {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} />
                ))}
            </div>
            <div className="flex">
                <input
                    type="text"
                    placeholder="Hello, world!"
                    className="grow min-w-0 p-3 rounded-l-lg bg-gray-700 border border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                />
                <button
                    className="bg-blue-600 hover:bg-blue-700 p-3 rounded-r-lg font-semibold transition hover:cursor-pointer"
                    onClick={() => {
                        console.log("Sending message:", messageInput);
                        sendMessage(messageInput);
                        setMessageInput("");
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
