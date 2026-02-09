import { handleMutation } from "@/utils/handleMutation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface CrudPageConfig<TForm, TPayload, TId = string | number> {
  label: string;
  emptyForm: TForm;
  mapToPayload: (form: TForm) => TPayload;
  validate?: (form: TForm) => string | null;
  createFn: (payload: TPayload) => Promise<any>;
  updateFn: (id: TId, payload: TPayload) => Promise<any>;
  getId?: (form: TForm) => TId | undefined;
  redirectPath: string;
}

export function useCrudPageForm<TForm, TPayload, TId = string | number>({
  emptyForm,
  mapToPayload,
  validate,
  createFn,
  updateFn,
  getId,
  redirectPath,
  label,
}: CrudPageConfig<TForm, TPayload, TId>) {
  const [form, setForm] = useState<TForm | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initCreate = () => setForm(emptyForm);

  const hydrate = (data: TForm) => setForm(data);

  const submit = async () => {
    if (!form) return;

    if (validate) {
      const error = validate(form);
      if (error) return toast.error(error);
    }

    setLoading(true);
    try {
      const payload = mapToPayload(form);
      const uuid = getId?.(form);

      if (uuid) {
        await handleMutation(() => updateFn(uuid, payload), {
          loading: `Updating ${label}...`,
          success: `${label} updated successfully`,
          error: `Failed to update ${label}`,
        });
      } else {
        await handleMutation(() => createFn(payload), {
          loading: `Creating ${label}...`,
          success: `${label} created successfully`,
          error: `Failed to create ${label}`,
        });
      }

      navigate(redirectPath);
    } catch (e: any) {
      toast.error(e?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return { form, setForm, submit, loading, hydrate, initCreate };
}
