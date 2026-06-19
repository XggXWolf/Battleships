import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsReadyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    console.log(`Guard check: ${client.id} ready=${client.data.ready}`);

    if (!client.data.ready) {
      console.warn(`Client ${client.id} is not ready. Blocking message.`);
      throw new WsException('Client is not ready to receive messages');
    }

    return true;
  }
}
