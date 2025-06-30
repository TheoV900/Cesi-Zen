import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ResetPasswordDto } from './reset-password.dto';

class AuthDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Patch('reset-password')
  @UseGuards(AuthGuard('jwt'))
  resetPassword(
    @Request() req,
    @Body() dto: ResetPasswordDto,
  ) {
    // On sait que req.user est un User avec une propriété `id`
    const userId = (req.user as any).id;
    return this.authService.resetPassword(userId, dto);
  }
}
