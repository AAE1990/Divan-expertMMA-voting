'use client'

import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getCreatePollSchema, TCreatePollSchema } from "@/features/voting/schemes/voting.schema"
import { useCreatePoll } from "@/features/voting/hooks/useCreatePoll"
import { Card, CardContent, CardHeader, CardTitle, Loading } from "@/shared/components/ui/"
import { Input } from "@/shared/components/ui"
import { Label } from "@/shared/components/ui"
import { Button } from "@/shared/components/ui"
import { useRouter } from "@/i18n/routing"
import { useProfile } from "@/shared/hooks"
import { useGetTournaments } from "@/features/tournament/hooks/useGetTournaments"
import { useCreateTournament } from "@/features/tournament/hooks/useCreateTournament"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { useEffect } from "react"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"

export default function AdminVotingPage() {
    // 1. Сначала ВСЕ хуки без исключения
    const { user, isLoading: isProfileLoading } = useProfile()
    const { data: tournaments, isLoading: isTournamentsLoading } = useGetTournaments()
    const { mutate: createTournament } = useCreateTournament()
    const { mutate: createPoll, isPending } = useCreatePoll()
    const router = useRouter()
    const t = useTranslations('AdminVoting')
    const tCommon = useTranslations('Common')
    const locale = useLocale()

    // Форма боя теперь должна включать tournamentId
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<TCreatePollSchema>({
        resolver: zodResolver(getCreatePollSchema(t)),
        defaultValues: {
            isPeopleChamp: false
        }
    })

    // 2. useEffect для редиректа тоже здесь
    useEffect(() => {
        if (!isProfileLoading && (!user || user.role !== 'ADMIN')) {
            router.push('/')
        }
    }, [user, isProfileLoading, router])

    // 3. И ТОЛЬКО ТЕПЕРЬ условия отрисовки
    if (isProfileLoading) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
                <Loading />
            </div>
        )
    }

    // 3. ЗАЩИТА: Если загрузилось, и это НЕ админ, возвращаем ПУСТОТУ (null), 
    // пока useEffect делает свою работу по редиректу.
    if (!user || user.role !== 'ADMIN') {
        return null
    }


    // Функция для создания тестового турнира (чтобы не верстать пока всю форму)
    const handleQuickTournament = () => {
        const nameRu = prompt(t('tournamentPromptRu') || 'Введите название турнира на русском')
        if (!nameRu) return
        const nameEn = prompt(t('tournamentPromptEn') || 'Введите название турнира на английском')
        if (!nameEn) return
        const date = new Date().toISOString()
        createTournament({ nameRu, nameEn, date })
    }

    // Компонент для предпросмотра изображения
    const PreviewImage = ({ register, name, label }: { register: any, name: string, label: string }) => {
        const { control } = useForm();
        const photoUrl = useWatch({
            control,
            name: name,
            defaultValue: ""
        });

        if (!photoUrl) return null;

        return (
            <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">{t('previewLabel')}</p>
                <div className="h-40 w-full overflow-hidden rounded-lg shadow-md">
                    <img
                        src={photoUrl}
                        alt={label}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Если изображение не загрузилось, показываем заглушку
                            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Фото+не+найдено';
                        }}
                    />
                </div>
            </div>
        );
    };

    const onSubmit = (data: TCreatePollSchema) => {
        createPoll({
            questionRu: data.questionRu,
            questionEn: data.questionEn,
            // Массив из двух бойцов с фотографиями
            options: [
                {
                    textRu: data.fighter1Ru,
                    textEn: data.fighter1En,
                    photoUrl: data.fighter1Photo || undefined
                },
                {
                    textRu: data.fighter2Ru,
                    textEn: data.fighter2En,
                    photoUrl: data.fighter2Photo || undefined
                }
            ],
            expiresAt: data.expiresAt,
            // ID турнира, который мы получили через Select и setValue
            tournamentId: data.tournamentId,
            isPeopleChamp: data.isPeopleChamp
        })
    }


    return (
        <div className="max-w-2xl mx-auto py-10 space-y-8">
            {/* Секция 1: Управление турнирами */}
            <Card className="border-dashed border-2">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t('tournamentsTitle')}</CardTitle>
                    <Button variant="outline" size="sm" onClick={handleQuickTournament}>
                        {t('quickTournamentButton')}
                    </Button>
                </CardHeader>
            </Card>

            {/* Секция 2: Создание боя */}
            <Card>
                <CardHeader><CardTitle>{t('addFightTitle')}</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label>{t('selectTournamentLabel')}</Label>
                            <Select onValueChange={(value) => setValue("tournamentId", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder={isTournamentsLoading ? tCommon('loading') : t('selectTournamentPlaceholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {tournaments?.tournaments?.map((tournament) => ( // Назвали переменную 'tournament'
                                        <SelectItem key={tournament.id} value={tournament.id}>
                                            {locale === 'en' ? tournament.nameEn : tournament.nameRu}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.tournamentId && <p className="text-red-500 text-xs">{errors.tournamentId.message}</p>}
                        </div>

                        {/* ... твои старые поля fighter1, fighter2, expiresAt ... */}
                        <div className="space-y-2">
                            <Label>{t('questionLabel')}</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Input {...register("questionRu")} placeholder={t('questionPlaceholderRu') || "Вопрос на русском"} />
                                    {errors.questionRu && <p className="text-red-500 text-xs">{errors.questionRu.message}</p>}
                                </div>
                                <div>
                                    <Input {...register("questionEn")} placeholder={t('questionPlaceholderEn') || "Вопрос на английском"} />
                                    {errors.questionEn && <p className="text-red-500 text-xs">{errors.questionEn.message}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="border p-4 rounded-lg">
                                <h3 className="font-medium mb-3">{t('fighter1Label')}</h3>
                                <div className="space-y-2">
                                    <Label>{t('fighterNameLabel')}</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Input {...register("fighter1Ru")} placeholder={t('fighterNamePlaceholderRu') || "Имя на русском"} />
                                            {errors.fighter1Ru && <p className="text-red-500 text-xs">{errors.fighter1Ru.message}</p>}
                                        </div>
                                        <div>
                                            <Input {...register("fighter1En")} placeholder={t('fighterNamePlaceholderEn') || "Имя на английском"} />
                                            {errors.fighter1En && <p className="text-red-500 text-xs">{errors.fighter1En.message}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 mt-3">
                                    <Label>{t('photoUrlLabel')}</Label>
                                    <Input {...register("fighter1Photo")} placeholder="https://example.com/fighter1.jpg" />
                                    {errors.fighter1Photo && <p className="text-red-500 text-xs">{errors.fighter1Photo.message}</p>}
                                </div>
                                {/* Предпросмотр фотографии */}
                                <PreviewImage register={register} name="fighter1Photo" label={t('fighter1Label')} />
                            </div>

                            <div className="border p-4 rounded-lg">
                                <h3 className="font-medium mb-3">{t('fighter2Label')}</h3>
                                <div className="space-y-2">
                                    <Label>{t('fighterNameLabel')}</Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Input {...register("fighter2Ru")} placeholder={t('fighterNamePlaceholderRu') || "Имя на русском"} />
                                            {errors.fighter2Ru && <p className="text-red-500 text-xs">{errors.fighter2Ru.message}</p>}
                                        </div>
                                        <div>
                                            <Input {...register("fighter2En")} placeholder={t('fighterNamePlaceholderEn') || "Имя на английском"} />
                                            {errors.fighter2En && <p className="text-red-500 text-xs">{errors.fighter2En.message}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2 mt-3">
                                    <Label>{t('photoUrlLabel')}</Label>
                                    <Input {...register("fighter2Photo")} placeholder="https://example.com/fighter2.jpg" />
                                    {errors.fighter2Photo && <p className="text-red-500 text-xs">{errors.fighter2Photo.message}</p>}
                                </div>
                                {/* Предпросмотр фотографии */}
                                <PreviewImage register={register} name="fighter2Photo" label={t('fighter2Label')} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{t('expiresAtLabel')}</Label>
                            <Input type="datetime-local" {...register("expiresAt")} />
                            {errors.expiresAt && <p className="text-red-500 text-xs">{errors.expiresAt.message}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="isPeopleChamp"
                                {...register("isPeopleChamp")}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor="isPeopleChamp" className="text-sm font-medium leading-none">
                                {t('peopleChampLabel')}
                            </Label>
                        </div>
                        {errors.isPeopleChamp && <p className="text-red-500 text-xs">{errors.isPeopleChamp.message}</p>}

                        <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
                            {isPending ? t('publishingButton') : t('publishButton')}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
