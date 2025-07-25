import { z } from "zod";

export const dieCutBlocksSchema = z.object({
  id: z.number().optional(),
  distortion: z.string().min(1, { message: "A distorção é obrigatória." }),
  cylinderId: z.number().optional(),
});

export type DieCutBlocksSchema = z.infer<typeof dieCutBlocksSchema>;
