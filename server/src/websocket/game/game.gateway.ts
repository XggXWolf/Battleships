import {
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

interface GameData {
  pos: Position;
  gameId: string;
}

@UseGuards(WsReadyGuard)
@WebSocketGateway({ namespace: 'game' })
export class GameGateway extends BaseGateway {
  @WebSocketServer() server!: Server;
  constructor(
    protected readonly gatewayService: GatewayService,
    protected readonly gameService: GameService,
  ) {
    super(gatewayService);
  }

  @SubscribeMessage('join_game')
  handleJoinGame(client: Socket, gameId: string): void {
    client.join(gameId);
    console.log(`Client ${client.id} joined game ${gameId}`);
  }

  @SubscribeMessage('fire_shot')
  handleFireShot(client: Socket, data: GameData): void {
    const userId = client.data.sub;
    const { pos, gameId } = data;

    try {
      const result = this.gameService.fire(gameId, userId, pos);
      this.server.to(gameId).emit('fire_result', result);
    } catch (err) {
      client.emit('error', {
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }
}
