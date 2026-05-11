import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // Extract the token from the Authorization header
    const token = request.headers['authorization']?.split(' ')[1];

    // Throw an exception if no token is provided
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      // Verify the token and extract the user information
      const decoded = this.jwtService.verify(token);
      request.user = decoded; // Attach the user information to the request object

      return true; // Return true if the user is authenticated
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unauthorized';
      throw new UnauthorizedException('Unauthorized', message);
    }
  }
}
