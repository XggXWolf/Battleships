import React from "react";
import "./GameGrid.css";
import GridButton from "./GridButton";

const GRID_SIZE = 10;

export default function GameGrid() {
    const [clickedCells, setClickedCells] = React.useState<Set<string>>(
        new Set(),
    );

    const handleCellClick = (row: number, col: number) => {
        const cellKey = `${row}-${col}`;
        setClickedCells((prev) => new Set(prev).add(cellKey));
    };

    return (
        <div
            className="grow bg-primary p-3 sm:p-4 rounded-xl shadow-lg border border-color-border flex flex-col items-center justify-center min-h-0
    "
        >
            <h2 className="text-xl font-bold mb-2 text-blue-300">YOUR TURN</h2>

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
