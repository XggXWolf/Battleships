import { Injectable } from '@nestjs/common';
import { Game } from './game';
import { GameDataDB, Position, Ship } from './game.types';
import { PrismaService } from '../../prisma/prisma.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GameService {
  readonly activeGames = new Map<string, Game>(); // gameId -> Game

  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly usersService: UsersService,
  ) {}

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

  getPlayers(gameId: string): { player1Id: string; player2Id: string } {
    const game = this.activeGames.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    return { player1Id: game.player1Id, player2Id: game.player2Id };
  }

  async createGame(player1Id: string, player2Id: string) {
    const gameId = this.generateGameId(player1Id, player2Id);
    const game = new Game(player1Id, player2Id);

    await this.updateOrCreateGameDB({
      gameId,
      player1Id,
      player2Id,
      winnerId: null,
      status: 'placement',
      endedAt: null,
    });

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

    const result = game.fire(userId, pos);

    return result;
  }

  getPhase(gameId: string) {
    const game = this.activeGames.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    return game.currentPhase;
  }

  private calculateEloChange(
    winnerElo: number,
    loserElo: number,
  ): { winnerEloChange: number; loserEloChange: number } {
    const K = 32;
    const expectedScoreWinner =
      1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
    const expectedScoreLoser =
      1 / (1 + Math.pow(10, (winnerElo - loserElo) / 400));

    const winnerEloChange = Math.round(K * (1 - expectedScoreWinner));
    const loserEloChange = Math.round(K * (0 - expectedScoreLoser));

    return { winnerEloChange, loserEloChange };
  }

  private async updateOrCreateGameDB({
    gameId,
    player1Id,
    player2Id,
    winnerId,
    status,
    endedAt,
  }: GameDataDB) {
    const res = await this.prismaService.game.upsert({
      where: { gameId },
      update: { winnerId, status, endedAt },
      create: {
        gameId,
        player1Id,
        player2Id,
        winnerId,
        status,
        endedAt,
      },
    });
    return res;
  }

  startMoveTimer(
    gameId: string,
    userId: string,
    onFire: (result: ReturnType<Game['fire']>) => void,
  ): NodeJS.Timeout {
    const game = this.activeGames.get(gameId);

    if (!game) {
      throw new Error('Game not found');
    }

    const timeoutDuration = 3 * 1000; // 30 seconds

    const timeOut = setTimeout(() => {
      const randomPos = {
        x: Math.floor(Math.random() * 10) + 1,
        y: Math.floor(Math.random() * 10) + 1,
        hit: false,
      };

      while (
        game
          .getShots(userId)
          .some((shot) => shot.x === randomPos.x && shot.y === randomPos.y)
      ) {
        randomPos.x = Math.floor(Math.random() * 10) + 1;
        randomPos.y = Math.floor(Math.random() * 10) + 1;
      }

      try {
        const result = game.fire(userId, randomPos);
        onFire(result);
      } catch (err) {
        console.error(`[MoveTimer] Error firing shot for game ${gameId}:`, err);
      }
    }, timeoutDuration);

    game.moveTimer = timeOut;

    return timeOut;
  }

  clearMoveTimer(gameId: string) {
    const game = this.activeGames.get(gameId);
    if (!game || !game.moveTimer) {
      return;
    }

    clearTimeout(game.moveTimer);
    game.moveTimer = null;
  }

  startTimeout(
    gameId: string,
    disconnectedUserId: string,
    onFinalize: (
      finalResult: Awaited<ReturnType<GameService['finalizeGame']>>,
    ) => void,
  ): NodeJS.Timeout {
    const game = this.activeGames.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    const timeoutDuration = 10 * 1000; // 30 seconds

    console.log(
      `Starting disconnect timeout for game ${gameId} due to user ${disconnectedUserId} disconnecting.`,
    );

    const timeOut = setTimeout(() => {
      const winnerId =
        game.player1Id === disconnectedUserId ? game.player2Id : game.player1Id;

      console.log(
        `Disconnect timeout reached for game ${gameId}. User ${disconnectedUserId} did not reconnect. Declaring user ${winnerId} as the winner.`,
      );

      this.finalizeGame(gameId, winnerId)
        .then(onFinalize)
        .catch((err) => {
          console.error(`[Timeout] Failed to finalize game ${gameId}:`, err);
        });
    }, timeoutDuration);

    game.disconnectTimer = timeOut;

    return timeOut;
  }

  clearTimeout(gameId: string) {
    const game = this.activeGames.get(gameId);
    if (!game || !game.disconnectTimer) {
      return;
    }

    clearTimeout(game.disconnectTimer);
    game.disconnectTimer = null;
  }

  async finalizeGame(gameId: string, winnerId: string) {
    const game = this.activeGames.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    if (game.disconnectTimer) {
      clearTimeout(game.disconnectTimer);
      game.disconnectTimer = null;
    }

    await this.updateOrCreateGameDB({
      gameId,
      player1Id: game.player1Id,
      player2Id: game.player2Id,
      winnerId,
      status: 'finished',
      endedAt: new Date(),
    });

    const { player1Id, player2Id } = game;
    const loserId = winnerId === player1Id ? player2Id : player1Id;

    const [winner, loser] = await Promise.all([
      this.usersService.findMe(winnerId),
      this.usersService.findMe(loserId),
    ]);

    if (!winner || !loser) {
      throw new Error('Unexpected error: Winner or loser not found');
    }

    const { winnerEloChange, loserEloChange } = this.calculateEloChange(
      winner.elo,
      loser.elo,
    );

    await this.usersService.update(winnerId, {
      elo: winner.elo + winnerEloChange,
    });

    await this.usersService.update(loserId, {
      elo: loser.elo + loserEloChange,
    });

    return {
      winnerElo: winner.elo,
      loserElo: loser.elo,
      winnerId,
      loserId,
      winnerEloChange,
      loserEloChange,
    };
  }
}
