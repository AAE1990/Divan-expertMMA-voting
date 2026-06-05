import { z } from "zod"
import { getPasswordValidation } from "./password.schema"

export const getRegisterSchema = (t: (key: string) => string) => z.object({
    name: z.string().min(1, { message: t('nameRequired') }),
    email: z.string().trim().pipe(z.email({ message: t('invalidEmail') })),
    password: getPasswordValidation(t),
    passwordRepeat: z.string(),
}).refine((data) => data.password === data.passwordRepeat, {
    message: t('passwordsMismatch'),
    path: ["passwordRepeat"],
})

export type TypeRegisterSchema = z.infer<ReturnType<typeof getRegisterSchema>>