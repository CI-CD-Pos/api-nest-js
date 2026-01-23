import { Body, Controller, Post } from '@nestjs/common';
import type { SignInDTO, SignUpDTO } from './dtos/auth';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() body: SignUpDTO) {
    return await this.authService.signUp(body);
  }
  @Post('sign-in')
  async signIn(@Body() body: SignInDTO) {
    return await this.authService.signIn(body);
  }
}
