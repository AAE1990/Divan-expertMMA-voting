import { userService } from "@/features/user/services";
import { useQuery } from "@tanstack/react-query";

export function useProfile() {
    const { data: user, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: () => userService.findProfile()
    })

    return {
        user,
        isLoading
    }
}
