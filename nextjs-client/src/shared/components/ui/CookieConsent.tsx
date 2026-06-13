'use client'

import { useState, useEffect } from 'react'
import { Button } from './Button'
import { X } from 'lucide-react'
import { cn } from '@/shared/utils/clsx'
import { useTranslations } from 'next-intl'

interface CookieConsentProps {
  /** Текст соглашения */
  message?: string
  /** Текст кнопки */
  buttonText?: string
  /** Позиция на экране: 'bottom-left', 'bottom-right', 'bottom-center' */
  position?: 'bottom-left' | 'bottom-right' | 'bottom-center'
  /** Дополнительные классы */
  className?: string
}

export function CookieConsent({
  message,
  buttonText,
  position = 'bottom-right',
  className,
}: CookieConsentProps) {
  const t = useTranslations('CookieBanner');
  const [isVisible, setIsVisible] = useState(false)
  const finalMessage = message ?? t('message');
  const finalButtonText = buttonText ?? t('acceptButton');
  const closeButtonText = t('closeButton');

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookie-consent')
    if (!hasConsent) {
      // Небольшая задержка для плавного появления после загрузки страницы
      const timer = setTimeout(() => setIsVisible(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setIsVisible(false)
  }

  const handleClose = () => {
    localStorage.setItem('cookie-consent', 'closed')
    setIsVisible(false)
  }

  if (!isVisible) return null

  const positionClasses = {
    'bottom-left': 'left-4 bottom-4',
    'bottom-right': 'right-4 bottom-4',
    'bottom-center': 'left-1/2 -translate-x-1/2 bottom-4',
  }

  return (
    <div
      className={cn(
        'fixed z-50 max-w-md rounded-xl border bg-card p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300',
        positionClasses[position],
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm text-foreground">{finalMessage}</p>
          <div className="mt-3 flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleAccept}
              className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              {finalButtonText}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleClose}
              className="border-border text-foreground hover:bg-accent cursor-pointer"
            >
              {closeButtonText}
            </Button>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="ml-2 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
          aria-label={closeButtonText}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}