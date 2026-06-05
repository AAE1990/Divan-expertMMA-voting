import { useMutation, useQueryClient } from "@tanstack/react-query";

import { TypeLoginSchema } from "../schemes";
import { authService } from "../services";
import { toastMessageHandler } from "@/shared/utils";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";

export function useLoginMutation(
    setIsShowFactor: Dispatch<SetStateAction<boolean>>
) {
    const router = useRouter()
    const queryClient = useQueryClient()
    const t = useTranslations("Auth")

    const { mutate: login, isPending: isLoadingLogin } = useMutation({
        mutationKey: ['login user'],
        mutationFn: ({
            values,
            recaptcha
        }: {
            values: TypeLoginSchema
            recaptcha: string
        }) => authService.login(values, recaptcha),
        onSuccess(data: any) {
            if (data.message) {
                toastMessageHandler(data)
                setIsShowFactor(true)
            } else {
                toast.success(t('successLogin'))
                // Сбрасываем все запросы профиля, чтобы немедленно обновить интерфейс
                queryClient.resetQueries({ queryKey: ['profile'], exact: false })
                router.push('/dashboard/settings')
            }
        },
        onError(error: any) {
            const code = error.code // Читаем проброшенный код из FetchError!
            if (code && typeof code === 'string') {
                toast.error(t(code)) // Достает INVALID_CREDENTIALS / USER_NOT_FOUND из JSON
            } else {
                toastMessageHandler(error)
            }
        }
    })

    return {
        login,
        isLoadingLogin
    }
}
