import { useState } from "react";
import ChatPanel from "./ChatPanel/ChatPanel";
import LobbyPanel from "./LobbyPanel/LobbyPanel";

export default function SidePanel() {
    const [activeTab, setActiveTab] = useState<"lobby" | "chat">("lobby");

    return (
        <div className="lg:col-span-1 flex flex-col h-full">
            <div
                id="side-panel"
                className="bg-primary p-6 rounded-xl shadow-lg border border-color-border h-full min-h-100"
            >
                {activeTab === "lobby" && (
                    <LobbyPanel onGameJoin={setActiveTab} />
                )}
                {activeTab === "chat" && <ChatPanel />}
            </div>
        </div>
    );
}
