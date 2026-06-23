import { authService } from "@/features/auth/services";
import { toastMessageHandler } from "@/shared/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function useLogoutMutation() {
    const t = useTranslations("Auth")
    const router = useRouter()
    const queryClient = useQueryClient()

    const {mutate: logout, isPending: isLoadingLogout } = useMutation({
        mutationKey: ['logout'],
        mutationFn: () => authService.logout(),
        onSuccess() {
            toast.success(t('logoutSuccess'))
            // Сбрасываем все запросы профиля, чтобы немедленно обновить интерфейс
            queryClient.resetQueries({ queryKey: ['profile'], exact: false })
            router.push('/auth/login')
        },
        onError(error) {
            toastMessageHandler(error, t)
        }
    })

    return {
        logout,
        isLoadingLogout
    }
}
