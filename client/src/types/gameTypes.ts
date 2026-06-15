export interface Position {
    hit: boolean;
    x: number;
    y: number;
}

export interface Ship {
    size: number;
    pos: Omit<Position, "hit">;
    rotation: "horizontal" | "vertical";
}

export type CellState = "Ship" | "HitShip" | "Miss" | "Vacant";
