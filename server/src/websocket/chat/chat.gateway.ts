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
import { ChatMessage } from '../../types/chatMessage';

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway extends BaseGateway {
  @WebSocketServer() server!: Server;
  constructor(jwtService: JwtService) {
    super(jwtService);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ): void {
    client.join(roomId);
    console.log(`Client ${client.id} joined room ${roomId}`);
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom() {}
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: ChatMessage,
  ): void {
    console.log('Received message:', message);

    let chatMessage = {
      senderNickname: client.user.nickname,
      content: message.content,
      timestamp: new Date(),
    };

    this.server.emit('message', chatMessage);
  }
}
