// backend/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard, // enregistré localement, pas en tant que guard global
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

//Ce module NestJS configure Passport et JWT (avec expiration d’1h), 
// enregistre AuthService, JwtStrategy et RolesGuard, expose AuthController et 
// exporte AuthService.