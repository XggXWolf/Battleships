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
  ) { }

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

      const gameId = this.gameService.createGame(
        match.player1.data.sub,
        match.player2.data.sub,
      );


      let player1DataStripped = {
        username: match.player1.data.username,
        elo: match.player1.data.elo,
        sub: match.player1.data.sub,
      };

      let player2DataStripped = {
        username: match.player2.data.username,
        elo: match.player2.data.elo,
        sub: match.player2.data.sub,
      };

      match.player1.emit('match_found', {
        opponent: player2DataStripped,
        gameId,
      });
      match.player2.emit('match_found', {
        opponent: player1DataStripped,
        gameId,
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

    const player1Entry = this.playerQueue.pop();
    const player2Entry = this.playerQueue.pop();

    if (!player1Entry || !player2Entry) {
      return null;
    }

    const player1 = this.gatewayService.onlineUsers.get(player1Entry.userId);
    const player2 = this.gatewayService.onlineUsers.get(player2Entry.userId);

    if (!player1 || !player2) {
      if (player1) this.playerQueue.insert(player1Entry);
      if (player2) this.playerQueue.insert(player2Entry);
      return null;
    }

    return { player1, player2 };
  }
}
