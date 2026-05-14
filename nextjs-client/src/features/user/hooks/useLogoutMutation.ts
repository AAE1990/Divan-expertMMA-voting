import { authService } from "@/features/auth/services";
import { toastMessageHandler } from "@/shared/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLogoutMutation() {
    const router = useRouter()
    const queryClient = useQueryClient()

    const {mutate: logout, isPending: isLoadingLogout } = useMutation({
        mutationKey: ['logout'],
        mutationFn: () => authService.logout(),
        onSuccess() {
            toast.success('Вы успешно вышли из системы')
            // Сбрасываем все запросы профиля, чтобы немедленно обновить интерфейс
            queryClient.resetQueries({ queryKey: ['profile'], exact: false })
            router.push('/auth/login')
        },
        onError(error) {
            toastMessageHandler(error)
        }
    })

    return {
        logout,
        isLoadingLogout
    }
}
