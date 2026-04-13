import z from "zod";

export const SettingsSchema = z.object({
    name: z.string().min(1, {
        message: 'Введите имя'
    }),
    email: z.string({
        message: 'Некорректная почта'
    }),
    isTwoFactorEnabled: z.boolean()
})

export type TypeSettingsSchema = z.infer<typeof SettingsSchema>