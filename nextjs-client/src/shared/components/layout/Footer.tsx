import { Send, MessageCircle, Mail, Scale } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-background py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Лого и описание */}
        <div className="space-y-4">
          <h2 className="text-xl font-black uppercase italic italic tracking-tighter">
            Диванный эксперт
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Первая лига для тех, кто видит апсеты там, где другие видят фаворитов.
            Твоя аналитика — твоя репутация.
          </p>
          <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">
            © {new Date().getFullYear()} Все права защищены
          </p>
        </div>

        {/* Ссылки */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest">Сообщество</h3>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="https://t.me" className="hover:text-primary transition-colors flex items-center gap-2">
              <Send className="size-4" /> Telegram канал
            </Link>
            <Link href="https://vk.com" className="hover:text-primary transition-colors flex items-center gap-2">
              <MessageCircle className="size-4" /> ВКонтакте
            </Link>
            <Link href="mailto:loonyp2010@gmail.com" className="hover:text-primary transition-colors flex items-center gap-2">
              <Mail className="size-4" /> Написать нам
            </Link>
            <Link href="/rules" className="hover:text-primary transition-colors flex items-center gap-2">
              <Scale className="size-4" /> Правила сайта
            </Link>
          </div>
        </div>

        {/* Дисклеймер */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-red-500/80">Важное</h3>
          <p className="text-[11px] text-muted-foreground/60 leading-relaxed italic">
            Данный ресурс создан исключительно в развлекательных и аналитических целях.
            Мы не являемся букмекерской конторой, не принимаем ставки на деньги и не
            проводим азартные игры. Прогнозы на сайте — это личное мнение участников
            комьюнити.
          </p>
        </div>

      </div>
    </footer>
  );
};
