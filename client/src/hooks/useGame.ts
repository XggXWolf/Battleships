import { useEffect } from "react";
import { useGameStore } from "../stores/useGameStore";
import { gameSocket } from "../lib/socket";

export default function useGame() {
    const { currentTurn, gameStatus, gameId, opponentData, winner } =
        useGameStore();

    useEffect(() => {
        // Wait for the server's 'ready' event (auth + DB lookup complete)
        // before emitting join_game, otherwise WsReadyGuard rejects it
        const joinGame = () =>
            gameSocket.emit("join_game", useGameStore.getState().gameId);

        if (gameSocket.connected && (gameSocket as any).authReady) {
            joinGame();
        } else {
            gameSocket.once("ready", joinGame);
        }

        return () => {
            gameSocket.off("ready", joinGame);
        };
    }, [gameId]);

    return { currentTurn, gameStatus, gameId, opponentData, winner };
}
