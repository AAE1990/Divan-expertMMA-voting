import { z } from "zod";

export const createNewsSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Заголовок должен быть не менее 5 символов" })
    .max(200, { message: "Заголовок не должен превышать 200 символов" }),
  content: z
    .string()
    .min(10, { message: "Текст новости должен быть не менее 10 символов" }),
  imageUrl: z
    .string()
    .url({ message: "Введите корректный URL-адрес изображения" })
    .optional()
    .or(z.literal('')),
});

export type TCreateNewsSchema = z.infer<typeof createNewsSchema>;