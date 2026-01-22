import { Body, Controller, Post } from '@nestjs/common';
import type { SignInDTO, SignUpDTO } from './dtos/auth';

@Controller('auth')
export class AuthController {
  @Post('sign-in')
  async signIn(@Body() body: SignInDTO) {
    console.log(body);
  }

  @Post('sign-Up')
  async signUp(@Body() body: SignUpDTO) {
    console.log(body);
    
  }
}
