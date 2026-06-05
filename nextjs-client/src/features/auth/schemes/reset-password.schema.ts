import { z } from "zod";

export const getResetPasswordSchema = (t: (key: string) => string) => z.object({
    email: z.email({
        message: t('invalidEmail')
    })
})

export type TypeResetPasswordSchema = z.infer<ReturnType<typeof getResetPasswordSchema>>
