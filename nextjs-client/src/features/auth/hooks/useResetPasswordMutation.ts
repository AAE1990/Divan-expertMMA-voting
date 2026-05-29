import { useMutation } from "@tanstack/react-query";
import { TypeResetPasswordSchema } from '../schemes/reset-password.schema'
import { passwordRecoveryService } from "../services/password-recovery.service";
import { toast } from "sonner";
import { toastMessageHandler } from "@/shared/utils";
import { useTranslations } from "next-intl";

export function useResetPasswordMutation() {
    const t = useTranslations("Auth")
    const { mutate: reset, isPending: isLoadingReset } = useMutation({
        mutationKey: ['reset password'],
        mutationFn: ({
            values,
            recaptcha
        }: {
            values: TypeResetPasswordSchema
            recaptcha: string
        }) => passwordRecoveryService.reset(values, recaptcha),
        onSuccess() {
            toast.success(t('passwordResetSent'), {
                description: t('passwordResetSentDesc')
            })
        },
        onError(error) {
            toastMessageHandler(error)
        }
    })

    return { reset, isLoadingReset}
}
