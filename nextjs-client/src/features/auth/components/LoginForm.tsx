// src/features/auth/components/RegisterForm.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { LoginSchema, TypeLoginSchema } from "../schemes"
import { AuthWrapper } from "./AuthWrapper"
import { useTheme } from "next-themes"
import { useState } from "react"
import { toast } from "sonner"
import ReCAPTCHA from "react-google-recaptcha"
import { useLoginMutation } from "../hooks"
import { Input, PasswordInput } from "@/shared/components/ui"
import { Button } from "@/shared/components/ui"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui";
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"

export function LoginForm() {
  const {theme} = useTheme()
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
  const [isShowTwoFactor, setIsShowFactor] = useState(false)
  const t = useTranslations('Auth')

  const form = useForm<TypeLoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: ""
    },
  })

  const { login, isLoadingLogin } = useLoginMutation(setIsShowFactor)

  const onSubmit = (values: TypeLoginSchema) => {
    if (recaptchaValue) {
      login({ values, recaptcha: recaptchaValue })
    } else {
      toast.error(t('pleaseConfirmCaptcha'))
    }
  }

  return (
    <AuthWrapper
      heading={t('loginTitle')}
      description={t('loginDescription')}
      backButtonLabel={t('backButtonLabelRegister')}
      backButtonHref="/auth/register"
      isShowSocial
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2"
        >
          {isShowTwoFactor && (
              <FormField
                control={form.control}
                name='code'
                render={({ field}) => (
                  <FormItem>
                    <FormLabel>{t('twoFactorCode')}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('twoFactorPlaceholder')}
                        disabled={isLoadingLogin}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
              )}
            />
          )}
          {!isShowTwoFactor && (
            <>
              <FormField
                control={form.control}
                name='email'
                render={({ field}) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('emailPlaceholder')}
                          disabled={isLoadingLogin}
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field}) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>{t('password')}</FormLabel>
                      <Link
                        href='/auth/reset-password'
                        className="ml-auto inline-block text-sm underline"
                      >
                        {t('forgotPassword')}
                      </Link>
                    </div>
                      <FormControl>
                        <PasswordInput
                          placeholder={t('passwordPlaceholder')}
                          disabled={isLoadingLogin}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <div className="w-full flex justify-center mx-auto">
              <ReCAPTCHA
                sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string}
                onChange={setRecaptchaValue}
                theme={theme === "light" ? "light" : "dark"}
              />
          </div>

          <Button type="submit" className="w-full px-4" disabled={isLoadingLogin || !recaptchaValue}>
            {t('signIn')}
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  )
}