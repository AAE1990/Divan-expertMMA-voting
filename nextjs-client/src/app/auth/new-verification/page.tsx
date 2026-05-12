import { NewVerificationForm } from "@/features/auth/components/NewVerificationForm";
import { Suspense } from "react";

export default function NewVerificationPage() {
    return (
        <Suspense fallback={<div>Загрузка...</div>}>
            <NewVerificationForm />
        </Suspense>
    )
}
