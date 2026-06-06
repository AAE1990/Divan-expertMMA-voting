import { z } from "zod";

export const votingSchema = z.object({
  // Используем .min(1) с объектом сообщения — это самая стабильная перегрузка
  optionId: z
    .string()
    .min(1, { message: "Пожалуйста, выберите вариант для голосования" }),
});

export type TVotingSchema = z.infer<typeof votingSchema>;

export const createPollSchema = z.object({
  questionRu: z
    .string()
    .min(5, { message: "Вопрос на русском должен быть не менее 5 символов" }),
  questionEn: z
    .string()
    .min(5, { message: "Вопрос на английском должен быть не менее 5 символов" }),
  fighter1Ru: z
    .string()
    .min(2, { message: "Введите имя первого бойца на русском" }),
  fighter1En: z
    .string()
    .min(2, { message: "Введите имя первого бойца на английском" }),
  fighter1Photo: z
    .string()
    .url({ message: "Введите корректный URL-адрес фотографии" })
    .optional()
    .or(z.literal('')),
  fighter2Ru: z
    .string()
    .min(2, { message: "Введите имя второго бойца на русском" }),
  fighter2En: z
    .string()
    .min(2, { message: "Введите имя второго бойца на английском" }),
  fighter2Photo: z
    .string()
    .url({ message: "Введите корректный URL-адрес фотографии" })
    .optional()
    .or(z.literal('')),
  expiresAt: z
    .string()
    .min(1, { message: "Укажите дату и время окончания боя" }),
  tournamentId: z
    .string()
    .optional(),
  isPeopleChamp: z.boolean(),
}).refine((data) => {
  // Если isPeopleChamp === false, то tournamentId обязателен
  if (data.isPeopleChamp === false && !data.tournamentId) {
    return false;
  }
  return true;
}, {
  message: "Выберите турнир или отметьте 'Народный чемпион'",
  path: ["tournamentId"],
});

export type TCreatePollSchema = z.infer<typeof createPollSchema>;
