import { z } from "zod";

export const ResetPasswordSchema = z.object({
    email: z.email({
        message: 'Некорректная почта'
    })
})

export type TypeResetPasswordSchema = z.infer<typeof ResetPasswordSchema>
