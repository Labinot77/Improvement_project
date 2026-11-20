import { deleteSleep, saveSleep } from "@/app/sleep/actions/main";
import { useModal } from "@/providers/Modalprovider";
import type { SleepEntry, SleepFormValues } from "@/types/sleep";

// Server action wrappers: thrown errors are shown by the modals
async function onSave(values: SleepFormValues) {
  const res = await saveSleep(values);
  if (res.error) throw new Error(res.error);
}

async function onDelete(id: string) {
  const res = await deleteSleep(id);
  if (res.error) throw new Error(res.error);
}

// Openers for the sleep form and preview
export function useSleepModals() {
  const { open } = useModal();
  return {
    openForm: (entry?: SleepEntry) => open("sleep_form", { entry, onSave }),
    openPreview: (entry: SleepEntry) => open("sleep_preview", { entry, onSave, onDelete }),
  };
}
