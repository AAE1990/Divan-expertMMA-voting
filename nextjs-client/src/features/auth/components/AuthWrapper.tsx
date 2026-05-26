import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui"
import { Link } from "@/i18n/routing"
import { type  PropsWithChildren } from "react"
import { AuthSocial } from "./AuthSocial"
import { cn } from "@/shared/utils/clsx"

interface AuthWrapperProps {
    heading: string
    description?: string
    backButtonLabel?: string
    backButtonHref?: string
    isShowSocial?: boolean
}

export function AuthWrapper({
    children,
    heading,
    description,
    backButtonLabel,
    backButtonHref,
    isShowSocial = false
}: PropsWithChildren<AuthWrapperProps>) {
    return (
        <Card className='w-full max-w-[400px] p-4 sm:p-6 pb-6 sm:pb-8 flex flex-col gap-4 shadow-md'>
            <CardHeader className='p-0 space-y-1'>
                <CardTitle className="text-2xl font-black uppercase italic tracking-tight">{heading}</CardTitle>
                {description && (
                    <CardDescription className="text-xs">{description}</CardDescription>
                )}
            </CardHeader>
            <CardContent className='p-0 flex flex-col gap-4'>
                {isShowSocial && <AuthSocial />}
                {children}
            </CardContent>
            {backButtonLabel && backButtonHref && (
                <CardFooter className='!bg-transparent !border-t-0 !p-0 !pt-4 !pb-2'>
                    <Button variant='outline' className='w-full rounded-xl py-5 font-normal flex items-center justify-center text-sm cursor-pointer !mb-4' asChild>
                        <Link href={backButtonHref}>
                            {backButtonLabel}
                        </Link>
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}