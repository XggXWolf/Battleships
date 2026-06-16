import { useGameStore } from "../../../stores/useGameStore";
import ChatPanel from "./ChatPanel/ChatPanel";
import LobbyPanel from "./LobbyPanel/LobbyPanel";

export default function SidePanel() {
    const gameId = useGameStore((s) => s.gameId);

    return (
        <div className="lg:col-span-1 flex flex-col min-h-100">
            <div
                id="side-panel"
                className="bg-primary p-6 rounded-xl shadow-lg border border-color-border flex flex-col h-full overflow-hidden"
            >
                {!gameId && <LobbyPanel />}
                {gameId && <ChatPanel />}
            </div>
        </div>
    );
}
