import { userService } from "@/features/user/services";
import { useQuery } from "@tanstack/react-query";

export function useProfile(page?: number, limit?: number) {
    const { data: user, isLoading, isFetching } = useQuery({
        queryKey: ['profile', page, limit],
        queryFn: () => userService.findProfile(page, limit),
        
        // ВАЖНО: Если юзер не авторизован (401), не нужно повторять запрос 3 раза подряд!
        retry: false, 
        
        // Кэшируем профиль на 5 минут, чтобы при переходе по страницам запросы не дублировались
        staleTime: 5 * 60 * 1000, 
    })

    return { user, isLoading, isFetching }
}
