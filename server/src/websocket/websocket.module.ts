import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { GameGateway } from './game/game.gateway';
import { LobbyGateway } from './lobby/lobby.gateway';
import { LobbyGatewayService } from './lobby/lobby.gateway.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { GatewayService } from './gateway.service';
import { GameService } from './game/game.service';
import { ChatGatewayService } from './chat/chat.gateway.service';

@Module({
  providers: [
    ChatGateway,
    ChatGatewayService,
    GameGateway,
    GameService,
    LobbyGateway,
    LobbyGatewayService,
    UsersService,
    PrismaService,
    GatewayService,
  ],
})
export class WebsocketModule {}
