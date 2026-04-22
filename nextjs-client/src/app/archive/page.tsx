'use client'

import { useGetTournaments } from "@/features/tournament/hooks/useGetTournaments";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui";
import { Loading } from "@/shared/components/ui";
import Link from "next/link";
import { CalendarDays } from "lucide-react";

export default function ArchivePage() {
  const { data: tournaments, isLoading } = useGetTournaments();

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loading /></div>;

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-4xl font-black mb-8 uppercase tracking-tighter italic text-center">
        Архив событий
      </h1>

      <div className="grid gap-4">
        {tournaments?.map((t) => (
          <Link key={t.id} href={`/voting?tournamentId=${t.id}`}>
            <Card className="hover:border-primary transition-colors cursor-pointer group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {t.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <CalendarDays className="size-3" />
                    {new Date(t.date).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Смотреть итоги
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
