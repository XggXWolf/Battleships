import {
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

@UseGuards(WsReadyGuard)
@WebSocketGateway({ namespace: 'lobby' })
export class LobbyGateway extends BaseGateway {
  async handleConnection(client: Socket): Promise<void> {
    await super.handleConnection(client);
  }

  @WebSocketServer() server!: Server;
  constructor(
    protected readonly gatewayService: GatewayService,
    private readonly lobbyGatewayService: LobbyGatewayService,
  ) {
    super(gatewayService);
  }

  @SubscribeMessage('join_queue')
  handleQueueJoin(client: Socket): void {
    this.lobbyGatewayService.handleQueueJoin(client);
  }

  @SubscribeMessage('leave_queue')
  handleQueueLeave(client: Socket): void {
    this.lobbyGatewayService.handleQueueLeave(client);
  }

  handleDisconnect(client: Socket): void {
    this.lobbyGatewayService.handleQueueLeave(client);
    super.handleDisconnect(client);
  }
}
