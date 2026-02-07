import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import type { SignInDTO, SignUpDTO } from './dtos/auth';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { ZodValidationPipe } from '../pipe/zod-validation.pipe';
import { signInSchema, signUpSchema } from './schemas/auth-schema';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @UsePipes(new ZodValidationPipe(signUpSchema))
  async signUp(@Body() body: SignUpDTO) {
    return await this.authService.signUp(body);
  }
  @Post('sign-in')
  @UsePipes(new ZodValidationPipe(signInSchema))
  async signIn(@Body() body: SignInDTO) {
    return await this.authService.signIn(body);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Request() request) {
    const user = await this.authService.me(request.user.id);
    return user;
  }
}
