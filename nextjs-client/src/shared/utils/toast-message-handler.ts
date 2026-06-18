import { toast } from "sonner"

export function toastMessageHandler(error: any, t?: (key: string) => string) {
    // Извлекаем код ошибки из error.code (FetchError) или error.response?.data?.code
    const code = error.code || error.response?.data?.code
    
    if (code && typeof code === 'string' && t) {
        // Если есть функция перевода, используем её
        const translated = t(code)
        toast.error(translated)
        return
    }
    
    // Если код есть, но нет функции перевода, или код отсутствует,
    // используем стандартную логику с error.message
    if (error.message) {
        const errorMessage = error.message
        const firstDotIndex = errorMessage.indexOf('.')

        if (firstDotIndex !== -1) {
            toast.error(errorMessage.slice(0, firstDotIndex), {
                description: errorMessage.slice(firstDotIndex + 1)
            })
        } else {
            toast.error(errorMessage)
        }
    } else {
        const defaultMessage = t ? t('Common.serverError') : 'Server error'
        toast.error(defaultMessage)
    }
}