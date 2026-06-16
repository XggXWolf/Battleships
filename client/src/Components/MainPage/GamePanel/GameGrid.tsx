import { Fragment, type CSSProperties } from "react";
import { chatSocket, gameSocket } from "../../../lib/socket";
import { useGameStore } from "../../../stores/useGameStore";
import { useUserStore } from "../../../stores/useUserStore";
import "./GameGrid.css";
import GridButton from "./GridButton";

const GRID_SIZE = 10;

export default function GameGrid() {
    const { currentTurn, gameStatus, resetGame, eloChange } = useGameStore();
    const currentElo = useUserStore.getState().user.elo;

    function gameOver() {
        resetGame();
        chatSocket.disconnect();
        gameSocket.disconnect();
    }

    const glows = {
        default: {
            label: "Neutral Steel",
            color: "text-gray-500",
            bg: "bg-gray-700",
            rgb: "156, 163, 175",
        },
        opponent: {
            label: "Pulse Red",
            color: "text-red-500/80",
            bg: "bg-red-800/40",
            rgb: "248, 113, 113",
        },
        player: {
            label: "Vital Green",
            color: "text-green-500/80",
            bg: "bg-green-800/40",
            rgb: "74, 222, 128",
        },
    };

    const currentGlow = currentTurn ? glows[currentTurn] : glows.default;

    return (
        <div
            className="grow bg-primary p-3 sm:p-4 rounded-xl shadow-lg border border-[rgb(var(--glow-rgb))] flex flex-col items-center justify-center min-h-0 transition-all duration-1000 animate-glow-heartbeat"
            style={{ "--glow-rgb": currentGlow.rgb } as CSSProperties}
        >
            <div id="game-grid-container" className="relative w-full max-w-xl">
                {gameStatus === "finished" && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-root/80 backdrop-blur-sm rounded-lg overflow-hidden">
                        {/* Overlay Card */}
                        <div className="flex flex-col items-center gap-6 p-8 rounded-xl bg-primary border border-color-border shadow-2xl">
                            {currentTurn === "player" ? (
                                <div className="flex flex-col items-center gap-1">
                                    <h2 className="text-3xl font-bold text-green-400 tracking-wide">
                                        VICTORY
                                    </h2>
                                    <div className="mt-4 flex flex-col items-center">
                                        <span className="text-[#8b949e] text-sm font-medium">
                                            Rank Rating
                                        </span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-2xl font-semibold text-white">
                                                {currentElo}
                                            </span>
                                            <span className="text-lg font-medium text-green-400">
                                                {eloChange && `+${eloChange}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-1">
                                    <h2 className="text-3xl font-bold text-red-400 tracking-wide">
                                        DEFEAT
                                    </h2>
                                    <div className="mt-4 flex flex-col items-center">
                                        <span className="text-[#8b949e] text-sm font-medium">
                                            Rank Rating
                                        </span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-2xl font-semibold text-white">
                                                {currentElo}
                                            </span>
                                            <span className="text-lg font-medium text-red-400">
                                                {eloChange && `-${eloChange}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Return to Lobby Button */}
                            <button
                                className="mt-2 px-6 py-2 w-full rounded-md font-medium text-white transition-colors bg-[#21262d] hover:bg-color-border border border-[#363b42] active:scale-[0.98]"
                                onClick={gameOver}
                            >
                                Return to Lobby
                            </button>
                        </div>
                    </div>
                )}

                <div
                    id="game-grid"
                    className="grid grid-cols-[1rem_repeat(10,1fr)] grid-rows-[1rem_repeat(10,1fr)] gap-0.5 w-full"
                >
                    {/* Corner space */}
                    <div className="col-span-1 row-span-1" />

                    {/* Column labels */}
                    {Array.from({ length: GRID_SIZE }, (_, i) => (
                        <div key={`col-label-${i}`} className="grid-label">
                            {String.fromCharCode(65 + i)}
                        </div>
                    ))}

                    {/* Rows */}
                    {Array.from({ length: GRID_SIZE }, (_, i) => {
                        const row = i + 1; // 1-indexed
                        return (
                            <Fragment key={`row-${row}`}>
                                {/* Row label */}
                                <div className="grid-label">{row}</div>

                                {/* Grid cells */}
                                {Array.from({ length: GRID_SIZE }, (_, j) => {
                                    const col = j + 1; // 1-indexed
                                    return (
                                        <GridButton
                                            key={`cell-${row}-${col}`}
                                            coordinates={{ row, col }}
                                        />
                                    );
                                })}
                            </Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
