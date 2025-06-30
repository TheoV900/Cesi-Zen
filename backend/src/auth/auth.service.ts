import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from './reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,    // ← Injection de PrismaService
    private jwtService: JwtService,   // ← Injection de JwtService
  ) {}

  async register(email: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    try {
      const user = await this.prisma.user.create({
        data: { email, password: hash },
      });
      return this.signToken(user.id, user.email, user.role);
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new ConflictException('Email déjà utilisé');
      }
      throw e;
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Crédentiels invalides');
    }
    return user;
  }

  async login(email: string, password: string) {  // ← Vérifie que cette méthode existe
    const user = await this.validateUser(email, password);
    return this.signToken(user.id, user.email, user.role);
  }

  private signToken(userId: number, email: string, role: string) {
    const payload = { sub: userId, email, role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async resetPassword(userId: number, dto: ResetPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const valid = await bcrypt.compare(dto.oldPassword, user.password);
    if (!valid) {
      throw new UnauthorizedException('Mot de passe actuel incorrect');
    }
    const hash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hash },
    });
    return { message: 'Mot de passe mis à jour' };
  }
}
