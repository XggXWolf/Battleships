import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

export abstract class BaseGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(protected readonly jwtService: JwtService) {}

  afterInit(server: Server) {}

  async handleConnection(client: any) {
    const token = client.handshake.auth?.token;

    if (!token) {
      client.emit('error', { message: 'Unauthorized: No token provided' });
      console.log('Unauthorized connection attempt. Disconnecting...');
      client.disconnect(true);
      return;
    }

    try {
      const decoded = this.jwtService.verify(token);
      client.user = decoded;
    } catch (error) {
      console.log(
        'Unauthorized connection attempt:',
        error instanceof Error ? error.message : 'Invalid token',
      );
      client.disconnect(true);
      return;
    }

    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }
}
