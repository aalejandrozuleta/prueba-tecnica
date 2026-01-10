'use client';

import { AuthLayout } from '@/components/templates/AuthLayout';
import { RegisterForm } from '@/components/organism/RegisterForm';
import { useLanguage } from '@/hooks/useLanguage';
import { getRegisterTexts } from '@/libs/i18n';

/**
 * Página de registro.
 */
export default function RegisterPage() {
  const { language } = useLanguage();
  const texts = getRegisterTexts(language);

  return (
    <AuthLayout title={texts.title} subtitle={texts.subtitle}>
      <RegisterForm />
    </AuthLayout>
  );
}
