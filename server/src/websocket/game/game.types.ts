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

export interface GameDataDB {
  gameId: string;
  player1Id: string;
  player2Id: string;
  winnerId: string | null;
  status: 'placement' | 'active' | 'finished';
  endedAt: Date | null;
}
