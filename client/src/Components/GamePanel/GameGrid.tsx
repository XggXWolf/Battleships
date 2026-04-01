import React from "react";
import "./GameGrid.css";
import GridButton from "./GridButton";

const GRID_SIZE = 10;

interface GameGridProps {
    currentTurn?: "player" | "opponent" | null; // TO-DO: Hook with Zustand to get current turn, null for "Standing By"
}

export default function GameGrid({ currentTurn }: GameGridProps) {
    const [clickedCells, setClickedCells] = React.useState<Set<string>>(
        new Set(),
    );

    const handleCellClick = (row: number, col: number) => {
        const cellKey = `${row}-${col}`;
        setClickedCells((prev) => new Set(prev).add(cellKey));
    };

    const glows = {
        default: {
            label: "Neutral Steel",
            color: "text-gray-500",
            bg: "bg-gray-700",
            rgb: "156, 163, 175",
        },
        opponent: {
            label: "Pulse Red",
            color: "text-red-500/80",
            bg: "bg-red-800/40",
            rgb: "248, 113, 113",
        },
        player: {
            label: "Vital Green",
            color: "text-green-500/80",
            bg: "bg-green-800/40",
            rgb: "74, 222, 128",
        },
    };

    const currentGlow = currentTurn ? glows[currentTurn] : glows.default;

    return (
        <div
            className="grow bg-primary p-3 sm:p-4 rounded-xl shadow-lg border border-color-border flex flex-col items-center justify-center min-h-0 transition-all duration-1000 animate-glow-heartbeat"
            style={{ "--glow-rgb": currentGlow.rgb } as React.CSSProperties}
        >
            <div id="game-grid-container" className="w-full max-w-xl">
                <div
                    id="game-grid"
                    className="grid grid-cols-[1rem_repeat(10,1fr)] grid-rows-[1rem_repeat(10,1fr)] gap-0.5 w-full"
                >
                    {/* Corner space */}
                    <div className="col-span-1 row-span-1" />

                    {/* Column labels */}
                    {Array.from({ length: GRID_SIZE }, (_, i) => (
                        <div key={`col-label-${i}`} className="grid-label">
                            {String.fromCharCode(65 + i)}
                        </div>
                    ))}

                    {/* Rows */}
                    {Array.from({ length: GRID_SIZE }, (_, row) => (
                        <React.Fragment key={`row-${row}`}>
                            {/* Row label */}
                            <div className="grid-label">{row + 1}</div>

                            {/* Grid cells */}
                            {Array.from({ length: GRID_SIZE }, (_, col) => (
                                <GridButton
                                    key={`cell-${row}-${col}`}
                                    coordinates={{
                                        row,
                                        col,
                                    }}
                                    onClick={() => handleCellClick(row, col)}
                                    isClicked={clickedCells.has(
                                        `${row}-${col}`,
                                    )}
                                />
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
}
