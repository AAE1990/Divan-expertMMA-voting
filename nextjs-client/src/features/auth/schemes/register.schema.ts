import { z } from "zod"
import { passwordValidation } from "./password.schema"

export const RegisterSchema = z.object({
    name: z.string().min(1, { message: "Имя является обязательным" }),
    email: z.string().trim().pipe(z.email({ message: "Неверный email" })),
    password: passwordValidation,
    passwordRepeat: z.string(),
}).refine((data) => data.password === data.passwordRepeat, {
    message: "Пароли не совпадают",
    path: ["passwordRepeat"],
})

export type TypeRegisterSchema = z.infer<typeof RegisterSchema>