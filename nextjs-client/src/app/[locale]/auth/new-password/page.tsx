import { NewPasswordForm } from "@/features/auth/components/NewPasswordForm";
import { Suspense } from "react";

export default function NewPasswordPage() {
    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <Suspense fallback={<div>Загрузка...</div>}>
                <NewPasswordForm />
            </Suspense>
        </div>
    )
}
