import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ZodValidationPipe } from '../pipe/zod-validation.pipe';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    me: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should be defined', () => {
      expect(controller.signUp).toBeDefined();
    });

    it('should call authService.signUp with correct data', async () => {
      const signUpData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const expectedResponse = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      };

      mockAuthService.signUp.mockResolvedValue(expectedResponse);

      const result = await controller.signUp(signUpData);

      expect(mockAuthService.signUp).toHaveBeenCalledWith(signUpData);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw error when user already exists', async () => {
      const signUpData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      mockAuthService.signUp.mockRejectedValue(
        new Error('User already exists'),
      );

      await expect(controller.signUp(signUpData)).rejects.toThrow(
        'User already exists',
      );
    });
  });

  describe('signIn', () => {
    it('should be defined', () => {
      expect(controller.signIn).toBeDefined();
    });

    it('should call authService.signIn with correct data', async () => {
      const signInData = {
        email: 'john@example.com',
        password: 'password123',
      };

      const expectedResponse = {
        token: 'jwt-token-here',
      };

      mockAuthService.signIn.mockResolvedValue(expectedResponse);

      const result = await controller.signIn(signInData);

      expect(mockAuthService.signIn).toHaveBeenCalledWith(signInData);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw error for invalid credentials', async () => {
      const signInData = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      mockAuthService.signIn.mockRejectedValue(
        new Error('Invalid credentials'),
      );

      await expect(controller.signIn(signInData)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('me', () => {
    it('should be defined', () => {
      expect(controller.me).toBeDefined();
    });

    it('should return user profile', async () => {
      const request = {
        user: {
          id: 1,
        },
      };

      const expectedUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
      };

      mockAuthService.me.mockResolvedValue(expectedUser);

      const result = await controller.me(request);

      expect(mockAuthService.me).toHaveBeenCalledWith(1);
      expect(result).toEqual(expectedUser);
    });

    it('should throw error when user not found', async () => {
      const request = {
        user: {
          id: 999,
        },
      };

      mockAuthService.me.mockRejectedValue(new Error('User not found'));

      await expect(controller.me(request)).rejects.toThrow('User not found');
    });
  });
});
