import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { BaseGateway } from '../base.gateway';
import { LobbyGatewayService } from './lobby.gateway.service';
import { UsersService } from '../../users/users.service';
import { GatewayService } from '../gateway.service';

@WebSocketGateway({ namespace: 'lobby' })
export class LobbyGateway extends BaseGateway {
  async handleConnection(client: any): Promise<void> {
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
    client.leave('queue');
    console.log(`Client ${client.id} left the queue`);
  }

  handleDisconnect(client: any): void {
    this.lobbyGatewayService.handleQueueLeave(client);
    super.handleDisconnect(client);
  }
}
