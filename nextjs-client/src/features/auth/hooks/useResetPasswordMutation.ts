import { useMutation } from "@tanstack/react-query";
import { TypeResetPasswordSchema } from '../schemes/reset-password.schema'
import { passwordRecoveryService } from "../services/password-recovery.service";
import { toast } from "sonner";
import { toastMessageHandler } from "@/shared/utils";
import { useTranslations, useLocale } from "next-intl";

export function useResetPasswordMutation() {
    const t = useTranslations("Auth")
    const locale = useLocale()
    const { mutate: reset, isPending: isLoadingReset } = useMutation({
        mutationKey: ['reset password', locale],
        mutationFn: ({
            values,
            recaptcha
        }: {
            values: TypeResetPasswordSchema
            recaptcha: string
        }) => passwordRecoveryService.reset(values, recaptcha, locale),
        onSuccess() {
            toast.success(t('passwordResetSent'), {
                description: t('passwordResetSentDesc')
            })
        },
        onError(error: any) {
            const code = error.response?.data?.code
            if (code && typeof code === 'string') {
                toast.error(t(code))
            } else {
                toastMessageHandler(error)
            }
        }
    })

    return { reset, isLoadingReset}
}
