import z from "zod";
import { passwordValidation } from "./password.schema";

export const NewPasswordSchema = z.object({
    password: passwordValidation
})

export type TypeNewPasswordSchema = z.infer<typeof NewPasswordSchema>
