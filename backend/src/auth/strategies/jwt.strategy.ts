import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // Récupère l'utilisateur complet depuis la base
    return this.prisma.user.findUnique({ where: { id: payload.sub } });
  }
}


//Cette classe configure dans NestJS une stratégie d’authentification JWT qui extrait le 
// token Bearer de l’en-tête, le vérifie avec la clé secrète définie 
// en environnement et charge l’utilisateur correspondant depuis la base via PrismaService.