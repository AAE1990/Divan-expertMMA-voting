import { z } from "zod"

export const getLoginSchema = (t: (key: string) => string) => z.object({
    email: z.string({ message: t('invalidEmail') }),
    password: z.string().min(8, { message: t('passwordMinLength') }),
    code: z.optional(z.string())
})

export type TypeLoginSchema = z.infer<ReturnType<typeof getLoginSchema>>