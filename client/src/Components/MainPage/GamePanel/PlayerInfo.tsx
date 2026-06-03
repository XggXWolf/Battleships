import { useEffect, useState } from "react";
import { getRankFromElo, truncateRank } from "../../../util/rankFunctions";
import TurnIndicator from "./TurnIndicator";
import { isTokenExpired } from "../../../util/authFunctions";
import type { PlayerData } from "../../../types/playerData";

interface PlayerInfoProps {
    type: "player" | "opponent";
    currentTurn?: "player" | "opponent" | null; // null for "Standing By"
    showTurnIndicator?: boolean;
    showAddFriendButton?: boolean;
}

export default function PlayerInfo({
    type,
    currentTurn,
    showTurnIndicator,
    showAddFriendButton,
}: PlayerInfoProps) {
    const [playerData, setPlayerData] = useState<PlayerData>({} as PlayerData);

    useEffect(() => {
        let playerData = {} as PlayerData;

        if (type === "player") {
            if (isTokenExpired()) {
                localStorage.clear();
                return;
            }

            playerData = JSON.parse(
                localStorage.getItem("user") || "{}",
            ) as PlayerData;
        }

        setPlayerData(playerData);
    }, []);

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
                            {truncateRank(playerData.elo, playerData.role)}
                        </span>
                        {playerData.nickname}
                    </span>

                    <span
                        className={`text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap ${type === "player" ? "bg-green-800 text-green-300" : "bg-red-800 text-red-300"}`}
                    >
                        ELO: {playerData.elo}
                    </span>
                </div>

                {/* Top container for player, has the turn indicator element for
                the player. */}
                {showTurnIndicator && (
                    <div
                        id="game-status-container"
                        className="transition-all duration-300 ease-in-out"
                    >
                        {/*TO-DO: Hook with zustand */}
                        <TurnIndicator currentTurn={currentTurn} />
                    </div>
                )}

                {/* Bottom container for opponent, has add as friend button. */}
                {/* TO-DO: Restyle */}
                {showAddFriendButton && (
                    <button
                        className="flex items-center gap-2 px-4 py-1.5 
                                     bg-gray-900/20 hover:bg-blue-900/40 
                                     text-blue-400/80 hover:text-blue-400 text-xs font-bold uppercase tracking-wider
                                     border border-gray-500/30 hover:border-blue-500/60 
                                     rounded-lg transition-all duration-200 
                                     active:scale-95 shadow-sm cursor-pointer hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                    >
                        Add Friend
                    </button>
                )}
            </div>
        </div>
    );
}
