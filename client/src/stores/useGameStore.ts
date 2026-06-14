import { create } from "zustand";
import type { OpponentData, PlayerData } from "../types/playerData";

type GameStore = {
    currentTurn: "player" | "opponent" | null;
    gameStatus: "placement" | "active" | "finished";
    gameId: string | null;
    opponentData: OpponentData | null;
    setGameId: (id: string) => void;
    setCurrentTurn: (turn: "player" | "opponent" | null) => void;
    setGameStatus: (status: "placement" | "active" | "finished") => void;
    setOpponentData: (data: PlayerData) => void;
    resetGame: () => void;
};

export const useGameStore = create<GameStore>((set) => ({
    currentTurn: null,
    gameStatus: "placement",
    gameId: null,
    opponentData: null,
    setGameId: (id) => set({ gameId: id }),
    setCurrentTurn: (turn) => set({ currentTurn: turn }),
    setGameStatus: (status) => set({ gameStatus: status }),
    setOpponentData: (data) => set({ opponentData: data }),
    resetGame: () =>
        set({
            currentTurn: null,
            gameStatus: "placement",
            gameId: null,
            opponentData: null,
        }),
}));
