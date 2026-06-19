import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

import { Socket } from 'socket.io';
import { ChatMessage } from '../../types/chatMessage';
import { BaseGateway } from '../base.gateway';
import { WS_CORS } from '../gateway.config';
import { GatewayService } from '../gateway.service';
import { ChatGatewayService } from './chat.gateway.service';
import { UseGuards } from '@nestjs/common';
import { WsReadyGuard } from '../../guards/ws-ready.guard';
import { WsThrottlerGuard } from '../../guards/ws-throttler.guard';
import { Throttle } from '@nestjs/throttler';

@WebSocketGateway({
  namespace: 'chat',
  cors: WS_CORS,
})
@UseGuards(WsReadyGuard, WsThrottlerGuard)
export class ChatGateway extends BaseGateway {
  constructor(
    protected readonly gatewayService: GatewayService,
    private readonly chatGatewayService: ChatGatewayService,
  ) {
    super(gatewayService);
  }

  // Override base gateway disconnect handler to prevent automatic removal from online users map
  handleDisconnect(client: Socket): void {
    return;
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ): void {
    this.chatGatewayService.handleJoinRoom(client, roomId);
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom() {}

  @Throttle({ default: { limit: 10, ttl: 10000 } })
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: ChatMessage,
  ): void {
    this.chatGatewayService.handleMessage(client, message);
  }
}
