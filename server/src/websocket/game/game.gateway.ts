import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { BaseGateway } from '../base.gateway';
import { GatewayService } from '../gateway.service';
import { Position } from './game.types';
import { GameService } from './game.service';
import { UseGuards } from '@nestjs/common';
import { WsReadyGuard } from '../../guards/ws-ready.guard';
import { WsThrottlerGuard } from '../../guards/ws-throttler.guard';
import { WS_CORS } from '../gateway.config';
import { Throttle } from '@nestjs/throttler';

interface GameData {
  pos: Position;
  gameId: string;
}

@UseGuards(WsReadyGuard, WsThrottlerGuard)
@WebSocketGateway({ namespace: 'game', cors: WS_CORS })
export class GameGateway extends BaseGateway {
  @WebSocketServer() server!: Server;
  constructor(
    protected readonly gatewayService: GatewayService,
    protected readonly gameService: GameService,
  ) {
    super(gatewayService);
  }

  async handleConnection(client: Socket): Promise<void> {
    await super.handleConnection(client);

    const gameId = this.gameService.getGameFromUserId(client.data.sub)?.gameId;

    if (gameId) {
      client.join(gameId);
      console.log(
        `[GameGateway] Re-added client ${client.id} to room ${gameId}`,
      );
    }
  }

  // Override base gateway disconnect handler to prevent automatic removal from online users map
  handleDisconnect(client: Socket): void {
    return;
  }

  @SubscribeMessage('join_game')
  handleJoinGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameId: string,
  ): void {
    client.join(gameId);
    console.log(`Client ${client.id} joined game ${gameId}`);

    const game = this.gameService.activeGames.get(gameId);
    if (!game) {
      client.emit('error', {
        message: 'Unexpected error: Game not found',
      });
      return;
    }

    // Game not in placement phase = rejoining a game, no need to place ships
    if (game.currentPhase !== 'placement') {
      const gameData = this.gameService.onGameRejoin(gameId, client.data.sub);
      client.emit('rejoin_game', gameData);
      return;
    }

    const { phase, shipBoard } = this.gameService.onGameJoin(
      gameId,
      client.data.sub,
    );

    client.emit('placed_ships', {
      shipBoard,
    });

    if (phase === 'active') {
      this.server.to(gameId).emit('placement_complete', {
        phase,
      });
    }
  }

  @Throttle({ default: { limit: 20, ttl: 1000 } })
  @SubscribeMessage('fire_shot')
  handleFireShot(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: GameData,
  ): void {
    const userId = client.data.sub;
    const gameId = this.gameService.getGameFromUserId(userId)?.gameId;
    const pos = data.pos;

    if (!gameId) {
      client.emit('error', {
        message: 'You are not part of any active game',
      });
      return;
    }

    console.log(
      `Client ${client.id} fired a shot in game ${gameId} at position (${pos.x}, ${pos.y})`,
    );

    try {
      const result = this.gameService.fire(gameId, userId, pos);
      this.server.to(gameId).emit('fire_result', result);

      const currentPhase = this.gameService.getPhase(gameId);
      if (currentPhase === 'finished') {
        this.gameService.removeGame(gameId);
        this.server.to(gameId).emit('game_result', {
          eloChange: 10, // Placeholder for actual ELO change calculation
        });
        console.log(`Game ${gameId} has finished and been removed.`);
      }
    } catch (err) {
      client.emit('error', {
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }
}
