import z from "zod";
import type { User } from "./session.contract";

export const LoginSchema = z.object({
    email: z.string('E-mail é obrigatório').email('E-mail inválido'),
    password: z.string('Senha é obrigatória').min(6, 'Senha deve ter no mínimo 6 caracteres'),
}).strict();

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export type LoginResponse = {
    message: string;
    user: User;
}