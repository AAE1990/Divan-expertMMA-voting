import { z } from "zod";

export const createNewsSchema = z.object({
  titleRu: z
    .string()
    .min(5, { message: "Заголовок на русском должен быть не менее 5 символов" })
    .max(200, { message: "Заголовок на русском не должен превышать 200 символов" }),
  titleEn: z
    .string()
    .min(5, { message: "Заголовок на английском должен быть не менее 5 символов" })
    .max(200, { message: "Заголовок на английском не должен превышать 200 символов" }),
  contentRu: z
    .string()
    .min(10, { message: "Текст новости на русском должен быть не менее 10 символов" }),
  contentEn: z
    .string()
    .min(10, { message: "Текст новости на английском должен быть не менее 10 символов" }),
  imageUrl: z
    .string()
    .url({ message: "Введите корректный URL-адрес изображения" })
    .optional()
    .or(z.literal('')),
});

export type TCreateNewsSchema = z.infer<typeof createNewsSchema>;