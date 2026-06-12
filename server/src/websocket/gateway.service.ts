import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class GatewayService {
  readonly onlineUsers = new Map<string, Socket>(); // userId -> Socket

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
      // Need this to wait until database call is completed.
      client.data.ready = false;

      const decoded = this.jwtService.verify(token);

      const user = await this.usersService.findMe(decoded.sub);
      const elo = user.elo;

      client.user = { elo, ...decoded };
      client.data.userId = decoded.sub;

      client.data.ready = true;
    } catch (error) {
      console.log(
        'Unauthorized connection attempt:',
        error instanceof Error ? error.message : 'Invalid token',
      );
      client.disconnect(true);
      return;
    }

    this.onlineUsers.set(client.user.sub, client);
    console.log('Client connected:', client.id);
    console.log('Online users:', this.onlineUsers.size);
  }

  async handleDisconnect(client: any): Promise<void> {
    this.onlineUsers.delete(client.data.userId);
    console.log('Client disconnected:', client.id);
    console.log('Online users:', this.onlineUsers.size);
  }
}
