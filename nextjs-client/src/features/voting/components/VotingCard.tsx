'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getVotingSchema, TVotingSchema } from "../schemes/voting.schema"
import { IPoll } from "../types/voting.types"
import { useSubmitVote } from "../hooks/useSubmitVote"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/components/ui/Card"
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group"
import { Label } from "@/shared/components/ui/Label"
import { Button } from "@/shared/components/ui/Button"
import { Progress } from "@/shared/components/ui/progress"
import { cn } from "@/shared/utils"
import { useFinishPoll } from "../hooks/useFinishPoll"
import { useProfile } from "@/shared/hooks/useProfile"
import { Trophy } from "lucide-react" // Для красоты
import { useTranslations, useLocale } from "next-intl"
import { Clock, Swords } from "lucide-react"
import { useRouter } from "@/i18n/routing"


interface VotingCardProps {
  poll: IPoll
}

export const VotingCard = ({ poll }: VotingCardProps) => {
  const t = useTranslations('Voting')
  const locale = useLocale()
  const router = useRouter()

  const { user } = useProfile()
  const { mutate: finishPoll, isPending: isFinishing } = useFinishPoll()

  const { mutate: submitVote, isPending } = useSubmitVote()

  // 1. Проверяем, голосовал ли юзер
  const hasVoted = !!poll.userVoteOptionId

  // 2. Считаем общие голоса для процентов
  const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votesCount || 0), 0)

  const { handleSubmit, setValue, watch, formState: { errors } } = useForm<TVotingSchema>({
    resolver: zodResolver(getVotingSchema(t)),
  })

  const selectedValue = watch("optionId")

  const onSubmit = (data: TVotingSchema) => {
    submitVote({
      pollId: poll.id,
      optionId: data.optionId
    })
  }

  const isAdmin = user?.role === 'ADMIN'
  const isFinished = poll.status === 'FINISHED'

  const handleFinish = (optionId: string) => {
    if (confirm(t('confirmFinish'))) {
      finishPoll({ pollId: poll.id, winnerOptionId: optionId })
    }
  }

  const isExpired = poll.isPeopleChamp ? false : new Date(poll.expiresAt).getTime() < new Date().getTime()

  // Вспомогательная функция для рендеринга фото бойца
  const renderFighterPhoto = (option: any) => {
    if (!option.photoUrl) return null
    return (
      <div className="mb-3 w-full max-w-[160px] ultra:max-w-[180px] aspect-[3/4] overflow-hidden rounded-xl shadow-md bg-neutral-900 mx-auto flex-shrink-0">
        <img
          src={option.photoUrl}
          alt={locale === 'en' ? option.textEn : option.textRu}
          className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const text = locale === 'en' ? 'Photo+Not+Found' : 'Фото+не+найдено'
            e.currentTarget.src = `https://placeholder.com{text}`
          }}
        />
      </div>
    )
  }

  // Центральный блок VS
  const renderCenterBlock = () => {
    const isClosed = poll.status === 'CLOSED'
    const isOpen = poll.status === 'OPEN'
    return (
      <div className="flex flex-col items-center justify-center gap-2 shrink-0">
        <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-red-900 to-black border-4 border-red-800 shadow-2xl">
          <Swords className="text-white size-6 md:size-8" />
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-black tracking-tighter text-red-700 uppercase">VS</div>
          <div className="text-[10px] md:text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-widest whitespace-normal">
            {isFinished ? t('fightFinished') : isClosed ? t('votingEnded') : t('live')}
          </div>
          {!isFinished && !isClosed && (
            <div className="flex items-center justify-center gap-1 mt-2 text-[10px] text-amber-600">
              <Clock className="size-3" />
              <span>{new Date(poll.expiresAt).toLocaleDateString(locale, { day: 'numeric', month: 'short' })}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Блок бойца для режима результатов (hasVoted)
  const renderFighterResult = (option: any, isLeft: boolean) => {
    const percentage = totalVotes > 0 ? Math.round((option.votesCount / totalVotes) * 100) : 0
    const isUserChoice = option.id === poll.userVoteOptionId
    const isWinner = !poll.isPeopleChamp && option.id === poll.winnerOptionId

    return (
      <div className={cn(
        "flex flex-col items-center justify-between h-full w-full p-3 md:p-4 border-2 rounded-xl transition-all cursor-pointer text-center"
      )}>
        {/* 1. Фото бойца всегда сверху */}
        {renderFighterPhoto(option)}

        {/* 2. Контейнер контента, который растягивается и толкает элементы */}
        <div className="flex flex-col items-center justify-between flex-1 w-full text-center mt-3">

          {/* обертка для имени и иконок: ЖЕСТКО задаем min-h, чтобы они держали высоту */}
          <div className="flex flex-col items-center justify-center w-full min-h-[110px] md:min-h-[120px] mb-2 shrink-0">
            <span className={cn(
              "text-sm font-bold uppercase tracking-wide transition-colors text-center block",
              isUserChoice && "text-primary",
              isWinner && "text-green-600"
            )}>
              {locale === 'en' ? option.textEn : option.textRu}
            </span>

            {(isUserChoice || isWinner) && (
              <div className="flex items-center justify-center gap-1 text-sm mt-1">
                {isUserChoice && <span>✅</span>}
                {isWinner && <span>🏆</span>}
              </div>
            )}
          </div>

          {/* 3. Блок прогресс-бара и голосов всегда прижмется к самому низу */}
          <div className="w-full mt-auto">
            <span className={cn(
              "text-xs font-bold px-2 py-1 rounded block mb-2 mx-auto w-max",
              isWinner ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-muted"
            )}>
              {percentage}%
            </span>

            <Progress
              value={percentage}
              className={cn(
                "h-2 w-full",
                isWinner ? "bg-green-500" : isUserChoice ? "bg-secondary" : "bg-muted"
              )}
            />

            <p className="text-[10px] text-muted-foreground mt-1 italic">
              {t('totalVotes')} {option.votesCount}
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Блок бойца для режима голосования (user, не голосовал)
  const renderFighterVoting = (option: any, isLeft: boolean) => {
    return (
      <div
        onClick={() => setValue("optionId", option.id)}
        className={cn(
          // Заменили max-w и h-full на четкую фиксированную ширину и высоту
          "flex flex-col items-center justify-between w-[150px] sm:w-[170px] md:w-[185px] min-h-[290px] md:min-h-[320px] p-2 md:p-3 border-2 rounded-xl transition-all text-center cursor-pointer shadow-sm",
          "bg-gradient-to-b from-sky-50 to-white border-sky-200 hover:border-sky-400 hover:shadow-md",
          "dark:from-slate-900 dark:to-black dark:border-slate-800 dark:hover:border-slate-600",
          selectedValue === option.id && "border-primary ring-2 ring-primary/30"
        )}
      >
        {/* 1. Фотография бойца */}
        {renderFighterPhoto(option)}

        {/* 2. Контейнер для клика и контента */}
        <Label
          htmlFor={option.id}
          className="flex flex-col items-center justify-between w-full mt-2 cursor-pointer flex-grow"
        >
          {/* Имя бойца — выровнено по центру, резервируем min-h */}
          <span className="px-1 text-center w-full break-words line-clamp-2 font-black uppercase tracking-wider text-xs md:text-sm text-sky-900 dark:text-sky-100 min-h-[36px] flex items-center justify-center">
            {locale === 'en' ? option.textEn : option.textRu}
          </span>

          {/* Кружочек инпута */}
          <div className={cn(
            "shrink-0 border-2 rounded-full size-5 flex items-center justify-center transition-all mt-2",
            selectedValue === option.id
              ? "border-primary bg-primary shadow-[0_0_8px_rgba(239,68,68,0.3)]"
              : "border-muted-foreground/30 bg-transparent"
          )}>
            {selectedValue === option.id && <div className="size-2 rounded-full bg-white" />}
          </div>

          {/* Текст подсказки — теперь он внутри Label и аккуратно уменьшен */}
          <span className="text-[9px] md:text-[10px] text-muted-foreground/60 italic text-center block mt-2 px-1 max-w-full break-words leading-tight">
            {t('clickToVote')}
          </span>
        </Label>
      </div>
    )
  }

  // Блок бойца для анонимного просмотра
  const renderFighterAnonymous = (option: any, isLeft: boolean) => {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center w-full p-3 md:p-4 border rounded-xl opacity-60 text-center",
        "bg-sky-50 border-sky-200",
        "dark:bg-slate-900 dark:border-slate-800"
      )}>
        {renderFighterPhoto(option)}
        <div className="mt-2 text-center">
          <span className="font-bold uppercase tracking-wider text-sm text-sky-900 dark:text-sky-100">
            {locale === 'en' ? option.textEn : option.textRu}
          </span>
        </div>
      </div>
    )
  }

  // Основной контент карточки в зависимости от режима
  const renderFightCardContent = () => {
    // Если опций не 2, откатываемся к вертикальному стеку (на всякий случай)
    if (poll.options.length !== 2) {
      // Возвращаем старый вертикальный рендер (упрощённо)
      return (
        <div className="space-y-6 py-2">
          {poll.options.map((option) => {
            const percentage = totalVotes > 0 ? Math.round((option.votesCount / totalVotes) * 100) : 0
            const isUserChoice = option.id === poll.userVoteOptionId
            const isWinner = !poll.isPeopleChamp && option.id === poll.winnerOptionId
            return (
              <div key={option.id} className="group">
                {option.photoUrl && (
                  <div className="mb-3 w-full aspect-square overflow-hidden rounded-xl shadow-md bg-neutral-900 flex-shrink-0">
                    <img
                      src={option.photoUrl}
                      alt={locale === 'en' ? option.textEn : option.textRu}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                )}
                <div className="flex flex-col items-center justify-between text-center w-full min-h-[125px] mb-2 shrink-0">
                  <span className={cn("text-sm font-medium", isUserChoice && "text-primary font-bold", isWinner && "text-green-600 font-bold")}>
                    {locale === 'en' ? option.textEn : option.textRu}
                    <span className="whitespace-nowrap">
                      {isUserChoice && " ✅"}
                      {isWinner && " 🏆"}
                    </span>
                  </span>
                  <span className={cn("text-xs font-bold px-2 py-1 rounded", isWinner ? "bg-green-100 text-green-800" : "bg-muted")}>
                    {percentage}%
                  </span>
                </div>
                <Progress value={percentage} className={cn("h-3", isWinner ? "bg-green-500" : isUserChoice ? "bg-secondary" : "bg-muted")} />
                <p className="text-[10px] text-muted-foreground mt-1 text-right italic">{t('totalVotes')} {option.votesCount}</p>
              </div>
            )
          })}
        </div>
      )
    }

    const [fighter1, fighter2] = poll.options

return (
  // relative позволяет повесить VS строго по центру, а 2xl:px-4 раздвинет бойцов к краям, освобождая место для мечей
  <div className="flex flex-col 2xl:flex-row items-center w-full min-w-0 relative 2xl:px-4">
    
    {/* Левый/Верхний боец: занял ровно половину карточки на десктопе */}
    <div className="w-full 2xl:w-1/2 min-w-0 flex flex-col items-center justify-center text-center shrink-0">
      {hasVoted || isFinished || isExpired
        ? renderFighterResult(fighter1, true)
        : renderFighterVoting(fighter1, true)
      }
    </div>

    {/* Центральный блок VS: висит строго по центру, z-10 поднимает его над фотками */}
    <div className="w-full 2xl:w-auto 2xl:absolute 2xl:left-1/2 2xl:top-1/2 2xl:-translate-x-1/2 2xl:-translate-y-1/2 flex flex-col items-center justify-center py-1 shrink-0 z-10 pointer-events-none">
      {renderCenterBlock()}
    </div>

    {/* Правый/Нижний боец: занял ровно вторую половину карточки на десктопе */}
    <div className="w-full 2xl:w-1/2 min-w-0 flex flex-col items-center justify-center text-center shrink-0">
      {hasVoted || isFinished || isExpired
        ? renderFighterResult(fighter2, false)
        : renderFighterVoting(fighter2, false)
      }
    </div>

  </div>
)
  }

  return (
    <Card className={cn(
      //"w-full max-w-4xl mx-auto mb-6 flex flex-col h-full shadow-2xl border-2",
      "w-full h-auto 2xl:h-full flex flex-col justify-between border-2 rounded-2xl p-4",
      isFinished && "border-yellow-500/50"
    )}>
      <CardHeader className="flex flex-col items-center justify-start text-center w-full pt-4 pb-2 h-[140px] md:h-[160px] lg:h-[180px] 2xl:h-[120px] relative shrink-0">
        {isFinished && (
          <Trophy className="text-yellow-500 size-7 animate-bounce mb-1 flex-shrink-0" />
        )}

        <CardTitle className="w-full px-4">
          <div className="text-lg md:text-xl text-center font-black uppercase tracking-wide">
            {locale === 'en' ? poll.questionEn : poll.questionRu}
          </div>
        </CardTitle>

        <CardDescription className="text-center text-sm font-medium mt-1 text-muted-foreground/80">
          {isFinished ? t('fightFinished') : t('chooseWinner')}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col 2xl:flex-grow items-center justify-center p-0 gap-4 mt-2 w-full">
        {/* Форма для голосования (скрытая, но нужна для сабмита) */}
        {user && !hasVoted && !isFinished && !isExpired && (
          <form onSubmit={handleSubmit(onSubmit)} id={`form-${poll.id}`} className="hidden">
            <RadioGroup value={selectedValue} onValueChange={(v) => setValue("optionId", v)}>
              {poll.options.map(opt => (
                <RadioGroupItem key={opt.id} value={opt.id} id={opt.id} />
              ))}
            </RadioGroup>
          </form>
        )}

        {/* Контент бойцов: на мобильных min-h большой, на десктопе (xl) сжимается по контенту */}
        <div className="w-full py-2">
          {renderFightCardContent()}
        </div>

        {/* Панель админа */}
        {isAdmin && !isFinished && !poll.isPeopleChamp && (
          <div className="mt-8 pt-6 border-t border-dashed border-primary/30">
            <p className="text-[10px] uppercase font-bold text-primary mb-3 text-center tracking-widest">
              {t('judgePanel')}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {poll.options.map((option) => (
                <Button
                  key={option.id}
                  size="sm"
                  variant="outline"
                  className="text-[10px] h-auto py-2 whitespace-normal border-primary/50 hover:bg-primary hover:text-white leading-tight cursor-pointer"
                  onClick={() => handleFinish(option.id)}
                  disabled={isFinishing}
                >
                  {t('wonBy', { fighter: locale === 'en' ? option.textEn : option.textRu })}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Футер с кнопкой прогноза */}
      <CardFooter className="pt-4 border-t">
        {user ? (
          // 1. ПОЛЬЗОВАТЕЛЬ АВТОРИЗОВАН
          !hasVoted ? (
            <Button
              form={`form-${poll.id}`}
              type="submit"
              className="w-full font-bold uppercase py-2 h-auto whitespace-normal cursor-pointer"
              disabled={isPending || poll.status === 'CLOSED' || isExpired}
            >
              {isExpired ? t('votingEnded') : isPending ? t('submitting') : t('makePrediction')}
            </Button>
          ) : (
            <div className="w-full text-center text-sm font-medium text-muted-foreground">
              {t('alreadyVoted')}
            </div>
          )
        ) : (
          // 2. ПОЛЬЗОВАТЕЛЬ — АНОНИМ (Выводим красивую интерактивную кнопку!)
          <Button
            variant="outline"
            className="w-full font-bold uppercase py-2 h-auto whitespace-normal border-dashed border-primary/40 text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all cursor-pointer"
            onClick={() => router.push(`/auth/login`)} // Улетает на логин!
          >
            {t('loginToVoteAction')}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
