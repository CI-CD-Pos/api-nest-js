import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

jest.mock('@prisma/adapter-pg');
jest.mock('pg');

describe('PrismaService', () => {
  let service: PrismaService;

  const mockPrismaClient = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };

  beforeEach(async () => {
    // Mock the constructor to avoid actual database connection
    const mockService = Object.create(PrismaService.prototype);
    Object.assign(mockService, mockPrismaClient);
    
    service = mockService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should have onModuleInit method', () => {
      expect(typeof PrismaService.prototype.onModuleInit).toBe('function');
    });
  });

  describe('onModuleDestroy', () => {
    it('should have onModuleDestroy method', () => {
      expect(typeof PrismaService.prototype.onModuleDestroy).toBe('function');
    });
  });
});
