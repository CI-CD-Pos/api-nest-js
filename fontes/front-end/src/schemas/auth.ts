import z from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe um nome")
    .min(3, "O nome precisa ter no mínimo 3 caracteres"),
  email: z.email("E-mail inválido"),
  password: z
    .string()
    .min(1, "Digite uma senha")
    .min(5, "A senha deve ter pelo menos 5 caracteres"),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const sigInSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z
    .string()
    .min(1, "Digite uma senha")
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type SignInSchema = z.infer<typeof sigInSchema>;
