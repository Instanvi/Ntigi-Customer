import { toast } from "sonner";

/** Success / error feedback — use AlertModal only when the user must confirm an action. */
export function showSuccess(message: string, title?: string) {
  if (title) {
    toast.success(title, { description: message });
    return;
  }
  toast.success(message);
}

export function showError(message: string, title = "Action failed") {
  toast.error(title, { description: message });
}
