import { Injectable } from '@nestjs/common';
import { Game } from './game';
import { Position } from './game.types';

@Injectable()
export class GameService {
    readonly activeGames = new Map<string, Game>();

    private generateGameId(player1Id: string, player2Id: string): string {
        const sortedIds = [player1Id, player2Id].sort();
        return `${sortedIds[0]}_${sortedIds[1]}-${Date.now()}`;
    }

    createGame(player1Id: string, player2Id: string): string {
        const gameId = this.generateGameId(player1Id, player2Id);
        const game = new Game(player1Id, player2Id);
        this.activeGames.set(gameId, game);
        return gameId;
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
}
