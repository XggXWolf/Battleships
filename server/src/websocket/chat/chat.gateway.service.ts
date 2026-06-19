import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatMessage } from '../../types/chatMessage';
import { WebSocketServer } from '@nestjs/websockets';

@Injectable()
export class ChatGatewayService {
  @WebSocketServer() server!: Server;

  handleJoinRoom(client: Socket, roomId: string) {
    client.join(roomId);
    console.log(`Client ${client.id} joined room ${roomId}`);
  }

  handleMessage(client: Socket, message: ChatMessage) {
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
