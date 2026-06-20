import { Injectable } from '@nestjs/common';
import { Game } from './game';
import { Position, Ship } from './game.types';

@Injectable()
export class GameService {
  readonly activeGames = new Map<string, Game>(); // gameId -> Game

  private generateGameId(player1Id: string, player2Id: string): string {
    const sortedIds = [player1Id, player2Id].sort();
    return `${sortedIds[0]}_${sortedIds[1]}-${Date.now()}`;
  }

  onGameJoin(gameId: string, userId: string) {
    const game = this.activeGames.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    const ships = game.placeShips(userId);
    return { phase: game.currentPhase, shipBoard: ships };
  }

  onGameRejoin(
    gameId: string,
    userId: string,
  ): {
    gameId: string;
    turn: string;
    opponent: string;
    gameStatus: string;
    hitBoard: Position[];
    enemyHitBoard: Position[];
    shipBoard: Ship[];
  } {
    const game = this.activeGames.get(gameId)!;

    const opponentId =
      game.player1Id === userId ? game.player2Id : game.player1Id;

    return {
      gameId,
      turn: game.currentTurn,
      opponent: opponentId,
      gameStatus: game.currentPhase,
      hitBoard: game.getShots(userId),
      enemyHitBoard: game.getShots(opponentId),
      shipBoard: game.getShips(userId),
    };
  }

  getGameFromUserId(userId: string): { gameId: string; game: Game } | null {
    for (const [gameId, game] of this.activeGames.entries()) {
      if (game.player1Id === userId || game.player2Id === userId) {
        return { gameId, game };
      }
    }
    return null;
  }

  createGame(player1Id: string, player2Id: string) {
    const gameId = this.generateGameId(player1Id, player2Id);
    const game = new Game(player1Id, player2Id);
    this.activeGames.set(gameId, game);
    return { gameId, turn: game.currentTurn };
  }

  removeGame(gameId: string) {
    this.activeGames.delete(gameId);
  }

  fire(gameId: string, userId: string, pos: Position) {
    const game = this.activeGames.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    return game.fire(userId, pos);
  }

  getPhase(gameId: string) {
    const game = this.activeGames.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    return game.currentPhase;
  }
}
