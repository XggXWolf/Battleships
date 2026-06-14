import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class WsReadyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    console.log(`Guard check: ${client.id} ready=${client.data.ready}`);

    return !!client.data.ready;
  }
}
