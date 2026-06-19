import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GatewayService } from '../gateway.service';
import { MatchmakingQueue } from '../util/playerQueue';
import { GameService } from '../game/game.service';

@Injectable()
export class LobbyGatewayService {
  constructor(
    private gatewayService: GatewayService,
    protected readonly gameService: GameService,
  ) {}

  readonly playerQueue = new MatchmakingQueue(); // userId -> elo

  handleQueueJoin(client: Socket) {
    const userId = client.data.sub;
    if (this.playerQueue.has(userId)) {
      console.log(`Client ${client.id} is already in the queue, re-adding`);
      this.handleQueueLeave(client);
    }

    this.playerQueue.insert({ userId: userId, elo: client.data.elo });

    client.join('queue');
    console.log(`Client ${client.id} joined the queue`);

    const match = this.findMatch();
    if (match) {
      console.log(
        `Match found between ${match.player1.id} and ${match.player2.id}`,
      );

      match.player1.leave('queue');
      match.player2.leave('queue');

      const { gameId, turn } = this.gameService.createGame(
        match.player1.data.sub,
        match.player2.data.sub,
      );

      let player1DataStripped = {
        nickname: match.player1.data.nickname,
        elo: match.player1.data.elo,
        id: match.player1.data.sub,
        role: match.player1.data.role,
      };

      let player2DataStripped = {
        nickname: match.player2.data.nickname,
        elo: match.player2.data.elo,
        id: match.player2.data.sub,
        role: match.player2.data.role,
      };

      console.log('player1DataStripped:', player1DataStripped);
      console.log('player2DataStripped:', player2DataStripped);

      match.player1.emit('match_found', {
        gameId,
        turn,
        opponent: player2DataStripped,
      });
      match.player2.emit('match_found', {
        gameId,
        turn,
        opponent: player1DataStripped,
      });
    }
  }

  handleQueueLeave(client: Socket) {
    console.log(client.data.sub);
    console.log(this.playerQueue);

    this.playerQueue.remove(client.data.sub);

    client.leave('queue');
    console.log(`Client ${client.id} left the queue`);
  }

  findMatch(): { player1: Socket; player2: Socket } | null {
    if (this.playerQueue.size < 2) {
      return null;
    }

    const p1Entry = this.playerQueue.peek();
    const p2Candidate = this.playerQueue.peekIndex(1);

    if (!p1Entry || !p2Candidate) {
      return null;
    }

    const player1 = this.gatewayService.onlineUsers.get(p1Entry.userId);
    const player2 = this.gatewayService.onlineUsers.get(p2Candidate.userId);

    if (!player1) {
      this.playerQueue.pop();
      return this.findMatch();
    }

    if (!player2) {
      this.playerQueue.remove(p2Candidate.userId);
      return this.findMatch();
    }

    this.playerQueue.pop();
    this.playerQueue.pop();

    return { player1, player2 };
  }
}
