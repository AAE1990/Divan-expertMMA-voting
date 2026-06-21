import { toast } from "sonner"

export function toastMessageHandler(error: any, t?: (key: string) => string) {
    // Извлекаем код ошибки из error.code (FetchError) или error.response?.data?.code
    const code = error.code || error.response?.data?.code
    // 1. Вытаскиваем сообщение от бэкенда. Если его нет, берем системный error.message
    // Внутри toast-message-handler.ts на строке 7 убедись, что написано так:
    const backendMessage = error.message || error.response?.data?.message || error;
    console.log("=== ЧТО ПРИШЛО С БЭКЕНДА ===", backendMessage);

    if (code && typeof code === 'string' && t) {
        // Если есть функция перевода, используем её
        const translated = t(code)
        toast.error(translated)
        return
    }

    if (backendMessage) {
        // 2. Если нам передали функцию перевода t, переводим сообщение бэкенда
        const translatedMessage = t ? t(backendMessage) : backendMessage;

        const firstDotIndex = backendMessage.indexOf('.');

        if (firstDotIndex !== -1) {
            // Сохраняем логику деления на заголовок и описание (для ключей со встроенными точками)
            toast.error(t ? t(backendMessage.slice(0, firstDotIndex)) : backendMessage.slice(0, firstDotIndex), {
                description: t ? t(backendMessage.slice(firstDotIndex + 1)) : backendMessage.slice(firstDotIndex + 1)
            });
        } else {
            // 3. Выводим переведенный текст ("Please check your email...") вместо ключа!
            toast.error(translatedMessage);
        }
    }
}
