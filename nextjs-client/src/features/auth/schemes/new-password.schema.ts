import z from "zod";
import { getPasswordValidation } from "./password.schema";

export const getNewPasswordSchema = (t: (key: string) => string) => z.object({
    password: getPasswordValidation(t)
})

export type TypeNewPasswordSchema = z.infer<ReturnType<typeof getNewPasswordSchema>>
