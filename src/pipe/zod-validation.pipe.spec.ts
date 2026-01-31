import { BadRequestException, ArgumentMetadata } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from './zod-validation.pipe';

describe('ZodValidationPipe', () => {
  let pipe: ZodValidationPipe;

  const testSchema = z.object({
    email: z.string().email('Invalid email'),
    age: z.number().min(0, 'Age must be positive'),
  });

  beforeEach(() => {
    pipe = new ZodValidationPipe(testSchema);
  });

  describe('transform', () => {
    it('should return parsed value when validation succeeds', () => {
      const testData = {
        email: 'test@example.com',
        age: 25,
      };

      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: Object,
        data: undefined,
      };

      const result = pipe.transform(testData, metadata);

      expect(result).toEqual(testData);
    });

    it('should throw BadRequestException with validation errors', () => {
      const testData = {
        email: 'invalid-email',
        age: -5,
      };

      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: Object,
        data: undefined,
      };

      expect(() => pipe.transform(testData, metadata)).toThrow(
        BadRequestException,
      );

      try {
        pipe.transform(testData, metadata);
      } catch (error) {
        expect(error.getResponse()).toHaveProperty('issues');
        expect(Array.isArray(error.getResponse().issues)).toBe(true);
        expect(error.getResponse().issues.length).toBeGreaterThan(0);
      }
    });

    it('should include issue path in error response', () => {
      const testData = {
        email: 'invalid-email',
        age: 25,
      };

      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: Object,
        data: undefined,
      };

      try {
        pipe.transform(testData, metadata);
      } catch (error) {
        const response = error.getResponse();
        expect(response.issues[0]).toHaveProperty('path');
        expect(response.issues[0]).toHaveProperty('message');
      }
    });

    it('should handle non-ZodError exceptions', () => {
      const badSchema = z.object({
        value: z.string(),
      });

      const pipeWithBadSchema = new ZodValidationPipe(badSchema);
      const testData = { value: 123 };

      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: Object,
        data: undefined,
      };

      expect(() => pipeWithBadSchema.transform(testData, metadata)).toThrow(
        BadRequestException,
      );
    });

    it('should return parsed value even if input has extra properties', () => {
      const testData = {
        email: 'test@example.com',
        age: 25,
        extraField: 'should be ignored',
      };

      const metadata: ArgumentMetadata = {
        type: 'body',
        metatype: Object,
        data: undefined,
      };

      const result = pipe.transform(testData, metadata);

      expect(result).toEqual({
        email: 'test@example.com',
        age: 25,
      });
    });
  });
});
