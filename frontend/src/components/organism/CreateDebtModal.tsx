'use client';

import { useEffect, useState } from 'react';
import { ZodType } from 'zod';

import { Modal } from '@/components/shared/Modal';
import {
  createDebtSchema,
  type CreateDebtSchema,
} from '@/schemas/createDebt.schema';
import { CreateDebtPayload } from '@/types/createDebtPayload';
import { Input } from '@/components/atom/Input';
import { Button } from '@/components/atom/Button';
import { useLanguage } from '@/hooks/useLanguage';
import { getDebtModal, getErrorTexts } from '@/libs/i18n';

/**
 * Props del modal de creación de deuda.
 */
export interface CreateDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDebtPayload) => Promise<void>;
}

/* -------------------------------------------------------------------------- */
/*                            Estado inicial del form                          */
/* -------------------------------------------------------------------------- */

/**
 * Valores iniciales del formulario.
 */
const initialValues: CreateDebtSchema = {
  amount: 0,
  description: '',
  creditorId: '',
  status: 'PENDING',
};

/**
 * Errores iniciales del formulario.
 */
const initialErrors: Record<
  keyof CreateDebtSchema,
  string
> = {
  amount: '',
  description: '',
  creditorId: '',
  status: '',
};

/* -------------------------------------------------------------------------- */
/*                               Componente                                   */
/* -------------------------------------------------------------------------- */

/**
 * Modal de creación de deuda.
 *
 * Características:
 * - Validación por campo (onChange / onBlur)
 * - Validación global en submit
 * - i18n desacoplado
 * - Reset automático al abrir y al crear
 */
export function CreateDebtModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateDebtModalProps) {
  const { language } = useLanguage();

  const texts = getDebtModal(language);
  const errorTexts = getErrorTexts(language);

  const [values, setValues] =
    useState<CreateDebtSchema>(initialValues);

  const [errors, setErrors] =
    useState<Record<keyof CreateDebtSchema, string>>(
      initialErrors,
    );

  const [loading, setLoading] = useState(false);

  /* ---------------------------------------------------------------------- */
  /*                          Configuración de inputs                        */
  /* ---------------------------------------------------------------------- */

  const inputs: Array<{
    name: keyof CreateDebtSchema;
    type?: string;
    label: string;
  }> = [
    {
      name: 'amount',
      type: 'number',
      label: texts.amount,
    },
    {
      name: 'description',
      type: 'text',
      label: texts.description,
    },
    {
      name: 'creditorId',
      type: 'text',
      label: texts.creditorId,
    },
  ];

  /* ---------------------------------------------------------------------- */
  /*                             Utilidades                                  */
  /* ---------------------------------------------------------------------- */

  /**
   * Resetea el formulario a su estado inicial.
   */
  const resetForm = () => {
    setValues(initialValues);
    setErrors(initialErrors);
  };

  /**
   * Resetea el formulario cada vez que se abre el modal.
   */
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  /**
   * Valida un campo individual.
   */
  const validateField = (
    field: keyof CreateDebtSchema,
    value: any,
  ): string => {
    const schema =
      createDebtSchema.shape[field] as ZodType<any>;

    const result = schema.safeParse(value);

    if (result.success) return '';

    const key =
      result.error.issues[0]
        ?.message as keyof typeof errorTexts;

    return (
      errorTexts[key] ??
      errorTexts.unknown
    );
  };

  /**
   * Maneja cambios en los inputs con validación inmediata.
   */
  const handleChange = (
    field: keyof CreateDebtSchema,
    value: any,
  ) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  };

  /**
   * Maneja el submit con validación global.
   */
  const handleSubmit = async () => {
    setLoading(true);

    const parsed =
      createDebtSchema.safeParse(values);

    if (!parsed.success) {
      const formErrors = { ...errors };

      parsed.error.issues.forEach((issue) => {
        const field =
          issue.path[0] as keyof CreateDebtSchema;

        const key =
          issue.message as keyof typeof errorTexts;

        formErrors[field] =
          errorTexts[key] ??
          errorTexts.unknown;
      });

      setErrors(formErrors);
      setLoading(false);
      return;
    }

    try {
      await onSubmit(parsed.data);

      resetForm(); // ← limpieza tras éxito
      onClose();
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /*                                  Render                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <Modal
      isOpen={isOpen}
      title={texts.createTitle}
      onClose={onClose}
    >
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
            value={
              name === 'amount'
                ? String(values[name])
                : (values[name] as string)
            }
            error={errors[name]}
            disabled={loading}
            onChange={(e) =>
              handleChange(
                name,
                type === 'number'
                  ? Number(e.target.value)
                  : e.target.value,
              )
            }
            onBlur={(e) =>
              handleChange(
                name,
                type === 'number'
                  ? Number(e.target.value)
                  : e.target.value,
              )
            }
          />
        ))}

        <Button type="submit" isLoading={loading}>
          {loading
            ? texts.loading
            : texts.submit}
        </Button>
      </form>
    </Modal>
  );
}
