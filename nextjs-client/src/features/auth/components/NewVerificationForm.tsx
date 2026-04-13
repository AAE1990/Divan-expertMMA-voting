'use client'

import { useSearchParams } from "next/navigation"
import { useVerificationMutation } from "../hooks"
import { useEffect } from "react"
import { AuthWrapper } from "./AuthWrapper"
import { Loading } from "@/shared/components/ui"

export function NewVerificationForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const { verification } = useVerificationMutation()

    useEffect(() => {
        if (token) {
            verification(token)
        }
    }, [token, verification])

    return (
        <AuthWrapper heading="Подтверждение почты">
            <div>
                <Loading />
            </div>
        </AuthWrapper>
    )
}
