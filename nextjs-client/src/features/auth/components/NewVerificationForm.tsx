'use client'

import { useSearchParams } from "next/navigation"
import { useVerificationMutation } from "../hooks"
import { useEffect } from "react"
import { AuthWrapper } from "./AuthWrapper"
import { Loading } from "@/shared/components/ui"
import { useTranslations } from "next-intl"

export function NewVerificationForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const t = useTranslations('Auth')

    const { verification } = useVerificationMutation()

    useEffect(() => {
        if (token) {
            verification(token)
        }
    }, [token, verification])

    return (
        <AuthWrapper heading={t('emailVerificationTitle')}>
            <div>
                <Loading />
            </div>
        </AuthWrapper>
    )
}
