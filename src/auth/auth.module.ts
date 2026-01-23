import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'env';
import { AuthGuard } from './auth.guard';

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: env.SECRET as string,
      global: false,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, PrismaService, AuthGuard],
})
export class AuthModule {}
