"use client"

import { useTheme } from "next-themes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getNewPasswordSchema, TypeNewPasswordSchema } from "../schemes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNewPasswordMutation } from "../hooks";
import { toast } from "sonner";
import { AuthWrapper } from "./AuthWrapper";
import ReCAPTCHA from "react-google-recaptcha"
import { Button } from "@/shared/components/ui/Button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { PasswordInput } from "@/shared/components/ui";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

export function NewPasswordForm() {
    const { theme } = useTheme()
    const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const t = useTranslations('Auth')
    const locale = useLocale()

    const form = useForm<TypeNewPasswordSchema>({
        resolver: zodResolver(getNewPasswordSchema(t)),
        defaultValues: {
          password: ''
        },
      })

    const { newPassword, isLoadingNew } = useNewPasswordMutation()

    const onSubmit = (values: TypeNewPasswordSchema) => {
        if (!token) {
            toast.error(t('invalidLink'))
            return
        }
        if (recaptchaValue) {
            newPassword({ values, recaptcha: recaptchaValue })
        } else {
            toast.error(t('pleaseConfirmCaptcha'))
        }
    }

    // Если токена нет, показываем сообщение
    if (!token) {
        return (
            <AuthWrapper
                heading={t('invalidLinkTitle')}
                description={t('invalidLinkDescription')}
                backButtonLabel={t('backToHome')}
                backButtonHref="/"
            >
                <div className="text-left space-y-2">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        {t('linkExpiredMessage')}
                    </p>
                </div>
            </AuthWrapper>
        )
    }

    return (
        <AuthWrapper
            heading={t('newPasswordTitle')}
            description={t('newPasswordDescription')}
            backButtonLabel={t('backToLogin')}
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-2"
                >
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('password')}</FormLabel>
                                <FormControl>
                                    <PasswordInput
                                        placeholder={t('passwordPlaceholder')}
                                        disabled={isLoadingNew}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="w-full flex justify-center mx-auto">
                        <ReCAPTCHA
                            sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string}
                            onChange={setRecaptchaValue}
                            theme={theme === "light" ? "light" : "dark"}
                            hl={locale} // МАГИЯ ЗДЕСЬ! Передает 'ru' или 'en' напрямую в Google!
                        />
                    </div>

                    <Button type="submit" className="w-full px-4" disabled={isLoadingNew || !recaptchaValue}>
                        {t('continueButton')}
                    </Button>
                </form>
            </Form>
        </AuthWrapper>
    )
}
