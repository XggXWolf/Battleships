import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

type AuthInput = { username: string; password: string };
type SignInData = { userId: string; username: string };
type AuthResult = { accessToken: string; userId: string; username: string };

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(input: AuthInput): Promise<AuthResult> {
    const user = await this.validateUser(input);

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.signIn(user);
  }

  // eslint-disable-next-line @typescript-eslint/require-await, @typescript-eslint/no-unused-vars
  async validateUser(input: AuthInput): Promise<SignInData | null> {
    const user = await this.usersService.findUserByUsername(input.username);

    if (user && user.password === input.password) {
      return {
        userId: user.userId,
        username: user.username,
      };
    }

    return null;
  }

  async signIn(user: SignInData): Promise<AuthResult> {
    const tokenPayLoad = {
      sub: user.userId,
      username: user.username,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayLoad);

    return { accessToken, username: user.username, userId: user.userId };
  }
}
