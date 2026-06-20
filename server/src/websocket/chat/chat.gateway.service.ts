import { Injectable } from '@nestjs/common';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessage } from '../../types/chatMessage';
import { GameService } from '../game/game.service';

@Injectable()
export class ChatGatewayService {
  constructor(protected readonly gameService: GameService) {}

  handleJoinRoom(client: Socket, roomId: string) {
    const game = this.gameService.activeGames.get(roomId.replace('-chat', ''));
    if (!game) {
      console.warn(
        `Game not found for room ${roomId}, client ${client.id} cannot join`,
      );
      return;
    }

    if (
      game.player1Id !== client.data.sub &&
      game.player2Id !== client.data.sub
    ) {
      console.warn(
        `Client ${client.id} is not a player in game ${roomId}, cannot join chat`,
      );
      return;
    }

    client.join(roomId);
    console.log(`Client ${client.id} joined room ${roomId}`);
  }

  handleMessage(
    client: Socket,
    message: ChatMessage,
  ): { roomId: string; chatMessage: ChatMessage } | undefined {
    console.log('Client:', client.data);
    console.log('Client rooms:', client.rooms);
    console.log('Received message:', message);

    const roomId = [...client.rooms].find((room) => room.endsWith('-chat'));
    if (!roomId) {
      console.warn(
        `Client ${client.id} is not in a chat room, ignoring message`,
      );

      return undefined;
    }

    let chatMessage = {
      senderNickname: client.data.nickname,
      content: message.content,
      timestamp: new Date(),
    };

    return { roomId, chatMessage };
  }
}
