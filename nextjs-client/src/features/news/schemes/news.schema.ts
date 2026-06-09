import { z } from "zod";

export const getCreateNewsSchema = (t: (key: string) => string) => z.object({
  titleRu: z
    .string()
    .min(5, { message: t('titleRuMinLength') })
    .max(200, { message: t('titleRuMaxLength') }),
  titleEn: z
    .string()
    .min(5, { message: t('titleEnMinLength') })
    .max(200, { message: t('titleEnMaxLength') }),
  contentRu: z
    .string()
    .min(10, { message: t('contentRuMinLength') }),
  contentEn: z
    .string()
    .min(10, { message: t('contentEnMinLength') }),
  imageUrl: z
    .string()
    .url({ message: t('invalidImageUrl') })
    .optional()
    .or(z.literal('')),
});

export type TCreateNewsSchema = z.infer<ReturnType<typeof getCreateNewsSchema>>;

// Для обратной совместимости (если где-то используется старый импорт)
export const createNewsSchema = getCreateNewsSchema(() => "");