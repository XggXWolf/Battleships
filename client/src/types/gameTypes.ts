export interface Position {
    hit: boolean;
    x: number;
    y: number;
}

export interface Ship {
    size: number;
    pos: Position;
    rotation: "horizontal" | "vertical";
}
