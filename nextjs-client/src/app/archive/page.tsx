'use client'

import { useGetTournaments } from "@/features/tournament/hooks/useGetTournaments";
import { Card, CardHeader, CardTitle, CardDescription, Input } from "@/shared/components/ui";
import { Loading } from "@/shared/components/ui";
import Link from "next/link";
import { CalendarDays, Search } from "lucide-react";
import { useState } from "react";

export default function ArchivePage() {
  const { data: tournaments, isLoading } = useGetTournaments();
  const [searchTerm, setSearchTerm] = useState("") // Состояние для текста поиска

  // Фильтруем турниры "на лету"
  const filteredTournaments = tournaments?.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loading /></div>;

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-4xl font-black mb-8 uppercase tracking-tighter italic text-center">
        Архив событий
      </h1>

      {/* ПОЛЕ ПОИСКА */}
      <div className="relative mb-8 max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Поиск турнира (например, UFC 300)..."
          className="pl-10 rounded-full border-2 focus:border-primary transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {filteredTournaments?.length ? (
          filteredTournaments.map((t) => (
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
          ))
        ) : (
          <p className="text-center text-muted-foreground py-10 italic">
            Ничего не найдено по запросу "{searchTerm}"
          </p>
        )}
      </div>
    </div>
  );
}
