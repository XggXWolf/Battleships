import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class WsReadyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();
    return !!client.data.ready;
  }
}
