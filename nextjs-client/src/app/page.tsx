import Link from "next/link";
import { buttonVariants } from "@/shared/components/ui"; // Импорт стилей для кнопок
import { Trophy, CheckCircle2, BarChart3, Users } from "lucide-react"; // Иконки для фишек
import { cn } from "@/shared/utils/clsx";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* HERO SECTION */}
      <section className="w-full py-20 px-4 border-b border-white/5 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter italic">
              Диванный эксперт
            </h1>
            <p className="text-xl md:text-2xl font-bold text-primary uppercase tracking-widest opacity-90">
              Главная лига ММА-прогнозов
            </p>
          </div>
          
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
            Твой голос решает, кто станет легендой. Делай прогнозы на UFC и другие турниры, 
            зарабатывай баллы и возглавь наш рейтинг в мире любителей ММА.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <Link href="/voting" className={cn(buttonVariants({ size: "lg" }), "font-bold uppercase tracking-widest px-8 py-7 text-lg")}>
              Сделать прогноз
            </Link>
            <Link href="/rating" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "font-bold uppercase tracking-widest px-8 py-7 text-lg border-2")}>
              Посмотреть рейтинг
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION (Фишки) */}
      <section className="w-full py-20 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-secondary/5 border border-white/5">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <BarChart3 className="size-8" />
            </div>
            <h3 className="text-xl font-black uppercase italic">Голоса всех участников</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Мы не просто собираем прогнозы, мы показываем реальное мнение комьюнити. Узнай, на кого ставят сотни других "диванников".
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-secondary/5 border border-white/5">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="size-8" />
            </div>
            <h3 className="text-xl font-black uppercase italic">Рейтинг по точности</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Удача здесь не поможет. Система учитывает каждый верный и неверный прогноз, формируя честный коэффициент твоей экспертности.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-secondary/5 border border-white/5">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Trophy className="size-8" />
            </div>
            <h3 className="text-xl font-black uppercase italic">Честный подсчет</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Баллы начисляются автоматически сразу после завершения турнира. Никаких подтасовок — только факты и результаты боев.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}
