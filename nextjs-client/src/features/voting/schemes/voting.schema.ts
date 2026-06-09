import { z } from "zod";

export const getVotingSchema = (t: (key: string) => string) => z.object({
  // Используем .min(1) с объектом сообщения — это самая стабильная перегрузка
  optionId: z
    .string()
    .min(1, { message: t('pleaseSelectOption') }),
});

export type TVotingSchema = z.infer<ReturnType<typeof getVotingSchema>>;

export const getCreatePollSchema = (t: (key: string) => string) => z.object({
  questionRu: z
    .string()
    .min(5, { message: t('questionRequired') }),
  questionEn: z
    .string()
    .min(5, { message: t('questionRequired') }),
  fighter1Ru: z
    .string()
    .min(2, { message: t('fighterRequired') }),
  fighter1En: z
    .string()
    .min(2, { message: t('fighterRequired') }),
  fighter1Photo: z
    .string()
    .url({ message: t('invalidPhotoUrl') })
    .optional()
    .or(z.literal('')),
  fighter2Ru: z
    .string()
    .min(2, { message: t('fighterRequired') }),
  fighter2En: z
    .string()
    .min(2, { message: t('fighterRequired') }),
  fighter2Photo: z
    .string()
    .url({ message: t('invalidPhotoUrl') })
    .optional()
    .or(z.literal('')),
  expiresAt: z
    .string()
    .min(1, { message: t('expiresAtRequired') }),
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
  message: t('tournamentOrPeopleChampRequired'),
  path: ["tournamentId"],
});

export type TCreatePollSchema = z.infer<ReturnType<typeof getCreatePollSchema>>;

// Для обратной совместимости (если где-то используется старый импорт)
export const votingSchema = getVotingSchema(() => "Пожалуйста, выберите вариант для голосования");
export const createPollSchema = getCreatePollSchema(() => "");
