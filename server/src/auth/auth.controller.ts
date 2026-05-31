import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { SkipAuth } from '../decorators/skip-auth.decorator';
@SkipAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.validateUser(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.registerUserLocal(registerDto);
  }

  // Passport handles the route on its own, it just needs to exist
  @UseGuards(AuthGuard('google'))
  @Get('google/login')
  googleLogin() {}

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleCallback(@Req() { user }: Request, @Res() res: Response) {
    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/oauth-failure`);
    }

    const token = await this.authService.generateJwtToken({
      id: user.sub,
      nickname: user.nickname,
      role: user.role,
      isProfileComplete: user.isProfileComplete,
    });
    return res.redirect(
      `${process.env.FRONTEND_URL}/oauth-success?token=${token}`,
    );
  }
}
