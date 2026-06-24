import { useGameStore } from "../stores/useGameStore";
import { useUserStore } from "../stores/useUserStore";
import { gameSocket } from "./socket";

let bound = false;
let disconnectInterval: ReturnType<typeof setInterval> | null = null;
let moveInterval: ReturnType<typeof setInterval> | null = null;

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
            if (disconnectInterval) {
                clearInterval(disconnectInterval);
                disconnectInterval = null;
            }
            if (moveInterval) {
                clearInterval(moveInterval);
                moveInterval = null;
            }

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

    const startDisconnectTimer = (timeout: number) => {
        if (disconnectInterval) {
            clearInterval(disconnectInterval);
        }

        useGameStore.getState().setOpponentDisconnected(true);
        useGameStore.getState().setDisconnectTimer(timeout);

        disconnectInterval = setInterval(() => {
            const currentTimer = useGameStore.getState().disconnectTimer;
            if (currentTimer !== null && currentTimer > 0) {
                useGameStore.getState().setDisconnectTimer(currentTimer - 1);
            } else {
                clearInterval(disconnectInterval!);
                disconnectInterval = null;
            }
        }, 1000);
    };

    gameSocket.on("opponent_disconnected", ({ timeout }) => {
        console.log(`Opponent disconnected. Timeout: ${timeout} seconds.`);
        startDisconnectTimer(timeout);
    });

    const startMoveTimer = (time: number) => {
        if (moveInterval) {
            clearInterval(moveInterval);
        }

        useGameStore.getState().setMoveTimer(time);

        moveInterval = setInterval(() => {
            const currentTimer = useGameStore.getState().moveTimer;
            if (currentTimer !== null && currentTimer > 0) {
                useGameStore.getState().setMoveTimer(currentTimer - 1);
            } else {
                clearInterval(moveInterval!);
                moveInterval = null;
            }
        }, 1000);
    };

    gameSocket.on("fire_result", ({ isHit, won, position, turn }) => {
        const currentTurn = useGameStore.getState().currentTurn;
        const playerId = useUserStore.getState().user.id;

        if (currentTurn === "player") {
            useGameStore.getState().addHit({ hit: isHit, ...position });
        } else {
            useGameStore.getState().addEnemyHit({ hit: isHit, ...position });
            console.log(useGameStore.getState().enemyHits);
        }

        startMoveTimer(60);

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
