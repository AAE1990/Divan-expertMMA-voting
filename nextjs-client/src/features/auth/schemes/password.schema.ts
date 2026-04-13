import z from "zod";

// Базовая проверка сложности
export const passwordValidation = z
  .string()
  .min(8, { message: "Минимум 8 символов" })
  .regex(/[A-Z]/, { message: "Нужна хотя бы одна заглавная буква" })
  .regex(/[a-z]/, { message: "Нужна хотя бы одна строчная буква" })
  .regex(/[0-9]/, { message: "Добавьте хотя бы одну цифру" })
  .regex(/[@$!%*?&#]/, { message: "Добавьте спецсимвол (@, #, $, % и т.д.)" });
  