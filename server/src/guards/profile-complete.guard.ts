import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

// TO-DO
@Injectable()
export class ProfileCompleteGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user = context.switchToHttp().getRequest().user;
    const skip = this.reflector.get<boolean>(
      'skipProfileCheck',
      context.getHandler(),
    );
    if (skip) {
      return true;
    }

    if (!user.isProfileComplete) {
      return false;
    }
    return true;
  }
}
