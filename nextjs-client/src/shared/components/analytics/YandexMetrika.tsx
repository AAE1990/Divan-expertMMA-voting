'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

export default function YandexMetrika() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Отслеживаем переходы в Single Page Application (SPA)
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ym) {
      // Собираем полный URL и сообщаем Метрике о переходе на новую страницу
      const currentUrl = window.location.origin + pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      (window as any).ym(110096454, 'hit', currentUrl, {
        referer: document.referrer
      });
    }
  }, [pathname, searchParams]);

  return (
    <Script id="yandex-metrika" strategy="afterInteractive">
      {`
        (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=110096454", "ym");

        ym(110096454, "init", {
             ssr: true,
             webvisor: true,
             clickmap: true,
             ecommerce: "dataLayer",
             accurateTrackBounce: true,
             trackLinks: true
        });
      `}
    </Script>
  );
}
