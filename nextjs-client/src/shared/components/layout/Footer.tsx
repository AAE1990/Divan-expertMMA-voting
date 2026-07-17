import { Send, MessageCircle, Mail, Scale, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from 'next-intl';

export const Footer = () => {
  const t = useTranslations('Footer');
  return (
    <footer className="w-full border-t border-white/5 bg-background py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Лого и описание */}
        <div className="space-y-4">
          <h2 className="text-xl font-black uppercase italic italic tracking-tighter">
            {t('logo')}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('description')}
          </p>
          <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">
            {t('copyright', { year: new Date().getFullYear() })}
          </p>
        </div>

        {/* Ссылки */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest">{t('communityTitle')}</h3>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="https://t.me/couch_expert_mma" className="hover:text-primary transition-colors flex items-center gap-2">
              <Send className="size-4" /> {t('links.telegram')}
            </Link>
            <Link href="https://vk.com" className="hover:text-primary transition-colors flex items-center gap-2">
              <MessageCircle className="size-4" /> {t('links.vk')}
            </Link>
            <Link href="mailto:loonyp2010@gmail.com" className="hover:text-primary transition-colors flex items-center gap-2">
              <Mail className="size-4" /> {t('links.email')}
            </Link>
            <Link href="/rules" className="hover:text-primary transition-colors flex items-center gap-2">
              <Scale className="size-4" /> {t('links.rules')}
            </Link>
            <Link href="/privacy" className="hover:text-primary transition-colors flex items-center gap-2">
              <ShieldCheck className="size-4" /> {t('privacyPolicy')}
            </Link>
          </div>
        </div>

        {/* Дисклеймер */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-red-500/80">{t('importantTitle')}</h3>
          <p className="text-[11px] text-muted-foreground/60 leading-relaxed italic">
            {t('disclaimer')}
          </p>
        </div>

      </div>
    </footer>
  );
};
