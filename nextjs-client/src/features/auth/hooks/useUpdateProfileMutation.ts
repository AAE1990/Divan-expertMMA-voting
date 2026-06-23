import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { toastMessageHandler } from "@/shared/utils"
import { useTranslations } from "next-intl"

import { userService } from "@/features/user/services"
import { TypeSettingsSchema } from "@/features/user/schemes"

export function useUpdateProfileMutation() {
    const t = useTranslations("Auth")
    const { mutate: update, isPending: isLoadingUpdate } = useMutation({
        mutationKey: ['update profile'],
        mutationFn: (data: TypeSettingsSchema) =>
            userService.updateProfile(data),
        onSuccess() {
            toast.success(t('profileUpdated'))
        },
        onError(error: any) {
            const code = error.code
            if (code && typeof code === 'string') {
                toast.error(t(code))
            } else {
                toastMessageHandler(error, t)
            }
        }
    })

    return { update, isLoadingUpdate }
}
