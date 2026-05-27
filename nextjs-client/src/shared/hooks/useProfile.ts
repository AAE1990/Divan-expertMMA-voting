import { userService } from "@/features/user/services";
import { useQuery } from "@tanstack/react-query";

export function useProfile(page?: number, limit?: number) {
    const { data: user, isLoading, isFetching } = useQuery({
        queryKey: ['profile', page, limit],
        queryFn: () => userService.findProfile(page, limit)
    })

    return {
        user,
        isLoading,
        isFetching
    }
}
