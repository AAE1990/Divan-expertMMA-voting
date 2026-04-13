import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { verificationService } from "../services";
import { toast } from "sonner";

export function useVerificationMutation() {
    const router = useRouter()

    const { mutate: verification } = useMutation({
        mutationKey: ['new verification'],
        mutationFn: (token: string | null ) =>
            verificationService.newVerification(token),
        onSuccess() {
            toast.success('Почта успешно подтверждена')
            router.push('/dashboard/settings')
        },
        onError(error) {
            console.error('Ошибка верификации:', error) // Выведет детали в консоль
            toast.error('Ошибка при подтверждении почты')
            router.push('/auth/login')
        }
    })

    return { verification }
}
