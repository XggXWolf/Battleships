import { useGameStore } from "../stores/useGameStore";
import { useUserStore } from "../stores/useUserStore";
import { gameSocket } from "./socket";

let bound = false;

export function bindGameSocketListeners() {
    if (bound) return;
    bound = true;

    gameSocket.on("placement_complete", () => {
        useGameStore.getState().setGameStatus("active");
    });

    gameSocket.on("rejoin_game", (gameData) => {
        const user = useUserStore.getState().user;
        useGameStore.getState().resetGame();
        useGameStore.getState().setGameId(gameData.gameId);
        useGameStore
            .getState()
            .setCurrentTurn(gameData.turn === user.id ? "player" : "opponent");
        useGameStore.getState().setOpponentData(gameData.opponent);
        useGameStore.getState().setGameStatus(gameData.gameStatus);
        useGameStore.getState().setHitBoard(gameData.hitBoard);
        useGameStore.getState().setEnemyHits(gameData.enemyHitBoard);
        useGameStore.getState().setShipBoard(gameData.shipBoard);
    });

    gameSocket.on("placed_ships", ({ shipBoard }) => {
        useGameStore.getState().setShipBoard(shipBoard);
        console.log("Received ship board:", shipBoard);
    });

    gameSocket.on(
        "game_result",
        ({ winnerId, winnerEloChange, loserEloChange }) => {
            const eloChange =
                useUserStore.getState().user.id === winnerId
                    ? winnerEloChange
                    : loserEloChange;
            useGameStore
                .getState()
                .setWinner(
                    winnerId === useUserStore.getState().user.id
                        ? "player"
                        : "opponent",
                );
            useGameStore.getState().setGameStatus("finished");

            useGameStore.getState().setEloChange(Math.abs(eloChange));
            useUserStore.getState().updateElo(eloChange);
        },
    );

    // Not yet implemented
    gameSocket.on("opponent_disconnected", ({ timeout }) => {
        console.log(`Opponent disconnected. Timeout: ${timeout} seconds.`);
    });

    gameSocket.on("fire_result", ({ isHit, won, position, turn }) => {
        const currentTurn = useGameStore.getState().currentTurn;
        const playerId = useUserStore.getState().user.id;

        if (currentTurn === "player") {
            useGameStore.getState().addHit({ hit: isHit, ...position });
        } else {
            useGameStore.getState().addEnemyHit({ hit: isHit, ...position });
            console.log(useGameStore.getState().enemyHits);
        }

        if (!won) {
            useGameStore
                .getState()
                .setCurrentTurn(turn === playerId ? "player" : "opponent");
        }
    });

    gameSocket.on("error", (error) => {
        console.error("Error from server:", error);
    });
}
