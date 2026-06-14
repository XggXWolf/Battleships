import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from '../users/users.service';
import { GatewayService } from './gateway.service';

export abstract class BaseGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(protected readonly gatewayService: GatewayService) {}

  afterInit(server: Server) {}

  handleConnection(client: Socket) {
    this.gatewayService.handleConnection(client);
  }

  handleDisconnect(client: Socket) {
    this.gatewayService.handleDisconnect(client);
  }
}
