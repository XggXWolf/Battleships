import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import googleOauthConfig from './auth/config/google-oauth.config';
import { APP_GUARD } from '@nestjs/core';
import { ProfileCompleteGuard } from './guards/profile-complete.guard';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AuthorizationGuard } from './guards/authorization.guard';
import { WebsocketModule } from './websocket/websocket.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ConfigModule.forFeature(googleOauthConfig),
    PrismaModule,
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    AuthModule,
    WebsocketModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 100,
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    { provide: APP_GUARD, useClass: AuthorizationGuard },
    { provide: APP_GUARD, useClass: ProfileCompleteGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
