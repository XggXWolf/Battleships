import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewayService } from './gateway.service';

export abstract class BaseGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(protected readonly gatewayService: GatewayService) {}

  afterInit(server: Server) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    await this.gatewayService.handleConnection(client);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.gatewayService.handleDisconnect(client);
  }
}
