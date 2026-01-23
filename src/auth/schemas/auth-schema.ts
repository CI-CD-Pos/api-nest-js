import z from 'zod';

export const signUpSchema = z
  .object({
    name: z.string().min(2, 'Seu nome precisa ser no minimo 2 caracteres'),
    email: z.email(),
    password: z.string().min(4, 'Sua senha precisa ser no minimo 4 caracteres'),
  })
  .strict();
export const signInSchema = z
  .object({
    email: z.email(),
    password: z.string().min(4, 'Sua senha precisa ser no minimo 4 caracteres'),
  })
  .strict();

export type SignUpSchema = z.infer<typeof signUpSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
