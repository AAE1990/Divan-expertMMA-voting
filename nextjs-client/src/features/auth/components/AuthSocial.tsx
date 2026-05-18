'use client'

import { Button } from "@/shared/components/ui"
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { FaGoogle, FaYandex } from "react-icons/fa";
import { authService } from "../services";


export function AuthSocial() {
    const router = useRouter()

    const { mutateAsync} = useMutation({
        mutationKey: ['oauth by provider'],
        mutationFn: async (provider: 'google' | 'yandex') => 
            await authService.oauthByProvider(provider)
    })

    const onClick = async (provider: 'google' | 'yandex') => {
        const response = await mutateAsync(provider)

        if(response) {
            router.push(response.url)
        }
    }

    return (
        <>
           <div className="flex flex-col md:flex-row gap-4 w-full">
            <Button onClick={() => onClick('google')} variant="outline" className="w-full md:w-auto">
                <FaGoogle className="mr-2 size-4" />
                Google
            </Button>
            <Button onClick={() => onClick('yandex')} variant="outline" className="w-full md:w-auto">
                <FaYandex className="mr-2 size-4" />
                Яндекс
            </Button>
           </div>
           <div className='relative mb-2 space-y-4'>
               <div className='absolute inset-0 flex items-center'>
                   <span className='w-full border-t border-[#00000000]'/>
               </div>
               <div className='relative flex justify-center text-xs uppercase'>
                   <span className='bg-background px-2 text-muted-foreground'>
                       Или
                   </span>
               </div>
           </div>
        </>
    )
}