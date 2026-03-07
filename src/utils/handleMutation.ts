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
    
    const errorMessage = 
      err?.response?.data?.message || 
      err?.message || 
      config.error || 
      "Something went wrong";

    toast.error(errorMessage);
    console.error(err);
    throw err;
  }
}