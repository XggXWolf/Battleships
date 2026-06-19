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

    gameSocket.on("placed_ships", ({ shipBoard }) => {
        useGameStore.getState().setShipBoard(shipBoard);
        console.log("Received ship board:", shipBoard);
    });

    gameSocket.on("game_result", ({ eloChange }) => {
        useGameStore.getState().setEloChange(eloChange);
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

        if (won) {
            useGameStore.getState().setWinner(currentTurn);
            useGameStore.getState().setGameStatus("finished");
            return;
        }

        useGameStore
            .getState()
            .setCurrentTurn(turn === playerId ? "player" : "opponent");
    });

    gameSocket.on("error", (error) => {
        console.error("Error from server:", error);
    });
}
