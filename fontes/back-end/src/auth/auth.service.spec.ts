import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should successfully sign up a new user', async () => {
      const signUpData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const hashedPassword = '$2b$10$hashedPasswordString';

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrismaService.user.create.mockResolvedValue({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
      });

      const result = await service.signUp(signUpData);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(signUpData.password, 8);
      expect(mockPrismaService.user.create).toHaveBeenCalled();
      expect(result).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      });
    });

    it('should throw error if user already exists', async () => {
      const signUpData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'john@example.com',
      });

      await expect(service.signUp(signUpData)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('should successfully sign in with valid credentials', async () => {
      const signInData = {
        email: 'john@example.com',
        password: 'password123',
      };

      const user = {
        id: 1,
        email: 'john@example.com',
        password: '$2b$10$hashedPasswordString',
      };

      const jwtToken = 'jwt-token-value';

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue(jwtToken);

      const result = await service.signIn(signInData);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        signInData.password,
        user.password,
      );
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
      });
      expect(result).toEqual({ token: jwtToken });
    });

    it('should throw error with invalid password', async () => {
      const signInData = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      const user = {
        id: 1,
        email: 'john@example.com',
        password: '$2b$10$hashedPasswordString',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(signInData)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      const signInData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(signInData)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('me', () => {
    it('should return user data without password', async () => {
      const userId = 1;

      const user = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.me(userId);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      expect(result).toEqual(user);
    });

    it('should throw error if user not found', async () => {
      const userId = 999;

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.me(userId)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
