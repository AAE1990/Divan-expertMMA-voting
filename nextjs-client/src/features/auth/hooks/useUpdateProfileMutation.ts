import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { toastMessageHandler } from "@/shared/utils"

import { userService } from "@/features/user/services"
import { TypeSettingsSchema } from "@/features/user/schemes"

export function useUpdateProfileMutation() {
    const { mutate: update, isPending: isLoadingUpdate } = useMutation({
        mutationKey: ['update profile'],
        mutationFn: (data: TypeSettingsSchema) =>
            userService.updateProfile(data),
        onSuccess() {
            toast.success('Профиль успешно обновлён')
        },
        onError(error) {
            toastMessageHandler
        }
    })

    return {update, isLoadingUpdate}
}
