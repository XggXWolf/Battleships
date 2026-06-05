import { Module } from '@nestjs/common';
import { ChatGateway } from './chat/chat.gateway';
import { GameGateway } from './game/game.gateway';
import { LobbyGateway } from './lobby/lobby.gateway';

@Module({
  providers: [ChatGateway, GameGateway, LobbyGateway],
})
export class WebsocketModule {}
