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
  const id = messages.loading
    ? toast.loading(messages.loading)
    : undefined;

  try {
    const result = await action();

    if (id) toast.dismiss(id);
    if (messages.success) toast.success(messages.success);

    return result;
  } catch (err: any) {
    if (id) toast.dismiss(id);
    toast.error(messages.error || err?.message || "Something went wrong");
    throw err;
  }
}
