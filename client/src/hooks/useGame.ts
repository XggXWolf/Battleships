import { useEffect, useState } from "react";
import { useGameStore } from "../stores/useGameStore";
import { gameSocket } from "../lib/socket";

export default function useGame() {
    const [winner, setWinner] = useState<"player" | "opponent" | null>(null);

    const {
        currentTurn,
        gameStatus,
        gameId,
        opponentData,
        setCurrentTurn,
        setGameStatus,
    } = useGameStore();

    useEffect(() => {
        gameSocket.on("fire_result", ({ hitShip, sunk, won, position }) => {
            const currentTurn = useGameStore.getState().currentTurn;

            if (won) {
                setWinner(currentTurn);
                setGameStatus("finished");
                return;
            }

            setCurrentTurn(currentTurn === "player" ? "opponent" : "player");
        });

        return () => {
            gameSocket.off("fire_result");
        };
    }, []);

    return { currentTurn, gameStatus, gameId, opponentData, winner };
}
