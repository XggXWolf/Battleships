export interface Position {
  x: number;
  y: number;
  hit: boolean;
}

export interface Ship {
  size: number;
  pos: Position;
  rotation: 'horizontal' | 'vertical';
}
