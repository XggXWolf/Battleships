import { useEffect, useState } from "react";
import { useGameStore } from "../stores/useGameStore";
import { gameSocket } from "../lib/socket";
import { useUserStore } from "../stores/useUserStore";

export default function useGame() {
    const [winner, setWinner] = useState<"player" | "opponent" | null>(null);

    const {
        currentTurn,
        gameStatus,
        gameId,
        opponentData,
        enemyHits,
        setCurrentTurn,
        setGameStatus,
        setShipBoard,
        addHit,
        addEnemyHit,
    } = useGameStore();

    useEffect(() => {
        gameSocket.on("placement_complete", () => {
            setGameStatus("active");
        });

        gameSocket.on("placed_ships", ({ shipBoard }) => {
            setShipBoard(shipBoard);
            console.log("Received ship board:", shipBoard);
        });

        gameSocket.on("fire_result", ({ isHit, won, position, turn }) => {
            const currentTurn = useGameStore.getState().currentTurn;
            const playerId = useUserStore.getState().user.id;

            if (currentTurn === "player") {
                addHit({ hit: isHit, ...position });
            } else {
                addEnemyHit({ hit: isHit, ...position });
                console.log(enemyHits);
            }

            if (won) {
                setWinner(currentTurn);
                setGameStatus("finished");
                return;
            }

            setCurrentTurn(turn === playerId ? "player" : "opponent");
        });

        gameSocket.on("error", (error) => {
            console.error("Error from server:", error);
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
            gameSocket.off("error");
        };
    }, [gameId]);

    return { currentTurn, gameStatus, gameId, opponentData, winner };
}
