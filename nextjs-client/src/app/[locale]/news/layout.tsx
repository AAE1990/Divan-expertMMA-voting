import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Теперь params — это строго Promise!
}

// 1. Динамическая генерация метаданных
export async function generateMetadata({ params }: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  // Дожидаемся развертывания params, чтобы забрать текущую локаль
  const { locale } = await params; 
  
  // Подтягиваем переводы из пространства имен "News"
  const t = await getTranslations({ locale, namespace: 'News' });

  return {
    title: `${t('newsTitle')} | My Fight Club`,
    description: t('newsSubtitle'),
    openGraph: {
      title: `${t('newsTitle')} | My Fight Club`,
      description: t('newsSubtitle'),
      type: 'website',
    },
  };
}

// 2. Сам компонент макета (тоже должен принимать асинхронные params по спецификации Next.js)
export default async function NewsLayout({ children, params }: LayoutProps) {
  // Просто дожидаемся их для валидации роутинга Next.js
  await params; 
  
  return <>{children}</>;
}
