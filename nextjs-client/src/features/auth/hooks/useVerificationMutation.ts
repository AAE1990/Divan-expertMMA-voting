import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@/i18n/routing";
import { verificationService } from "../services";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function useVerificationMutation() {
    const router = useRouter()
    const t = useTranslations("Auth")

    const { mutate: verification } = useMutation({
        mutationKey: ['new verification'],
        mutationFn: (token: string | null ) =>
            verificationService.newVerification(token),
        onSuccess() {
            toast.success(t('emailVerified'))
            router.push('/dashboard/settings')
        },
        onError(error) {
            console.error('Ошибка верификации:', error) // Выведет детали в консоль
            toast.error(t('verificationError'))
            router.push('/auth/login')
        }
    })

    return { verification }
}
