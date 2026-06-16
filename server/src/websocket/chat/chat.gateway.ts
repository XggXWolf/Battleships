import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { BaseGateway } from '../base.gateway';
import { ChatMessage } from '../../types/chatMessage';
import { GatewayService } from '../gateway.service';
import { WS_CORS } from '../gateway.config';

@WebSocketGateway({
  namespace: 'chat',
  cors: WS_CORS,
})
export class ChatGateway extends BaseGateway {
  @WebSocketServer() server!: Server;
  constructor(protected readonly gatewayService: GatewayService) {
    super(gatewayService);
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
    console.log('Client:', client.data);
    console.log('Client rooms:', client.rooms);
    console.log('Received message:', message);

    const roomId = [...client.rooms].find((room) => room.endsWith('-chat'));
    if (!roomId) {
      console.warn(
        `Client ${client.id} is not in a chat room, ignoring message`,
      );
      return;
    }

    let chatMessage = {
      senderNickname: client.data.nickname,
      content: message.content,
      timestamp: new Date(),
    };

    console.log('Sending message to room', roomId, ':', chatMessage);
    this.server.to(roomId).emit('message', chatMessage);
  }
}
