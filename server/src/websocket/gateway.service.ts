import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class GatewayService {
  readonly onlineUsers = new Map<string, Socket>();

  constructor(
    protected readonly jwtService: JwtService,
    protected readonly usersService: UsersService,
  ) {}

  async handleConnection(client: any): Promise<void> {
    const token = client.handshake.auth?.token;

    if (!token) {
      client.emit('error', { message: 'Unauthorized: No token provided' });
      console.log('Unauthorized connection attempt. Disconnecting...');
      client.disconnect(true);
      return;
    }

    try {
      const decoded = this.jwtService.verify(token);

      const user = await this.usersService.findMe(decoded.sub);
      const elo = user.elo;

      client.user = { elo, ...decoded };
    } catch (error) {
      console.log(
        'Unauthorized connection attempt:',
        error instanceof Error ? error.message : 'Invalid token',
      );
      client.disconnect(true);
      return;
    }

    this.onlineUsers.set(client.user.id, client);
    console.log('Client connected:', client.id);
    console.log('Online users:', this.onlineUsers.size);
  }

  async handleDisconnect(client: any): Promise<void> {
    this.onlineUsers.delete(client.user.id);
    console.log('Client disconnected:', client.id);
    console.log('Online users:', this.onlineUsers.size);
  }
}
