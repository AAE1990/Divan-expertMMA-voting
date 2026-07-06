'use client';

import { useEffect, useState } from 'react';
import { ChevronsUp, ChevronsDown } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Кнопки плавно появляются, если проскроллили больше 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 md:bottom-8 md:right-8 animate-in fade-in duration-300">
      {/* Кнопка НАВЕРХ */}
      <button
        onClick={scrollToTop}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900 text-white shadow-xl transition-all hover:scale-110 active:scale-95 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-800 dark:border-zinc-700 cursor-pointer"
        aria-label="Scroll to top"
      >
        <ChevronsUp className="h-5 w-5" />
      </button>

      {/* Кнопка ВНИЗ */}
      <button
        onClick={scrollToBottom}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900 text-white shadow-xl transition-all hover:scale-110 active:scale-95 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-800 dark:border-zinc-700 cursor-pointer"
        aria-label="Scroll to bottom"
      >
        <ChevronsDown className="h-5 w-5" />
      </button>
    </div>
  );
}
