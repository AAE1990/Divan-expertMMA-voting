'use client'

import { Button } from "@/shared/components/ui"
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { FaGoogle, FaYandex } from "react-icons/fa";
import { authService } from "../services";


export function AuthSocial() {
    const router = useRouter()
    const t = useTranslations('Auth')
    const locale = useLocale()

    const { mutateAsync } = useMutation({
        mutationKey: ['oauth by provider', locale],
        mutationFn: async (provider: 'google' | 'yandex') =>
            await authService.oauthByProvider(provider, locale)
    })

    const onClick = async (provider: 'google' | 'yandex') => {
        const response = await mutateAsync(provider)

        if (response) {
            router.push(response.url)
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                <Button
                    onClick={() => onClick('google')}
                    variant="outline"
                    className="w-full cursor-pointer flex items-center justify-center font-medium text-sm transition-colors hover:bg-white/5"
                    style={{ paddingLeft: '16px', paddingRight: '16px' }}
                >
                    <FaGoogle className="mr-2 size-4 shrink-0 text-black dark:text-white" />
                    <span>Google</span> {/* Короткий лаконичный текст */}
                </Button>

                <Button
                    onClick={() => onClick('yandex')}
                    variant="outline"
                    className="w-full cursor-pointer flex items-center justify-center font-medium text-sm transition-colors hover:bg-white/5"
                    style={{ paddingLeft: '16px', paddingRight: '16px' }}
                >
                    <FaYandex className="mr-2 size-4 shrink-0 text-red-500" />
                    <span>Яндекс</span> {/* Короткий лаконичный текст */}
                </Button>
            </div>

            {/* Исправленный адаптивный разделитель без использования фонового bg */}
            <div className='flex items-center my-5 w-full select-none gap-4'>
                <div className='flex-1 border-t border-solid border-border/60' />
                <span className='text-[10px] uppercase font-black tracking-widest text-muted-foreground shrink-0'>
                    {t('or')}
                </span>
                <div className='flex-1 border-t border-solid border-border/60' />
            </div>
        </>
    )
}