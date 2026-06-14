import { create } from "zustand";
import type { OpponentData, PlayerData } from "../types/playerData";
import type { Position, Ship } from "../types/gameTypes";

type GameStore = {
    currentTurn: "player" | "opponent" | null;
    gameStatus: "placement" | "active" | "finished";
    shipBoard: Ship[];
    hitBoard: Position[];
    gameId: string | null;
    opponentData: OpponentData | null;
    setGameId: (id: string) => void;
    setCurrentTurn: (turn: "player" | "opponent" | null) => void;
    setGameStatus: (status: "placement" | "active" | "finished") => void;
    setShipBoard: (ships: Ship[]) => void; // Player's ships
    setHitBoard: (hits: Position[]) => void; // Opponent's board's hits
    addHit: (hit: Position) => void;
    setOpponentData: (data: PlayerData) => void;
    resetGame: () => void;
};

export const useGameStore = create<GameStore>((set) => ({
    currentTurn: null,
    gameStatus: "placement",
    gameId: null,
    opponentData: null,
    shipBoard: [],
    hitBoard: [],
    setGameId: (id) => set({ gameId: id }),
    setCurrentTurn: (turn) => set({ currentTurn: turn }),
    setGameStatus: (status) => set({ gameStatus: status }),
    setShipBoard: (ships) => set({ shipBoard: ships }),
    setHitBoard: (hits) => set({ hitBoard: hits }),
    addHit: (hit) =>
        set((s) => ({
            hitBoard: [...s.hitBoard, hit],
        })),
    setOpponentData: (data) => set({ opponentData: data }),
    resetGame: () =>
        set({
            currentTurn: null,
            gameStatus: "placement",
            gameId: null,
            opponentData: null,
        }),
}));
