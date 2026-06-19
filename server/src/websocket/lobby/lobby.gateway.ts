import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { BaseGateway } from '../base.gateway';
import { LobbyGatewayService } from './lobby.gateway.service';
import { GatewayService } from '../gateway.service';
import { WsReadyGuard } from '../../guards/ws-ready.guard';
import { UseGuards } from '@nestjs/common';
import { WS_CORS } from '../gateway.config';

@UseGuards(WsReadyGuard)
@WebSocketGateway({ namespace: 'lobby', cors: WS_CORS })
export class LobbyGateway extends BaseGateway {
  @WebSocketServer() server!: Server;
  constructor(
    protected readonly gatewayService: GatewayService,
    private readonly lobbyGatewayService: LobbyGatewayService,
  ) {
    super(gatewayService);
  }

  @SubscribeMessage('join_queue')
  handleQueueJoin(@ConnectedSocket() client: Socket): void {
    this.lobbyGatewayService.handleQueueJoin(client);
  }

  @SubscribeMessage('leave_queue')
  handleQueueLeave(@ConnectedSocket() client: Socket): void {
    this.lobbyGatewayService.handleQueueLeave(client);
  }

  handleDisconnect(@ConnectedSocket() client: Socket): void {
    this.lobbyGatewayService.handleQueueLeave(client);
    super.handleDisconnect(client);
  }
}
