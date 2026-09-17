import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/routing";
import { verificationService } from "../services";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { toastMessageHandler } from "@/shared/utils";

export function useVerificationMutation() {
    const queryClient = useQueryClient()
    const router = useRouter()
    const t = useTranslations("Auth")

    const { mutate: verification } = useMutation({
        mutationKey: ['new verification'],
        mutationFn: (token: string | null ) =>
            verificationService.newVerification(token),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['profile'] }) // убираем кэширование профиля после успешной верификации, в данном случае были кнопки входа после верификации
            toast.success(t('emailVerified'))
            router.push('/dashboard/settings')
        },
        onError(error: any) {
            console.error('Ошибка верификации:', error) // Выведет детали в консоль
            const code = error.code
            if (code && typeof code === 'string') {
                toast.error(t(code))
            } else {
                toastMessageHandler(error, t)
            }
            router.push('/auth/login')
        }
    })

    return { verification }
}
