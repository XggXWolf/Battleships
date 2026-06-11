import { useState } from "react";
import ChatPanel from "./ChatPanel/ChatPanel";
import LobbyPanel from "./LobbyPanel/LobbyPanel";

export default function SidePanel() {
    const [activeTab, setActiveTab] = useState<"lobby" | "chat">("lobby");

    return (
        <div className="lg:col-span-1 flex flex-col min-h-100">
            <div
                id="side-panel"
                className="bg-primary p-6 rounded-xl shadow-lg border border-color-border flex flex-col h-full overflow-hidden"
            >
                {activeTab === "lobby" && (
                    <LobbyPanel onGameJoin={setActiveTab} />
                )}
                {activeTab === "chat" && <ChatPanel />}
            </div>
        </div>
    );
}
