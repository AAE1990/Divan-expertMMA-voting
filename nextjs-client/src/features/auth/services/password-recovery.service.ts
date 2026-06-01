import { api } from "@/shared/api";
import { TypeNewPasswordSchema, TypeResetPasswordSchema } from "../schemes";
import { IUser } from "../types";

class PasswordRecoveryService {
    public async reset(body: TypeResetPasswordSchema, recaptcha?: string, locale?: string) {
        const headers = recaptcha ? { recaptcha }: undefined
        const payload = locale ? { ...body, locale } : body

        const response = await api.post<IUser>(
            'auth/password-recovery/reset',
            payload,
            {
                headers
            }
        )

        return response
    }

    public async new(
        body: TypeNewPasswordSchema,
        token: string | null,
        recaptcha?: string
    ) {
        const headers = recaptcha ? { recaptcha } : undefined

        const response = await api.post<IUser>(
            `auth/password-recovery/new/${token}`,
            body,
            {
                headers
            }
        )

        return response
    }
}

export const passwordRecoveryService = new PasswordRecoveryService()
