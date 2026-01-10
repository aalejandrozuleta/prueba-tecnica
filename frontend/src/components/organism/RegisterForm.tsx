'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ZodType } from 'zod';

import { registerSchema, RegisterSchema } from '@/schemas/register.schema';
import { Input } from '@/components/atom/Input';
import { Button } from '@/components/atom/Button';
import { useToast } from '@/hooks/useToast';
import { useLanguage } from '@/hooks/useLanguage';
import { getRegisterTexts, getErrorTexts } from '@/libs/i18n';
import { registerUser } from '@/services/auth.service';

/**
 * Formulario de registro con validación en tiempo real.
 *
 * - Validación por campo mientras el usuario escribe
 * - Validación final en submit
 * - Alineado 1:1 con backend
 * - i18n integrado
 */
export function RegisterForm() {
  const router = useRouter();
  const { success, error } = useToast();
  const { language } = useLanguage();

  const texts = getRegisterTexts(language);
  const errorTexts = getErrorTexts(language);

  const [values, setValues] = useState<RegisterSchema>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<keyof RegisterSchema, string>>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  /**
   * Configuración declarativa de inputs.
   */
  const inputs: Array<{
    name: keyof RegisterSchema;
    type?: string;
    label: string;
  }> = [
    { name: 'name', type: 'text', label: texts.name },
    { name: 'email', type: 'email', label: texts.email },
    { name: 'password', type: 'password', label: texts.password },
    { name: 'confirmPassword', type: 'password', label: texts.confirmPassword },
  ];

  /**
   * Valida un campo individual.
   */
  const validateField = (
    field: keyof RegisterSchema,
    value: string,
  ): string => {
    // Caso especial: confirmación de contraseña
    if (field === 'confirmPassword') {
      return value !== values.password
        ? errorTexts.passwordMatch
        : '';
    }

    const schema = registerSchema.shape[field] as ZodType<string>;
    const result = schema.safeParse(value);

    if (result.success) return '';

    const key = result.error.issues[0]?.message as keyof typeof errorTexts;
    return errorTexts[key] ?? result.error.issues[0]?.message ?? '';
  };

  /**
   * Maneja cambios en inputs (validación en tiempo real).
   */
  const handleChange = (
    field: keyof RegisterSchema,
    value: string,
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  };

  /**
   * Maneja el envío del formulario (validación global).
   */
  const handleSubmit = async () => {
    setLoading(true);

    const parsed = registerSchema.safeParse(values);

    if (!parsed.success) {
      const formErrors = { ...errors };

      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterSchema;
        const key = issue.message as keyof typeof errorTexts;
        formErrors[field] = errorTexts[key] ?? issue.message;
      });

      setErrors(formErrors);
      setLoading(false);
      return;
    }

    try {
      await registerUser({
        email: values.email,
        password: values.password,
        name: values.name,
      });
      success(texts.submit);
      router.push('/auth');
    } catch (err:any) {
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
          name={name}
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
        onClick={() => router.push('/auth')}
      >
        {texts.loginLink}
      </button>
    </form>
  );
}
