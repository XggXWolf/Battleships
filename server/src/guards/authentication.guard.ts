import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>('skipAuth', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAuth) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const token = request.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid token';
      throw new UnauthorizedException('Unauthorized', message);
    }
  }
}
