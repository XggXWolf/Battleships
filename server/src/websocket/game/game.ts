import { Position, Ship } from './game.types';

export class Game {
  private boards = new Map<string, Ship[]>(); // userId -> ships
  private shots = new Map<string, Position[]>(); // userId -> shots
  private turn: string; // userId
  private phase: 'placement' | 'active' | 'finished' = 'placement';
  private disconnectTimeout: NodeJS.Timeout | null = null;
  private moveTimeout: NodeJS.Timeout | null = null;

  get disconnectTimer() {
    return this.disconnectTimeout;
  }

  set disconnectTimer(timeout: NodeJS.Timeout | null) {
    this.disconnectTimeout = timeout;
  }

  get moveTimer() {
    return this.moveTimeout;
  }

  set moveTimer(timeout: NodeJS.Timeout | null) {
    this.moveTimeout = timeout;
  }

  get currentTurn() {
    return this.turn;
  }

  get currentPhase() {
    return this.phase;
  }

  constructor(
    readonly player1Id: string,
    readonly player2Id: string,
  ) {
    this.turn = player1Id;
  }

  getShots(userId: string): Position[] {
    return this.shots.get(userId) ?? [];
  }

  getShips(userId: string): Ship[] {
    return this.boards.get(userId) ?? [];
  }

  private occupies = (s: Ship): string[] => {
    let positions = [] as string[];
    for (let i = 0; i < s.size; i++) {
      const cx = s.rotation === 'horizontal' ? s.pos.x + i : s.pos.x;
      const cy = s.rotation === 'vertical' ? s.pos.y + i : s.pos.y;
      positions.push(`${cx},${cy}`);
    }

    return positions;
  };

  placeShips(userId: string, ships?: Ship[]) {
    if (userId !== this.player1Id && userId !== this.player2Id) {
      throw new Error('Invalid player');
    }

    if (this.phase !== 'placement') {
      throw new Error('Cannot place ships after the placement phase');
    }

    if (this.boards.has(userId)) {
      throw new Error('Player has already placed ships');
    }

    // Random ship placement for vs Bot Mode
    if (!ships) {
      let shipSizes = [5, 4, 3, 3, 2];
      let placed = [] as Ship[];

      shipSizes.forEach((size) => {
        let rotation: 'horizontal' | 'vertical';
        let pos: Position;

        do {
          rotation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
          if (rotation === 'horizontal') {
            pos = {
              x: Math.floor(Math.random() * (10 - size + 1)) + 1,
              y: Math.floor(Math.random() * 10) + 1,
              hit: false,
            };
          } else {
            pos = {
              x: Math.floor(Math.random() * 10) + 1,
              y: Math.floor(Math.random() * (10 - size + 1)) + 1,
              hit: false,
            };
          }
        } while (
          this.occupies({ size, pos, rotation }).some((p) =>
            placed.flatMap(this.occupies).includes(p),
          )
        );

        placed.push({ size, pos, rotation });
      });

      this.boards.set(userId, placed);

      if (this.bothPlaced()) {
        this.phase = 'active';
      }

      return placed;
    }

    if (ships.length !== 5) {
      throw new Error('Must place exactly 5 ships');
    }

    // NOT IMPLEMENTED: Manual ship placement

    return null;
  }

  private bothPlaced() {
    return this.boards.has(this.player1Id) && this.boards.has(this.player2Id);
  }

  private isShipSunk(ship: Ship, shots: Position[]): boolean {
    const occupied = this.occupies(ship);
    return occupied.every((cell) =>
      shots.some((s) => cell === `${s.x},${s.y}`),
    );
  }

  // Bug: Doesnt this thing accept float values ?
  private isWithinBounds(pos: Position): boolean {
    return pos.x >= 1 && pos.x <= 10 && pos.y >= 1 && pos.y <= 10;
  }

  fire(
    userId: string,
    position: Position,
  ): {
    isHit: boolean;
    sunk: Ship | null;
    won: boolean;
    position: Position;
    turn: string;
  } {
    if (this.phase !== 'active') {
      throw new Error('Game is not in active phase');
    }

    if (this.turn !== userId) {
      throw new Error('Not your turn');
    }

    if (!this.isWithinBounds(position)) {
      throw new Error('Position out of bounds');
    }

    if (!this.shots.has(userId)) {
      this.shots.set(userId, []);
    }

    const opponentId =
      userId === this.player1Id ? this.player2Id : this.player1Id;
    let targetBoard = this.boards.get(opponentId)!;

    const playerShots = this.shots.get(userId)!;

    const alreadyFired = playerShots.some(
      (s) => s.x === position.x && s.y === position.y,
    );

    if (alreadyFired) {
      throw new Error('Already fired at this position');
    }

    const hitShip =
      targetBoard.find((ship) =>
        this.occupies(ship).some(
          (cell) => cell === `${position.x},${position.y}`,
        ),
      ) ?? null;

    playerShots.push({ ...position, hit: !!hitShip });

    const sunk =
      hitShip && this.isShipSunk(hitShip, playerShots) ? hitShip : null;

    const allOpponentCells = targetBoard.flatMap(this.occupies);
    const won = allOpponentCells.every((cell) =>
      playerShots.some((s) => cell === `${s.x},${s.y}`),
    );

    if (won) {
      this.phase = 'finished';
    } else if (!hitShip) {
      this.turn = opponentId;
    }

    return { isHit: !!hitShip, sunk, won, position, turn: this.turn };
  }

  getWinner() {
    if (this.phase !== 'finished') {
      return null;
    }

    return this.turn;
  }
}
