import { Body, Controller, Post } from '@nestjs/common';
import type { SignInDTO, SignUpDTO } from './dtos/auth';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() body: SignInDTO) {
    await this.authService.signIn(body);
    return body;
  }

  @Post('sign-Up')
  async signUp(@Body() body: SignUpDTO) {
    await this.authService.signUp(body);
    return body;
  }
}
