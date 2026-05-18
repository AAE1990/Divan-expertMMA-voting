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
        <Card className='w-full max-w-[400px] sm:p-6 p-3 sm:px-6 px-2'>
            <CardHeader className='space-y-2 sm:p-0'>
                <CardTitle>{heading}</CardTitle>
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
            </CardHeader>
            <CardContent className='sm:p-0 pt-4'>
                {isShowSocial && <AuthSocial />}
                {children}
            </CardContent>
            <CardFooter className='sm:p-0 pt-4'>
                {backButtonLabel && backButtonHref && (
                    <Button variant='link' className='w-full font normal'>
                        <Link href={backButtonHref}>{backButtonLabel}</Link>
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}