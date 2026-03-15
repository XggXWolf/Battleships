import type { ChatMessageProps } from "./ChatMessage";
import ChatMessage from "./ChatMessage";

interface ChatPanelProps {
    hidden: boolean;
}

const dummyMessages: ChatMessageProps[] = [
    {
        type: "system",
        content: "Game started! You are playing against Opponent.",
    },
    { type: "player", content: "Good luck, have fun!" },
    { type: "opponent", content: "You too! Let's have a great game." },
];

export default function ChatPanel({ hidden }: ChatPanelProps) {
    return (
        <div
            id="chat-panel"
            className={`${hidden ? "hidden" : "block"} flex flex-col space-y-4 h-full`}
        >
            <h3 className="text-xl font-bold text-center text-white border-b border-gray-700 pb-3 mb-2">
                Game Chat
            </h3>
            <div
                id="chat-messages"
                className="grow overflow-y-auto space-y-3 p-2 bg-root rounded-lg mb-4 h-64 sm:h-auto"
            >
                {dummyMessages.map((msg, index) => (
                    <ChatMessage key={index} {...msg} />
                ))}
            </div>
            <div className="flex">
                <input
                    type="text"
                    placeholder="Hello, world!"
                    className="flex-grow p-3 rounded-l-lg bg-gray-700 border border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <button className="bg-blue-600 hover:bg-blue-700 p-3 rounded-r-lg font-semibold transition">
                    Send
                </button>
            </div>
        </div>
    );
}
