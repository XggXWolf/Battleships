import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UsersService } from '../users/users.service';
import { GatewayService } from './gateway.service';

export abstract class BaseGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(protected readonly gatewayService: GatewayService) {}

  afterInit(server: Server) {}

  handleConnection(client: any) {
    this.gatewayService.handleConnection(client);
  }

  handleDisconnect(client: any) {
    this.gatewayService.handleDisconnect(client);
  }
}
