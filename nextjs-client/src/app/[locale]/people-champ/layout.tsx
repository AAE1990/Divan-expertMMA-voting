import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Строго Promise для Next.js 15
}

export async function generateMetadata({ params }: Omit<LayoutProps, 'children'>): Promise<Metadata> {
  const { locale } = await params; 
  
  // Подключаем пространство имен "PeopleChamp" из твоего JSON!
  const t = await getTranslations({ locale, namespace: 'PeopleChamp' });

  return {
    title: `${t('title')} | My Fight Club`, // Будет: "Народный чемпион | My Fight Club"
    description: t('authDescription'), // Подтянет твое крутое описание про спорные бои и мнение комьюнити!
    openGraph: {
      title: `${t('title')} | My Fight Club`,
      description: t('authDescription'),
      type: 'website',
    },
  };
}

export default async function PeopleChampLayout({ children, params }: LayoutProps) {
  await params; 
  return <>{children}</>;
}
