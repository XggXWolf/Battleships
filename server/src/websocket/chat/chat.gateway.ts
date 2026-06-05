import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { BaseGateway } from '../base.gateway';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway extends BaseGateway {
  @WebSocketServer() server!: Server;
  constructor(jwtService: JwtService) {
    super(jwtService);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): void {
    console.log('Received message:', data);

    let chatMessage = {
      senderSocket: client.id,
      senderNickname: client.user.nickname,
      content: data,
      timestamp: new Date(),
    };

    client.broadcast.emit('message', chatMessage);
  }
}
