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
import { WS_CORS } from '../gateway.config';

interface GameData {
  pos: Position;
  gameId: string;
}

@UseGuards(WsReadyGuard)
@WebSocketGateway({ namespace: 'game', cors: WS_CORS })
export class GameGateway extends BaseGateway {
  @WebSocketServer() server!: Server;
  constructor(
    protected readonly gatewayService: GatewayService,
    protected readonly gameService: GameService,
  ) {
    super(gatewayService);
  }

  @SubscribeMessage('join_game')
  handleJoinGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameId: string,
  ): void {
    client.join(gameId);
    console.log(`Client ${client.id} joined game ${gameId}`);

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

  // TO-DO : fetch gameId from active games in gateway service instead of client sending it
  @SubscribeMessage('fire_shot')
  handleFireShot(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: GameData,
  ): void {
    const userId = client.data.sub;
    const { pos, gameId } = data;

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
