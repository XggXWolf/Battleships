import { gameSocket } from "../../../lib/socket";
import { useGameStore } from "../../../stores/useGameStore";
import { useShallow } from "zustand/shallow";
import type { CellState } from "../../../types/gameTypes";
import "./GameGrid.css";
import getCellState from "../../../util/getCellState";

interface GridButtonProps {
    coordinates: { row: number; col: number };
}

const numberToLetter = (num: number) => String.fromCharCode(65 + num);

const shipColors = {
    2: "bg-cyan-500/50 border-cyan-400",
    3: "bg-teal-500/50 border-teal-400",
    4: "bg-purple-500/50 border-purple-400",
    5: "bg-pink-500/50 border-pink-400",
} as Record<number, string>;

const getStateStyles = ({
    size,
    cellState,
}: {
    size: number;
    cellState: CellState;
}): string => {
    switch (cellState) {
        case "Ship":
            return shipColors[size];
        case "HitShip":
            return "bg-rose-900/20 border-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.7)] animate-pulse";
        case "Miss":
            return "bg-slate-400/20 border-slate-300/30";
        default:
            return "bg-blue-900/30 border-blue-800/40 hover:bg-blue-800/50 active:bg-blue-700/70 transition";
    }
};
export default function GridButton({ coordinates }: GridButtonProps) {
    const gameId = useGameStore((s) => s.gameId);

    const state = useGameStore(
        useShallow((s) =>
            getCellState(
                coordinates.col,
                coordinates.row,
                s.shipBoard,
                s.enemyHits,
                s.hitBoard,
                s.currentTurn,
            ),
        ),
    );

    function fireShot() {
        console.log(`Firing shot at ${coordinates.row}, ${coordinates.col}`);
        const position = { x: coordinates.col, y: coordinates.row };

        gameSocket.emit("fire_shot", {
            gameId,
            pos: position,
        });
    }

    return (
        <button
            className={`grid-cell ${getStateStyles(state)} rounded-sm border`}
            onClick={fireShot}
            id={`cell-${coordinates.row}-${coordinates.col}`}
            disabled={!gameId}
        >
            <div className="grid-cell-content text-gray-400">{`${numberToLetter(coordinates.col - 1)}${coordinates.row}`}</div>
        </button>
    );
}
