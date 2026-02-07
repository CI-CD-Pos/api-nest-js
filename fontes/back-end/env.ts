import { z } from 'zod';
const envSchema = z.object({
  DATABASE_URL: z.url(),
  SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
