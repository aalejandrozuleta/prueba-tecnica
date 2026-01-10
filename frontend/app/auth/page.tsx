'use client';

import { AuthLayout } from '@/components/templates/AuthLayout';
import { LoginForm } from '@/components/organism/LoginForm';
import { useLanguage } from '@/hooks/useLanguage';
import { getAuthTexts } from '@/libs/i18n';

/**
 * Página de autenticación.
 */
export default function AuthPage() {
  const { language } = useLanguage();
  const texts = getAuthTexts(language);

  return (
    <AuthLayout title={texts.title} subtitle={texts.subtitle}>
      <LoginForm />
    </AuthLayout>
  );
}
