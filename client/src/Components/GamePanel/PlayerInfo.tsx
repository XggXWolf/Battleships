import { useEffect, useState } from "react";
import truncateRank from "../../util/truncateRank";
import TurnIndicator from "./TurnIndicator";

interface PlayerInfoProps {
    type: "player" | "opponent";
}

const tempUser = {
    username: "Player",
    rank: "Admiral",
    elo: 1500,
};

export default function PlayerInfo({ type }: PlayerInfoProps) {
    return (
        <div className="bg-primary p-3 rounded-xl shadow-lg border border-color-border shrink-0">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-3">
                    <span
                        className={`text-lg font-semibold flex items-center whitespace-nowrap ${type === "player" ? "text-green-400" : "text-red-400"}`}
                    >
                        <span
                            className={` text-xs font-bold px-2 py-0.5 rounded border uppercase tracking-wide mr-2 shadow-sm ${type === "player" ? "bg-green-900/80 text-green-100 border-green-700" : "bg-red-900/80 text-red-100 border-red-700"} `}
                        >
                            {truncateRank(tempUser.rank)}
                        </span>
                        {tempUser.username}
                    </span>

                    <span
                        className={`text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap ${type === "player" ? "bg-green-800 text-green-300" : "bg-red-800 text-red-300"}`}
                    >
                        ELO: {tempUser.elo}
                    </span>
                </div>

                {type === "player" && (
                    <div
                        id="game-status-container"
                        className="transition-all duration-300 ease-in-out"
                    >
                        {/*TO-DO: Hook with zustand */}
                        <TurnIndicator currentTurn={"player"} />
                    </div>
                )}
            </div>
        </div>
    );
}
