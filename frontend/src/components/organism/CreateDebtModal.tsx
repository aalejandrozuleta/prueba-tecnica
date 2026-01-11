'use client';

import { useEffect, useState } from 'react';
import { ZodType } from 'zod';

import { Modal } from '@/components/shared/Modal';
import { createDebtSchema, type CreateDebtSchema } from '@/schemas/createDebt.schema';
import { CreateDebtPayload } from '@/types/createDebtPayload';
import { UpdateDebtPayload } from '@/types/UpdateDebtPayload';
import { Input } from '@/components/atom/Input';
import { Button } from '@/components/atom/Button';
import { useLanguage } from '@/hooks/useLanguage';
import { getDebtModal, getErrorTexts } from '@/libs/i18n';
import { updateDebtSchema } from '@/schemas/updateDebt.schema';

/* -------------------------------------------------------------------------- */
/*                                   Props                                    */
/* -------------------------------------------------------------------------- */

type CreateModeProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create';
  onSubmit: (data: CreateDebtPayload) => Promise<void>;
};

type EditModeProps = {
  isOpen: boolean;
  onClose: () => void;
  mode: 'edit';
  initialData: UpdateDebtPayload;
  onSubmit: (data: UpdateDebtPayload) => Promise<void>;
};

export type CreateDebtModalProps = CreateModeProps | EditModeProps;

/* -------------------------------------------------------------------------- */
/*                            Estado inicial del form                          */
/* -------------------------------------------------------------------------- */

const initialValues: CreateDebtSchema = {
  amount: 0,
  description: '',
  creditorId: '',
  status: 'PENDING'
};

const initialErrors: Record<keyof CreateDebtSchema, string> = {
  amount: '',
  description: '',
  creditorId: '',
  status: ''
};

/* -------------------------------------------------------------------------- */
/*                               Componente                                   */
/* -------------------------------------------------------------------------- */

export function CreateDebtModal(props: CreateDebtModalProps) {
  const { language } = useLanguage();

  const texts = getDebtModal(language);
  const errorTexts = getErrorTexts(language);

  const isEdit = props.mode === 'edit';

  const [values, setValues] = useState<CreateDebtSchema>(initialValues);

  const [errors, setErrors] = useState<Record<keyof CreateDebtSchema, string>>(initialErrors);

  const [loading, setLoading] = useState(false);

  /* ---------------------------------------------------------------------- */
  /*                             Inicialización                              */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    if (!props.isOpen) return;

    if (isEdit) {
      setValues({
        ...initialValues,
        amount: props.initialData.amount,
        description: props.initialData.description,
        status: props.initialData.status
      });
      setErrors(initialErrors);
      return;
    }

    setValues(initialValues);
    setErrors(initialErrors);
  }, [props.isOpen, isEdit]);

  /* ---------------------------------------------------------------------- */
  /*                             Utilidades                                  */
  /* ---------------------------------------------------------------------- */

  const validateField = (field: keyof CreateDebtSchema, value: any): string => {
    const schema = createDebtSchema.shape[field] as ZodType<any>;

    const result = schema.safeParse(value);

    if (result.success) return '';

    const key = result.error.issues[0]?.message as keyof typeof errorTexts;

    return errorTexts[key] ?? errorTexts.unknown;
  };

  const handleChange = (field: keyof CreateDebtSchema, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));

    setErrors(prev => ({
      ...prev,
      [field]: validateField(field, value)
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const schema = isEdit ? updateDebtSchema : createDebtSchema;

    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      const formErrors = { ...errors };

      parsed.error.issues.forEach(issue => {
        const field = issue.path[0] as keyof CreateDebtSchema;

        const key = issue.message as keyof typeof errorTexts;

        formErrors[field] = errorTexts[key] ?? errorTexts.unknown;
      });

      setErrors(formErrors);
      setLoading(false);
      return;
    }

    try {
      if (isEdit) {
        await props.onSubmit({
          id: props.initialData.id,
          amount: parsed.data.amount,
          description: parsed.data.description ?? '',
          status: 'PENDING'
        });
      } else {
        await props.onSubmit({
          amount: parsed.data.amount,
          description: parsed.data.description ?? '',
          creditorId: values.creditorId, // 👈 explícito
          status: 'PENDING'
        });
      }

      props.onClose();
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------------------------------------------- */
  /*                                  Render                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <Modal
      isOpen={props.isOpen}
      title={isEdit ? texts.editTitle : texts.createTitle}
      onClose={props.onClose}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Input
          name="amount"
          type="number"
          label={texts.amount}
          value={String(values.amount)}
          error={errors.amount}
          disabled={loading}
          onChange={e => handleChange('amount', Number(e.target.value))}
        />

        <Input
          name="description"
          type="text"
          label={texts.description}
          value={values.description}
          error={errors.description}
          disabled={loading}
          onChange={e => handleChange('description', e.target.value)}
        />

        {!isEdit && (
          <Input
            name="creditorId"
            type="text"
            label={texts.creditorId}
            value={values.creditorId}
            error={errors.creditorId}
            disabled={loading}
            onChange={e => handleChange('creditorId', e.target.value)}
          />
        )}

        <Button type="submit" isLoading={loading}>
          {loading ? texts.loading : isEdit ? texts.update : texts.submit}
        </Button>
      </form>
    </Modal>
  );
}
