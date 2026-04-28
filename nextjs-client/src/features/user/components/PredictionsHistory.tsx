import { IUserVote } from "@/features/auth/types"
import { Badge } from "@/shared/components/ui/Badge"
import { CheckCircle2, XCircle, Clock } from "lucide-react"

export const PredictionsHistory = ({ votes }: { votes: IUserVote[] }) => {
  if (!votes?.length) return (
    <p className="text-center text-muted-foreground text-xs py-10 italic">
      Вы еще не сделали ни одного прогноза
    </p>
  )

  return (
    <div className="space-y-3">
      {votes.map((vote) => {
        const isFinished = vote.poll.status === 'FINISHED'
        const isWinner = isFinished && vote.optionId === vote.poll.winnerOptionId
        
        return (
          <div key={vote.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
            <div className="space-y-1 min-w-0">
              <p className="text-[10px] uppercase font-bold text-muted-foreground truncate">
                {vote.poll.question}
              </p>
              <p className="text-sm font-semibold truncate italic text-primary">
                {vote.option.text}
              </p>
            </div>

            <div className="flex shrink-0 ml-4">
              {!isFinished ? (
                <Badge variant="outline" className="gap-1 text-sky-500 border-sky-500/20">
                  <Clock className="size-3" /> Ожидание
                </Badge>
              ) : isWinner ? (
                <Badge variant="default" className="gap-1 bg-green-500 hover:bg-green-600">
                  <CheckCircle2 className="size-3" /> +1 балл
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="size-3" /> Мимо
                </Badge>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
