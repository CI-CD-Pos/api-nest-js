import z from "zod";

export const refundSchema = z.object({
  name: z.string().min(3, "Informe um nome claro para a sua solicitação"),
  category: z.string().min(1, "Selecione uma categoria"),
  amount: z
    .string()
    .min(1, "Informe um valor")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Informe um valor superior a 0",
    ),
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Selecione um comprovante")
    .refine(
      (files) => files[0]?.size <= 5 * 1024 * 1024,
      "O arquivo deve ter no máximo 5MB",
    ),
});

export type RefundSchema = z.infer<typeof refundSchema>;
