import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/shared/components/ui"; // Импорт стилей для кнопок
import { Trophy, CheckCircle2, BarChart3, Users, Newspaper } from "lucide-react"; // Иконки для фишек
import { cn } from "@/shared/utils/clsx";
import { NewsBlock } from "./components/NewsBlock";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations('Home');
  return (
    <div className="flex flex-col items-center">
      {/* HERO SECTION */}
      <section className="w-full py-20 px-4 border-b border-white/5 bg-gradient-to-b from-primary/10 to-transparent">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter italic">
              {t('title')}
            </h1>
            <p className="text-xl md:text-2xl font-bold text-primary uppercase tracking-widest opacity-90">
              {t('subtitle')}
            </p>
          </div>
          
          <p className="max-w-2xl mx-auto text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
            {t('description')}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <Link href="/voting" className={cn(buttonVariants({ size: "lg" }), "font-bold uppercase tracking-widest px-8 py-7 text-lg")}>
              {t('ctaPredict')}
            </Link>
            <Link href="/rating" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "font-bold uppercase tracking-widest px-8 py-7 text-lg border-2")}>
              {t('ctaRating')}
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
            <h3 className="text-xl font-black uppercase italic">{t('feature1Title')}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('feature1Description')}
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-secondary/5 border border-white/5">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="size-8" />
            </div>
            <h3 className="text-xl font-black uppercase italic">{t('feature2Title')}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('feature2Description')}
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-secondary/5 border border-white/5">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <Trophy className="size-8" />
            </div>
            <h3 className="text-xl font-black uppercase italic">{t('feature3Title')}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('feature3Description')}
            </p>
          </div>

        </div>
      </section>

      {/* NEWS SECTION */}
      <section className="w-full py-20 px-4 max-w-6xl mx-auto border-t border-white/5">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="flex items-center gap-3">
            <Newspaper className="size-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-black uppercase italic">{t('newsTitle')}</h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {t('newsSubtitle')}
          </p>
          
          <NewsBlock />
        </div>
      </section>
   </div>
 );
}

