import { useMutation } from "@tanstack/react-query";

import { TypeRegisterSchema } from "../schemes";
import { authService } from "../services";
import { toastMessageHandler } from "@/shared/utils";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing"

export function useRegisterMutation() {
    const locale = useLocale();
    const t = useTranslations("Auth")
    const router = useRouter()

    const { mutate: registerMutation, isPending: isLoadingRegister } = useMutation({
        mutationKey: ['register user'],
        mutationFn: ({ values, recaptcha }: { values: TypeRegisterSchema; recaptcha: string }) => {
            return authService.register(
                { ...values, locale } as any,
                recaptcha
            );
        },
        onSuccess(data: any) {
            toastMessageHandler(data)

            // ВАЖНО: Автоматически перенаправляем пользователя на страницу входа
            router.push('/auth/login');
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
