import { useMutation } from "@tanstack/react-query";

import { TypeRegisterSchema } from "../schemes";
import { authService } from "../services";
import { toastMessageHandler } from "@/shared/utils";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function useRegisterMutation() {
    const t = useTranslations("Auth")
    const { mutate: registerMutation, isPending: isLoadingRegister } = useMutation({
        mutationKey: ['register user'],
        mutationFn: ({
            values,
            recaptcha
        }: {
            values: TypeRegisterSchema
            recaptcha: string
        }) => authService.register(values, recaptcha),
        onSuccess(data: any) {
            toastMessageHandler(data)
        },
        onError(error: any) {
            const code = error.code
            if (code && typeof code === 'string') {
                toast.error(t(code))
            } else {
                toastMessageHandler(error)
            }
        }
    })

    return {
        registerMutation,
        isLoadingRegister
    }
}
