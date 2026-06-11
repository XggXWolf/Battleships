import { Position, Ship } from './game.types';

class Game {
  private boards = new Map<string, Ship[]>(); // userId -> ships
  private shots = new Map<string, Position[]>(); // userId -> shots
  private turn: string; // userId
  private phase: 'placement' | 'active' | 'finished' = 'placement';

  constructor(
    readonly player1Id: string,
    readonly player2Id: string,
  ) {
    this.turn = player1Id;
  }

  placeShips(userId: string, ships?: Ship[]) {
    const occupies = (s: Ship): string[] => {
      let positions = [] as string[];
      for (let i = 0; i < s.size; i++) {
        const cx = s.rotation === 'horizontal' ? s.pos.x + i : s.pos.x;
        const cy = s.rotation === 'vertical' ? s.pos.y + i : s.pos.y;
        positions.push(`${cx},${cy}`);
      }

      return positions;
    };

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
              x: Math.floor(Math.random() * (10 - size + 1)),
              y: Math.floor(Math.random() * 10),
            };
          } else {
            pos = {
              x: Math.floor(Math.random() * 10),
              y: Math.floor(Math.random() * (10 - size + 1)),
            };
          }
        } while (
          occupies({ size, pos, rotation }).some((p) =>
            placed.flatMap(occupies).includes(p),
          )
        );

        placed.push({ size, pos, rotation });
      });

      this.boards.set(userId, placed);

      if (this.bothPlaced()) {
        this.phase = 'active';
      }

      return true;
    }

    if (ships.length !== 5) {
      throw new Error('Must place exactly 5 ships');
    }

    // NOT IMPLEMENTED: Manual ship placement

    return false;
  }

  bothPlaced() {
    return this.boards.has(this.player1Id) && this.boards.has(this.player2Id);
  }
}
