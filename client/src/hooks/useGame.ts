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
        setShipBoard,
        addHit,
    } = useGameStore();

    useEffect(() => {
        gameSocket.on("placement_complete", () => {
            setGameStatus("active");
        });

        gameSocket.on("placed_ships", ({ shipBoard }) => {
            setShipBoard(shipBoard);
            console.log("Received ship board:", shipBoard);
        });

        gameSocket.on("fire_result", ({ isHit, won, position }) => {
            const currentTurn = useGameStore.getState().currentTurn;

            if (won) {
                setWinner(currentTurn);
                setGameStatus("finished");
                return;
            }

            addHit({ isHit, ...position });
            setCurrentTurn(currentTurn === "player" ? "opponent" : "player");
        });


        // Wait for the server's 'ready' event (auth + DB lookup complete)
        // before emitting join_game, otherwise WsReadyGuard rejects it
        const joinGame = () => gameSocket.emit("join_game", gameId);

        gameSocket.once("ready", joinGame);

        return () => {
            gameSocket.off("fire_result");
            gameSocket.off("placement_complete");
            gameSocket.off("placed_ships");
            gameSocket.off("ready", joinGame);
        };
    }, [gameId]);

    return { currentTurn, gameStatus, gameId, opponentData, winner };
}
