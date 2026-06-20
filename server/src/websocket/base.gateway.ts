import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewayService } from './gateway.service';
import { GameService } from './game/game.service';
import { Inject } from '@nestjs/common';

export abstract class BaseGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @Inject(GameService)
  protected readonly gameService!: GameService;

  constructor(protected readonly gatewayService: GatewayService) {}

  afterInit(server: Server) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    await this.gatewayService.handleConnection(client);

    const gameId = this.gameService.getGameFromUserId(client.data.sub)?.gameId;

    if (gameId) {
      client.join(gameId);
      console.log(`Client ${client.id} rejoined game ${gameId}`);
      const gameData = this.gameService.onGameRejoin(gameId, client.data.sub);
      client.emit('rejoin_game', gameData);
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.gatewayService.handleDisconnect(client);
  }
}
