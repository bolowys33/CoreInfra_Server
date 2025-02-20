import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/users/dto/create-user.dto';
import { SignInDto, VerifyOtpDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: SignUpDto) {
    return this.authService.register(dto);
  }

  @Post('register-admin')
  async registerAdmin(@Body() dto: SignUpDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: SignInDto) {
    return this.authService.login(dto);
  }

  @Post('verify-account')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyAccount(dto);
  }
}
