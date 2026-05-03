import { Avatar, AvatarFallback, AvatarImage, Skeleton } from "@/shared/components/ui";
import { IUser } from "@/features/auth/types";

interface UserButtonProps {
    user: IUser
}

export function UserButton({ user }: UserButtonProps) {
    if (!user) return null

    return (
        <Avatar>
            <AvatarImage src={user.picture} />
            <AvatarFallback>
                {user.displayName.slice(0, 1)}
            </AvatarFallback>
        </Avatar>
    )
}

export function UserButtonLoading() {
    return <Skeleton className="h-10 w-10 rounded-full" />
}
