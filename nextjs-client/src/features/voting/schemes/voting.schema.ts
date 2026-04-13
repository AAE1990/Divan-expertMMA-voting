import { z } from "zod";

export const votingSchema = z.object({
  // Используем .min(1) с объектом сообщения — это самая стабильная перегрузка
  optionId: z
    .string()
    .min(1, { message: "Пожалуйста, выберите вариант для голосования" }),
});

export type TVotingSchema = z.infer<typeof votingSchema>;

export const createPollSchema = z.object({
  question: z
    .string()
    .min(5, { message: "Вопрос должен быть не менее 5 символов" }),
  fighter1: z
    .string()
    .min(2, { message: "Введите имя первого бойца" }),
  fighter2: z
    .string()
    .min(2, { message: "Введите имя второго бойца" }),
  expiresAt: z
    .string()
    .min(1, { message: "Укажите дату и время окончания боя" }),
});

export type TCreatePollSchema = z.infer<typeof createPollSchema>;
