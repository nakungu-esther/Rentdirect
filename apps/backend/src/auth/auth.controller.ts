import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { OtpSendDto } from './dto/otp-send.dto';
import { OtpVerifyDto } from './dto/otp-verify.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('health')
  health() {
    return this.authService.health();
  }

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('otp/send')
  sendOtp(@Body() dto: OtpSendDto) {
    return this.authService.sendOtp(dto.phone);
  }

  @Public()
  @Post('otp/verify')
  verifyOtp(@Body() dto: OtpVerifyDto) {
    return this.authService.verifyOtp(dto.phone, dto.code);
  }

  @Public()
  @Post('logout')
  logout() {
    return { ok: true };
  }

  @Public()
  @Post('refresh')
  refresh(@Body() body: { refreshToken: string; userId: string }) {
    return this.authService.refresh(body.refreshToken, body.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: { sub: string }) {
    return this.authService.me(user.sub);
  }
}
