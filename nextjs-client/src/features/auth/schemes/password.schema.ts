import z from "zod";

// Базовая проверка сложности
export const getPasswordValidation = (t: (key: string) => string) =>
  z
    .string()
    .min(8, { message: t('passwordMin') })
    .regex(/[A-Z]/, { message: t('passwordUppercase') })
    .regex(/[a-z]/, { message: t('passwordLowercase') })
    .regex(/[0-9]/, { message: t('passwordDigit') })
    .regex(/[@$!%*?&#]/, { message: t('passwordSpecial') });

// Для обратной совместимости (используется в new-password.schema.ts)
export const passwordValidation = getPasswordValidation(() => "Минимум 8 символов");