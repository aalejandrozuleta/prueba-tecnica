'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ZodType } from 'zod';

import { loginSchema, LoginSchema } from '@/schemas/login.schema';
import { Input } from '@/components/atom/Input';
import { Button } from '@/components/atom/Button';
import { useToast } from '@/hooks/useToast';
import { useLanguage } from '@/hooks/useLanguage';
import { getAuthTexts, getErrorTexts } from '@/libs/i18n';
import { loginUser } from '@/services/auth.service';

/**
 * Formulario de autenticación (login).
 *
 * - Validación en tiempo real
 * - Cookies httpOnly
 * - UX coherente con Register
 * - i18n integrado
 */
export function LoginForm() {
  const router = useRouter();
  const { success, error } = useToast();
  const { language } = useLanguage();

  const texts = getAuthTexts(language);
  const errorTexts = getErrorTexts(language);

  const [values, setValues] = useState<LoginSchema>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<keyof LoginSchema, string>>({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  /**
   * Inputs declarativos.
   */
  const inputs: Array<{
    name: keyof LoginSchema;
    type?: string;
    label: string;
  }> = [
    { name: 'email', type: 'email', label: texts.email },
    { name: 'password', type: 'password', label: texts.password },
  ];

  /**
   * Valida un campo individual.
   */
  const validateField = (
    field: keyof LoginSchema,
    value: string,
  ): string => {
    const schema = loginSchema.shape[field] as ZodType<string>;
    const result = schema.safeParse(value);

    if (result.success) return '';

    const key = result.error.issues[0]?.message as keyof typeof errorTexts;
    return errorTexts[key] ?? result.error.issues[0]?.message ?? '';
  };

  /**
   * Maneja cambios (validación en tiempo real).
   */
  const handleChange = (field: keyof LoginSchema, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  };

  /**
   * Envío del formulario.
   */
  const handleSubmit = async () => {
    setLoading(true);

    const parsed = loginSchema.safeParse(values);

    if (!parsed.success) {
      const formErrors = { ...errors };

      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginSchema;
        const key = issue.message as keyof typeof errorTexts;
        formErrors[field] = errorTexts[key] ?? issue.message;
      });

      setErrors(formErrors);
      setLoading(false);
      return;
    }

    try {
      await loginUser(values);
      success(texts.submit);
      router.push('/dashboard');
    } catch (err: any) {
      error(err.error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      {inputs.map(({ name, type, label }) => (
        <Input
          key={name}
          type={type}
          label={label}
          value={values[name]}
          error={errors[name]}
          disabled={loading}
          onChange={(e) => handleChange(name, e.target.value)}
          onBlur={(e) => handleChange(name, e.target.value)}
        />
      ))}

      <Button type="submit" isLoading={loading}>
        {loading ? texts.loading : texts.submit}
      </Button>

      <button
        type="button"
        className="text-sm text-blue-600 hover:underline"
        onClick={() => router.push('/register')}
      >
        {texts.registerLink}
      </button>
    </form>
  );
}
