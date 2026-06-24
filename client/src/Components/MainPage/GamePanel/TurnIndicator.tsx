import { useGameStore } from "../../../stores/useGameStore";
import formatSeconds from "../../../util/formatSeconds";

export default function TurnIndicator() {
    const currentTurn = useGameStore((s) =>
        s.opponentDisconnected ? "disconnected" : s.currentTurn,
    );

    const moveTimer = useGameStore((s) => s.moveTimer);
    const disconnectTimer = useGameStore((s) => s.disconnectTimer);

    switch (currentTurn) {
        case "player":
            return (
                <div className="flex items-center space-x-2 bg-green-900/40 border border-green-500/60 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-green-400 font-bold tracking-widest text-sm drop-shadow-md">
                        {moveTimer
                            ? `${formatSeconds(moveTimer)}`
                            : "YOUR TURN"}
                    </span>
                </div>
            );
        case "opponent":
            return (
                <div className="flex items-center space-x-2 bg-red-900/40 border border-red-500/60 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <span className="text-red-400 font-bold tracking-widest text-sm drop-shadow-md">
                        {moveTimer
                            ? `${formatSeconds(moveTimer)}`
                            : "ENEMY TURN"}
                    </span>
                </div>
            );
        case "disconnected":
            return (
                <div className="flex items-center space-x-2 bg-amber-900/40 border border-amber-500/60 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(217,119,6,0.3)]">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                    <span className="text-amber-400 font-bold tracking-widest text-sm drop-shadow-md">
                        {disconnectTimer
                            ? `${formatSeconds(disconnectTimer)}`
                            : "OPPONENT OFFLINE"}
                    </span>
                </div>
            );
        default:
            return (
                <div className="flex items-center space-x-2 bg-gray-800/80 border border-gray-600/50 px-3 py-1 rounded-full shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-gray-500"></span>
                    <span className="text-gray-400 font-bold tracking-wider text-sm uppercase">
                        STANDING BY
                    </span>
                </div>
            );
    }
}
