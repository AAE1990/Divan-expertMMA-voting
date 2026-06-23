import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Строго Promise по спецификации Next.js 15
}

// 1. Динамическая генерация метаданных для страницы голосований/турниров
export async function generateMetadata({ params }: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const { locale } = await params; 
  
  // Подтягиваем переводы из пространства имен "Voting" (или проверь как у тебя в json называется этот блок)
  const t = await getTranslations({ locale, namespace: 'Voting' });

  return {
    // Если у тебя в json есть ключи для тайтла и описания секции голосований, подставь их вместо 'votingTitle'
    title: `${t('title') || 'Голосования'} | My Fight Club`,
    description: t('subtitle') || 'Сделай свой прогноз на главные поединки UFC',
    openGraph: {
      title: `${t('title') || 'Голосования'} | My Fight Club`,
      description: t('subtitle') || 'Сделай свой прогноз на главные поединки UFC',
      type: 'website',
    },
  };
}

// 2. Серверный макет-обертка
export default async function VotingLayout({ children, params }: LayoutProps) {
  await params; 
  return <>{children}</>;
}
