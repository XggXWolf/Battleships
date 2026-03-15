import ChatPanel from "./ChatPanel/ChatPanel";
import LobbyPanel from "./LobbyPanel/LobbyPanel";

export default function SidePanel() {
    return (
        <div className="lg:col-span-1 flex flex-col h-full">
            <div
                id="side-panel"
                className="bg-primary p-6 rounded-xl shadow-lg border border-color-border h-full min-h-100"
            >
                <LobbyPanel hidden={true} />
                <ChatPanel hidden={false} />
            </div>
        </div>
    );
}
