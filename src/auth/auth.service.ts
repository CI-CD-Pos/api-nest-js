import { Injectable } from '@nestjs/common';
import type { SignInDTO, SignUpDTO } from './dtos/auth';

@Injectable()
export class AuthService {
  async signUp(data: SignUpDTO){
    return
  }

  async signIn(data:SignInDTO){
    return
  }
}
