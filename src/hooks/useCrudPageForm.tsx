import { handleMutation } from "@/utils/handleMutation";
import { useCallback, useRef, useState } from "react";
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

  // prevents double submit
  const submittingRef = useRef(false);

  // prevents hydration overwrite
  const initializedRef = useRef(false);

  const initCreate = useCallback(() => {
    initializedRef.current = true;
    setForm(emptyForm);
  }, [emptyForm]);

  const hydrate = useCallback((data: TForm) => {
    if (initializedRef.current) return; // ignore refetch overwrite
    initializedRef.current = true;
    setForm(data);
  }, []);

  const submit = useCallback(async () => {
    if (!form || submittingRef.current) return;

    if (validate) {
      const error = validate(form);
      if (error) return toast.error(error);
    }

    submittingRef.current = true;
    setLoading(true);

    try {
      const payload = mapToPayload(form);
      const id = getId?.(form);

      if (id) {
        await handleMutation(() => updateFn(id, payload), {
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
      submittingRef.current = false;
      setLoading(false);
    }
  }, [form, validate, mapToPayload, getId, updateFn, createFn, label, navigate, redirectPath]);

  return { form, setForm, submit, loading, hydrate, initCreate };
}