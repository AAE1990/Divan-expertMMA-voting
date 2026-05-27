import { LuLoader } from "react-icons/lu";
import { useTranslations } from "next-intl";

export function Loading() {
    const t = useTranslations('Common');
    return (
        <div className="flex items-center justify-center text-sm">
            <LuLoader className="mr-2 size-5 animate-spin" />
            {t('loading')}
        </div>
    )
}
