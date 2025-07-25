import { z } from "zod";

// Regex para validação de email
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Schema para objeto de seleção (usado em customer, group, approver)
const selectObjectSchema = z.object({
  value: z.number(),
  label: z.string(),
});

const selectObjectWithStringValueSchema = z.object({
  value: z.string(),
  label: z.string(),
});

// Schema para criação de usuário
export const createUserSchema = z.object({
  email: z.string().regex(emailRegex, "E-mail inválido"),
  firstName: z.string().min(1, "O primeiro nome é obrigatório"),
  lastName: z.string().min(1, "O sobrenome é obrigatório"),
  customer: selectObjectSchema
    .nullable()
    .optional()
    .refine(
      (val) => val !== null && val !== undefined,
      "Selecione uma opção válida para a empresa",
    ),
  group: selectObjectSchema
    .nullable()
    .optional()
    .refine(
      (val) => val !== null && val !== undefined,
      "Selecione uma opção válida para o grupo",
    ),
  approver: selectObjectWithStringValueSchema
    .nullable()
    .optional()
    .refine((val) => val !== null && val !== undefined, "Selecione uma opção"),
  password: z
    .string()
    .min(12, "A senha deve possuir pelo menos 12 caracteres")
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/,
      "A senha deve possuir uma letra maiúscula, uma letra minúscula e um número",
    ),
});

// Tipo inferido do schema
export type CreateUserSchema = z.infer<typeof createUserSchema>;

// Schema para edição de usuário (sem password)
export const editUserSchema = z.object({
  email: z.string().regex(emailRegex, "E-mail inválido"),
  firstName: z.string().min(1, "O primeiro nome é obrigatório"),
  lastName: z.string().min(1, "O sobrenome é obrigatório"),
  customer: selectObjectSchema
    .nullable()
    .optional()
    .refine(
      (val) => val !== null && val !== undefined,
      "Selecione uma opção válida para a empresa",
    ),
  group: selectObjectSchema
    .nullable()
    .optional()
    .refine(
      (val) => val !== null && val !== undefined,
      "Selecione uma opção válida para o grupo",
    ),
  approver: selectObjectWithStringValueSchema
    .nullable()
    .optional()
    .refine((val) => val !== null && val !== undefined, "Selecione uma opção"),
});

// Tipo inferido do schema
export type EditUserSchema = z.infer<typeof editUserSchema>;

// Schema para criação de grupo
export const createGroupSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(50, "O nome deve ter no máximo 50 caracteres"),
});

// Tipo inferido do schema
export type CreateGroupSchema = z.infer<typeof createGroupSchema>;

// Schema para edição de grupo
export const editGroupSchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(50, "O nome deve ter no máximo 50 caracteres"),
});

// Tipo inferido do schema
export type EditGroupSchema = z.infer<typeof editGroupSchema>;
