import { deleteActivity, saveActivity } from "@/app/activity/actions/main";
import { useModal } from "@/providers/Modalprovider";
import type { Activity, ActivityFormValues } from "@/types/fitness";

// Server action wrappers: thrown errors are shown by the modals
async function onSave(values: ActivityFormValues) {
  const res = await saveActivity(values);
  if (res.error) throw new Error(res.error);
}

async function onDelete(id: string) {
  const res = await deleteActivity(id);
  if (res.error) throw new Error(res.error);
}

// Openers for the log form and the day preview
export function useActivityModals() {
  const { open } = useModal();
  return {
    openForm: (date?: string) => open("activity_form", { date, onSave }),
    openDay: (date: string, sessions: Activity[]) => open("dayActivity", { date, sessions, onDelete }),
  };
}
