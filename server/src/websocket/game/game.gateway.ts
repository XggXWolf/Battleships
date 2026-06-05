import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { BaseGateway } from '../base.gateway';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ namespace: 'game' })
export class GameGateway extends BaseGateway {
  @WebSocketServer() server!: Server;
  constructor(jwtService: JwtService) {
    super(jwtService);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, message: any): void {
    console.log('Received message:', message);

    client.emit('message', `Echo: ${message}`);

    this.server.emit('message', 'Hello from the server!');
  }
}
