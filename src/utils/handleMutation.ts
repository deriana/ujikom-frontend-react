import toast from "react-hot-toast";

type Messages = {
  loading?: string;
  success?: string;
  error?: string;
  onSuccess?: (data?: any) => void;
};

export async function handleMutation<T>(
  action: () => Promise<T>,
  config: Messages
): Promise<T | undefined> {
  const id = config.loading ? toast.loading(config.loading) : undefined;

  try {
    const result = await action();
    if (id) toast.dismiss(id);
    if (config.success) toast.success(config.success);
    if (config.onSuccess) config.onSuccess(result);
    return result;
  } catch (err: any) {
    if (id) toast.dismiss(id);
    let errorMessage = err?.response?.data?.message || err?.message || config.error || "Something went wrong"
    const validationErrors = err?.response?.data?.errors;
    if (validationErrors) {
      const detailedMessages = Object.values(validationErrors)
        .flat() 
        .join(" ");
      
      errorMessage = detailedMessages;
    }
    toast.error(errorMessage, {
      duration: 4000, 
    });
    console.error(err);
    throw err;
  }
}