import toast from "react-hot-toast";

type Messages = {
  loading?: string;
  success?: string;
  error?: string;
};

export async function handleMutation<T>(
  action: () => Promise<T>,
  messages: Messages
): Promise<T | undefined> {
  const id = messages.loading ? toast.loading(messages.loading) : undefined;

  try {
    const result = await action();
    if (id) toast.dismiss(id);
    if (messages.success) toast.success(messages.success);
    return result;
  } catch (err: any) {
    if (id) toast.dismiss(id);
    
    const errorMessage = 
      err?.response?.data?.message || 
      err?.message || 
      messages.error || 
      "Something went wrong";

    toast.error(errorMessage);
    console.error(err);
    throw err;
  }
}