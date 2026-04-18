'use client'

import { useLeaderboard } from "@/features/user/hooks/useLeaderboard";
import { Card, CardContent, Loading } from "@/shared/components/ui";
import { Trophy, Medal } from "lucide-react";
import { cn } from "@/shared/utils/clsx";

export default function RatingPage() {
  const { data: leaders, isLoading } = useLeaderboard();

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loading /></div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center gap-4 mb-8">
        <Trophy className="size-10 text-yellow-500" />
        <h1 className="text-4xl font-black uppercase tracking-tighter">Топ прогнозистов</h1>
      </div>

      <Card className="border-2">
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="p-4 font-bold uppercase text-xs">Место</th>
                  <th className="p-4 font-bold uppercase text-xs">Участник</th>
                  <th className="p-4 font-bold uppercase text-xs text-right">Баллы</th>
                </tr>
              </thead>
              <tbody>
                {leaders?.map((user, index) => {
                  const isTop3 = index < 3;
                  return (
                    <tr key={user.id} className={cn(
                      "border-b last:border-0 hover:bg-primary/5 transition-colors",
                      isTop3 && "bg-yellow-500/5 dark:bg-yellow-500/10"
                    )}>
                      <td className="p-4">
                        <div className="flex items-center justify-center size-8 rounded-full font-bold bg-muted">
                          {index === 0 ? <Medal className="text-yellow-500 size-5" /> : index + 1}
                        </div>
                      </td>
                      <td className="p-4 font-semibold">
                        {user.displayName || "Аноним"}
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-xl font-black text-primary">{user.score}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
