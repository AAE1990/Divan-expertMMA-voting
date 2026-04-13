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
import Link from "next/link"

export function LoginForm() {
  const {theme} = useTheme()
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
  const [isShowTwoFactor, setIsShowFactor] = useState(false)

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
      toast.error('Пожалуйста, подтвердите, что вы не робот')
    }
  }

  return (
    <AuthWrapper
      heading="Войти"
      description="Чтобы войти на сайт введите ваш email и пароль"
      backButtonLabel="Еще нет аккаунта? Зарегистрироваться"
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
                    <FormLabel>Код</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="123456"
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
                    <FormLabel>Почта</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your@example.com"
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
                      <FormLabel>Пароль</FormLabel>
                      <Link
                        href='/auth/reset-password'
                        className="ml-auto inline-block text-sm underline"
                      >
                        Забыли пароль
                      </Link>
                    </div>
                      <FormControl>
                        <PasswordInput 
                          placeholder="********"
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

          <div className="flex justify-center">
              <ReCAPTCHA 
                sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY as string}
                onChange={setRecaptchaValue}
                theme={theme === "light" ? "light" : "dark"}
              />
          </div>

          <Button type="submit" className="w-full" disabled={isLoadingLogin || !recaptchaValue}>
            Войти
          </Button>
        </form>
      </Form>
    </AuthWrapper>
  )
}