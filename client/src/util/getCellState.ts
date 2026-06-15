import type { CellState, Position, Ship } from "../types/gameTypes";

const occupies = (s: Ship): string[] => {
    let positions = [] as string[];
    for (let i = 0; i < s.size; i++) {
        const cx = s.rotation === "horizontal" ? s.pos.x + i : s.pos.x;
        const cy = s.rotation === "vertical" ? s.pos.y + i : s.pos.y;
        positions.push(`${cx},${cy}`);
    }

    return positions;
};

export default function getCellState(
    x: number,
    y: number,
    shipBoard: Ship[],
    enemyHits: Position[],
    playerHits: Position[],
    currentTurn: "player" | "opponent" | null,
): { size: number; cellState: CellState } {
    let result = { size: 0, cellState: "Vacant" as CellState };

    if (currentTurn === "opponent") {
        if (enemyHits.some((hit) => hit.x === x && hit.y === y && !hit.hit)) {
            result.cellState = "Miss";
        }

        for (const ship of shipBoard) {
            const positions = occupies(ship);
            if (positions.includes(`${x},${y}`)) {
                result = { size: ship.size, cellState: "Ship" };
                break;
            }
        }

        if (enemyHits.some((hit) => hit.x === x && hit.y === y && hit.hit)) {
            result.cellState = "HitShip";
        }

        console.log(
            `Cell (${x}, ${y}) state: ${result.cellState}, size: ${result.size}`,
        );
    } else if (currentTurn === "player") {
        if (playerHits.some((hit) => hit.x === x && hit.y === y && !hit.hit)) {
            result.cellState = "Miss";
        }

        if (playerHits.some((hit) => hit.x === x && hit.y === y && hit.hit)) {
            result.cellState = "HitShip";
        }
    }

    return result;
}
