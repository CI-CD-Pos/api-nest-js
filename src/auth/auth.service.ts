import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { SignInDTO, SignUpDTO } from './dtos/auth';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  async signUp(data: SignUpDTO) {
    const isUserExists = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (isUserExists) {
      throw new UnauthorizedException('User already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 8);

    const user = await this.prismaService.user.create({
      data: { ...data, password: passwordHash },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async signIn(data: SignInDTO) {
    const user = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    const passwordHash =
      user?.password ??
      '$2b$10$fakeHashToPreventTimingAttack.fakeHashToPreventTimingAttack.fake';

    const isPasswordValid = await bcrypt.compare(data.password, passwordHash);

    const isAuthenticated = isPasswordValid && user;

    if (!isAuthenticated) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync({ id: user.id, email: user.email });

    return {token};
  }
}
