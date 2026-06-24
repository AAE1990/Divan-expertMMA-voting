'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui"
import { Scale, Shield, Users, MessageSquare, AlertTriangle, Trophy, BookOpen } from "lucide-react"
import { useTranslations } from 'next-intl'

export default function RulesPage() {
  const t = useTranslations('Rules');
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Scale className="size-10 text-primary" />
          <h1 className="text-4xl font-black uppercase tracking-tighter">{t('title')}</h1>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base">
          {t('updated')}
        </p>
      </div>

      <Card className="border-2 shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="size-5" />
            {t('generalTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            {t('generalParagraph1')}
          </p>
          <p>
            {t('generalParagraph2')}
          </p>
          <p className="font-semibold text-muted-foreground/90 border-l-2 border-primary pl-3 italic">
            {t('generalParagraph3')}
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Users className="size-5" />
            {t('respectfulTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              {t('respectfulItem1')}
            </li>
            <li>
              {t('respectfulItem2')}
            </li>
            <li>
              {t('respectfulItem3')}
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="size-5" />
            {t('prohibitedTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              {t('prohibitedItem1')}
            </li>
            <li>
              {t('prohibitedItem2')}
            </li>
            <li>
              {t('prohibitedItem3')}
            </li>
            <li>
              {t('prohibitedItem4')}
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            {t('prohibitedNote')}
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Shield className="size-5" />
            {t('safetyTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            {t('safetyParagraph')}
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>{t('safetyItem1')}</li>
            <li>{t('safetyItem2')}</li>
            <li>{t('safetyItem3')}</li>
            <li>{t('safetyItem4')}</li>
          </ul>
          <p>
            {t('safetyParagraph2')}
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Trophy className="size-5" />
            {t('ratingTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            {t('ratingParagraph')}
          </p>
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{t('ratingSubtitle')}</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>{t('ratingItem1')}</li>
              <li>{t('ratingItem2')}</li>
              <li>{t('ratingItem3')}</li>
              <li>{t('ratingItem4')}</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('ratingNote')}
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <MessageSquare className="size-5" />
            {t('conclusionTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            {t('conclusionParagraph1')}
          </p>
          <p className="font-medium">
            {t('conclusionParagraph2')}
          </p>
          <div className="pt-4 border-t text-sm text-muted-foreground">
            <p>{t('copyright')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}