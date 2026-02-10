import { useState } from "react";
import { handleMutation } from "@/utils/handleMutation";

interface CrudConfig<TForm, TPayload> {
  label: string;
  emptyForm: TForm;
  mapToPayload: (form: TForm) => TPayload;
  validate?: (form: TForm) => string | null;
  createFn: (payload: TPayload) => Promise<any>;
  updateFn: (id: string, payload: TPayload) => Promise<any>;
}

export function useCrudModalForm<TForm extends { uuid?: string }, TPayload>({
  emptyForm,
  mapToPayload,
  validate,
  createFn,
  updateFn,
  label,
}: CrudConfig<TForm, TPayload>) {
  const [form, setForm] = useState<TForm>(emptyForm);
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const openCreate = () => {
    setForm(emptyForm);
    setIsEdit(false);
    setIsOpen(true);
  };

  const openEdit = (data: TForm) => {
    setForm(data);
    setIsEdit(true);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setForm(emptyForm);
    setIsEdit(false);
  };

  const submit = async () => {
    if (validate) {
      const error = validate(form);
      if (error) return;
    }

    const payload = mapToPayload(form);

    setLoading(true);
    try {
      if (isEdit && form.uuid) {
        await handleMutation(
          () => updateFn(form.uuid!, payload),
          {
            loading: `Updating ${label}...`,
            success: `${label} updated successfully`,
            error: `Failed to update ${label}`,
          }
        );
      } else {
        await handleMutation(
          () => createFn(payload),
          {
            loading: `Creating ${label}...`,
            success: `${label} created successfully`,
            error: `Failed to create ${label}`,
          }
        );
      }

      close();
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    setForm,
    isOpen,
    isEdit,
    loading,
    openCreate,
    openEdit,
    close,
    submit,
  };
}
