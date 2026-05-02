import z from "zod";

const noLinksRegex = /^(?!.*https?:\/\/).*$/;
const usernameRegex = /^[a-zA-Z0-9_.-]*$/;
const telegramRegex = /^[a-zA-Z0-9_]*$/;
const vkInstagramRegex = /^[a-zA-Z0-9_.]*$/;
const twitterRegex = /^[a-zA-Z0-9_]*$/;

export const SettingsSchema = z.object({
    name: z.string().min(1, {
        message: 'Введите имя'
    }),
    email: z.string({
        message: 'Некорректная почта'
    }),
    isTwoFactorEnabled: z.boolean(),
    bio: z.string().max(100, {
        message: 'Биография не должна превышать 100 символов'
    }).regex(noLinksRegex, {
        message: 'Биография не должна содержать ссылок'
    }).optional().or(z.literal('')),
    city: z.string().regex(noLinksRegex, {
        message: 'Город не должен содержать ссылок'
    }).optional().or(z.literal('')),
    country: z.string().regex(noLinksRegex, {
        message: 'Страна не должна содержать ссылок'
    }).optional().or(z.literal('')),
    youtube: z.string().regex(usernameRegex, {
        message: 'YouTube username может содержать только буквы, цифры, точки, дефисы и подчеркивания'
    }).optional().or(z.literal('')),
    telegram: z.string().regex(telegramRegex, {
        message: 'Telegram username может содержать только буквы, цифры и подчеркивания'
    }).optional().or(z.literal('')),
    vk: z.string().regex(vkInstagramRegex, {
        message: 'VK username может содержать только буквы, цифры, точки и подчеркивания'
    }).optional().or(z.literal('')),
    twitter: z.string().regex(twitterRegex, {
        message: 'Twitter username может содержать только буквы, цифры и подчеркивания'
    }).optional().or(z.literal('')),
    instagram: z.string().regex(vkInstagramRegex, {
        message: 'Instagram username может содержать только буквы, цифры, точки и подчеркивания'
    }).optional().or(z.literal(''))
})

export type TypeSettingsSchema = z.infer<typeof SettingsSchema>