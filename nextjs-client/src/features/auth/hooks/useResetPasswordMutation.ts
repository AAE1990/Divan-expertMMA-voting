import { useMutation } from "@tanstack/react-query";
import { TypeResetPasswordSchema } from '../schemes/reset-password.schema'
import { passwordRecoveryService } from "../services/password-recovery.service";
import { toast } from "sonner";
import { toastMessageHandler } from "@/shared/utils";

export function useResetPasswordMutation() {
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
            toast.success('Проверьте почту', {
                description:
                    'На вашу почту была отправлена ссылка на подтверждение'
            })
        },
        onError(error) {
            toastMessageHandler(error)
        }
    })

    return { reset, isLoadingReset}
}
